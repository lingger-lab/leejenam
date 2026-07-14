'use client';

import { v4 as uuidv4 } from 'uuid';

const SESSION_KEY = 'ijn_session';

export function getSessionId(): string {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export type EventType =
  | 'page_view'
  | 'section_view'
  | 'name_input_start'
  | 'name_input_complete'
  | 'add_to_cart'
  | 'checkout_start'
  | 'order_submit'
  | 'subscribe_intent'
  | 'survey_answer'
  | 'ghost_message_view';

export async function track(
  type: EventType,
  meta?: Record<string, unknown>,
): Promise<void> {
  try {
    const sessionId = getSessionId();

    const url = new URL(window.location.href);
    const utmSource = url.searchParams.get('utm_source') ?? undefined;

    await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        session_id: sessionId,
        utm_source: utmSource,
        meta,
      }),
      keepalive: true,
    });
  } catch {
    // Silently swallow - never block user experience
  }
}
