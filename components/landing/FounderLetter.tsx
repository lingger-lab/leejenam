import Image from 'next/image';

export function FounderLetter() {
  return (
    <section id="founder" className="bg-paper py-12 lg:py-16 px-6">
      <div className="max-w-md lg:max-w-lg mx-auto">
        <p className="font-batang text-soft text-sm tracking-widest mb-10 lg:mb-14">
          편지
        </p>

        <div className="font-batang text-base text-ink leading-loose space-y-4 text-left">
          <p>
            건강에 좋다는 것들을 많이 봤습니다.
            <br />
            효능을 잔뜩 적어두고, 비싸게 팝니다.
          </p>
          <p>
            영양을 공부한 사람으로서 압니다.
            <br />
            그렇게 대단한 건 별로 없다는 걸.
          </p>
          <p>
            그래서 저는 반대로 했습니다.
            <br />
            제철에 난 과일을, 그대로 담급니다.
            <br />
            아무것도 더하지 않습니다.
          </p>
          <p>
            설탕은 뺐습니다.
            <br />
            대신 알룰로스로 단맛을 냈습니다.
            <br />
            달아도 덜 부담스럽게.
          </p>
          <p>
            달게 드시는 분께는 달게,
            <br />
            덜 달게 드시는 분께는 덜 달게.
            <br />
            한 병씩 담그니, 입맛을 맞출 수 있습니다.
          </p>
          <p>
            효능은 말하지 않겠습니다.
            <br />
            그냥, 오늘 담근 과일청입니다.
          </p>
        </div>

        <div className="mt-10 flex items-center justify-end gap-3">
          <span className="font-batang text-base text-ink tracking-[0.25em]">대표 이제남</span>
          <Image
            src="/img/signature.png"
            alt="이제남 서명"
            width={140}
            height={50}
            className="h-10 w-auto"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
