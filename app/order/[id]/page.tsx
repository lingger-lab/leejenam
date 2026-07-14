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
      <main className="bg-paper min-h-screen px-6 py-20">
        <div className="max-w-lg mx-auto text-center">
          <p className="font-plex text-soft text-sm">불러오는 중...</p>
        </div>
      </main>
    );
  }

  /* 에러 */
  if (error || !order) {
    return (
      <main className="bg-paper min-h-screen px-6 py-20">
        <div className="max-w-lg mx-auto text-center">
          <p className="font-batang text-xl text-ink mb-4">
            {error ?? '주문 정보를 찾을 수 없습니다.'}
          </p>
          <Link
            href="/"
            className="font-plex text-sm text-soft underline underline-offset-4
                       decoration-rule hover:text-ink hover:decoration-ink transition-colors"
          >
            처음으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  const engraveNames = order.items.map((item) => item.engraveName);

  /* ── Ghost 모드 ── */
  if (isGhost()) {
    return (
      <main className="bg-paper min-h-screen py-20">
        <div className="mb-8 text-center">
          <p className="font-plex text-xs text-soft tracking-widest">
            주문번호 {order.order_no}
          </p>
        </div>
        <GhostMessage engraveNames={engraveNames} />
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="font-plex text-sm text-soft underline underline-offset-4
                       decoration-rule hover:text-ink hover:decoration-ink transition-colors"
          >
            처음으로
          </Link>
        </div>
      </main>
    );
  }

  /* ── Live 모드 (향후) ── */
  return (
    <main className="bg-paper min-h-screen px-6 py-20">
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

        <p className="font-plex text-sm text-soft leading-relaxed mb-10">
          {order.buyer_name}님, 정성껏 담그겠습니다.
        </p>

        <Link
          href="/"
          className="font-plex text-sm text-soft underline underline-offset-4
                     decoration-rule hover:text-ink hover:decoration-ink transition-colors"
        >
          처음으로
        </Link>
      </div>
    </main>
  );
}
