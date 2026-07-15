export function Refuse() {
  return (
    <section id="ingredients" className="bg-ink py-24 px-6">
      <div className="max-w-md mx-auto text-center">
        <p className="font-batang text-paper/60 text-sm tracking-widest mb-8">
          원칙
        </p>
        <h2 className="font-batang font-bold text-2xl text-paper leading-relaxed mb-6">
          넣지 않은 것들.
        </h2>
        <div className="font-plex text-paper/80 text-sm leading-loose space-y-4">
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
