export const STATUS_OPTIONS = [
  'ghost_received', 'pending_payment', 'paid',
  'brewing', 'engraving', 'shipped', 'cancelled',
] as const;

export const STATUS_LABEL: Record<string, string> = {
  ghost_received: '고스트 접수',
  pending_payment: '결제 대기',
  paid: '결제 완료',
  brewing: '담그는 중',
  engraving: '이름 새기는 중',
  shipped: '발송',
  cancelled: '취소',
};
