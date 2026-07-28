export function Monologue() {
  return (
    <section id="hook" className="bg-ink min-h-[100dvh] px-6 flex flex-col items-center justify-center relative">
      <div className="max-w-md mx-auto text-center">
        <p className="font-batang text-paper/60 text-sm tracking-widest mb-8">
          문제
        </p>
        <blockquote className="font-batang text-paper text-xl leading-loose">
          커피는 줄이라는데,
          <br />
          물은 안 넘어가고.
        </blockquote>
        <div className="w-8 h-px bg-paper/30 mx-auto my-10" />
        <p className="font-batang text-gold text-lg leading-loose">
          그래서 과일로 만든 청을 담갔습니다.
          <br />
          설탕 대신 알룰로스, 물에 타서 마실 수 있도록.
        </p>
      </div>

      <p className="absolute bottom-8 left-1/2 -translate-x-1/2 font-plex text-paper/40 text-xs animate-bounce">
        아래로 ↓
      </p>
    </section>
  );
}
