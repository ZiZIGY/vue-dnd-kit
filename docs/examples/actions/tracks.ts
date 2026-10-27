export interface Track {
  id: string;
  title: string;
  artist: string;
  length: string;
  hue: number;
}

export const TRACKS: Track[] = [
  { id: 'midnight', title: 'Midnight Drive', artist: 'Neon Coast', length: '3:42', hue: 168 },
  { id: 'paper', title: 'Paper Planes', artist: 'The Folds', length: '2:58', hue: 28 },
  { id: 'tide', title: 'Low Tide', artist: 'Harbor', length: '4:05', hue: 220 },
  { id: 'bloom', title: 'Static Bloom', artist: 'Violet Hour', length: '3:21', hue: 300 },
  { id: 'golden', title: 'Golden Hour', artist: 'Sundial', length: '3:09', hue: 52 },
];
