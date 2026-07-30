export function Monologue() {
  return (
    <section
      id="hook"
      className="bg-ink min-h-[100dvh] px-6 flex flex-col items-center justify-center relative overflow-hidden"
    >
      <div className="max-w-md lg:max-w-xl mx-auto text-center relative z-10">
        <blockquote className="font-batang text-paper leading-loose">
          <span
            className="hero-rise hero-shimmer text-2xl font-bold inline-block"
            style={{ animationDelay: '0.3s' }}
          >
            제철 과일이 주는 영양,
          </span>
          <br />
          <span
            className="hero-rise text-xl inline-block"
            style={{ animationDelay: '0.7s' }}
          >
            그대로 담았습니다.
          </span>
        </blockquote>

        <div
          className="hero-rise w-8 h-px bg-paper/30 mx-auto my-10"
          style={{ animationDelay: '1.1s' }}
        />

        <p
          className="hero-rise font-batang text-gold text-base leading-loose"
          style={{ animationDelay: '1.4s' }}
        >
          없는 효능을 지어내지 않습니다.
          <br />
          자연이 철마다 내주는 과일을,
          <br />
          그대로 담글 뿐입니다.
          <br />
          설탕 대신 알룰로스, 물에 타서 드세요.
        </p>
      </div>

      <p
        className="hero-rise absolute bottom-8 left-1/2 -translate-x-1/2 font-plex text-paper/40 text-xs animate-bounce z-10"
        style={{ animationDelay: '2.0s' }}
      >
        아래로 ↓
      </p>
    </section>
  );
}
