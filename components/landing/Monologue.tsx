'use client';

import { useState, useEffect } from 'react';

const LINE1 = '제철 과일이 주는 영양,';
const LINE2 = '그대로 담았습니다.';

export function Monologue() {
  const [typed1, setTyped1] = useState('');
  const [typed2, setTyped2] = useState('');
  const [phase, setPhase] = useState<'idle' | 'typing1' | 'typing2' | 'done'>(
    'idle',
  );
  const [showBody, setShowBody] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) {
      setTyped1(LINE1);
      setTyped2(LINE2);
      setPhase('done');
      setShowBody(true);
      return;
    }

    let cancelled = false;
    const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    (async () => {
      await wait(500);
      if (cancelled) return;
      setPhase('typing1');

      for (let i = 1; i <= LINE1.length; i++) {
        if (cancelled) return;
        setTyped1(LINE1.slice(0, i));
        await wait(40);
      }
      if (cancelled) return;

      await wait(300);
      if (cancelled) return;
      setPhase('typing2');

      for (let i = 1; i <= LINE2.length; i++) {
        if (cancelled) return;
        setTyped2(LINE2.slice(0, i));
        await wait(40);
      }
      if (cancelled) return;
      setPhase('done');

      await wait(500);
      if (cancelled) return;
      setShowBody(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const showCursor1 = phase === 'typing1';
  const showCursor2 = phase === 'typing2';
  const shimmer = phase === 'done' || phase === 'typing2';

  return (
    <section
      id="hook"
      className="bg-ink min-h-[100dvh] px-6 flex flex-col items-center justify-center relative overflow-hidden"
    >
      <div className="max-w-md lg:max-w-xl mx-auto text-center relative z-10">
        <blockquote className="font-batang text-paper">
          <span
            className={`text-3xl lg:text-5xl font-bold inline-block leading-tight ${shimmer ? 'hero-shimmer' : ''}`}
          >
            {typed1}
            {showCursor1 && (
              <span className="cursor-blink font-light">|</span>
            )}
          </span>
          {typed1.length === LINE1.length && (
            <>
              <br />
              <span className="text-xl lg:text-3xl inline-block leading-snug mt-3 lg:mt-4">
                {typed2}
                {showCursor2 && (
                  <span className="cursor-blink font-light">|</span>
                )}
              </span>
            </>
          )}
        </blockquote>

        <div
          className={`w-8 h-px bg-paper/30 mx-auto my-10 transition-transform duration-700 origin-center ${
            showBody ? 'scale-x-100' : 'scale-x-0'
          }`}
        />

        <p
          className={`font-batang text-gold text-lg lg:text-xl leading-loose transition-opacity duration-700 ${
            showBody ? 'opacity-100' : 'opacity-0'
          }`}
        >
          없는 효능을 지어내지 않습니다.
          <br />
          자연이 철마다 내주는 과일을,
          <br />
          그대로 담글 뿐입니다.
          <br />
          설탕 대신 알룰로스, 물에 타서 드세요.
        </p>
      </div>

      <p
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 font-plex text-paper/60 text-xs z-10 transition-opacity duration-700 ${
          showBody ? 'opacity-100 motion-safe:animate-bounce' : 'opacity-0'
        }`}
      >
        아래로 ↓
      </p>
    </section>
  );
}
