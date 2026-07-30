export function Monologue() {
  return (
    <section
      id="hook"
      className="min-h-[100dvh] px-6 flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        background: [
          'radial-gradient(circle at 20% 30%, rgba(242, 196, 160, 0.45) 0%, transparent 50%)',
          'radial-gradient(circle at 80% 60%, rgba(179, 74, 92, 0.4) 0%, transparent 50%)',
          'radial-gradient(circle at 45% 85%, rgba(90, 74, 122, 0.4) 0%, transparent 50%)',
          '#1B1917',
        ].join(', '),
      }}
    >
      <div className="max-w-md lg:max-w-xl mx-auto text-center relative z-10">
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
