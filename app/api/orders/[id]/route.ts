import { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) {
    return Response.json({ error: '주문 ID가 필요합니다.' }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('id, order_no, buyer_name')
    .eq('id', id)
    .single();

  if (orderError || !order) {
    return Response.json(
      { error: '주문 정보를 찾을 수 없습니다.' },
      { status: 404 },
    );
  }

  const { data: items, error: itemsError } = await supabase
    .from('order_items')
    .select('product_id, engrave_name, quantity, unit_price')
    .eq('order_id', id);

  if (itemsError) {
    return Response.json(
      { error: '주문 항목을 불러올 수 없습니다.' },
      { status: 500 },
    );
  }

  return Response.json({
    id: order.id,
    order_no: order.order_no,
    buyer_name: order.buyer_name,
    items: items ?? [],
  });
}
