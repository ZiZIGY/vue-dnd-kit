import type { IconName } from './icons';

/**
 * The page being built: sections, columns side by side in each, blocks stacked in each
 * column. Plain data: the canvas's lists and the layers tree move the same objects.
 */

export type SectionKind = 'navbar' | 'hero' | 'logos' | 'features' | 'pricing' | 'testimonials' | 'faq' | 'cta' | 'footer';
export type BlockKind =
  | 'logo'
  | 'links'
  | 'badge'
  | 'heading'
  | 'text'
  | 'button'
  | 'image'
  | 'list'
  | 'quote'
  | 'price'
  | 'logos'
  | 'icon';

export interface Block {
  id: string;
  kind: BlockKind;
  /** The main text: a heading, a button's label, a price, a quote. */
  text: string;
  /** A second text: a price's period, a quote's author. */
  note: string;
  /** Lines: of a list, the links of a menu, the names of a logo cloud. */
  items: string[];
  /** Headings and texts. */
  size: 'xl' | 'lg' | 'md' | 'sm';
  /** Buttons: `primary` or `ghost`. Images: `dashboard` or `photo`. Icons: the icon. */
  variant: string;
}

export interface Column {
  id: string;
  blocks: Block[];
}

export interface Section {
  id: string;
  kind: SectionKind;
  columns: Column[];
}

/** A row of the layers tree: any node of the page. */
export type LayerNode = Section | Column | Block;

export const isSection = (node: LayerNode): node is Section => 'columns' in node;
export const isColumn = (node: LayerNode): node is Column => 'blocks' in node;
/** How deep a node sits: sections 0, columns 1, blocks 2. */
export const levelOf = (node: LayerNode) => (isSection(node) ? 0 : isColumn(node) ? 1 : 2);

/** What a chip of the palette carries (`makeDraggable`'s `data`): the kind of block it makes. */
export interface ChipData {
  kind: BlockKind;
}

/** A block before it has an id: what a template or a chip makes. */
type BlockSpec = Omit<Block, 'id'>;

const spec = (kind: BlockKind, fields: Partial<BlockSpec> = {}): BlockSpec => ({
  kind,
  text: '',
  note: '',
  items: [],
  size: 'md',
  variant: '',
  ...fields,
});

// ─── The look of a section ───────────────────────────────────────────────────────

/**
 * How a section lays out its columns: `bar` in a row (a navbar), `split` in two halves,
 * `center` as one narrow column, `grid` as equal columns under a header (its first column).
 */
export type Layout = 'bar' | 'split' | 'center' | 'grid';
export type Tone = 'light' | 'muted' | 'ink' | 'brand';

/** The site's colors per tone, as CSS variables: blocks read them wherever they are. */
const LIGHT = {
  '--surface': '#ffffff',
  '--card': '#ffffff',
  '--ink': '#0f172a',
  '--body': '#516078',
  '--line': '#e3e7ef',
  '--accent': '#5b5bd6',
  '--accent-ink': '#ffffff',
  '--soft': '#eef0fd',
};

export const TONES: Record<Tone, Record<string, string>> = {
  light: LIGHT,
  muted: { ...LIGHT, '--surface': '#f5f6fa' },
  ink: {
    '--surface': '#0b1020',
    '--card': '#121a33',
    '--ink': '#f8fafc',
    '--body': '#97a3ba',
    '--line': '#1f2a44',
    '--accent': '#8f90ff',
    '--accent-ink': '#0b1020',
    '--soft': '#1b2340',
  },
  brand: {
    '--surface': 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    '--card': 'rgb(255 255 255 / 0.1)',
    '--ink': '#ffffff',
    '--body': 'rgb(255 255 255 / 0.8)',
    '--line': 'rgb(255 255 255 / 0.25)',
    '--accent': '#ffffff',
    '--accent-ink': '#4338ca',
    '--soft': 'rgb(255 255 255 / 0.16)',
  },
};

/**
 * Type sizes and spacing for a page this wide, as CSS variables. The canvas sets them on the
 * page, and the overlays on the copies they show: a block in hand looks as it does on the page.
 */
export const typeScale = (width: number) => {
  const size = (min: number, ratio: number, max: number) => `${Math.round(Math.min(max, Math.max(min, width * ratio)))}px`;
  return {
    '--h-xl': size(28, 0.056, 60),
    '--h-lg': size(22, 0.036, 40),
    '--h-md': size(18, 0.025, 26),
    '--h-sm': size(15, 0.017, 18),
    '--t-lg': size(15, 0.0185, 19),
    '--t-md': size(14, 0.0155, 16),
    '--t-sm': size(13, 0.0135, 14),
    '--pad': size(32, 0.075, 104),
    '--gutter': size(18, 0.055, 72),
    '--gap': size(18, 0.04, 48),
  };
};

