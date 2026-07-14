'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  getCart,
  getCartTotal,
  clearCart,
  type CartItem,
} from '@/lib/cart';
import { validatePhone, validateEngraveName } from '@/lib/validators';
import { track } from '@/lib/events';

type FormData = {
  buyerName: string;
  phone: string;
  zipcode: string;
  address1: string;
  address2: string;
  memo: string;
  subscribeIntent: boolean;
  forWhom: 'self' | 'family';
};

type FormErrors = Partial<Record<keyof FormData | 'engrave' | 'cart', string>>;

export default function CheckoutPage() {
  const router = useRouter();

  const [items, setItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<FormData>({
    buyerName: '',
    phone: '',
    zipcode: '',
    address1: '',
    address2: '',
    memo: '',
    subscribeIntent: false,
    forWhom: 'self',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  /* 마운트 */
  useEffect(() => {
    setItems(getCart());
    setTotal(getCartTotal());
    track('checkout_start');
  }, []);

  /* 카트가 비었으면 */
  useEffect(() => {
    if (items.length === 0 && typeof window !== 'undefined') {
      // 첫 렌더시에는 아직 localStorage를 못 읽었을 수 있으므로 체크
      const cart = getCart();
      if (cart.length === 0) return; // 빈 상태 허용 (리다이렉트는 submit에서 검증)
    }
  }, [items]);

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  /* 구독 의향 체크 */
  const handleSubscribe = (checked: boolean) => {
    updateField('subscribeIntent', checked);
    if (checked) {
      track('subscribe_intent');
    }
  };

  /* 검증 */
  const validate = (): FormErrors => {
    const errs: FormErrors = {};

    if (!form.buyerName.trim()) {
      errs.buyerName = '주문자 이름을 입력해주세요.';
    }

    const phoneResult = validatePhone(form.phone);
    if (!phoneResult.ok) {
      errs.phone = phoneResult.error;
    }

    if (!form.zipcode.trim() || !form.address1.trim()) {
      errs.zipcode = '배송지 주소를 입력해주세요.';
    }

    // 각인 이름 전체 재검증
    for (const item of items) {
      const nameResult = validateEngraveName(item.engraveName);
      if (!nameResult.ok) {
        errs.engrave = `"${item.engraveName}" — ${nameResult.error}`;
        break;
      }
    }

    if (items.length === 0) {
      errs.cart = '장바구니가 비어 있습니다.';
    }

    return errs;
  };

  /* 제출 */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          buyer_name: form.buyerName.trim(),
          phone: form.phone.replace(/[\s-]/g, ''),
          zipcode: form.zipcode.trim(),
          address1: form.address1.trim(),
          address2: form.address2.trim(),
          memo: form.memo.trim(),
          subscribe_intent: form.subscribeIntent,
          for_whom: form.forWhom,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || '주문 접수에 실패했습니다.');
      }

      const { id } = await res.json();
      clearCart();
      router.push(`/order/${id}`);
    } catch (err) {
      setErrors({
        cart: err instanceof Error ? err.message : '주문 접수에 실패했습니다.',
      });
      setSubmitting(false);
    }
  };

  /* ---------- 렌더 ---------- */
  return (
    <main className="bg-paper min-h-screen px-6 py-20">
      <div className="max-w-lg mx-auto">
        <p className="font-batang text-soft text-sm tracking-widest mb-3 text-center">
          주문서
        </p>
        <h1 className="font-batang font-bold text-2xl text-ink text-center mb-12">
          마지막으로 확인합니다
        </h1>

        {/* ── 주문 요약 ── */}
        <div className="border border-rule bg-white-2 p-5 mb-10">
          <p className="font-batang text-soft text-xs tracking-widest mb-4">
            주문 내역
          </p>
          <ul className="space-y-3">
            {items.map((item, i) => (
              <li key={i} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-plex text-sm text-ink">{item.productName}</p>
                  <p className="font-pen text-xl text-seal">{item.engraveName}</p>
                </div>
                <p className="font-plex text-sm text-soft flex-shrink-0">
                  {item.quantity}병 &middot; {(item.price * item.quantity).toLocaleString()}원
                </p>
              </li>
            ))}
          </ul>
          <div className="border-t border-rule mt-4 pt-3 flex justify-between">
            <span className="font-plex text-sm text-soft">합계</span>
            <span className="font-batang font-bold text-ink">
              {total.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* ── 폼 ── */}
        <form onSubmit={handleSubmit} className="space-y-7">
          {/* 주문자 이름 */}
          <Field
            label="주문자 이름"
            error={errors.buyerName}
          >
            <input
              type="text"
              value={form.buyerName}
              onChange={(e) => updateField('buyerName', e.target.value)}
              placeholder="홍길동"
              className={inputClass}
            />
          </Field>

          {/* 연락처 */}
          <Field
            label="연락처"
            error={errors.phone}
          >
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="01012345678"
              className={inputClass}
            />
          </Field>

          {/* 주소 */}
          <Field
            label="주소"
            error={errors.zipcode}
          >
            <input
              type="text"
              value={form.zipcode}
              onChange={(e) => updateField('zipcode', e.target.value)}
              placeholder="우편번호"
              className={`${inputClass} mb-2`}
            />
            <input
              type="text"
              value={form.address1}
              onChange={(e) => updateField('address1', e.target.value)}
              placeholder="기본주소"
              className={`${inputClass} mb-2`}
            />
            <input
              type="text"
              value={form.address2}
              onChange={(e) => updateField('address2', e.target.value)}
              placeholder="상세주소"
              className={inputClass}
            />
          </Field>

          {/* 배송메모 */}
          <Field label="배송 메모">
            <input
              type="text"
              value={form.memo}
              onChange={(e) => updateField('memo', e.target.value)}
              placeholder="부재 시 문 앞에 놓아주세요"
              className={inputClass}
            />
          </Field>

          {/* 누가 드실 건가요 */}
          <fieldset>
            <legend className="font-plex text-sm text-soft mb-3">
              누가 드실 건가요?
            </legend>
            <div className="flex gap-4">
              {([['self', '본인'], ['family', '가족']] as const).map(
                ([value, label]) => (
                  <label
                    key={value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="forWhom"
                      value={value}
                      checked={form.forWhom === value}
                      onChange={() => updateField('forWhom', value)}
                      className="accent-seal w-4 h-4"
                    />
                    <span className="font-plex text-sm text-ink">{label}</span>
                  </label>
                ),
              )}
            </div>
          </fieldset>

          {/* 정기구독 의향 */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.subscribeIntent}
              onChange={(e) => handleSubscribe(e.target.checked)}
              className="accent-seal w-4 h-4 mt-0.5"
            />
            <span className="font-plex text-sm text-ink leading-relaxed">
              정기적으로 받아보고 싶습니다
            </span>
          </label>

          {/* 에러 (카트/각인) */}
          {errors.engrave && (
            <p className="font-plex text-sm text-seal">{errors.engrave}</p>
          )}
          {errors.cart && (
            <p className="font-plex text-sm text-seal">{errors.cart}</p>
          )}

          {/* 제출 */}
          <button
            type="submit"
            disabled={submitting}
            className="block w-full py-4 bg-ink text-paper text-center
                       font-plex font-medium text-sm tracking-wide
                       hover:bg-seal transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '접수 중...' : '주문하기'}
          </button>

          <p className="text-center">
            <a
              href="/privacy"
              className="font-plex text-xs text-soft underline underline-offset-2
                         decoration-rule hover:text-ink transition-colors"
            >
              개인정보처리방침
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}

/* ---------- 공통 스타일 ---------- */

const inputClass = [
  'w-full bg-white-2 border border-rule px-4 py-3',
  'font-plex text-sm text-ink',
  'placeholder:text-rule',
  'outline-none focus:border-seal transition-colors',
].join(' ');

/* ---------- Field 래퍼 ---------- */

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-plex text-sm text-soft mb-2">{label}</label>
      {children}
      {error && (
        <p className="font-plex text-xs text-seal mt-1.5">{error}</p>
      )}
    </div>
  );
}
