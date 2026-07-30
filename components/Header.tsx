'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-paper/95 backdrop-blur-sm border-b border-rule'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-lg lg:max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* 브랜드 */}
        <Link
          href="/"
          className={`font-batang font-bold text-xl transition-colors ${
            scrolled ? 'text-ink' : 'text-paper'
          }`}
        >
          이제남
        </Link>

        {/* 네비게이션 */}
        <nav>
          <Link
            href="/checkout"
            className={`font-plex text-sm px-4 py-2.5 transition-colors ${
              scrolled
                ? 'border border-ink/30 text-ink hover:border-seal hover:text-seal'
                : 'border border-paper/30 text-paper/80 hover:text-paper hover:border-paper/60'
            }`}
          >
            주문하기
          </Link>
        </nav>
      </div>
    </header>
  );
}
