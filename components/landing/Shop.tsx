'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PRODUCTS } from '@/lib/products';
import { PRICE } from '@/lib/config';

function FlipCard({
  src,
  backSrc,
  alt,
}: {
  src: string;
  backSrc: string;
  alt: string;
}) {
  const [flipped, setFlipped] = useState(false);
  return (
    <div
      className="relative w-full aspect-[4/5] cursor-pointer"
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className="relative w-full h-full motion-safe:transition-transform motion-safe:duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* 앞면 */}
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 512px"
          />
        </div>
        {/* 뒷면 */}
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <Image
            src={backSrc}
            alt={`${alt} 뒷면`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 512px"
          />
        </div>
      </div>
      <p className="absolute bottom-2 right-2 font-plex text-xs text-soft bg-paper/80 px-2 py-0.5">
        {flipped ? '앞면 보기' : '뒷면 보기'}
      </p>
    </div>
  );
}

export function Shop() {
  return (
    <section id="shop" className="bg-paper py-20 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-14">
          <p className="font-batang text-soft text-sm tracking-widest mb-3">
            세 가지
          </p>
          <h2 className="font-batang font-bold text-2xl text-ink">
            오늘 담글 수 있는 청
          </h2>
          <p className="text-soft text-sm mt-3 font-plex">
            26,000원 · 500ml · 주문 후 3~4일
          </p>
        </div>

        <div className="space-y-8">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="border border-rule bg-white-2/50"
            >
              <FlipCard
                src={product.src}
                backSrc={product.backSrc}
                alt={product.name}
              />
              <div className="p-4">
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-batang font-bold text-lg text-ink">
                    {product.name}
                  </h3>
                  <span className="font-plex text-sm text-ink">
                    {PRICE.toLocaleString()}원
                  </span>
                </div>
                <p className="text-soft text-sm font-plex mb-4">
                  {product.note}
                </p>
                <Link
                  href={`/checkout?product=${product.id}`}
                  className="block w-full py-3 bg-ink text-paper text-center
                             font-plex font-medium text-sm tracking-wide
                             hover:bg-seal active:bg-seal transition-colors"
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
      </div>
    </section>
  );
}
