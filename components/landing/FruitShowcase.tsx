import Image from 'next/image';

const fruits = [
  { src: '/img/fruit_peach.webp', name: '복숭아', alt: '복숭아 원물' },
  { src: '/img/fruit_plum.webp', name: '자두', alt: '자두 원물' },
  { src: '/img/fruit_blueberry.webp', name: '블루베리', alt: '블루베리 원물' },
];

export function FruitShowcase() {
  return (
    <section id="fruits" className="bg-paper py-12 lg:py-16 px-6">
      <div className="max-w-lg lg:max-w-3xl mx-auto">
        <div className="text-center mb-10 lg:mb-14">
          <p className="font-batang text-soft text-sm tracking-widest mb-3">
            원물
          </p>
          <h2 className="font-batang font-bold text-2xl lg:text-4xl text-ink tracking-[-0.01em] leading-snug">
            제철에 난 과일을, 그대로 담급니다
          </h2>
        </div>

        <div className="space-y-10 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6">
          {fruits.map((fruit) => (
            <div key={fruit.name}>
              <div className="relative w-full aspect-square overflow-hidden">
                <Image
                  src={fruit.src}
                  alt={fruit.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 512px"
                  loading="lazy"
                />
              </div>
              <p className="font-batang text-lg text-ink text-center mt-4">
                {fruit.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
