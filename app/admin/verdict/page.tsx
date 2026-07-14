export const dynamic = 'force-dynamic';

import { createServerClient } from '@/lib/supabase-server';
import { THRESHOLDS } from '@/lib/config';

async function getVerdict() {
  const supabase = await createServerClient();
  const { data } = await supabase.from('verdict').select('*').single();
  return data;
}

const VERDICT_UI: Record<string, { border: string; bg: string; title: string; desc: string }> = {
  INSUFFICIENT_DATA: {
    border: 'border-rule',
    bg: 'bg-rule/10',
    title: '아직 판정할 수 없습니다',
    desc: `방문자 ${THRESHOLDS.MIN_VISITORS_FOR_VERDICT}명이 넘어야 합니다.`,
  },
  FAIL_LOW_INTENT: {
    border: 'border-seal',
    bg: 'bg-seal/5',
    title: '컨셉 사망',
    desc: `구매버튼 클릭률이 ${THRESHOLDS.MIN_PURCHASE_CLICK_RATE}% 미만입니다. 중단하십시오.`,
  },
  FAIL_HIGH_CAC: {
    border: 'border-seal',
    bg: 'bg-seal/5',
    title: '팔수록 손해',
    desc: `CAC가 ${THRESHOLDS.MAX_CAC.toLocaleString()}원을 넘습니다. 마진보다 큽니다.`,
  },
  FAIL_NO_REPEAT: {
    border: 'border-gold',
    bg: 'bg-gold/10',
    title: '일회성 상품',
    desc: '정기구독 의향이 0입니다. 매일 마시는 음료가 아닙니다.',
  },
  PASS: {
    border: 'border-green-600',
    bg: 'bg-green-50',
    title: '통과',
    desc: '생산을 시작하십시오. 단, 승자 1종만.',
  },
};

export default async function VerdictPage() {
  let verdict;
  try {
    verdict = await getVerdict();
  } catch {
    verdict = null;
  }

  if (!verdict) {
    return (
      <div>
        <h1 className="font-batang font-bold text-2xl text-ink mb-4">판정 대시보드</h1>
        <p className="text-soft text-sm">Supabase 연결을 확인해주세요.</p>
      </div>
    );
  }

  const ui = VERDICT_UI[verdict.verdict] ?? VERDICT_UI.INSUFFICIENT_DATA;
  const isFail = verdict.verdict?.startsWith('FAIL');

  return (
    <div>
      <h1 className="font-batang font-bold text-2xl text-ink mb-8">판정 대시보드</h1>

      {/* 판정 결과 */}
      <div className={`border-2 ${ui.border} ${ui.bg} p-8 mb-10`}>
        <h2 className={`font-bold text-3xl ${isFail ? 'text-seal' : 'text-ink'}`}>
          {ui.title}
        </h2>
        <p className="text-soft text-lg mt-2">{ui.desc}</p>
      </div>

      {/* 상세 지표 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="방문자" value={verdict.visitors} />
        <StatCard label="장바구니 클릭" value={verdict.cart_clicks} />
        <StatCard label="주문 완료" value={verdict.orders} />
        <StatCard label="구독 의향" value={verdict.sub_intent} />
      </div>

      {/* 기준값 */}
      <div className="border border-rule p-6">
        <h3 className="font-bold text-ink mb-4">판정 기준 (하드코딩 — 변경 불가)</h3>
        <table className="w-full text-sm">
          <tbody className="divide-y divide-rule/50">
            <tr>
              <td className="py-2 text-soft">구매버튼 클릭률</td>
              <td className={`py-2 font-bold ${
                verdict.purchase_click_rate < THRESHOLDS.MIN_PURCHASE_CLICK_RATE
                  ? 'text-seal' : 'text-ink'
              }`}>
                {verdict.purchase_click_rate ?? 0}%
              </td>
              <td className="py-2 text-soft text-right">
                기준: {THRESHOLDS.MIN_PURCHASE_CLICK_RATE}% 이상
              </td>
            </tr>
            <tr>
              <td className="py-2 text-soft">CAC 추정</td>
              <td className={`py-2 font-bold ${
                verdict.cac_estimate > THRESHOLDS.MAX_CAC ? 'text-seal' : 'text-ink'
              }`}>
                {verdict.cac_estimate != null
                  ? `${Number(verdict.cac_estimate).toLocaleString()}원`
                  : '-'}
              </td>
              <td className="py-2 text-soft text-right">
                기준: {THRESHOLDS.MAX_CAC.toLocaleString()}원 이하
              </td>
            </tr>
            <tr>
              <td className="py-2 text-soft">정기구독 의향</td>
              <td className={`py-2 font-bold ${
                verdict.sub_intent === 0 && verdict.orders > 0 ? 'text-seal' : 'text-ink'
              }`}>
                {verdict.sub_intent}명
              </td>
              <td className="py-2 text-soft text-right">기준: 0 초과</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-soft text-xs mt-6">
        이 기준은 코드에 하드코딩되어 있습니다. 결과를 보고 기준을 느슨하게 만들 수 없습니다.
      </p>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number | null }) {
  return (
    <div className="border border-rule bg-white p-4">
      <p className="text-xs text-soft">{label}</p>
      <p className="text-2xl font-bold text-ink mt-1">{value ?? 0}</p>
    </div>
  );
}
