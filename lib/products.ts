export type ProductId = 'peach' | 'plum' | 'berry';

export type Product = {
  id: ProductId;
  name: string;
  note: string;
  src: string;
  backSrc: string;
};

export const PRODUCTS: Product[] = [
  {
    id: 'peach',
    name: '복숭아청',
    note: '여름에 복숭아를 먹는 건 오래된 습관입니다.',
    src: '/img/01_peach.webp',
    backSrc: '/img/01_peach_back.webp',
  },
  {
    id: 'plum',
    name: '자두청',
    note: '시고 답니다. 물에 타면 여름 맛이 납니다.',
    src: '/img/02_plum.webp',
    backSrc: '/img/02_plum_back.webp',
  },
  {
    id: 'berry',
    name: '블루베리청',
    note: '왜 좋은지는 저보다 잘 아실 겁니다.',
    src: '/img/03_berry.webp',
    backSrc: '/img/03_berry_back.webp',
  },
];
