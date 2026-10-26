export interface PageBlock {
  id: string;
  kind: 'title' | 'text' | 'image' | 'button';
  name: string;
}

let count = 0;

/** A copy needs a key of its own: the original stays where it was. */
export const copyBlock = (block: PageBlock): PageBlock => ({ ...block, id: `${block.kind}-${++count}` });
