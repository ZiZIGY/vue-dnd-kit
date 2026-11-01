export interface Icon {
  id: string;
  name: string;
  kind: 'folder' | 'jpg' | 'txt' | 'mp3' | 'pdf';
  /** Where it lies on the desktop, from its top left corner. */
  x: number;
  y: number;
}

/** An icon's width and height: it stays on the desktop. */
export const SIZE = 76;
