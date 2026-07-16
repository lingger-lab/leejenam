import Image from 'next/image';

const steps = [
  { num: '01', title: '원물', desc: '욱곡농장에서 과일을 받습니다.' },
  { num: '02', title: '세척', desc: '공기 방울로 씻습니다.', image: '/img/08_wash.webp' },
  { num: '03', title: '손질', desc: '사람 손으로 자릅니다.' },
  { num: '04', title: '담금', desc: '유리병에 켜켜이 담급니다.', image: '/img/04_pouring.webp' },
  { num: '05', title: '병입', desc: '소분하여 밀봉합니다.' },
  { num: '06', title: '이름', desc: '라벨에 이름을 씁니다.', image: '/img/05_writing.webp' },
];

export function Process() {
  return (
    <section id="process" className="bg-white-2 py-20 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-14">
          <p className="font-batang text-soft text-sm tracking-widest mb-3">
            제조
          </p>
          <h2 className="font-batang font-bold text-2xl text-ink">
            여섯 단계
          </h2>
        </div>

        <div className="relative">
          {/* 세로 라인 */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-rule" />

          <div className="space-y-0">
            {steps.map((step) => (
              <div key={step.num} className="relative pl-14 pb-10">
                {/* 넘버 원 */}
                <div className="absolute left-0 top-0 w-10 h-10 bg-paper border border-rule
                                flex items-center justify-center text-soft text-xs font-plex">
                  {step.num}
                </div>

                <div>
                  <h3 className="font-batang font-bold text-lg text-ink mb-1">
                    {step.title}
                  </h3>
                  <p className="text-soft text-sm font-plex">{step.desc}</p>

                  {step.image && (
                    <div className="relative w-full aspect-video mt-4 overflow-hidden">
                      <Image
                        src={step.image}
                        alt={step.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 512px"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
