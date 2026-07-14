'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export function Maker() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const handleStorage = () => {
      try {
        const cart = JSON.parse(localStorage.getItem('ijn_cart') ?? '[]');
        if (cart.length > 0) {
          setUserName(cart[0].engraveName);
        }
      } catch {
        // ignore
      }
    };

    handleStorage();
    window.addEventListener('cart-updated', handleStorage);
    return () => window.removeEventListener('cart-updated', handleStorage);
  }, []);

  const names = [
    {
      role: '원물',
      name: '이수성',
      desc: '욱곡농장',
    },
    {
      role: '담금',
      name: '이제남',
      desc: '제이엔',
    },
    {
      role: '드시는 분',
      name: userName || '___',
      desc: '',
      highlight: true,
    },
  ];

  return (
    <section className="bg-paper py-20 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-14">
          <p className="font-batang text-soft text-sm tracking-widest mb-3">
            세 사람
          </p>
          <h2 className="font-batang font-bold text-2xl text-ink leading-relaxed">
            이 청에는
            <br />
            세 사람의 이름이 들어갑니다.
          </h2>
        </div>

        {/* 대표 사진 */}
        <div className="relative w-full aspect-square max-w-xs mx-auto mb-14">
          <Image
            src="/img/07_maker.webp"
            alt="이제남 대표"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 80vw, 320px"
          />
        </div>

        {/* 세 이름 */}
        <div className="space-y-0">
          {names.map((item, i) => (
            <div
              key={i}
              className={`flex items-center py-5 ${
                i < names.length - 1 ? 'border-b border-rule' : ''
              }`}
            >
              <div className="w-20 flex-shrink-0">
                <span className="text-soft text-xs font-plex tracking-wider">
                  {item.role}
                </span>
              </div>
              <div className="flex-1">
                <span
                  className={`${
                    item.highlight
                      ? 'font-pen text-3xl text-seal'
                      : 'font-batang font-bold text-lg text-ink'
                  }`}
                >
                  {item.name}
                </span>
                {item.desc && (
                  <span className="text-soft text-xs ml-2 font-plex">
                    {item.desc}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
