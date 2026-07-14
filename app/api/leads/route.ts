import { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';
import { validatePhone } from '@/lib/validators';

interface LeadBody {
  phone: string;
  name?: string;
  source?: string;
  session_id?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LeadBody = await request.json();

    if (!body.phone) {
      return Response.json(
        { ok: false, error: '연락처를 입력해주세요.' },
        { status: 400 },
      );
    }

    const phoneResult = validatePhone(body.phone);
    if (!phoneResult.ok) {
      return Response.json(
        { ok: false, error: phoneResult.error },
        { status: 400 },
      );
    }

    const supabase = createServiceClient();

    const cleanedPhone = body.phone.replace(/[\s-]/g, '');

    const { error } = await supabase
      .from('leads')
      .upsert(
        {
          phone: cleanedPhone,
          name: body.name?.trim() || null,
          source: body.source || null,
          session_id: body.session_id || null,
        },
        { onConflict: 'phone' },
      );

    if (error) {
      console.error('[leads] upsert failed:', error);
      return Response.json(
        { ok: false, error: '저장 중 문제가 생겼어요. 다시 시도해주세요.' },
        { status: 500 },
      );
    }

    return Response.json({ ok: true });
  } catch (err) {
    console.error('[leads] unexpected error:', err);
    return Response.json(
      { ok: false, error: '요청을 처리하지 못했어요.' },
      { status: 500 },
    );
  }
}
