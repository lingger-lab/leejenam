export function Monologue() {
  return (
    <section id="hook" className="bg-ink min-h-[100dvh] px-6 flex flex-col items-center justify-center relative overflow-hidden">
      {/* 색 번짐 — 물에 청이 퍼지는 효과 */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="bloom bloom-peach" />
        <div className="bloom bloom-plum" />
        <div className="bloom bloom-berry" />
      </div>

      <div className="max-w-md mx-auto text-center relative z-10">
        <blockquote className="font-batang text-paper leading-loose">
          <span className="text-2xl font-bold">제철 과일이 주는 영양,</span>
          <br />
          <span className="text-xl">그대로 담았습니다.</span>
        </blockquote>
        <div className="w-8 h-px bg-paper/30 mx-auto my-10" />
        <p className="font-batang text-gold text-base leading-loose">
          없는 효능을 지어내지 않습니다.
          <br />
          자연이 철마다 내주는 과일을,
          <br />
          그대로 담글 뿐입니다.
          <br />
          설탕 대신 알룰로스, 물에 타서 드세요.
        </p>
      </div>

      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-plex text-paper/40 text-xs animate-bounce z-10">
        아래로 ↓
      </p>
    </section>
  );
}
