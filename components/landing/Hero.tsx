'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { getStoredName } from '@/lib/name';

const slides = [
  {
    id: 'peach',
    src: '/img/01_peach.webp',
    alt: '이제남 복숭아청 — 라벨에 이순자라는 이름이 손글씨로 새겨져 있다',
    name: '이순자',
  },
  {
    id: 'plum',
    src: '/img/02_plum.webp',
    alt: '이제남 자두청 — 라벨에 김영호라는 이름이 손글씨로 새겨져 있다',
    name: '김영호',
  },
  {
    id: 'berry',
    src: '/img/03_berry.webp',
    alt: '이제남 블루베리청 — 라벨에 박정희라는 이름이 손글씨로 새겨져 있다',
    name: '박정숙',
  },
];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [userName, setUserName] = useState('');

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const sync = () => setUserName(getStoredName());
    sync();
    window.addEventListener('name-updated', sync);
    return () => window.removeEventListener('name-updated', sync);
  }, []);

  useEffect(() => {
    if (paused) return;
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReducedMotion) return;

    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const diff = touchStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
    setTouchStart(null);
  };

  const displayName = userName || slides[current].name;

  return (
    <section
      id="hero" className="relative w-full bg-paper overflow-hidden py-14 lg:py-20"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="이제남 과일청 3종"
    >
      {/* 슬라이드 — 확대된 이미지 */}
      <div className="relative w-full max-w-lg lg:max-w-2xl mx-auto px-4 aspect-[4/5]">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
            aria-hidden={i !== current}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              className="object-contain"
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 512px"
            />
          </div>
        ))}
      </div>

      {/* 점 인디케이터 */}
      <div className="flex justify-center gap-1 mt-6">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => setCurrent(i)}
            className="p-3 flex items-center justify-center"
            aria-label={`${i + 1}번 슬라이드`}
            aria-current={i === current}
          >
            <span
              className={`block h-2 rounded-full transition-all duration-300 ${
                i === current
                  ? 'bg-seal w-6'
                  : 'bg-rule hover:bg-soft w-2'
              }`}
            />
          </button>
        ))}
      </div>

      {/* 이름 전환 강조 */}
      <div className="text-center mt-8">
        <p className="font-pen text-3xl text-seal">
          {displayName}
        </p>
        <p className="font-plex text-sm text-soft mt-1">
          님에게 갑니다
        </p>
      </div>

      {/* 하단 카피 */}
      <div className="text-center mt-4">
        <p className="font-batang text-base text-soft tracking-wider">
          각각 다른 이름이 새겨집니다
        </p>
      </div>

      {/* CTA */}
      <div className="text-center mt-8">
        <a
          href="/checkout"
          className="inline-block font-plex text-base font-medium bg-ink text-paper
                     px-10 py-4 hover:bg-seal transition-colors tracking-wide"
        >
          주문하기
        </a>
        <p className="mt-4 font-plex text-sm text-soft">
          또는 전화 한 통이면 됩니다
        </p>
        <a
          href="tel:010-8339-5585"
          className="font-plex text-base text-seal font-medium hover:underline"
        >
          010-8339-5585
        </a>
      </div>
    </section>
  );
}
