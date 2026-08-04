export function Spec() {
  return (
    <section id="spec" className="bg-paper-2 py-14 lg:py-20 px-6">
      <div className="max-w-lg lg:max-w-2xl mx-auto">
        <p className="font-batang text-soft text-sm tracking-widest mb-10 lg:mb-14 text-center">
          제품 정보
        </p>

        <table className="w-full text-base font-plex">
          <tbody className="divide-y divide-rule">
            {[
              ['제품명', '이제남 과일청'],
              ['종류', '복숭아청 / 자두청 / 블루베리청'],
              ['내용량', '500ml'],
              ['가격', '26,000원'],
              ['원재료', '과일, 알룰로스'],
              ['제조원', '농업회사법인 제이엔'],
              ['원산지', '국내산 (경남 창원)'],
              ['보관방법', '직사광선을 피해 서늘한 곳 보관. 개봉 후 냉장보관.'],
              ['유통기한', '제조일로부터 3개월'],
              ['배송', '주문 후 3~4일 · 배송비 무료'],
            ].map(([label, value]) => (
              <tr key={label}>
                <td className="py-3 pr-4 text-soft w-24 align-top whitespace-nowrap">
                  {label}
                </td>
                <td className="py-3 text-ink tabular-nums">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </section>
  );
}
