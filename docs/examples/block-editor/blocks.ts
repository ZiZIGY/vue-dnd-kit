export type BlockKind =
  | 'text'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'todo'
  | 'bullet'
  | 'numbered'
  | 'toggle'
  | 'quote'
  | 'callout'
  | 'code'
  | 'image'
  | 'divider';

export interface Block {
  id: string;
  kind: BlockKind;
  /** The block's text; an image's caption. */
  text: string;
  /** To-dos: ticked off. */
  done?: boolean;
  /** The blocks nested under it, one level in. A toggle hides them when closed. */
  children: Block[];
}

export interface KindInfo {
  name: string;
  hint: string;
  /** A 24×24 line icon. */
  icon: string;
  /** Typed at the start of a block, followed by a space, turns it into this kind. */
  markdown?: string;
  /** Blocks can be nested under it. */
  nests?: boolean;
  /** Enter at its end makes another block of the same kind (lists), not a paragraph. */
  continues?: boolean;
  /** It has no text to edit, so it can't be turned into another kind. */
  fixed?: boolean;
}

export const KINDS: Record<BlockKind, KindInfo> = {
  text: { name: 'Text', hint: 'Just start writing', icon: 'M5 6h14M12 6v13', nests: true },
  h1: { name: 'Heading 1', hint: 'Big section heading', icon: 'M4 6v12M12 6v12M4 12h8M17 9.5l2.5-2V18', markdown: '#' },
  h2: {
    name: 'Heading 2',
    hint: 'Medium section heading',
    icon: 'M4 6v12M12 6v12M4 12h8M16 10a2 2 0 1 1 4 0c0 2-4 4-4 8h4',
    markdown: '##',
  },
  h3: {
    name: 'Heading 3',
    hint: 'Small section heading',
    icon: 'M4 6v12M12 6v12M4 12h8M16 7.5h4l-2.4 3.6a2.6 2.6 0 1 1-1.8 4.7',
    markdown: '###',
  },
  todo: {
    name: 'To-do list',
    hint: 'Track tasks with a checkbox',
    icon: 'M7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zM8.5 12l2.5 2.5 4.5-5',
    markdown: '[]',
    nests: true,
    continues: true,
  },
  bullet: {
    name: 'Bulleted list',
    hint: 'A simple list',
    icon: 'M10 7h10M10 12h10M10 17h10M5 7h.01M5 12h.01M5 17h.01',
    markdown: '-',
    nests: true,
    continues: true,
  },
  numbered: {
    name: 'Numbered list',
    hint: 'A list in order',
    icon: 'M10 7h10M10 12h10M10 17h10M4 5.5 5.5 4.5V9.5M4 14.5a1.5 1.5 0 1 1 3 0c0 1.2-3 2.3-3 4h3',
    markdown: '1.',
    nests: true,
    continues: true,
  },
  toggle: {
    name: 'Toggle list',
    hint: 'Hide blocks inside',
    icon: 'm7 6 5 4-5 4zM15 10h5M7 18h13',
    markdown: '>',
    nests: true,
    continues: true,
  },
  quote: { name: 'Quote', hint: 'Set words apart', icon: 'M5 5v14M9.5 8H19M9.5 12H19M9.5 16H15', markdown: '"', nests: true },
  callout: {
    name: 'Callout',
    hint: 'Make a note stand out',
    icon: 'M6 4h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-4 3v-3H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM12 8v3M12 13.5h.01',
    nests: true,
  },
  code: { name: 'Code', hint: 'A snippet, in monospace', icon: 'm8 8-4 4 4 4M16 8l4 4-4 4M13.5 5.5l-3 13', markdown: '```' },
  image: {
    name: 'Image',
    hint: 'A picture with a caption',
    icon: 'M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM4 16l5-5 4 4 2.5-2.5L20 17M15.5 8.5h.01',
    fixed: true,
  },
  divider: { name: 'Divider', hint: 'Split the page', icon: 'M4 12h16M4 7h.01M20 7h.01M4 17h.01M20 17h.01', fixed: true },
};

/** The kinds, in the order the menus list them. */
export const KIND_LIST = Object.keys(KINDS) as BlockKind[];

let count = 0;

export const createBlock = (kind: BlockKind, text = '', more: Partial<Block> = {}): Block => ({
  id: `block-${++count}`,
  kind,
  text,
  ...(kind === 'todo' && { done: false }),
  children: [],
  ...more,
});

/** A copy of a block and everything nested in it, every one with a new id. */
export const copyBlock = (block: Block): Block => ({ ...block, id: `block-${++count}`, children: block.children.map(copyBlock) });

/** A deep copy that keeps the ids: a snapshot for undo. */
export const snapshot = (blocks: Block[]): Block[] => blocks.map((block) => ({ ...block, children: snapshot(block.children) }));

/** Where a block sits in the tree: the array that holds it, its index there, its parent and its level. */
export interface Place {
  siblings: Block[];
  index: number;
  parent: Block | null;
  depth: number;
}

export const locate = (blocks: Block[], id: string, parent: Block | null = null, depth = 0): Place | null => {
  for (const [index, block] of blocks.entries()) {
    if (block.id === id) return { siblings: blocks, index, parent, depth };
    const found = locate(block.children, id, block, depth + 1);
    if (found) return found;
  }
  return null;
};
/** How screen readers and the status line name a block: its kind and the start of its text. */
export const describe = (block: Block | undefined) => {
  if (!block) return 'block';
  const text = block.text.trim();
  const name = KINDS[block.kind].name.toLowerCase();
  return text ? `${name} “${text.length > 32 ? `${text.slice(0, 30)}…` : text}”` : `empty ${name}`;
};

/** The page the demo opens with: it tells you what to try. */
export const createPage = (): Block[] => [
  createBlock('callout', 'Hover a block and drag ⋮⋮ to move it, sideways to nest it. Hold Alt to copy.'),
  createBlock('h2', 'Before Friday'),
  createBlock('todo', 'Freeze the API', { done: true }),
  createBlock('todo', 'Record the demo video', { children: [createBlock('text', 'Two minutes, no voice-over.')] }),
  createBlock('todo', 'Write the release notes'),
  createBlock('h2', 'Launch day'),
  createBlock('numbered', 'Publish the packages'),
  createBlock('numbered', 'Deploy the docs'),
  createBlock('numbered', 'Post the announcement'),
  createBlock('toggle', 'Open questions', {
    children: [createBlock('bullet', 'Keep the v2 docs online?'), createBlock('bullet', 'Who answers the issues on Monday?')],
  }),
  createBlock('quote', 'Ship it when it feels great to drag.'),
  createBlock('h3', 'Install'),
  createBlock('code', 'npm i @vue-dnd-kit/core'),
  createBlock('image', 'Release day, 6 am'),
  createBlock('divider'),
  createBlock('text', 'Type / for more blocks. Draw a box in the margin to select several, then drag them together.'),
];
