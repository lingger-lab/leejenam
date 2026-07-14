'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  getCart,
  removeFromCart,
  updateQuantity,
  getCartTotal,
  type CartItem,
} from '@/lib/cart';

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);

  const refresh = useCallback(() => {
    setItems(getCart());
    setTotal(getCartTotal());
  }, []);

  useEffect(() => {
    refresh();

    const onCartUpdated = () => refresh();
    window.addEventListener('cart-updated', onCartUpdated);
    return () => window.removeEventListener('cart-updated', onCartUpdated);
  }, [refresh]);

  const handleQuantity = (index: number, delta: number) => {
    const item = items[index];
    if (!item) return;
    updateQuantity(index, item.quantity + delta);
  };

  const handleRemove = (index: number) => {
    removeFromCart(index);
  };

  /* ---------- 빈 장바구니 ---------- */
  if (items.length === 0) {
    return (
      <main className="bg-paper min-h-screen px-6 py-20">
        <div className="max-w-lg mx-auto text-center">
          <p className="font-batang text-soft text-sm tracking-widest mb-4">
            장바구니
          </p>

          <p className="font-batang text-xl text-ink mt-16 leading-relaxed">
            담긴 청이 없습니다.
          </p>

          <Link
            href="/#shop"
            className="inline-block mt-10 font-plex text-sm text-soft
                       underline underline-offset-4 decoration-rule
                       hover:text-ink hover:decoration-ink transition-colors"
          >
            청 담으러 가기
          </Link>
        </div>
      </main>
    );
  }

  /* ---------- 장바구니 목록 ---------- */
  return (
    <main className="bg-paper min-h-screen px-6 py-20">
      <div className="max-w-lg mx-auto">
        <p className="font-batang text-soft text-sm tracking-widest mb-3 text-center">
          장바구니
        </p>
        <h1 className="font-batang font-bold text-2xl text-ink text-center mb-12">
          담아두신 청
        </h1>

        {/* 아이템 리스트 */}
        <ul className="divide-y divide-rule">
          {items.map((item, index) => (
            <li key={`${item.productId}-${item.engraveName}-${index}`} className="py-5">
              <div className="flex items-start justify-between gap-4">
                {/* 좌: 상품 정보 */}
                <div className="flex-1 min-w-0">
                  <p className="font-batang font-bold text-ink">
                    {item.productName}
                  </p>
                  <p className="font-pen text-2xl text-seal mt-1">
                    {item.engraveName}
                  </p>
                </div>

                {/* 우: 가격 */}
                <p className="font-plex text-sm text-ink flex-shrink-0 pt-0.5">
                  {(item.price * item.quantity).toLocaleString()}원
                </p>
              </div>

              {/* 수량 + 삭제 */}
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-0">
                  <button
                    onClick={() => handleQuantity(index, -1)}
                    className="w-8 h-8 border border-rule text-soft text-sm
                               hover:border-ink hover:text-ink transition-colors
                               flex items-center justify-center"
                    aria-label="수량 줄이기"
                  >
                    -
                  </button>
                  <span className="w-10 h-8 border-y border-rule text-center
                                   leading-8 font-plex text-sm text-ink">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantity(index, 1)}
                    className="w-8 h-8 border border-rule text-soft text-sm
                               hover:border-ink hover:text-ink transition-colors
                               flex items-center justify-center"
                    aria-label="수량 늘리기"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => handleRemove(index)}
                  className="font-plex text-xs text-soft underline underline-offset-2
                             decoration-rule hover:text-seal hover:decoration-seal
                             transition-colors"
                >
                  삭제
                </button>
              </div>
            </li>
          ))}
        </ul>

        {/* 합계 */}
        <div className="border-t-2 border-ink mt-2 pt-5 flex items-center justify-between">
          <span className="font-batang text-ink">합계</span>
          <span className="font-batang font-bold text-xl text-ink">
            {total.toLocaleString()}원
          </span>
        </div>

        {/* 주문서 작성 */}
        <Link
          href="/checkout"
          className="block w-full mt-10 py-4 bg-ink text-paper text-center
                     font-plex font-medium text-sm tracking-wide
                     hover:bg-seal transition-colors"
        >
          주문서 작성
        </Link>

        {/* 더 담기 */}
        <div className="mt-5 text-center">
          <Link
            href="/#shop"
            className="font-plex text-sm text-soft underline underline-offset-4
                       decoration-rule hover:text-ink hover:decoration-ink
                       transition-colors"
          >
            더 담기
          </Link>
        </div>
      </div>
    </main>
  );
}
