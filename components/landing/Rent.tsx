import Image from 'next/image';

export function Rent() {
  return (
    <section id="facility" className="bg-white-2 py-14 lg:py-20 px-6">
      <div className="max-w-md lg:max-w-lg mx-auto">
        <div className="text-center mb-12 lg:mb-16">
          <p className="font-batang text-soft text-sm tracking-widest mb-3">
            제조 시설
          </p>
          <h2 className="font-batang font-bold text-2xl lg:text-4xl text-ink tracking-[-0.01em] leading-snug">
            HACCP 인증 시설에서
            <br />
            직접 만듭니다.
          </h2>
        </div>

        <div className="font-plex text-base text-ink leading-loose space-y-4">
          <p>
            식품안전관리인증(HACCP) 기준을 갖춘
            <br />
            위생 시설에서 제조합니다.
          </p>
          <p>
            농업회사법인 제이엔이 직접 제조하며,
            <br />
            모든 공정을 직접 관리합니다.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="w-[70%]">
            <Image
              src="/haccp_license.webp"
              alt="임차 제조 시설 HACCP 인증서"
              width={600}
              height={850}
              className="w-full h-auto border border-rule shadow-sm"
              loading="lazy"
            />
            <p className="font-plex text-xs text-soft text-center mt-3">
              임차 제조 시설 HACCP 인증 제2024-2-0159호 · 유효기간 2027.05
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
