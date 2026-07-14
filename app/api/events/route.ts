import { NextRequest } from 'next/server';
import { createServiceClient } from '@/lib/supabase-server';

interface EventBody {
  type: string;
  session_id: string;
  product_id?: string;
  section?: string;
  utm_source?: string;
  meta?: Record<string, unknown>;
}

export async function POST(request: NextRequest) {
  try {
    const body: EventBody = await request.json();

    if (!body.type || !body.session_id) {
      // Silently accept - tracking must never fail visibly
      return Response.json({ ok: true });
    }

    const supabase = createServiceClient();

    await supabase.from('events').insert({
      type: body.type,
      session_id: body.session_id,
      product_id: body.product_id || null,
      section: body.section || null,
      utm_source: body.utm_source || null,
      meta: body.meta ?? {},
    });

    return Response.json({ ok: true });
  } catch {
    // Tracking must never fail with a user-visible error
    return Response.json({ ok: true });
  }
}
