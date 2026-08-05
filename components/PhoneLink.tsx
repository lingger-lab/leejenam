'use client';

import { track } from '@/lib/events';
import { pixelTrack } from '@/lib/pixel';

const PHONE = '010-8339-5585';

type Props = {
  /** 클릭 발생 위치 식별용 (hero, shop, footer, checkout 등) */
  location: string;
  className?: string;
  children: React.ReactNode;
};

/**
 * 전화 주문 링크 — 탭 시 자체 이벤트(phone_click)와 Meta 픽셀 Contact를 기록한다.
 * 참고: "탭-투-콜 의도"만 계측되며 통화 완료는 추적하지 않는다.
 */
export function PhoneLink({ location, className, children }: Props) {
  const handleClick = () => {
    track('phone_click', { location });
    pixelTrack('Contact');
  };

  return (
    <a href={`tel:${PHONE}`} className={className} onClick={handleClick}>
      {children}
    </a>
  );
}
