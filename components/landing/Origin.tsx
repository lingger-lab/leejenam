import Image from 'next/image';

export function Origin() {
  return (
    <section id="origin" className="bg-paper py-20 px-6">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-14">
          <p className="font-batang text-soft text-sm tracking-widest mb-3">
            원산지
          </p>
          <h2 className="font-batang font-bold text-2xl text-ink">
            욱곡농장
          </h2>
          <p className="text-soft text-xs mt-3 font-plex tracking-wider">
            35.1095°N, 128.5835°E
          </p>
          <p className="text-soft text-sm mt-1 font-plex">
            경남 창원 · 이수성
          </p>
        </div>

        <div className="relative w-full aspect-[3/2] overflow-hidden">
          <Image
            src="/img/06_farm.webp"
            alt="욱곡농장 — 이수성 농부와 이제남 대표가 과수원에 서 있다"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 512px"
          />
        </div>

        <p className="text-soft text-sm font-plex mt-6 leading-relaxed text-center">
          이수성 농부가 키운 과일로 만듭니다.
          <br />
          어디서 왔는지 모르는 원물은 쓰지 않습니다.
        </p>
      </div>
    </section>
  );
}
