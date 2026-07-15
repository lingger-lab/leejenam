const badges = [
  { label: '재고', value: '0병', desc: '주문받고 담급니다' },
  { label: '배송', value: '사흘', desc: '주문 후 3~4일' },
  { label: '라벨', value: '이름', desc: '드시는 분 이름을 새깁니다' },
  { label: '원물', value: '욱곡', desc: '경남 진주 욱곡농장' },
];

export function Badges() {
  return (
    <section id="badges" className="bg-paper py-16 px-6">
      <div className="max-w-lg mx-auto grid grid-cols-2 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.label}
            className="border border-rule bg-white-2 p-5 text-center"
          >
            <p className="text-soft text-[10px] tracking-[0.3em] uppercase font-plex mb-1">
              {badge.label}
            </p>
            <p className="font-batang font-bold text-2xl text-ink">
              {badge.value}
            </p>
            <p className="text-soft text-xs mt-1.5 font-plex">{badge.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
