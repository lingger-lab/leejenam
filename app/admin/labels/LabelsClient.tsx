'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase';
import { LabelPreview } from '@/components/LabelPreview';

type LabelItem = {
  item_id: string;
  order_no: string;
  buyer_name: string;
  product_name: string;
  engrave_name: string;
  quantity: number;
  label_printed: boolean;
  label_written: boolean;
  created_at: string;
};

export default function LabelsClient() {
  const [items, setItems] = useState<LabelItem[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('label_queue')
        .select('*');
      if (data) setItems(data as LabelItem[]);
    }
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const markWritten = async (itemId: string) => {
    await supabase
      .from('order_items')
      .update({ label_written: true })
      .eq('id', itemId);
    setItems((prev) => prev.filter((i) => i.item_id !== itemId));
  };

  const today = new Date().toLocaleDateString('ko', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {/* 화면: 새길 이름 목록 */}
      <div className="print:hidden">
        <h1 className="font-batang font-bold text-2xl text-ink mb-6">
          오늘 새길 이름
        </h1>

        {items.length === 0 ? (
          <p className="text-soft text-sm">새길 이름이 없습니다.</p>
        ) : (
          <>
            <div className="space-y-0 divide-y divide-rule mb-8">
              {items.map((item) => (
                <div key={item.item_id} className="flex items-center gap-6 py-4">
                  <span className="text-sm text-soft w-32">{item.order_no}</span>
                  <span className="text-sm w-20">{item.product_name}</span>
                  <span className="font-pen text-4xl text-seal flex-1">
                    {item.engrave_name}
                  </span>
                  <span className="text-xs text-soft">x{item.quantity}</span>
                  <button
                    onClick={() => markWritten(item.item_id)}
                    className="px-3 py-1.5 border border-rule text-sm text-soft
                               hover:bg-ink hover:text-paper hover:border-ink transition-colors"
                  >
                    썼음
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-ink text-paper text-sm hover:bg-seal transition-colors"
            >
              라벨 인쇄
            </button>
          </>
        )}
      </div>

      {/* 인쇄: 이름 자리 빈칸 라벨 */}
      <div className="hidden print:block">
        <div className="grid grid-cols-3 gap-4">
          {items.flatMap((item) =>
            Array.from({ length: item.quantity }).map((_, i) => (
              <LabelPreview
                key={`${item.item_id}-${i}`}
                name=""
                productName={item.product_name}
                blank={true}
                date={today}
                size="sm"
              />
            ))
          )}
        </div>
      </div>
    </>
  );
}
