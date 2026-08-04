export function Refuse() {
  return (
    <section id="ingredients" className="bg-ink py-14 lg:py-20 px-6">
      <div className="max-w-md lg:max-w-lg mx-auto text-center">
        <p className="font-batang text-paper/60 text-sm tracking-widest mb-10 lg:mb-14">
          원칙
        </p>
        <h2 className="font-batang font-bold text-2xl lg:text-4xl text-paper tracking-[-0.01em] leading-snug mb-6">
          넣지 않은 것들.
        </h2>
        <div className="font-plex text-paper/80 text-base leading-loose space-y-4">
          <p>
            인공 감미료, 합성 착색료, 보존료.
            <br />
            넣지 않았습니다.
          </p>
          <p>
            과일과 알룰로스.
            <br />
            그것만 넣었습니다.
            <br />
            그게 전부입니다.
          </p>
        </div>
        <div className="w-8 h-px bg-paper/30 mx-auto mt-10" />
      </div>
    </section>
  );
}
