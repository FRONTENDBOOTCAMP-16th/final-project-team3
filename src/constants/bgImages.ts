export const BG_IMAGES = [
  { src: '/images/activio-1.gif',  cls: 'home-bg-1' },
  { src: '/images/activio-2.jpg',  cls: 'home-bg-2' },
  { src: '/images/activio-3.webp', cls: 'home-bg-3' },
  { src: '/images/activio-4.jpg',  cls: 'home-bg-4' },
  { src: '/images/activio-5.jpeg', cls: 'home-bg-5' },
  { src: '/images/activio-6.jpg',  cls: 'home-bg-6' },
] as const;

export type BgImage = (typeof BG_IMAGES)[number];
