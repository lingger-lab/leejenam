'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { useParams } from 'next/navigation';

const STATUS_OPTIONS = [
  'ghost_received', 'pending_payment', 'paid',
  'brewing', 'engraving', 'shipped', 'cancelled',
];

const STATUS_LABEL: Record<string, string> = {
  ghost_received: '고스트 접수',
  pending_payment: '결제 대기',
  paid: '결제 완료',
  brewing: '담그는 중',
  engraving: '이름 새기는 중',
  shipped: '발송',
  cancelled: '취소',
};

type OrderItem = {
  id: string;
  product_id: string;
  engrave_name: string;
  quantity: number;
  unit_price: number;
  label_printed: boolean;
  label_written: boolean;
};

type Order = {
  id: string;
  order_no: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string | null;
  zipcode: string | null;
  address1: string | null;
  address2: string | null;
  delivery_memo: string | null;
  subtotal: number;
  shipping_fee: number;
  total: number;
  payment_mode: string;
  status: string;
  subscribe_intent: boolean;
  survey_who: string | null;
  admin_memo: string | null;
  contacted_at: string | null;
  created_at: string;
  order_items: OrderItem[];
};

export default function OrderDetailClient() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [saving, setSaving] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('id', id)
        .single();
      if (data) setOrder(data as Order);
    }
    load();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateStatus = async (status: string) => {
    setSaving(true);
    await supabase.from('orders').update({ status }).eq('id', id);
    setOrder((prev) => prev ? { ...prev, status } : prev);
    setSaving(false);
  };

  const markContacted = async () => {
    setSaving(true);
    const now = new Date().toISOString();
    await supabase.from('orders').update({ contacted_at: now }).eq('id', id);
    setOrder((prev) => prev ? { ...prev, contacted_at: now } : prev);
    setSaving(false);
  };

  if (!order) {
    return <p className="text-soft">불러오는 중...</p>;
  }

  return (
    <div>
      <h1 className="font-batang font-bold text-2xl text-ink mb-2">
        {order.order_no}
      </h1>
      <p className="text-soft text-sm mb-8">
        {new Date(order.created_at).toLocaleString('ko')} · {order.payment_mode}
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* 왼쪽: 주문 정보 */}
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-sm text-soft mb-2">주문자</h3>
            <p>{order.buyer_name}</p>
            <p className="text-soft">{order.buyer_phone}</p>
            {order.buyer_email && <p className="text-soft">{order.buyer_email}</p>}
          </div>

          {order.address1 && (
            <div>
              <h3 className="font-bold text-sm text-soft mb-2">배송지</h3>
              <p>{order.zipcode} {order.address1}</p>
              {order.address2 && <p>{order.address2}</p>}
              {order.delivery_memo && (
                <p className="text-soft text-sm mt-1">{order.delivery_memo}</p>
              )}
            </div>
          )}

          <div>
            <h3 className="font-bold text-sm text-soft mb-2">금액</h3>
            <p className="text-lg font-bold">{order.total.toLocaleString()}원</p>
          </div>

          <div className="flex gap-4">
            {order.subscribe_intent && (
              <span className="text-xs bg-seal/10 text-seal px-2 py-1">정기구독 의향</span>
            )}
            {order.survey_who && (
              <span className="text-xs bg-ink/10 text-ink px-2 py-1">
                {order.survey_who === 'self' ? '본인' : '가족'}
              </span>
            )}
          </div>
        </div>

        {/* 오른쪽: 각인 이름 + 상태 */}
        <div className="space-y-6">
          <div>
            <h3 className="font-bold text-sm text-soft mb-3">각인 이름</h3>
            {order.order_items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 py-2 border-b border-rule/50">
                <span className="text-sm text-soft">{item.product_id}</span>
                <span className="font-pen text-3xl text-seal">{item.engrave_name}</span>
                <span className="text-xs text-soft ml-auto">x{item.quantity}</span>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-bold text-sm text-soft mb-2">상태 변경</h3>
            <select
              value={order.status}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={saving}
              className="w-full border border-rule px-3 py-2 text-sm bg-white outline-none"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{STATUS_LABEL[s]}</option>
              ))}
            </select>
          </div>

          <div>
            <h3 className="font-bold text-sm text-soft mb-2">연락 상태</h3>
            {order.contacted_at ? (
              <p className="text-green-600 text-sm">
                {new Date(order.contacted_at).toLocaleString('ko')} 연락 완료
              </p>
            ) : (
              <button
                onClick={markContacted}
                disabled={saving}
                className="px-4 py-2 bg-ink text-paper text-sm hover:bg-seal transition-colors disabled:opacity-50"
              >
                연락 완료 기록
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
