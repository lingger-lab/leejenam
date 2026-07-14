export const dynamic = 'force-dynamic';

import { createServerClient } from '@/lib/supabase-server';

async function getAnalytics() {
  const supabase = await createServerClient();

  const [dailyRes, funnelRes, adRes, sectionRes, hourlyRes] = await Promise.all([
    supabase.from('daily_metrics').select('*').limit(30),
    supabase.from('funnel').select('*').single(),
    supabase.from('ad_performance').select('*'),
    supabase.from('section_reach').select('*'),
    supabase.from('hourly_pattern').select('*'),
  ]);

  return {
    daily: dailyRes.data ?? [],
    funnel: funnelRes.data,
    ads: adRes.data ?? [],
    sections: sectionRes.data ?? [],
    hourly: hourlyRes.data ?? [],
  };
}

export default async function AnalyticsPage() {
  let data;
  try {
    data = await getAnalytics();
  } catch {
    data = null;
  }

  if (!data) {
    return (
      <div>
        <h1 className="font-batang font-bold text-2xl text-ink mb-4">마케팅 분석</h1>
        <p className="text-soft text-sm">Supabase 연결을 확인해주세요.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-batang font-bold text-2xl text-ink mb-8">마케팅 분석</h1>

      {/* 퍼널 */}
      {data.funnel && (
        <div className="mb-10">
          <h2 className="font-bold text-lg text-ink mb-4">퍼널</h2>
          <FunnelChart funnel={data.funnel} />
        </div>
      )}

      {/* 일간 추이 */}
      {data.daily.length > 0 && (
        <div className="mb-10">
          <h2 className="font-bold text-lg text-ink mb-4">일간 추이 (최근 30일)</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule text-left text-soft">
                  <th className="py-2 pr-4">날짜</th>
                  <th className="py-2 pr-4">방문</th>
                  <th className="py-2 pr-4">장바구니</th>
                  <th className="py-2 pr-4">주문</th>
                  <th className="py-2">클릭률</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-rule/50">
                {data.daily.map((d: Record<string, number | string>) => {
                  const rate = Number(d.visitors) > 0
                    ? ((Number(d.cart_clicks) / Number(d.visitors)) * 100).toFixed(1)
                    : '0';
                  return (
                    <tr key={String(d.date)}>
                      <td className="py-2 pr-4 text-soft">{String(d.date)}</td>
                      <td className="py-2 pr-4">{d.visitors}</td>
                      <td className="py-2 pr-4">{d.cart_clicks}</td>
                      <td className="py-2 pr-4">{d.orders}</td>
                      <td className={`py-2 font-medium ${Number(rate) < 3 ? 'text-seal' : 'text-ink'}`}>
                        {rate}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 광고 소재별 */}
      {data.ads.length > 0 && (
        <div className="mb-10">
          <h2 className="font-bold text-lg text-ink mb-4">광고 소재별 성과</h2>
          <div className="grid gap-3">
            {data.ads.map((ad: Record<string, string | number>) => (
              <div key={String(ad.ad)} className="border border-rule p-4 flex items-center gap-4">
                <span className="font-medium text-ink">{ad.ad}</span>
                <span className="text-soft text-sm">방문 {ad.visitors}</span>
                <span className="text-soft text-sm">클릭 {ad.cart_clicks}</span>
                <span className={`ml-auto font-bold ${Number(ad.click_rate) < 3 ? 'text-seal' : 'text-ink'}`}>
                  {ad.click_rate}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 섹션별 도달 */}
      {data.sections.length > 0 && (
        <div className="mb-10">
          <h2 className="font-bold text-lg text-ink mb-4">섹션별 도달률</h2>
          <div className="space-y-2">
            {data.sections.map((s: Record<string, string | number>) => (
              <div key={String(s.section)} className="flex items-center gap-3">
                <span className="text-sm text-soft w-24">{s.section}</span>
                <div className="flex-1 bg-rule/30 h-5 relative">
                  <div
                    className="bg-ink h-full"
                    style={{ width: `${s.reach_rate}%` }}
                  />
                </div>
                <span className="text-sm w-14 text-right">{s.reach_rate}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 시간대별 */}
      {data.hourly.length > 0 && (
        <div className="mb-10">
          <h2 className="font-bold text-lg text-ink mb-4">시간대별 방문 패턴</h2>
          <div className="flex items-end gap-1 h-32">
            {Array.from({ length: 24 }, (_, h) => {
              const entry = data.hourly.find((e: Record<string, number>) => Number(e.hour) === h);
              const count = entry ? Number((entry as Record<string, number>).visitors) : 0;
              const max = Math.max(...data.hourly.map((e: Record<string, number>) => Number(e.visitors)), 1);
              const pct = (count / max) * 100;
              return (
                <div key={h} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full bg-seal/60 transition-all"
                    style={{ height: `${pct}%`, minHeight: count > 0 ? '2px' : '0' }}
                    title={`${h}시: ${count}명`}
                  />
                  {h % 6 === 0 && (
                    <span className="text-[9px] text-soft">{h}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function FunnelChart({ funnel }: { funnel: Record<string, number> }) {
  const steps = [
    { key: 'step1_visit', label: '방문' },
    { key: 'step2_name_start', label: '이름 입력' },
    { key: 'step3_name_complete', label: '이름 완료' },
    { key: 'step4_add_cart', label: '장바구니' },
    { key: 'step5_checkout', label: '주문서' },
    { key: 'step6_order', label: '주문 완료' },
  ];

  const maxVal = Math.max(funnel[steps[0].key] || 1, 1);

  return (
    <div className="space-y-2">
      {steps.map((step, i) => {
        const val = funnel[step.key] || 0;
        const pct = ((val / maxVal) * 100).toFixed(0);
        const prevVal = i > 0 ? funnel[steps[i - 1].key] || 0 : val;
        const convRate = prevVal > 0 ? ((val / prevVal) * 100).toFixed(1) : '-';

        return (
          <div key={step.key} className="flex items-center gap-3">
            <span className="text-sm text-soft w-20">{step.label}</span>
            <div className="flex-1 bg-rule/30 h-8 relative">
              <div
                className={`h-full transition-all ${
                  step.key === 'step4_add_cart' ? 'bg-seal' : 'bg-ink/70'
                }`}
                style={{ width: `${pct}%` }}
              />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-white mix-blend-difference">
                {val}
              </span>
            </div>
            <span className="text-xs text-soft w-14 text-right">
              {i > 0 ? `${convRate}%` : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}
