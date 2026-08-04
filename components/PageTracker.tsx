'use client';

import { useEffect } from 'react';
import { track } from '@/lib/events';

export function PageTracker() {
  useEffect(() => {
    track('page_view');

    // 섹션 도달 추적 (IntersectionObserver).
    // 라벨은 각 <section>의 고정 id를 사용 — 섹션 순서를 바꿔도 라벨이 밀리지 않는다.
    const observed = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target.id;
            if (section && !observed.has(section)) {
              observed.add(section);
              track('section_view', { section });
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    // id가 있는 섹션만 관찰
    document
      .querySelectorAll<HTMLElement>('section[id]')
      .forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return null;
}
