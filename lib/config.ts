export type PaymentMode = 'ghost' | 'live';

export const PAYMENT_MODE: PaymentMode =
  (process.env.NEXT_PUBLIC_PAYMENT_MODE as PaymentMode) ?? 'ghost';

export const isGhost = () => PAYMENT_MODE === 'ghost';
export const isLive = () => PAYMENT_MODE === 'live';

export const PRICE = 26000;
export const SHIPPING_FEE = 3000;
export const DELIVERY_DAYS = '3~4일';

// Hardcoded thresholds - never change these
export const THRESHOLDS = {
  MIN_PURCHASE_CLICK_RATE: 3,
  MAX_CAC: 20000,
  MIN_VISITORS_FOR_VERDICT: 100,
} as const;
