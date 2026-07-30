import Image from 'next/image';

export function FruitBanner() {
  return (
    <section id="banner" className="relative w-full max-w-4xl mx-auto">
      <Image
        src="/img/banner_fruits.webp"
        alt="제철 과일 — 복숭아, 자두, 블루베리"
        width={750}
        height={1500}
        className="w-full h-auto"
        sizes="100vw"
        loading="lazy"
      />
    </section>
  );
}
