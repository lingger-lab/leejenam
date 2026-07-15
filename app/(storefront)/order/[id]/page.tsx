'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase';
import { isGhost } from '@/lib/config';
import { track } from '@/lib/events';
import { GhostMessage } from '@/components/GhostMessage';

type OrderData = {
  id: string;
  order_no: string;
  buyer_name: string;
  items: { productName: string; engraveName: string; quantity: number; price: number }[];
};

const timeline = [
  { step: '1', title: '주문 접수', desc: '주문이 접수되었습니다.', active: true },
  { step: '2', title: '원물 준비', desc: '욱곡농장에서 과일을 받습니다.' },
  { step: '3', title: '담금·숙성', desc: '유리병에 켜켜이 담급니다.' },
  { step: '4', title: '사진 전달', desc: '2일차에 담근 사진을 보내드립니다.' },
  { step: '5', title: '라벨 각인', desc: '이름을 손으로 씁니다.' },
  { step: '6', title: '발송', desc: '정성껏 포장하여 보내드립니다.' },
];

function OrderTimeline() {
  return (
    <div className="max-w-lg mx-auto px-6 mt-10">
      <p className="font-batang text-soft text-sm tracking-widest mb-6 text-center">
        앞으로의 과정
      </p>
      <div className="space-y-0">
        {timeline.map((item, i) => (
          <div key={i} className="relative pl-10 pb-6">
            <div
              className={`absolute left-0 top-0 w-7 h-7 flex items-center justify-center text-xs font-plex ${
                item.active
                  ? 'bg-seal text-paper'
                  : 'bg-paper border border-rule text-soft'
              }`}
            >
              {item.step}
            </div>
            {i < timeline.length - 1 && (
              <div className="absolute left-3.5 top-7 w-px h-full bg-rule" />
            )}
            <h3
              className={`font-batang font-bold ${
                item.active ? 'text-ink' : 'text-soft'
              }`}
            >
              {item.title}
            </h3>
            <p className="font-plex text-sm text-soft">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrderCompletePage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    track('order_submit');
  }, []);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const supabase = createClient();
        const { data, error: dbError } = await supabase
          .from('orders')
          .select('id, order_no, buyer_name, items')
          .eq('id', params.id)
          .single();

        if (dbError || !data) {
          setError('주문 정보를 찾을 수 없습니다.');
          return;
        }

        setOrder(data as OrderData);
      } catch {
        setError('주문 정보를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [params.id]);

  /* 로딩 */
  if (loading) {
    return (
      <div className="bg-paper min-h-screen px-6 py-10">
        <div className="max-w-lg mx-auto text-center">
          <p className="font-plex text-soft text-sm">불러오는 중...</p>
        </div>
      </div>
    );
  }

  /* 에러 */
  if (error || !order) {
    return (
      <div className="bg-paper min-h-screen px-6 py-10">
        <div className="max-w-lg mx-auto text-center">
          <p className="font-batang text-xl text-ink mb-4">
            {error ?? '주문 정보를 찾을 수 없습니다.'}
          </p>
        </div>
      </div>
    );
  }

  const engraveNames = order.items.map((item) => item.engraveName);

  /* ── Ghost 모드 ── */
  if (isGhost()) {
    return (
      <div className="bg-paper min-h-screen py-10">
        <div className="mb-8 text-center">
          <p className="font-plex text-xs text-soft tracking-widest">
            주문번호 {order.order_no}
          </p>
        </div>
        <GhostMessage engraveNames={engraveNames} />
        <OrderTimeline />
      </div>
    );
  }

  /* ── Live 모드 (향후) ── */
  return (
    <div className="bg-paper min-h-screen px-6 py-10">
      <div className="max-w-lg mx-auto text-center">
        <p className="font-batang text-soft text-sm tracking-widest mb-3">
          주문 완료
        </p>
        <h1 className="font-batang font-bold text-2xl text-ink mb-2">
          접수되었습니다
        </h1>
        <p className="font-plex text-xs text-soft tracking-widest mb-10">
          주문번호 {order.order_no}
        </p>

        <div className="border border-rule bg-white-2 p-6 text-left mb-8">
          <p className="font-plex text-sm text-soft mb-4">주문 내역</p>
          <ul className="space-y-3">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-plex text-sm text-ink">{item.productName}</p>
                  <p className="font-pen text-xl text-seal">{item.engraveName}</p>
                </div>
                <p className="font-plex text-sm text-soft flex-shrink-0">
                  {item.quantity}병
                </p>
              </li>
            ))}
          </ul>
        </div>

        <p className="font-plex text-sm text-soft leading-relaxed mb-4">
          {order.buyer_name}님, 정성껏 담그겠습니다.
        </p>
      </div>

      <OrderTimeline />
    </div>
  );
}
