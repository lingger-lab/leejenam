import Image from 'next/image';

export function FruitBanner() {
  return (
    <section id="banner" className="relative w-full max-w-md lg:max-w-lg mx-auto pb-4">
      <Image
        src="/img/banner_fruits.webp"
        alt="제철 과일 — 복숭아, 자두, 블루베리"
        width={750}
        height={1500}
        className="w-full h-auto"
        sizes="(max-width: 768px) 100vw, 512px"
        loading="lazy"
      />
    </section>
  );
}
