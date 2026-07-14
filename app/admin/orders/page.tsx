export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { createServerClient } from '@/lib/supabase-server';

async function getOrders() {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from('orders')
    .select(`
      id, order_no, buyer_name, buyer_phone, status, payment_mode,
      total, subscribe_intent, contacted_at, created_at,
      order_items ( engrave_name, product_id )
    `)
    .order('created_at', { ascending: false })
    .limit(100);
  return data ?? [];
}

const STATUS_LABEL: Record<string, string> = {
  ghost_received: '고스트 접수',
  pending_payment: '결제 대기',
  paid: '결제 완료',
  brewing: '담그는 중',
  engraving: '이름 새기는 중',
  shipped: '발송',
  cancelled: '취소',
};

export default async function OrdersPage() {
  let orders: Awaited<ReturnType<typeof getOrders>> = [];
  try {
    orders = await getOrders();
  } catch {
    // Supabase not connected
  }

  return (
    <div>
      <h1 className="font-batang font-bold text-2xl text-ink mb-6">주문 목록</h1>

      {orders.length === 0 ? (
        <p className="text-soft text-sm">아직 주문이 없습니다.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-rule text-left text-soft">
                <th className="py-3 pr-3">주문번호</th>
                <th className="py-3 pr-3">주문자</th>
                <th className="py-3 pr-3">각인 이름</th>
                <th className="py-3 pr-3">상태</th>
                <th className="py-3 pr-3">금액</th>
                <th className="py-3 pr-3">구독</th>
                <th className="py-3 pr-3">연락</th>
                <th className="py-3">일시</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule/50">
              {orders.map((order) => {
                const items = (order as Record<string, unknown>).order_items as Array<{ engrave_name: string; product_id: string }> | null;
                const engraveNames = items?.map((i) => i.engrave_name).join(', ') ?? '';

                return (
                  <tr key={order.id} className="hover:bg-paper/50">
                    <td className="py-3 pr-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-seal underline underline-offset-2"
                      >
                        {order.order_no}
                      </Link>
                    </td>
                    <td className="py-3 pr-3">{order.buyer_name}</td>
                    <td className="py-3 pr-3 font-pen text-lg text-seal">
                      {engraveNames}
                    </td>
                    <td className="py-3 pr-3 text-soft">
                      {STATUS_LABEL[order.status] ?? order.status}
                    </td>
                    <td className="py-3 pr-3">{order.total?.toLocaleString()}원</td>
                    <td className="py-3 pr-3">
                      {order.subscribe_intent ? '의향' : '-'}
                    </td>
                    <td className="py-3 pr-3">
                      {order.contacted_at ? (
                        <span className="text-green-600">완료</span>
                      ) : (
                        <span className="text-seal">미연락</span>
                      )}
                    </td>
                    <td className="py-3 text-soft text-xs">
                      {new Date(order.created_at).toLocaleDateString('ko')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
