'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { PRODUCTS, type ProductId } from '@/lib/products';
import { PRICE } from '@/lib/config';
import { validatePhone, validateEngraveName } from '@/lib/validators';
import { track } from '@/lib/events';
import { getStoredName } from '@/lib/name';

/* ---------- Suspense wrapper ---------- */

export default function CheckoutPageWrapper() {
  return (
    <Suspense>
      <CheckoutPage />
    </Suspense>
  );
}

/* ---------- Types ---------- */

type OrderItem = {
  id: string;
  productId: ProductId;
  productName: string;
  engraveName: string;
  price: number;
};

type ShippingForm = {
  buyerName: string;
  phone: string;
  zipcode: string;
  address1: string;
  address2: string;
  memo: string;
  subscribeIntent: boolean;
  forWhom: 'self' | 'family';
};

type FormErrors = Partial<
  Record<keyof ShippingForm | 'items' | 'engrave' | 'api', string>
>;

/* ---------- Daum Postcode type ---------- */

declare global {
  interface Window {
    daum?: {
      Postcode: new (opts: {
        oncomplete: (data: { zonecode: string; roadAddress: string }) => void;
        width?: string;
        height?: string;
      }) => { open: () => void; embed: (element: HTMLElement) => void };
    };
  }
}

/* ---------- Page ---------- */