// ─── The catalog ─────────────────────────────────────────────────────────────────

export const SECTIONS: Record<
  SectionKind,
  { name: string; icon: IconName; layout: Layout; tone: Tone; cards?: boolean; columns: BlockSpec[][] }
> = {
  navbar: {
    name: 'Navbar',
    icon: 'navbar',
    layout: 'bar',
    tone: 'light',
    columns: [
      [spec('logo', { text: 'Lumora' })],
      [spec('links', { items: ['Product', 'Pricing', 'Customers', 'Docs'] })],
      [spec('button', { text: 'Start free', variant: 'primary' })],
    ],
  },
  hero: {
    name: 'Hero',
    icon: 'hero',
    layout: 'split',
    tone: 'light',
    columns: [
      [
        spec('badge', { text: 'New · Funnels 2.0' }),
        spec('heading', { text: 'Know what your users actually do', size: 'xl' }),
        spec('text', { text: 'Lumora turns every click into answers your team can act on. No SQL, no waiting on data.', size: 'lg' }),
        spec('button', { text: 'Start free trial', variant: 'primary' }),
        spec('text', { text: 'Free for 14 days · No credit card', size: 'sm' }),
      ],
      [spec('image', { variant: 'dashboard' })],
    ],
  },
  logos: {
    name: 'Logos',
    icon: 'logos',
    layout: 'center',
    tone: 'light',
    columns: [
      [
        spec('text', { text: 'Trusted by product teams at', size: 'sm' }),
        spec('logos', { items: ['Acme', 'Globex', 'Initech', 'Hooli', 'Umbrella'] }),
      ],
    ],
  },
  features: {
    name: 'Features',
    icon: 'features',
    layout: 'grid',
    tone: 'muted',
    columns: [
      [
        spec('heading', { text: 'Everything your team needs', size: 'lg' }),
        spec('text', { text: 'From the first click to the renewal, the whole journey in one place.' }),
      ],
      [
        spec('icon', { variant: 'zap' }),
        spec('heading', { text: 'Instant insights', size: 'sm' }),
        spec('text', { text: 'Dashboards update as events arrive, not overnight.', size: 'sm' }),
      ],
      [
        spec('icon', { variant: 'chart' }),
        spec('heading', { text: 'Funnels that explain', size: 'sm' }),
        spec('text', { text: 'See where users drop off, and the step that saves them.', size: 'sm' }),
      ],
      [
        spec('icon', { variant: 'lock' }),
        spec('heading', { text: 'Private by design', size: 'sm' }),
        spec('text', { text: 'Your data stays in your region, encrypted end to end.', size: 'sm' }),
      ],
    ],
  },
  pricing: {
    name: 'Pricing',
    icon: 'pricing',
    layout: 'grid',
    tone: 'light',
    cards: true,
    columns: [
      [
        spec('heading', { text: 'Simple, honest pricing', size: 'lg' }),
        spec('text', { text: 'Start free. Upgrade when your team grows.' }),
      ],
      [
        spec('heading', { text: 'Starter', size: 'sm' }),
        spec('price', { text: '$0', note: '/ month' }),
        spec('list', { items: ['1 project', '10k events a month', 'Community support'] }),
        spec('button', { text: 'Get started', variant: 'ghost' }),
      ],
      [
        spec('heading', { text: 'Team', size: 'sm' }),
        spec('price', { text: '$49', note: '/ month' }),
        spec('list', { items: ['Unlimited projects', '1M events a month', 'Funnels and cohorts'] }),
        spec('button', { text: 'Start trial', variant: 'primary' }),
      ],
      [
        spec('heading', { text: 'Scale', size: 'sm' }),
        spec('price', { text: '$199', note: '/ month' }),
        spec('list', { items: ['SSO and audit log', '10M events a month', 'A dedicated engineer'] }),
        spec('button', { text: 'Contact sales', variant: 'ghost' }),
      ],
    ],
  },
  testimonials: {
    name: 'Testimonials',
    icon: 'testimonials',
    layout: 'grid',
    tone: 'muted',
    cards: true,
    columns: [
      [spec('heading', { text: 'Loved by product teams', size: 'lg' })],
      [spec('quote', { text: 'We cut our weekly reporting from a day to ten minutes.', note: 'Maya Chen, Globex' })],
      [spec('quote', { text: 'The first analytics tool our designers actually open.', note: 'Tom Okafor, Initech' })],
      [spec('quote', { text: 'Funnels showed us the step that cost half our sign-ups.', note: 'Lena Fischer, Hooli' })],
    ],
  },
  faq: {
    name: 'FAQ',
    icon: 'faq',
    layout: 'split',
    tone: 'light',
    columns: [
      [
        spec('heading', { text: 'Questions, answered', size: 'lg' }),
        spec('text', { text: 'Can’t find what you need? Write to us: a human replies within a day.' }),
      ],
      [
        spec('heading', { text: 'Is there a free plan?', size: 'sm' }),
        spec('text', { text: 'Yes. Starter is free forever for one project.', size: 'sm' }),
        spec('heading', { text: 'Can I import my data?', size: 'sm' }),
        spec('text', { text: 'From Segment, Mixpanel or a CSV file, in a few clicks.', size: 'sm' }),
        spec('heading', { text: 'Where is my data stored?', size: 'sm' }),
        spec('text', { text: 'In the EU or the US: you choose when you sign up.', size: 'sm' }),
      ],
    ],
  },
  cta: {
    name: 'Call to action',
    icon: 'cta',
    layout: 'center',
    tone: 'brand',
    columns: [
      [
        spec('heading', { text: 'Start building with Lumora today', size: 'lg' }),
        spec('text', { text: 'Set up in five minutes. Your first insight in ten.' }),
        spec('button', { text: 'Start free trial', variant: 'primary' }),
      ],
    ],
  },
  footer: {
    name: 'Footer',
    icon: 'footer',
    layout: 'bar',
    tone: 'ink',
    columns: [
      [spec('logo', { text: 'Lumora' })],
      [spec('links', { items: ['Privacy', 'Terms', 'Status', 'Contact'] })],
      [spec('text', { text: '© 2026 Lumora, Inc.', size: 'sm' })],
    ],
  },
};

