import { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { PAYMENT_MODE, isGhost, SHIPPING_FEE } from '@/lib/config';
import { validatePhone, validateEngraveName } from '@/lib/validators';

interface OrderItemInput {
  product_id: string;
  engrave_name: string;
  quantity: number;
  unit_price: number;
}

interface OrderBody {
  buyer_name: string;
  buyer_phone: string;
  buyer_email?: string;
  zipcode?: string;
  address1?: string;
  address2?: string;
  delivery_memo?: string;
  items: OrderItemInput[];
  subscribe_intent?: boolean;
  survey_who?: string;
  session_id?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: OrderBody = await request.json();

    // --- Validate required fields ---
    if (!body.buyer_name?.trim()) {
      return Response.json(
        { error: '주문자 이름을 입력해주세요.' },
        { status: 400 },
      );
    }

    if (!body.buyer_phone) {
      return Response.json(
        { error: '연락처를 입력해주세요.' },
        { status: 400 },
      );
    }

    const phoneResult = validatePhone(body.buyer_phone);
    if (!phoneResult.ok) {
      return Response.json({ error: phoneResult.error }, { status: 400 });
    }

    if (!body.items || body.items.length === 0) {
      return Response.json(
        { error: '주문할 상품을 선택해주세요.' },
        { status: 400 },
      );
    }

    // --- Validate each item's engrave_name ---
    for (const item of body.items) {
      const engraveResult = validateEngraveName(item.engrave_name);
      if (!engraveResult.ok) {
        return Response.json({ error: engraveResult.error }, { status: 400 });
      }

      if (!item.product_id) {
        return Response.json(
          { error: '상품 정보가 올바르지 않습니다.' },
          { status: 400 },
        );
      }

      if (!item.quantity || item.quantity < 1) {
        return Response.json(
          { error: '수량을 확인해주세요.' },
          { status: 400 },
        );
      }
    }

    // --- Calculate totals ---
    const subtotal = body.items.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0,
    );
    const total = subtotal + SHIPPING_FEE;

    const status = isGhost() ? 'ghost_received' : 'pending_payment';

    // --- Insert order (service client bypasses RLS) ---
    const supabase = createServiceClient();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        buyer_name: body.buyer_name.trim(),
        buyer_phone: body.buyer_phone.replace(/[\s-]/g, ''),
        buyer_email: body.buyer_email?.trim() || null,
        zipcode: body.zipcode?.trim() || null,
        address1: body.address1?.trim() || null,
        address2: body.address2?.trim() || null,
        delivery_memo: body.delivery_memo?.trim() || null,
        subtotal,
        shipping_fee: SHIPPING_FEE,
        total,
        payment_mode: PAYMENT_MODE,
        status,
        subscribe_intent: body.subscribe_intent ?? false,
        survey_who: body.survey_who || null,
        session_id: body.session_id || null,
      })
      .select('id, order_no')
      .single();

    if (orderError || !order) {
      console.error('[orders] insert failed:', orderError);
      return Response.json(
        { error: '주문 접수 중 문제가 생겼어요. 잠시 후 다시 시도해주세요.' },
        { status: 500 },
      );
    }

    // --- Insert order items ---
    const orderItems = body.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      engrave_name: item.engrave_name.trim(),
      quantity: item.quantity,
      unit_price: item.unit_price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('[orders] order_items insert failed:', itemsError);
      // Clean up the order if items insertion fails
      await supabase.from('orders').delete().eq('id', order.id);
      return Response.json(
        { error: '주문 항목 저장 중 문제가 생겼어요. 다시 시도해주세요.' },
        { status: 500 },
      );
    }

    return Response.json({
      mode: PAYMENT_MODE,
      orderId: order.id,
      orderNo: order.order_no,
    });
  } catch (err) {
    console.error('[orders] unexpected error:', err);
    return Response.json(
      { error: '요청을 처리하지 못했어요. 잠시 후 다시 시도해주세요.' },
      { status: 500 },
    );
  }
}
