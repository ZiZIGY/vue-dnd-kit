export interface Furniture {
  id: string;
  name: string;
  width: number;
  height: number;
  color: string;
  round?: boolean;
  /** In storage, or in the room at `x`, `y`. */
  place: 'storage' | 'room';
  x: number;
  y: number;
}

export const FURNITURE: Furniture[] = [
  { id: 'rug', name: 'Rug', width: 124, height: 84, color: '#a855f7', place: 'room', x: 96, y: 78 },
  { id: 'sofa', name: 'Sofa', width: 112, height: 42, color: '#3b82f6', place: 'room', x: 102, y: 22 },
  { id: 'table', name: 'Table', width: 56, height: 34, color: '#d97706', place: 'room', x: 130, y: 104 },
  { id: 'chair', name: 'Chair', width: 42, height: 42, color: '#14b8a6', place: 'storage', x: 0, y: 0 },
  { id: 'tv', name: 'TV', width: 88, height: 16, color: '#71717a', place: 'storage', x: 0, y: 0 },
  { id: 'plant', name: 'Plant', width: 32, height: 32, color: '#42b883', round: true, place: 'storage', x: 0, y: 0 },
  { id: 'lamp', name: 'Lamp', width: 26, height: 26, color: '#eab308', round: true, place: 'storage', x: 0, y: 0 },
];
