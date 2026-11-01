export interface Shape {
  id: string;
  kind: 'title' | 'chart' | 'photo' | 'logo';
  label: string;
  /** Where it sits on the slide, from its top left corner, and its size: px. */
  x: number;
  y: number;
  width: number;
  height: number;
}
