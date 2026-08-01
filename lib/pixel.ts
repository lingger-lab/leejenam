'use client';

/**
 * Meta Pixel(fbq) 안전 래퍼.
 * - 픽셀 미로드(환경변수 미설정 등)면 window.fbq가 없으므로 조용히 무시한다.
 * - 자체 이벤트 트래킹(lib/events.ts)과 독립적으로 "추가" 동작한다.
 * - 개인정보(이메일·전화번호)는 절대 파라미터로 전달하지 않는다.
 */

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** Meta 표준 이벤트 */
type StandardEvent = 'PageView' | 'InitiateCheckout' | 'Lead';

export function pixelTrack(
  event: StandardEvent,
  params?: Record<string, unknown>,
): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('track', event, params);
}

export function pixelTrackCustom(
  event: string,
  params?: Record<string, unknown>,
): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;
  window.fbq('trackCustom', event, params);
}