export const SECTION_KINDS = Object.keys(SECTIONS) as SectionKind[];

/** Every kind of block: its name, its icon, and what a new one says. `text`: it has texts to edit. */
export const BLOCKS: Record<BlockKind, { name: string; icon: IconName; text: boolean; spec: BlockSpec }> = {
  heading: { name: 'Heading', icon: 'heading', text: true, spec: spec('heading', { text: 'A new heading' }) },
  text: { name: 'Text', icon: 'text', text: true, spec: spec('text', { text: 'Tell your visitors something worth knowing.' }) },
  button: { name: 'Button', icon: 'button', text: true, spec: spec('button', { text: 'Learn more', variant: 'primary' }) },
  image: { name: 'Image', icon: 'image', text: false, spec: spec('image', { variant: 'photo' }) },
  list: { name: 'List', icon: 'list', text: true, spec: spec('list', { items: ['First point', 'Second point', 'Third point'] }) },
  quote: { name: 'Quote', icon: 'quote', text: true, spec: spec('quote', { text: 'A few words from a happy customer.', note: 'Sam Rivera, Acme' }) },
  icon: { name: 'Icon', icon: 'icon', text: false, spec: spec('icon', { variant: 'globe' }) },
  badge: { name: 'Badge', icon: 'badge', text: true, spec: spec('badge', { text: 'New' }) },
  logo: { name: 'Logo', icon: 'logo', text: true, spec: spec('logo', { text: 'Lumora' }) },
  links: { name: 'Links', icon: 'links', text: true, spec: spec('links', { items: ['Home', 'About', 'Contact'] }) },
  price: { name: 'Price', icon: 'price', text: true, spec: spec('price', { text: '$19', note: '/ month' }) },
  logos: { name: 'Logo cloud', icon: 'logos', text: false, spec: spec('logos', { items: ['Acme', 'Globex', 'Initech'] }) },
};

/** The blocks the palette hands out; the others come with the sections. */
export const CHIPS: BlockKind[] = ['heading', 'text', 'button', 'image', 'list', 'quote', 'icon', 'badge'];

// ─── New nodes ───────────────────────────────────────────────────────────────────

let last = 0;
/** Ids unique on the page: a counter that never goes back, since undo brings old ids back. */
const nextId = (prefix: string) => `${prefix}${++last}`;

/** A new block from a spec, or a copy of a block: a new id, its own lines. */
export const createBlock = (from: BlockSpec): Block => ({ ...from, items: [...from.items], id: nextId('b') });

export const createSection = (kind: SectionKind): Section => ({
  id: nextId('s'),
  kind,
  columns: SECTIONS[kind].columns.map((blocks) => ({ id: nextId('c'), blocks: blocks.map(createBlock) })),
});

/** A copy of a section with new ids all the way down: Duplicate. */
export const copySection = (section: Section): Section => ({
  id: nextId('s'),
  kind: section.kind,
  columns: section.columns.map((column) => ({ id: nextId('c'), blocks: column.blocks.map(createBlock) })),
});

export const createPage = () => (['navbar', 'hero', 'logos', 'features', 'pricing', 'footer'] as const).map(createSection);

/** A block's first words, for the layers and screen readers. */
export const excerpt = (block: Block) => {
  const text = block.text || block.items.join(', ');
  return text.length > 28 ? `${text.slice(0, 27).trimEnd()}…` : text;
};
