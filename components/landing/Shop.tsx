'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/products';
import { PRICE } from '@/lib/config';

function FlipCard({
  src,
  backSrc,
  alt,
  index = 0,
}: {
  src: string;
  backSrc: string;
  alt: string;
  index?: number;
}) {
  const [flipped, setFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const el = cardRef.current;
    if (!el) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          timeoutId = setTimeout(() => {
            setFlipped(true);
          }, (3 + index * 2) * 1000);
        }
      },
      { threshold: 0.3 },
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [index]);

  return (
    <div ref={cardRef} className="relative w-full aspect-[4/5]">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-contain motion-safe:transition-opacity motion-safe:duration-700"
        style={{ opacity: flipped ? 0 : 1 }}
        sizes="(max-width: 768px) 100vw, 512px"
      />
      <Image
        src={backSrc}
        alt={`${alt} 뒷면`}
        fill
        className="object-contain motion-safe:transition-opacity motion-safe:duration-700"
        style={{ opacity: flipped ? 1 : 0 }}
        sizes="(max-width: 768px) 100vw, 512px"
      />
      <button
        type="button"
        onClick={() => setFlipped((prev) => !prev)}
        aria-pressed={flipped}
        className="absolute bottom-2 right-2 font-plex text-sm text-soft bg-paper/80
                   px-3 py-2.5 border border-rule hover:bg-paper transition-colors"
      >
        {flipped ? '앞면 보기' : '뒷면 보기'}
      </button>
    </div>
  );
}

export function Shop() {
  return (
    <section id="shop" className="bg-paper py-14 lg:py-20 px-6">
      <div className="max-w-lg lg:max-w-4xl mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <p className="font-batang text-soft text-sm tracking-widest mb-3">
            세 가지
          </p>
          <h2 className="font-batang font-bold text-2xl lg:text-5xl text-ink tracking-[-0.01em] leading-snug">
            오늘 담글 수 있는 청
          </h2>
          <p className="text-soft text-sm mt-3 font-plex">
            26,000원 · 500ml · 배송비 무료
          </p>
        </div>

        <div className="space-y-8 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
          {PRODUCTS.map((product, index) => (
            <div
              key={product.id}
              className="border border-rule bg-white-2 flex flex-col"
            >
              <FlipCard
                src={product.src}
                backSrc={product.backSrc}
                alt={product.name}
                index={index}
              />
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-batang font-bold text-lg text-ink">
                    {product.name}
                  </h3>
                  <span className="font-plex text-lg font-medium text-ink tabular-nums">
                    {PRICE.toLocaleString()}원
                  </span>
                </div>
                <p className="text-soft text-sm font-plex mb-2">
                  {product.note}
                </p>
                <p className="text-soft text-sm font-plex mb-4">
                  주문 후 3~4일
                </p>
                <Link
                  href={`/checkout?product=${product.id}`}
                  className="block w-full py-3 bg-ink text-paper text-center
                             font-plex font-medium text-sm tracking-wide
                             hover:bg-seal active:bg-seal transition-colors mt-auto"
                >
                  주문하기
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/checkout"
            className="inline-block font-plex text-sm text-soft underline underline-offset-4
                       decoration-rule hover:text-ink hover:decoration-ink transition-colors"
          >
            전체 상품 보기
          </Link>
        </div>

        <p className="mt-6 text-center font-plex text-sm text-soft leading-relaxed">
          온라인이 불편하시면, 전화로 주문하셔도 됩니다.
          <br />
          <a
            href="tel:010-8339-5585"
            className="text-seal text-base font-medium hover:underline"
          >
            010-8339-5585
          </a>
          <br />
          <span className="text-sm text-soft">
            농협 947-02-126434 예금주 이제남
          </span>
        </p>
      </div>
    </section>
  );
}
