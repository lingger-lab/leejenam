export const dynamic = 'force-dynamic';

import { createServerClient } from '@/lib/supabase-server';

async function getLeads() {
  const supabase = await createServerClient();

  const [allRes, uncontactedRes] = await Promise.all([
    supabase.from('leads').select('*').order('created_at', { ascending: false }).limit(200),
    supabase.from('uncontacted_leads').select('*'),
  ]);

  return {
    all: allRes.data ?? [],
    uncontacted: uncontactedRes.data ?? [],
  };
}

export default async function LeadsPage() {
  let data;
  try {
    data = await getLeads();
  } catch {
    data = { all: [], uncontacted: [] };
  }

  return (
    <div>
      <h1 className="font-batang font-bold text-2xl text-ink mb-6">리드 목록</h1>

      {/* 미연락 경고 */}
      {data.uncontacted.length > 0 && (
        <div className="border-2 border-seal bg-seal/5 p-4 mb-8">
          <h2 className="font-bold text-seal mb-2">
            미연락 리드: {data.uncontacted.length}명
          </h2>
          <p className="text-sm text-soft">
            &quot;만들지 못하게 되면, 그것도 알려드리겠습니다.&quot; — 이건 약속입니다.
          </p>
          <div className="mt-3 space-y-2">
            {data.uncontacted.map((lead: Record<string, string>) => (
              <div key={lead.id} className="flex items-center gap-3 text-sm">
                <span className="text-seal font-medium">{lead.phone}</span>
                <span className="text-soft">{lead.name ?? '-'}</span>
                {lead.engrave_names && (
                  <span className="font-pen text-lg text-seal">{lead.engrave_names}</span>
                )}
                <span className="text-soft text-xs ml-auto">
                  {new Date(lead.created_at).toLocaleDateString('ko')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 전체 리드 */}
      {data.all.length === 0 ? (
        <p className="text-soft text-sm">리드가 없습니다.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-rule text-left text-soft">
              <th className="py-3 pr-3">연락처</th>
              <th className="py-3 pr-3">이름</th>
              <th className="py-3 pr-3">유입</th>
              <th className="py-3 pr-3">연락</th>
              <th className="py-3">일시</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-rule/50">
            {data.all.map((lead: Record<string, string | null>) => (
              <tr key={lead.id} className={!lead.contacted_at ? 'bg-seal/5' : ''}>
                <td className="py-3 pr-3">{lead.phone}</td>
                <td className="py-3 pr-3">{lead.name ?? '-'}</td>
                <td className="py-3 pr-3 text-soft">{lead.source ?? '-'}</td>
                <td className="py-3 pr-3">
                  {lead.contacted_at ? (
                    <span className="text-green-600">완료</span>
                  ) : (
                    <span className="text-seal font-medium">미연락</span>
                  )}
                </td>
                <td className="py-3 text-soft text-xs">
                  {lead.created_at ? new Date(lead.created_at).toLocaleDateString('ko') : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
