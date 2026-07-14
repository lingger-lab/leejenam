'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

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
    name: '박정희',
  },
];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
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

  return (
    <section
      className="relative w-full bg-paper overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-label="이제남 과일청 3종"
    >
      {/* 슬라이드 */}
      <div className="relative w-full max-w-md mx-auto aspect-[4/5]">
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
              priority={i === 0}
              sizes="(max-width: 768px) 100vw, 448px"
            />
          </div>
        ))}
      </div>

      {/* 하단 텍스트 */}
      <div className="text-center pb-10 pt-4">
        <p className="font-batang text-sm text-soft tracking-wider">
          각각 다른 이름이 새겨집니다
        </p>
      </div>

      {/* 점 인디케이터 */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2.5">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => setCurrent(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current
                ? 'bg-seal w-6'
                : 'bg-rule hover:bg-soft'
            }`}
            aria-label={`${i + 1}번 슬라이드`}
            aria-current={i === current}
          />
        ))}
      </div>
    </section>
  );
}
