export const dynamic = 'force-dynamic';

import { createServerClient } from '@/lib/supabase-server';

async function getMetrics() {
  const supabase = await createServerClient();

  const [verdictRes, distributionRes, ordersToday, ordersTotal] = await Promise.all([
    supabase.from('verdict').select('*').single(),
    supabase.from('product_distribution').select('*'),
    supabase.from('orders').select('id', { count: 'exact' })
      .gte('created_at', new Date().toISOString().split('T')[0]),
    supabase.from('orders').select('id', { count: 'exact' }),
  ]);

  return {
    verdict: verdictRes.data,
    distribution: distributionRes.data ?? [],
    todayOrders: ordersToday.count ?? 0,
    totalOrders: ordersTotal.count ?? 0,
  };
}

export default async function AdminDashboard() {
  let metrics;
  try {
    metrics = await getMetrics();
  } catch {
    metrics = null;
  }

  return (
    <div>
      <h1 className="font-batang font-bold text-2xl text-ink mb-8">대시보드</h1>

      {/* 핵심 지표 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <MetricCard
          label="오늘 주문"
          value={metrics?.todayOrders ?? '-'}
        />
        <MetricCard
          label="누적 주문"
          value={metrics?.totalOrders ?? '-'}
        />
        <MetricCard
          label="구매버튼 클릭률"
          value={
            metrics?.verdict?.purchase_click_rate != null
              ? `${metrics.verdict.purchase_click_rate}%`
              : '-'
          }
          alert={
            metrics?.verdict?.purchase_click_rate != null &&
            metrics.verdict.purchase_click_rate < 3
          }
        />
        <MetricCard
          label="CAC 추정"
          value={
            metrics?.verdict?.cac_estimate != null
              ? `${Number(metrics.verdict.cac_estimate).toLocaleString()}원`
              : '-'
          }
          alert={
            metrics?.verdict?.cac_estimate != null &&
            metrics.verdict.cac_estimate > 20000
          }
        />
      </div>

      {/* 판정 */}
      {metrics?.verdict && (
        <VerdictBanner verdict={metrics.verdict.verdict} />
      )}

      {/* 3종 분포 */}
      {metrics?.distribution && metrics.distribution.length > 0 && (
        <div className="mt-8">
          <h2 className="font-batang font-bold text-lg text-ink mb-4">3종 분포</h2>
          <div className="space-y-2">
            {metrics.distribution.map((item: { name: string; order_count: number; pct: number }) => (
              <div key={item.name} className="flex items-center gap-3">
                <span className="text-sm text-soft w-20">{item.name}</span>
                <div className="flex-1 bg-rule/30 h-6 relative">
                  <div
                    className="bg-seal h-full transition-all"
                    style={{ width: `${item.pct ?? 0}%` }}
                  />
                </div>
                <span className="text-sm text-ink w-16 text-right">
                  {item.order_count}건 ({item.pct ?? 0}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!metrics && (
        <p className="text-soft text-sm mt-4">
          Supabase가 연결되지 않았습니다. .env.local을 확인해주세요.
        </p>
      )}
    </div>
  );
}

function MetricCard({
  label,
  value,
  alert = false,
}: {
  label: string;
  value: string | number;
  alert?: boolean;
}) {
  return (
    <div className={`border p-4 ${alert ? 'border-seal bg-seal/5' : 'border-rule bg-white'}`}>
      <p className="text-xs text-soft mb-1">{label}</p>
      <p className={`text-2xl font-bold ${alert ? 'text-seal' : 'text-ink'}`}>
        {value}
      </p>
    </div>
  );
}

function VerdictBanner({ verdict }: { verdict: string }) {
  const config: Record<string, { bg: string; text: string; title: string; desc: string }> = {
    INSUFFICIENT_DATA: {
      bg: 'bg-rule/20 border-rule',
      text: 'text-soft',
      title: '아직 판정할 수 없습니다',
      desc: '방문자 100명이 넘어야 합니다.',
    },
    FAIL_LOW_INTENT: {
      bg: 'bg-seal/5 border-seal',
      text: 'text-seal',
      title: '컨셉 사망',
      desc: '구매버튼 클릭률이 3% 미만입니다. 중단하십시오.',
    },
    FAIL_HIGH_CAC: {
      bg: 'bg-seal/5 border-seal',
      text: 'text-seal',
      title: '팔수록 손해',
      desc: 'CAC가 20,000원을 넘습니다.',
    },
    FAIL_NO_REPEAT: {
      bg: 'bg-gold/10 border-gold',
      text: 'text-ink',
      title: '일회성 상품',
      desc: '정기구독 의향이 0입니다.',
    },
    PASS: {
      bg: 'bg-green-50 border-green-600',
      text: 'text-green-800',
      title: '통과',
      desc: '생산을 시작하십시오. 승자 1종만.',
    },
  };

  const c = config[verdict] ?? config.INSUFFICIENT_DATA;

  return (
    <div className={`border-2 ${c.bg} p-5`}>
      <h3 className={`font-bold text-lg ${c.text}`}>{c.title}</h3>
      <p className="text-sm text-soft mt-1">{c.desc}</p>
    </div>
  );
}
