import Image from 'next/image';

const recipes = [
  {
    src: '/img/blueberry_aid.webp',
    alt: '블루베리청 에이드 — 블루베리청에 탄산수와 얼음',
    title: '에이드로',
    desc: '블루베리청에 탄산수와 얼음을. 여름에 가장 시원하게.',
  },
  {
    src: '/img/peach_latte.webp',
    alt: '복숭아청 라떼 — 복숭아청을 차가운 우유에 섞은 과일 라떼',
    title: '우유에 타서',
    desc: '복숭아청을 차가운 우유에 섞으면 과일 라떼가 됩니다.',
  },
  {
    src: '/img/plum_yogurt.webp',
    alt: '자두청 요거트 — 자두청을 요거트 위에 얹은 디저트',
    title: '얹어서',
    desc: '자두청을 요거트나 아이스크림 위에 얹으세요.',
  },
];

export function Serving() {
  return (
    <section id="serving" className="bg-paper-2 py-14 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-14">
          <h2 className="font-batang font-bold text-2xl text-ink">
            시원하게 즐기는 법
          </h2>
        </div>

        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-3 md:gap-8">
          {recipes.map((recipe) => (
            <div key={recipe.title}>
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded">
                <Image
                  src={recipe.src}
                  alt={recipe.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="lazy"
                />
              </div>
              <h3 className="font-batang text-lg text-ink mt-4">
                {recipe.title}
              </h3>
              <p className="font-plex text-base text-soft mt-1 leading-relaxed">
                {recipe.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
