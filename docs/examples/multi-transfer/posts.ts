export interface Post {
  id: string;
  title: string;
  /** The hue of the cover's gradient; `null` while the post has none. */
  cover: number | null;
}

/** What the question about missing covers answers. */
export type Choice = 'cover' | 'ready' | 'cancel';

export const pickCover = () => Math.floor(Math.random() * 360);
