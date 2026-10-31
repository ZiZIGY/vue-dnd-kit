export interface Product {
  id: string;
  name: string;
  price: number;
  emoji: string;
  hue: number;
}

export const PRODUCTS: Product[] = [
  { id: 'mug', name: 'Stoneware mug', price: 24, emoji: '☕', hue: 25 },
  { id: 'tote', name: 'Linen tote', price: 34, emoji: '👜', hue: 330 },
  { id: 'lamp', name: 'Desk lamp', price: 58, emoji: '💡', hue: 45 },
  { id: 'notebook', name: 'Dot notebook', price: 12, emoji: '📓', hue: 200 },
  { id: 'cactus', name: 'Mini cactus', price: 19, emoji: '🌵', hue: 140 },
  { id: 'headphones', name: 'Headphones', price: 89, emoji: '🎧', hue: 265 },
];

export const price = (value: number) => `$${value}`;
