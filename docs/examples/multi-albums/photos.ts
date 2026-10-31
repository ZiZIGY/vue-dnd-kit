export interface Photo {
  id: string;
  emoji: string;
  hue: number;
}

export interface Album {
  id: string;
  name: string;
  /** Photo ids, the latest first: the first one is the cover. */
  photos: string[];
}

export const PHOTOS: Photo[] = [
  { id: 'p1', emoji: '🌅', hue: 20 },
  { id: 'p2', emoji: '🏔️', hue: 210 },
  { id: 'p3', emoji: '🐶', hue: 35 },
  { id: 'p4', emoji: '🌊', hue: 195 },
  { id: 'p5', emoji: '🍜', hue: 10 },
  { id: 'p6', emoji: '🌲', hue: 140 },
  { id: 'p7', emoji: '🎡', hue: 300 },
  { id: 'p8', emoji: '🏝️', hue: 170 },
  { id: 'p9', emoji: '🐱', hue: 45 },
  { id: 'p10', emoji: '🌌', hue: 260 },
  { id: 'p11', emoji: '🚲', hue: 90 },
  { id: 'p12', emoji: '🌄', hue: 330 },
];

export const ALBUMS: Album[] = [
  { id: 'summer', name: 'Summer trip', photos: ['p8'] },
  { id: 'pets', name: 'Pets', photos: ['p3'] },
  { id: 'favorites', name: 'Favorites', photos: [] },
];
