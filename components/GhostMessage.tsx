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
        솔직히 말씀드리겠습니다.
      </h1>

      <p className="font-batang font-bold text-3xl text-seal my-7 leading-snug">
        아직 만들지 않았습니다.
      </p>

      <div className="font-plex text-base text-ink leading-loose space-y-5">
        <p>
          재고가 없어서가 아닙니다.
          <br />
          <strong>아직 한 병도 담그지 않았습니다.</strong>
        </p>

        <p>
          이 청을 정말 원하는 분이 계신지
          <br />
          먼저 확인하고 싶었습니다.
          <br />
          그래서 페이지부터 만들었습니다.
        </p>

        <p>
          주문해주셨다는 건,
          <br />
          원하신다는 뜻으로 알겠습니다.
        </p>
      </div>

      <div className="bg-ink text-paper p-5 mt-7 text-sm leading-loose rounded">
        <strong>
          첫 회차를 담글 때
          <br />
          가장 먼저 연락드리겠습니다.
        </strong>
        <br />
        그때 이 이름을 새겨서 보내드리겠습니다.
        <br />
        만들지 못하게 되면, 그것도 알려드리겠습니다.
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
