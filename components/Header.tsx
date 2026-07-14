'use client';

import { useState, useEffect } from 'react';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const syncCart = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('ijn_cart') ?? '[]');
        const count = cart.reduce(
          (sum: number, item: { quantity: number }) => sum + item.quantity,
          0
        );
        setCartCount(count);
      } catch {
        /* ignore */
      }
    };
    syncCart();
    window.addEventListener('cart-updated', syncCart);
    return () => window.removeEventListener('cart-updated', syncCart);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-paper/95 backdrop-blur-sm border-b border-rule'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-lg mx-auto px-6 h-14 flex items-center justify-between">
        {/* 브랜드 */}
        <a
          href="#"
          className="font-batang font-bold text-xl text-ink"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          이제남
        </a>

        {/* 우측 네비게이션 */}
        <div className="flex items-center gap-5">
          <a
            href="#shop"
            className="font-plex text-sm text-soft hover:text-ink transition-colors"
          >
            주문하기
          </a>
          {cartCount > 0 && (
            <a
              href="/cart"
              className="font-plex text-sm text-soft hover:text-ink transition-colors relative"
            >
              장바구니
              <span
                className="absolute -top-1.5 -right-3.5 w-4 h-4 bg-seal text-paper
                           text-[10px] flex items-center justify-center"
              >
                {cartCount}
              </span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
