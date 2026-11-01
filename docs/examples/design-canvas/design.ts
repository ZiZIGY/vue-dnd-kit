/** The design: frames and the layers in them, as a tree, the way the layers panel shows it. */

export type LayerKind = 'frame' | 'rect' | 'ellipse' | 'text' | 'image';
export type Artwork = 'mountains' | 'portrait' | 'dunes';

export interface Layer {
  id: string;
  kind: LayerKind;
  name: string;
  /** From the top-left corner of the frame it is in, or of the canvas. */
  x: number;
  y: number;
  width: number;
  height: number;
  /** The background, or the colour of a text. Images have none. */
  fill: string;
  /** Corner radius of frames, rectangles and images. */
  radius: number;
  hidden?: boolean;
  content?: string;
  fontSize?: number;
  fontWeight?: number;
  align?: 'left' | 'center' | 'right';
  image?: Artwork;
  /** A frame's layers. The first is in front, as in the layers panel. */
  children?: Layer[];
}

/** What a new layer of each kind looks like. */
export const KINDS: Record<LayerKind, { name: string; width: number; height: number; fill: string }> = {
  frame: { name: 'Frame', width: 200, height: 280, fill: '#ffffff' },
  rect: { name: 'Rectangle', width: 120, height: 80, fill: '#d9d9d9' },
  ellipse: { name: 'Ellipse', width: 88, height: 88, fill: '#d9d9d9' },
  text: { name: 'Text', width: 120, height: 24, fill: '#1e1e1e' },
  image: { name: 'Image', width: 160, height: 112, fill: '' },
};

type Basics = Pick<Layer, 'id' | 'kind' | 'name' | 'x' | 'y' | 'width' | 'height'>;

const layer = (props: Basics & Partial<Layer>): Layer => ({ fill: KINDS[props.kind].fill, radius: 0, ...props });
const text = (props: Omit<Basics, 'kind'> & Partial<Layer>) =>
  layer({ kind: 'text', fontSize: 12, fontWeight: 400, align: 'left', ...props });

/** Ids of new layers and copies: never one twice. */
let created = 0;

/** A new layer of `kind` with its top-left corner at `x`, `y`. */
export const createLayer = (kind: LayerKind, name: string, x: number, y: number): Layer => {
  const { width, height } = KINDS[kind];
  created++;
  return layer({
    id: `${kind}-${created}`,
    kind,
    name,
    x,
    y,
    width,
    height,
    ...(kind === 'frame' && { children: [] }),
    ...(kind === 'text' && { content: 'Type something', fontSize: 16, fontWeight: 400, align: 'left' as const }),
    ...(kind === 'image' && { image: 'mountains' as const, radius: 8 }),
  });
};

/** A copy with new ids, its frame's layers too. */
export const copyLayer = (source: Layer): Layer => {
  created++;
  return { ...source, id: `${source.id}-copy-${created}`, children: source.children?.map(copyLayer) };
};

/** Two screens of an app and two loose layers, front first. */
export const createDesign = (): Layer[] => [
  layer({ id: 'badge', kind: 'ellipse', name: 'Badge', x: 492, y: 150, width: 56, height: 56, fill: '#f43f5e' }),
  layer({ id: 'photo', kind: 'image', name: 'Photo', x: 480, y: 24, width: 136, height: 100, radius: 10, image: 'dunes' }),
  layer({
    id: 'profile',
    kind: 'frame',
    name: 'Profile',
    x: 240,
    y: 0,
    width: 200,
    height: 340,
    fill: '#f1f5f9',
    radius: 16,
    children: [
      text({ id: 'follow-label', name: 'Follow label', x: 16, y: 276, width: 168, height: 40, content: 'Follow', fill: '#ffffff', fontSize: 13, fontWeight: 600, align: 'center' }),
      layer({ id: 'follow', kind: 'rect', name: 'Follow button', x: 16, y: 276, width: 168, height: 40, fill: '#0d99ff', radius: 20 }),
      text({ id: 'stats', name: 'Stats', x: 16, y: 196, width: 168, height: 60, content: '24 trips · 118 places', fill: '#334155', fontWeight: 600, align: 'center' }),
      layer({ id: 'card', kind: 'rect', name: 'Stats card', x: 16, y: 196, width: 168, height: 60, fill: '#ffffff', radius: 12 }),
      text({ id: 'role', name: 'Role', x: 12, y: 160, width: 176, height: 18, content: 'Travel photographer', fill: '#64748b', fontSize: 11, align: 'center' }),
      text({ id: 'name', name: 'Name', x: 12, y: 134, width: 176, height: 24, content: 'Maya Lindqvist', fill: '#0f172a', fontSize: 16, fontWeight: 700, align: 'center' }),
      layer({ id: 'avatar', kind: 'image', name: 'Avatar', x: 64, y: 52, width: 72, height: 72, radius: 36, image: 'portrait' }),
      layer({ id: 'cover', kind: 'rect', name: 'Cover', x: 0, y: 0, width: 200, height: 92, fill: '#6366f1' }),
    ],
  }),
  layer({
    id: 'welcome',
    kind: 'frame',
    name: 'Welcome',
    x: 0,
    y: 0,
    width: 200,
    height: 380,
    radius: 16,
    children: [
      text({ id: 'start-label', name: 'Button label', x: 16, y: 316, width: 168, height: 44, content: 'Get started', fill: '#ffffff', fontSize: 13, fontWeight: 600, align: 'center' }),
      layer({ id: 'start', kind: 'rect', name: 'Button', x: 16, y: 316, width: 168, height: 44, fill: '#0f172a', radius: 12 }),
      layer({ id: 'dot-3', kind: 'ellipse', name: 'Dot 3', x: 112, y: 280, width: 8, height: 8, fill: '#cbd5e1' }),
      layer({ id: 'dot-2', kind: 'ellipse', name: 'Dot 2', x: 96, y: 280, width: 8, height: 8, fill: '#cbd5e1' }),
      layer({ id: 'dot-1', kind: 'ellipse', name: 'Dot 1', x: 80, y: 280, width: 8, height: 8, fill: '#0d99ff' }),
      text({ id: 'body', name: 'Body', x: 16, y: 220, width: 168, height: 36, content: 'Save places, plan the days and share the route.', fill: '#64748b', fontSize: 11 }),
      text({ id: 'title', name: 'Title', x: 16, y: 188, width: 168, height: 28, content: 'Find your next trip', fill: '#0f172a', fontSize: 18, fontWeight: 700 }),
      layer({ id: 'hero', kind: 'image', name: 'Hero', x: 12, y: 12, width: 176, height: 160, radius: 12, image: 'mountains' }),
    ],
  }),
];
