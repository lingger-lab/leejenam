import Image from 'next/image';

export function Credentials() {
  return (
    <section id="credentials" className="bg-white-2 py-12 lg:py-16 px-6">
      <div className="max-w-md lg:max-w-lg mx-auto">
        <div className="text-center mb-10 lg:mb-14">
          <p className="font-batang text-soft text-sm tracking-widest mb-3">
            자격
          </p>
          <h2 className="font-batang font-bold text-2xl lg:text-4xl text-ink tracking-[-0.01em] leading-snug">
            저는 영양사입니다.
          </h2>
        </div>
        <div className="font-batang text-base text-ink leading-loose space-y-4">
          <p>
            그래서 이 청이 몸에 어떻게 좋은지 그럴듯하게 설명할 수도 있습니다.
          </p>
          <p>
            하지만 하지 않겠습니다.
          </p>
          <p>
            영양을 공부하면서 배운 건, 함부로 좋다고 말하면 안 된다는 것이었습니다.
          </p>
          <p>
            그래서 설탕 대신 알룰로스를 쓰고, 효능은 말하지 않습니다.
          </p>
          <p>
            제가 아는 건 하나입니다. 오늘 담갔다는 것.
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <div className="w-[70%]">
            <Image
              src="/license.webp"
              alt="이제남 영양사 면허 증명서"
              width={600}
              height={640}
              className="w-full h-auto border border-rule shadow-sm"
              loading="lazy"
            />
            <p className="font-plex text-xs text-soft text-center mt-3">
              영양사 면허 제63606호 · 1996년 취득
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
