'use client';

import { useState } from 'react';
import Image from 'next/image';
import { validateEngraveName } from '@/lib/validators';
import { addToCart } from '@/lib/cart';
import { track } from '@/lib/events';
import { PRICE } from '@/lib/config';

const products = [
  {
    id: 'peach' as const,
    name: '복숭아청',
    note: '여름에 복숭아를 먹는 건 오래된 습관입니다.',
    src: '/img/01_peach.webp',
  },
  {
    id: 'plum' as const,
    name: '자두청',
    note: '시고 답니다. 물에 타면 여름 맛이 납니다.',
    src: '/img/02_plum.webp',
  },
  {
    id: 'berry' as const,
    name: '블루베리청',
    note: '왜 좋은지는 저보다 잘 아실 겁니다.',
    src: '/img/03_berry.webp',
  },
];

type ProductId = 'peach' | 'plum' | 'berry';

export function Shop() {
  const [selected, setSelected] = useState<ProductId | null>(null);
  const [names, setNames] = useState<Record<ProductId, string>>({
    peach: '',
    plum: '',
    berry: '',
  });
  const [errors, setErrors] = useState<Record<ProductId, string>>({
    peach: '',
    plum: '',
    berry: '',
  });
  const [added, setAdded] = useState<ProductId | null>(null);

  const handleNameChange = (id: ProductId, value: string) => {
    if (value.length <= 10) {
      setNames((prev) => ({ ...prev, [id]: value }));
      setErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  const handleAddToCart = (id: ProductId) => {
    const product = products.find((p) => p.id === id)!;
    const name = names[id].trim();

    const validation = validateEngraveName(name);
    if (!validation.ok) {
      setErrors((prev) => ({ ...prev, [id]: validation.error! }));
      return;
    }

    addToCart({
      productId: id,
      productName: product.name,
      engraveName: name,
      price: PRICE,
      quantity: 1,
    });

    track('add_to_cart', { product_id: id, engrave_name: name });

    setAdded(id);
    setTimeout(() => setAdded(null), 2000);
    setNames((prev) => ({ ...prev, [id]: '' }));
  };

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
          {products.map((product) => {
            const isOpen = selected === product.id;
            const error = errors[product.id];
            const isAdded = added === product.id;

            return (
              <div
                key={product.id}
                className={`border transition-colors duration-300 ${
                  isOpen ? 'border-seal bg-white-2' : 'border-rule bg-white-2/50'
                }`}
              >
                {/* 제품 카드 — 세로 배치 */}
                <button
                  onClick={() => setSelected(isOpen ? null : product.id)}
                  className="w-full text-left"
                >
                  {/* 큰 이미지 */}
                  <div className="relative w-full aspect-[4/5]">
                    <Image
                      src={product.src}
                      alt={product.name}
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 512px"
                    />
                  </div>
                  {/* 제품 정보 */}
                  <div className="p-4">
                    <h3 className="font-batang font-bold text-lg text-ink">
                      {product.name}
                    </h3>
                    <p className="text-soft text-sm mt-0.5 font-plex">
                      {product.note}
                    </p>
                    <p className="text-ink text-sm mt-2 font-plex">
                      {PRICE.toLocaleString()}원
                    </p>
                  </div>
                </button>

                {/* 이름 입력 + 장바구니 담기 */}
                {isOpen && (
                  <div className="px-4 pb-5 pt-1 border-t border-rule">
                    <label className="block text-soft text-xs mb-2 font-plex">
                      라벨에 새길 이름
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={names[product.id]}
                        onChange={(e) =>
                          handleNameChange(product.id, e.target.value)
                        }
                        placeholder="한글 이름"
                        className="flex-1 font-pen text-2xl text-seal bg-paper
                                   border border-rule focus:border-seal
                                   outline-none px-3 py-2 placeholder:font-plex
                                   placeholder:text-sm placeholder:text-rule
                                   transition-colors"
                        maxLength={10}
                        autoComplete="off"
                      />
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={isAdded}
                        className={`flex-shrink-0 px-5 py-2 text-sm font-plex font-medium
                                   transition-all duration-300 ${
                                     isAdded
                                       ? 'bg-seal/10 text-seal border border-seal'
                                       : 'bg-ink text-paper hover:bg-seal border border-ink hover:border-seal'
                                   }`}
                      >
                        {isAdded ? '담았습니다' : '담기'}
                      </button>
                    </div>
                    {error && (
                      <p className="text-seal text-xs mt-2 font-plex">{error}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 장바구니 바로가기 */}
        <div className="mt-10 text-center">
          <a
            href="/cart"
            className="inline-block font-plex text-soft text-sm underline underline-offset-4
                       decoration-rule hover:text-ink hover:decoration-ink transition-colors"
          >
            장바구니 보기
          </a>
        </div>
      </div>
    </section>
  );
}
