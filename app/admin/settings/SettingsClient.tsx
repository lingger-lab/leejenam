'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';

export default function SettingsClient() {
  const [adSpend, setAdSpend] = useState(0);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('settings')
        .select('ad_spend_total')
        .eq('id', 1)
        .single();
      if (data) setAdSpend(data.ad_spend_total);
      setLoading(false);
    }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = async () => {
    await supabase
      .from('settings')
      .update({ ad_spend_total: adSpend })
      .eq('id', 1);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <p className="text-soft">불러오는 중...</p>;

  return (
    <div>
      <h1 className="font-batang font-bold text-2xl text-ink mb-8">설정</h1>

      <div className="max-w-md space-y-6">
        <div>
          <label className="block text-sm text-soft mb-2">
            누적 광고비 (원)
          </label>
          <p className="text-xs text-soft mb-3">
            CAC = 광고비 / 주문수. 이 값이 20,000원을 넘으면 사업이 성립하지 않습니다.
          </p>
          <input
            type="number"
            value={adSpend}
            onChange={(e) => setAdSpend(Number(e.target.value))}
            className="w-full border border-rule px-4 py-3 text-lg bg-white outline-none
                       focus:border-ink transition-colors"
            min={0}
            step={10000}
          />
          <p className="text-xs text-soft mt-1">
            현재: {adSpend.toLocaleString()}원
          </p>
        </div>

        <button
          onClick={handleSave}
          className={`px-6 py-3 text-sm transition-all ${
            saved
              ? 'bg-seal/10 text-seal border border-seal'
              : 'bg-ink text-paper hover:bg-seal'
          }`}
        >
          {saved ? '저장됨' : '저장'}
        </button>
      </div>
    </div>
  );
}
