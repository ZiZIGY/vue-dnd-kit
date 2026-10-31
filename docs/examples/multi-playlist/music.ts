export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  hue: number;
}

export interface Playlist {
  id: string;
  name: string;
  hue: number;
  tracks: string[];
}

export const QUEUE: Track[] = [
  { id: 't1', title: 'Night Drive', artist: 'Neon Coast', duration: '3:42', hue: 280 },
  { id: 't2', title: 'Paper Planes', artist: 'Low Tide', duration: '2:58', hue: 200 },
  { id: 't3', title: 'Golden Hour', artist: 'Mira Vale', duration: '4:05', hue: 40 },
  { id: 't4', title: 'Static', artist: 'The Ferns', duration: '3:17', hue: 150 },
  { id: 't5', title: 'Slow Motion', artist: 'Kai Ruby', duration: '3:33', hue: 330 },
  { id: 't6', title: 'Afterglow', artist: 'Low Tide', duration: '4:21', hue: 20 },
  { id: 't7', title: 'Blue Hours', artist: 'Mira Vale', duration: '3:09', hue: 220 },
];

export const PLAYLISTS: Playlist[] = [
  { id: 'chill', name: 'Chill', hue: 190, tracks: ['t2'] },
  { id: 'focus', name: 'Focus', hue: 260, tracks: [] },
  { id: 'road', name: 'Road trip', hue: 30, tracks: ['t1', 't6'] },
];
