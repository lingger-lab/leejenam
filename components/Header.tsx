'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

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
        <Link href="/" className="font-batang font-bold text-xl text-ink">
          이제남
        </Link>

        {/* 네비게이션 */}
        <nav className="flex items-center gap-4">
          <Link
            href="/#process"
            className="font-plex text-sm text-soft hover:text-ink transition-colors"
          >
            이야기
          </Link>
          <Link
            href="/#shop"
            className="font-plex text-sm text-soft hover:text-ink transition-colors"
          >
            주문하기
          </Link>
          <Link
            href="/cart"
            className="font-plex text-sm text-soft hover:text-ink transition-colors relative"
          >
            장바구니
            {cartCount > 0 && (
              <span
                className="absolute -top-1.5 -right-3.5 w-4 h-4 bg-seal text-paper
                           text-[10px] flex items-center justify-center"
              >
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
