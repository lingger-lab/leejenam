'use client';

type Props = {
  name: string;
  productName: string;
  date?: string;
  blank?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const sizeMap = {
  sm: { wrapper: 'px-5 py-6', brand: 'text-lg', tagline: 'text-[10px]', label: 'text-[9px]', name: 'text-[36px]', info: 'text-[9px]' },
  md: { wrapper: 'px-7 py-9', brand: 'text-[22px]', tagline: 'text-[11px]', label: 'text-[10px]', name: 'text-[50px]', info: 'text-[11px]' },
  lg: { wrapper: 'px-9 py-12', brand: 'text-[26px]', tagline: 'text-[13px]', label: 'text-[12px]', name: 'text-[60px]', info: 'text-[13px]' },
};

export function LabelPreview({
  name,
  productName,
  date,
  blank = false,
  size = 'md',
}: Props) {
  const s = sizeMap[size];

  return (
    <div className={`bg-white-2 border border-rule ${s.wrapper} text-center`}>
      <div className={`font-batang font-bold ${s.brand} text-ink tracking-normal`}>
        이제남
      </div>
      <div className={`${s.tagline} text-seal mt-1.5`}>
        이제, 오늘 담갔습니다
      </div>

      <hr className="border-0 h-px bg-rule my-6" />

      <div className={`${s.label} tracking-[0.22em] text-soft mb-2.5`}>
        드시는 분
      </div>

      <div className={`font-pen ${s.name} leading-tight text-seal min-h-[56px]`}>
        {blank ? '\u00A0' : (name || '\u00A0')}
        {!blank && name && <span className="cursor-blink text-gold">|</span>}
      </div>

      <hr className="border-0 h-px bg-rule mt-6" />

      <div className={`${s.info} text-soft mt-4 leading-relaxed`}>
        {productName} · 500ml · 설탕 없음
        {date && (
          <>
            <br />
            {date} 담금 · 유통기한 3개월
          </>
        )}
      </div>
    </div>
  );
}
