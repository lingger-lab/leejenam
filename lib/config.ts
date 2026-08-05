export type PaymentMode = 'ghost' | 'live';

// 환경변수 값에 공백/줄바꿈이 섞여 들어오는 경우가 있어 trim 후 비교한다
// (예: Vercel에 "ghost\n"으로 저장되면 === 'ghost' 비교가 실패)
export const PAYMENT_MODE: PaymentMode =
  ((process.env.NEXT_PUBLIC_PAYMENT_MODE?.trim() || 'ghost') as PaymentMode);

export const isGhost = () => PAYMENT_MODE === 'ghost';
export const isLive = () => PAYMENT_MODE === 'live';

export const PRICE = 26000;
export const SHIPPING_FEE = 0;
export const DELIVERY_DAYS = '3~4일';

// Hardcoded thresholds - never change these
export const THRESHOLDS = {
  MIN_PURCHASE_CLICK_RATE: 3,
  MAX_CAC: 20000,
  MIN_VISITORS_FOR_VERDICT: 100,
} as const;