function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorRef = useRef<HTMLDivElement>(null);
  const orderListRef = useRef<HTMLDivElement>(null);
  const address2Ref = useRef<HTMLInputElement>(null);
  const postcodeRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);

  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [nameInputs, setNameInputs] = useState<Record<ProductId, string>>({
    peach: '',
    plum: '',
    berry: '',
  });
  const [nameErrors, setNameErrors] = useState<Record<ProductId, string>>({
    peach: '',
    plum: '',
    berry: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [showPostcode, setShowPostcode] = useState(false);

  const [form, setForm] = useState<ShippingForm>({
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

  const total = orderItems.reduce((sum, item) => sum + item.price, 0);

  /* 마운트: 저장된 이름 기입 + 쿼리 파라미터 처리 */
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    localStorage.removeItem('ijn_cart');
    track('checkout_start');

    const stored = getStoredName();
    if (stored) {
      setNameInputs({ peach: stored, plum: stored, berry: stored });
      setForm((prev) => ({ ...prev, buyerName: stored }));
    }

    const productParam = searchParams.get('product') as ProductId | null;
    if (productParam && stored) {
      const product = PRODUCTS.find((p) => p.id === productParam);
      const result = validateEngraveName(stored);
      if (product && result.ok) {
        setOrderItems([
          {
            id: crypto.randomUUID(),
            productId: product.id,
            productName: product.name,
            engraveName: stored,
            price: PRICE,
          },
        ]);
        setNameInputs((prev) => ({ ...prev, [productParam]: '' }));
      }
    }
  }, [searchParams]);

  /* 에러 시 스크롤 */
  useEffect(() => {
    if (Object.keys(errors).length > 0 && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [errors]);

  /* ---------- 상품 추가/제거 ---------- */

  const handleNameChange = (id: ProductId, value: string) => {
    if (value.length <= 10) {
      setNameInputs((prev) => ({ ...prev, [id]: value }));
      setNameErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  const handleAdd = (id: ProductId) => {
    const product = PRODUCTS.find((p) => p.id === id)!;
    const name = nameInputs[id].trim();

    const result = validateEngraveName(name);
    if (!result.ok) {
      setNameErrors((prev) => ({ ...prev, [id]: result.error }));
      return;
    }

    const newItem: OrderItem = {
      id: crypto.randomUUID(),
      productId: id,
      productName: product.name,
      engraveName: name,
      price: PRICE,
    };

    setOrderItems((prev) => [...prev, newItem]);
    setNameInputs((prev) => ({ ...prev, [id]: '' }));
    track('add_to_cart', { product_id: id, engrave_name: name });
    setTimeout(() => {
      orderListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleRemove = (itemId: string) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  /* ---------- 배송 폼 ---------- */

  const updateField = <K extends keyof ShippingForm>(
    key: K,
    value: ShippingForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  /* ---------- 다음 우편번호 검색 (임베드 방식) ---------- */

  const openPostcode = () => {
    setShowPostcode(true);
  };

  useEffect(() => {
    if (showPostcode && postcodeRef.current && window.daum?.Postcode) {
      postcodeRef.current.innerHTML = '';
      new window.daum.Postcode({
        oncomplete: (data) => {
          updateField('zipcode', data.zonecode);
          updateField('address1', data.roadAddress);
          setShowPostcode(false);
          setTimeout(() => address2Ref.current?.focus(), 100);
        },
        width: '100%',
        height: '100%',
      }).embed(postcodeRef.current);
    }
  }, [showPostcode]);

  /* ---------- 검증 + 제출 ---------- */

  const validate = (): FormErrors => {
    const errs: FormErrors = {};

    if (orderItems.length === 0) {
      errs.items = '주문할 청을 선택해주세요.';
    }

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

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setErrors({});

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems.map((item) => ({
            product_id: item.productId,
            engrave_name: item.engraveName,
            unit_price: item.price,
            quantity: 1,
          })),
          buyer_name: form.buyerName.trim(),
          buyer_phone: form.phone.replace(/[\s-]/g, ''),
          zipcode: form.zipcode.trim(),
          address1: form.address1.trim(),
          address2: form.address2.trim(),
          delivery_memo: form.memo.trim(),
          subscribe_intent: form.subscribeIntent,
          survey_who: form.forWhom,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || '주문 접수에 실패했습니다.');
      }

      const { orderId } = await res.json();
      router.push(`/order/${orderId}`);
    } catch (err) {
      setErrors({
        api: err instanceof Error ? err.message : '주문 접수에 실패했습니다.',
      });
      setSubmitting(false);
    }
  };

  const allErrorMessages = Object.values(errors).filter(Boolean) as string[];

  /* ---------- 렌더 ---------- */
  return (
    <div className="bg-paper min-h-screen px-6 py-10">
      <div className="max-w-lg mx-auto">
        <p className="font-batang text-soft text-sm tracking-widest mb-3 text-center">
          주문하기
        </p>
        <h1 className="font-batang font-bold text-2xl text-ink text-center mb-4">
          이름을 새겨 보내드립니다
        </h1>
        <p className="text-center font-plex text-sm text-soft mb-12">
          {PRICE.toLocaleString()}원 · 500ml · 주문 후 3~4일
        </p>

        <form onSubmit={handleSubmit}>
          {/* ── 1. 상품 선택 ── */}
          <div className="space-y-6 mb-10">
            {PRODUCTS.map((product) => {
              const nameError = nameErrors[product.id];

              return (
                <div
                  key={product.id}
                  className="border border-rule bg-white-2/50"
                >
                  <FlipCard
                    src={product.src}
                    backSrc={product.backSrc}
                    alt={product.name}
                  />

                  <div className="p-4">
                    <div className="flex items-baseline justify-between mb-3">
                      <h3 className="font-batang font-bold text-lg text-ink">
                        {product.name}
                      </h3>
                      <span className="font-plex text-sm text-ink">
                        {PRICE.toLocaleString()}원
                      </span>
                    </div>
                    <p className="text-soft text-sm font-plex mb-4">
                      {product.note}
                    </p>

                    <label className="block text-soft text-xs mb-2 font-plex">
                      라벨에 새길 이름
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={nameInputs[product.id]}
                        onChange={(e) =>
                          handleNameChange(product.id, e.target.value)
                        }
                        placeholder="한글 이름"
                        className="flex-1 font-pen text-2xl text-seal bg-paper
                                   border border-rule focus:border-seal
                                   outline-none px-3 py-2 placeholder:font-plex
                                   placeholder:text-sm placeholder:text-rule
                                   transition-colors"
                        maxLength={10}
                        autoComplete="off"
                      />
                      <button
                        type="button"
                        onClick={() => handleAdd(product.id)}
                        disabled={!nameInputs[product.id].trim()}
                        className="flex-shrink-0 px-5 py-2 text-sm font-plex font-medium
                                   bg-ink text-paper hover:bg-seal border border-ink
                                   hover:border-seal transition-colors
                                   disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        추가
                      </button>
                    </div>
                    {nameError && (
                      <p className="text-seal text-xs mt-2 font-plex">
                        {nameError}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── 주문 내역 ── */}
          {orderItems.length > 0 && (
            <div ref={orderListRef} className="border border-rule bg-white-2 p-5 mb-10">
              <p className="font-batang text-soft text-xs tracking-widest mb-4">
                주문 내역
              </p>
              <ul className="space-y-3">
                {orderItems.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="font-plex text-sm text-ink">
                        {item.productName}
                      </span>
                      <span className="font-pen text-xl text-seal ml-2">
                        {item.engraveName}
                      </span>
                    </div>
                    <span className="font-plex text-sm text-soft flex-shrink-0">
                      {item.price.toLocaleString()}원
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="font-plex text-xs text-soft hover:text-seal
                                 transition-colors flex-shrink-0"
                      aria-label="삭제"
                    >
                      ✕
                    </button>
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
          )}

          {/* ── 2. 배송 정보 ── */}
          <div className="space-y-7 mb-8">
            <p className="font-batang text-soft text-xs tracking-widest">
              배송 정보
            </p>

            <Field label="주문자 이름" error={errors.buyerName}>
              <input
                type="text"
                value={form.buyerName}
                onChange={(e) => updateField('buyerName', e.target.value)}
                placeholder="홍길동"
                className={inputClass}
              />
            </Field>

            <Field label="연락처" error={errors.phone}>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="01012345678"
                className={inputClass}
              />
            </Field>

            <Field label="주소" error={errors.zipcode}>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={form.zipcode}
                  readOnly
                  placeholder="우편번호"
                  className={`${inputClass} flex-1 bg-white-2 cursor-pointer`}
                  onClick={openPostcode}
                />
                <button
                  type="button"
                  onClick={openPostcode}
                  className="flex-shrink-0 px-4 py-3 bg-ink text-paper
                             font-plex text-sm font-medium
                             hover:bg-seal active:bg-seal transition-colors"
                  style={{ touchAction: 'manipulation' }}
                >
                  주소 검색
                </button>
              </div>
              <input
                type="text"
                value={form.address1}
                readOnly
                placeholder="기본주소"
                className={`${inputClass} mb-2 bg-white-2 cursor-pointer`}
                onClick={openPostcode}
              />
              <input
                ref={address2Ref}
                type="text"
                value={form.address2}
                onChange={(e) => updateField('address2', e.target.value)}
                placeholder="상세주소 (동/호수)"
                className={inputClass}
              />
            </Field>

            <Field label="배송 메모">
              <input
                type="text"
                value={form.memo}
                onChange={(e) => updateField('memo', e.target.value)}
                placeholder="부재 시 문 앞에 놓아주세요"
                className={inputClass}
              />
            </Field>

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
                      <span className="font-plex text-sm text-ink">
                        {label}
                      </span>
                    </label>
                  ),
                )}
              </div>
            </fieldset>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.subscribeIntent}
                onChange={(e) => {
                  updateField('subscribeIntent', e.target.checked);
                  if (e.target.checked) track('subscribe_intent');
                }}
                className="accent-seal w-4 h-4 mt-0.5"
              />
              <span className="font-plex text-sm text-ink leading-relaxed">
                정기적으로 받아보고 싶습니다
              </span>
            </label>
          </div>

          {/* ── 에러 통합 표시 ── */}
          {allErrorMessages.length > 0 && (
            <div
              ref={errorRef}
              className="border-2 border-seal bg-seal/10 p-4 mb-6 space-y-1"
            >
              <p className="font-plex text-sm font-bold text-seal">
                입력을 확인해주세요
              </p>
              {allErrorMessages.map((msg, i) => (
                <p key={i} className="font-plex text-sm text-seal">
                  · {msg}
                </p>
              ))}
            </div>
          )}

          {/* ── 제출 버튼 ── */}
          <button
            type="submit"
            disabled={submitting}
            style={{ touchAction: 'manipulation' }}
            className="block w-full py-4 bg-ink text-paper text-center
                       font-plex font-medium text-sm tracking-wide
                       active:bg-seal hover:bg-seal transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting
              ? '접수 중...'
              : orderItems.length > 0
                ? `주문하기 · ${total.toLocaleString()}원`
                : '주문하기'}
          </button>

          <p className="text-center mt-4 pb-6">
            <a
              href="/privacy"
              className="font-plex text-xs text-soft underline underline-offset-2
                         decoration-rule hover:text-ink transition-colors"
            >
              개인정보처리방침
            </a>
          </p>

          {/* 모바일 고정 하단 버튼 */}
          {orderItems.length > 0 && (
            <div className="fixed bottom-0 left-0 right-0 bg-paper border-t border-rule p-4 z-40 md:hidden">
              <button
                type="submit"
                disabled={submitting}
                style={{ touchAction: 'manipulation' }}
                className="w-full py-4 bg-ink text-paper text-center
                           font-plex font-medium text-sm tracking-wide
                           active:bg-seal hover:bg-seal transition-colors
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? '접수 중...'
                  : `주문하기 · ${total.toLocaleString()}원`}
              </button>
            </div>
          )}
        </form>

        {orderItems.length > 0 && <div className="h-24 md:hidden" />}
      </div>

      {/* ── 주소 검색 오버레이 (임베드) ── */}
      {showPostcode && (
        <div className="fixed inset-0 z-50 bg-ink/40 flex items-end md:items-center justify-center">
          <div className="w-full max-w-lg bg-paper">
            <div className="flex items-center justify-between px-4 py-3 border-b border-rule">
              <span className="font-plex text-sm text-ink font-medium">
                주소 검색
              </span>
              <button
                type="button"
                onClick={() => setShowPostcode(false)}
                className="font-plex text-sm text-soft hover:text-ink transition-colors px-2"
              >
                닫기
              </button>
            </div>
            <div ref={postcodeRef} style={{ height: '450px', width: '100%' }} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- FlipCard ---------- */

function FlipCard({
  src,
  backSrc,
  alt,
}: {
  src: string;
  backSrc: string;
  alt: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-full aspect-[4/5] cursor-pointer select-none"
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className="relative w-full h-full motion-safe:transition-transform motion-safe:duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 512px"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <Image
            src={backSrc}
            alt={`${alt} 뒷면`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 512px"
          />
        </div>
      </div>
      <span className="absolute bottom-2 right-2 font-plex text-xs text-soft bg-paper/80 px-2 py-0.5">
        {flipped ? '앞면 보기' : '뒷면 보기'}
      </span>
    </div>
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
