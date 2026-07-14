'use client';

import { useEffect } from 'react';
import { track } from '@/lib/events';

const SECTIONS = [
  'hero', 'signature', 'badges', 'monologue', 'declare',
  'process', 'origin', 'rent', 'maker', 'refuse', 'shop', 'spec',
];

export function PageTracker() {
  useEffect(() => {
    track('page_view');

    // 섹션 도달 추적 (IntersectionObserver)
    const observed = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = (entry.target as HTMLElement).dataset.section;
            if (section && !observed.has(section)) {
              observed.add(section);
              track('section_view', { section });
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    // 각 section 요소에 data-section 속성으로 매칭
    const sectionEls = document.querySelectorAll('section');
    sectionEls.forEach((el, i) => {
      if (i < SECTIONS.length) {
        el.dataset.section = SECTIONS[i];
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
