'use client';

import { useEffect } from 'react';
import { track } from '@/lib/events';

type Props = { engraveNames: string[] };

export function GhostMessage({ engraveNames }: Props) {
  useEffect(() => {
    track('ghost_message_view');
  }, []);

  return (
    <div className="bg-paper max-w-lg mx-auto px-8 py-12">
      <h1 className="font-batang font-bold text-2xl mb-7 leading-relaxed text-ink">
        예약이 접수되었습니다.
      </h1>

      <p className="font-batang font-bold text-3xl text-seal my-7 leading-snug">
        이제, 이 이름으로 담급니다.
      </p>

      <div className="font-plex text-base text-ink leading-loose space-y-5">
        <p>
          이제남의 과일청은 미리 만들어 쌓아두지 않습니다.
          <br />
          주문을 받은 뒤, <strong>그날 들어온 제철 과일로 한 병씩 담급니다.</strong>
        </p>

        <p>
          미리 만든 청과는 신선함이 다릅니다.
          <br />
          그래서 조금 기다리셔야 하지만, 그만큼 정성껏 담가
          <br />
          <strong>이름을 손으로 새겨</strong> 보내드립니다.
        </p>
      </div>

      <div className="bg-ink text-paper p-5 mt-7 text-sm leading-loose rounded">
        <strong>지금부터 담그기 시작합니다.</strong>
        <br />
        작업 <strong>2일차에 담근 사진과 함께
        <br />
        배송 일정을 문자로 알려드립니다.</strong>
        <br />
        조금만 기다려 주세요. 정성껏 준비하겠습니다.
      </div>

      {engraveNames.length > 0 && (
        <div className="mt-8 text-center">
          {engraveNames.map((n, i) => (
            <div key={i} className="font-pen text-5xl text-seal my-2">
              {n}
            </div>
          ))}
        </div>
      )}

      <div className="mt-7 text-right font-batang font-bold text-ink">
        — 이제남
      </div>
    </div>
  );
}
