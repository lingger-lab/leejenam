import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: '이야기 — 이제남',
  description: '이제남 브랜드 이야기. 이름을 걸고 만듭니다.',
};

export default function StoryPage() {
  return (
    <div className="bg-paper min-h-screen px-6 py-16">
      <div className="max-w-lg mx-auto">

        {/* Block 1 */}
        <section className="py-12">
          <h2 className="font-batang font-bold text-xl text-seal mb-6">
            커피는 줄이라는데, 물은 안 넘어가고.
          </h2>
          <div className="font-batang text-base text-ink leading-loose space-y-4">
            <p>
              나이가 들면 목이 덜 마릅니다. 그래서 물을 안 마십니다.
            </p>
            <p>
              커피는 줄이라고들 합니다. 줄이면 뭘 마시냐고 물으면, 물을 마시라고 합니다.
            </p>
            <p>
              그런데 맹물이 안 넘어갑니다.
            </p>
            <p>
              이 문제에는 답이 없었습니다. 그래서 만들었습니다.
            </p>
          </div>
        </section>

        {/* Block 2 */}
        <section className="py-12">
          <h2 className="font-batang font-bold text-xl text-seal mb-6">
            제 이름은 이제남입니다.
          </h2>
          <div className="font-batang text-base text-ink leading-loose space-y-4">
            <p>
              브랜드 이름을 뭘로 할까 고민하다가, 그냥 제 이름을 걸기로 했습니다.
            </p>
            <p>
              잘못되면 제 이름이 잘못되는 겁니다. 도망갈 곳을 없애두고 싶었습니다.
            </p>
          </div>
        </section>

        {/* Photo: 대표 */}
        <div className="py-8 flex justify-center">
          <div className="w-48 h-48 rounded-full overflow-hidden">
            <Image
              src="/img/07_maker.webp"
              alt="이제남 대표"
              width={192}
              height={192}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>
        </div>

        {/* Block 3 */}
        <section className="py-12">
          <h2 className="font-batang font-bold text-xl text-seal mb-6">
            저는 영양사입니다.
          </h2>
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
        </section>

        {/* Block 4 */}
        <section className="py-12">
          <h2 className="font-batang font-bold text-xl text-seal mb-6">
            하지 않기로 한 것들.
          </h2>
          <div className="font-batang text-base text-ink leading-loose space-y-4">
            <p>
              <strong className="font-bold">미리 담가두지 않습니다.</strong> 그래서 사흘이 걸립니다.
            </p>
            <p>
              <strong className="font-bold">설탕 대신 알룰로스를 씁니다.</strong> 그래서 석 달밖에 못 갑니다.
            </p>
            <p>
              <strong className="font-bold">효능을 말하지 않습니다.</strong> 저희도 모르기 때문입니다.
            </p>
            <p>
              <strong className="font-bold">공장을 저희 것이라 하지 않습니다.</strong> 빌려서 쓰는 게 맞으니까요.
            </p>
            <p>
              안 하기로 한 게 많을수록, 남는 게 분명해졌습니다.
            </p>
          </div>
        </section>

        {/* Block 5 */}
        <section className="py-12">
          <h2 className="font-batang font-bold text-xl text-seal mb-6">
            한 병에 세 사람 이름이 있습니다.
          </h2>
          <div className="font-batang text-base text-ink leading-loose space-y-4">
            <p>
              <strong className="font-bold">이수성</strong> — 욱곡농장에서 복숭아를 키웁니다.
            </p>
            <p>
              <strong className="font-bold">이제남</strong> — 그 복숭아로 청을 담급니다.
            </p>
            <p>
              <strong className="font-bold">그리고 당신</strong> — 라벨에 이름이 새겨집니다.
            </p>
            <p>
              시장에서 사 오지 않습니다. 이름을 아는 사람에게서 받습니다.
            </p>
            <p>
              그리고 이름을 아는 사람에게 보냅니다.
            </p>
          </div>
        </section>

        {/* Photo: 농장 */}
        <div className="py-8">
          <Image
            src="/img/06_farm.webp"
            alt="욱곡농장"
            width={600}
            height={400}
            className="w-full object-cover"
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 512px"
          />
        </div>

        {/* Block 6 */}
        <section className="py-12">
          <h2 className="font-batang font-bold text-xl text-seal mb-6">
            미리 만들면, 이름을 못 씁니다.
          </h2>
          <div className="font-batang text-base text-ink leading-loose space-y-4">
            <p>
              창고에 쌓아두고 파는 청에는 이름을 새길 수 없습니다. 누가 드실지 모르니까요.
            </p>
            <p>
              저희는 주문을 받고 담급니다. 그래서 이름을 새길 수 있습니다.
            </p>
            <p>
              이름이 새겨져 있다는 건, 당신을 위해 만들었다는 뜻입니다.
            </p>
          </div>
        </section>

        {/* Block 7 */}
        <section className="py-12">
          <h2 className="font-batang font-bold text-xl text-seal mb-6">
            작은 회사입니다.
          </h2>
          <div className="font-batang text-base text-ink leading-loose space-y-4">
            <p>
              하루에 많이 못 만듭니다. 한 병씩 담그고, 한 병씩 이름을 씁니다.
            </p>
            <p>
              크게 만들 수 있는 방법은 압니다. 미리 잔뜩 담가서 창고에 두면 됩니다.
            </p>
            <p>
              그런데 그러면 이 청이 아닙니다.
            </p>
            <p>
              작아서 할 수 있는 일을 합니다.
            </p>
          </div>
        </section>

        {/* Block 7.5 — 생산 한계 */}
        <section className="py-12">
          <h2 className="font-batang font-bold text-xl text-seal mb-6">
            청 하나에 백 병.
          </h2>
          <div className="font-batang text-base text-ink leading-loose space-y-4">
            <p>
              복숭아청 백 병.
              <br />
              자두청 백 병.
              <br />
              블루베리청 백 병.
            </p>
            <p>
              더 만들 수도 있습니다.
              <br />
              사람을 쓰고, 미리 잔뜩 담가두면 됩니다.
            </p>
            <p>
              그런데 그러면
              <br />
              제 손으로 담근 게 아닙니다.
            </p>
            <p>
              백 병은 제가 혼자
              <br />
              담그고, 이름까지 새길 수 있는
              <br />
              최대입니다.
            </p>
            <p>
              딱 거기까지만 하겠습니다.
            </p>
          </div>
        </section>

        {/* Block 8 — closing */}
        <section className="py-16 text-center">
          <h2 className="font-batang font-bold text-2xl text-seal leading-relaxed mb-8">
            내일을 약속하지 않습니다.
            <br />
            오늘 마실 것을 만듭니다.
          </h2>
          <p className="font-batang text-sm text-soft">
            — 농업회사법인 제이엔 · 이제남
          </p>
        </section>

        {/* CTA — bottom only */}
        <div className="text-center pb-8">
          <Link
            href="/"
            className="inline-block font-plex text-sm font-medium bg-ink text-paper
                       px-6 py-3 hover:bg-seal transition-colors"
          >
            이름 새겨서 주문하기
          </Link>
        </div>

      </div>
    </div>
  );
}
