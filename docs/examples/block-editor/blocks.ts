export type BlockKind = 'text' | 'heading' | 'todo' | 'toggle' | 'quote' | 'image' | 'divider';

export interface Block {
  id: string;
  kind: BlockKind;
  text: string;
  /** To-dos: ticked off. */
  done?: boolean;
  /** Toggles: the blocks inside. */
  children?: Block[];
}

/** How the palette shows each kind: a name, a hint and a line icon (24×24). */
export const KINDS: Record<BlockKind, { name: string; hint: string; icon: string }> = {
  text: { name: 'Text', hint: 'Just start writing', icon: 'M5 7h14M5 12h14M5 17h9' },
  heading: { name: 'Heading', hint: 'A section title', icon: 'M6 5v14M18 5v14M6 12h12' },
  todo: { name: 'To-do', hint: 'Track a task', icon: 'M5 5h14v14H5zM8.5 12l2.5 2.5 4.5-5' },
  toggle: { name: 'Toggle', hint: 'Hide blocks inside', icon: 'm9 6 6 6-6 6' },
  quote: { name: 'Quote', hint: 'Set words apart', icon: 'M6 5v14M10 8h9M10 12h9M10 16h6' },
  image: { name: 'Image', hint: 'Show a picture', icon: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4' },
  divider: { name: 'Divider', hint: 'Split the page', icon: 'M3 12h18' },
};

let count = 0;

export const createBlock = (kind: BlockKind, text = '', more: Partial<Block> = {}): Block => ({
  id: `${kind}-${++count}`,
  kind,
  text,
  ...(kind === 'todo' && { done: false }),
  ...(kind === 'toggle' && { children: [] }),
  ...more,
});

export const createPage = (): Block[] => [
  createBlock('heading', 'Launch week'),
  createBlock('text', 'Everything left before v3 ships on Friday.'),
  createBlock('todo', 'Freeze the API', { done: true }),
  createBlock('todo', 'Record the demo video'),
  createBlock('toggle', 'Open questions', {
    children: [createBlock('text', 'Keep the v2 docs online?'), createBlock('text', 'Who posts the announcement?')],
  }),
  createBlock('quote', 'Ship it when it feels great to drag.'),
  createBlock('image'),
];
