/** Boxes and lines on the canvas, in world units (100% zoom): snapping, guides, alignment. */

export interface Point {
  x: number;
  y: number;
}

export interface Box extends Point {
  width: number;
  height: number;
}

export type Axis = 'x' | 'y';

/** A pink line at `at` on `axis` (a vertical line for 'x'), drawn from `from` to `to` along the other axis. */
export interface Guide {
  axis: Axis;
  at: number;
  from: number;
  to: number;
}

export interface Guides {
  lines: Guide[];
  /** The space between the moved box and the closest box it lines up with, labelled with its length. */
  gaps: Guide[];
}

export const NO_GUIDES: Guides = { lines: [], gaps: [] };

const SIZE = { x: 'width', y: 'height' } as const;
const ACROSS = { x: 'y', y: 'x' } as const;

/** The lines a box snaps by along an axis: its start, its centre and its end. */
const linesOf = (box: Box, axis: Axis) => {
  const start = box[axis];
  const size = box[SIZE[axis]];
  return [start, start + size / 2, start + size];
};

export const offsetBox = (box: Box, x: number, y: number): Box => ({ ...box, x: box.x + x, y: box.y + y });

/** The smallest box around all of them; `null` for none. */
export const union = (boxes: Box[]): Box | null => {
  if (!boxes.length) return null;
  const left = Math.min(...boxes.map((box) => box.x));
  const top = Math.min(...boxes.map((box) => box.y));
  const right = Math.max(...boxes.map((box) => box.x + box.width));
  const bottom = Math.max(...boxes.map((box) => box.y + box.height));
  return { x: left, y: top, width: right - left, height: bottom - top };
};

/**
 * How far `values` (positions on `axis`) must move so that one of them sits on a line of
 * `targets`, if one is within `reach`: the closest wins. 0 when none is.
 */
export const snapValues = (values: number[], targets: Box[], axis: Axis, reach: number): number => {
  let best = reach + 1;
  for (const value of values) {
    for (const target of targets) {
      for (const line of linesOf(target, axis)) {
        const gap = line - value;
        if (Math.abs(gap) < Math.abs(best)) best = gap;
      }
    }
  }
  return Math.abs(best) <= reach ? best : 0;
};

/** How far `box` must move along `axis` so its edge or centre sits on a line of `targets`. */
export const snapBox = (box: Box, targets: Box[], axis: Axis, reach: number) =>
  snapValues(linesOf(box, axis), targets, axis, reach);

export const overlaps = (a: Box, b: Box) =>
  a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

const contains = (outer: Box, inner: Box) =>
  outer.x <= inner.x &&
  outer.y <= inner.y &&
  outer.x + outer.width >= inner.x + inner.width &&
  outer.y + outer.height >= inner.y + inner.height;

/** Whether a box lies across the line at `at` on `axis`, between `from` and `to` along it. */
const crosses = (box: Box, axis: Axis, at: number, from: number, to: number) => {
  const across = ACROSS[axis];
  return box[axis] < at && at < box[axis] + box[SIZE[axis]] && box[across] < to && from < box[across] + box[SIZE[across]];
};

/**
 * The lines `box` sits on exactly, each drawn across every box that shares it, and per
 * line the space to the closest of those boxes, unless another box stands in between.
 */
export const guidesFor = (box: Box, targets: Box[]): Guides => {
  const lines = new Map<string, Guide>();
  const gaps = new Map<string, Guide>();
  for (const axis of ['x', 'y'] as const) {
    const across = ACROSS[axis];
    const size = SIZE[across];
    const own = linesOf(box, axis);
    for (const target of targets) {
      const start = Math.min(box[across], target[across]);
      const end = Math.max(box[across] + box[size], target[across] + target[size]);
      // The space between the two along the line; none when they overlap there.
      const before = box[across] - (target[across] + target[size]);
      const after = target[across] - (box[across] + box[size]);
      for (const at of linesOf(target, axis)) {
        if (!own.some((value) => Math.abs(value - at) < 0.01)) continue;
        const key = `${axis}${Math.round(at * 100)}`;
        const line = lines.get(key);
        lines.set(key, line ? { ...line, from: Math.min(line.from, start), to: Math.max(line.to, end) } : { axis, at, from: start, to: end });
        const gap = before > 0 ? { from: box[across] - before, to: box[across] } : after > 0 ? { from: box[across] + box[size], to: target[across] } : null;
        // A box between the two hides the gap; the frame around them doesn't.
        if (!gap || targets.some((other) => !contains(other, box) && crosses(other, axis, at, gap.from, gap.to))) continue;
        const closest = gaps.get(key);
        if (!closest || gap.to - gap.from < closest.to - closest.from) gaps.set(key, { axis, at, ...gap });
      }
    }
  }
  return { lines: [...lines.values()], gaps: [...gaps.values()] };
};

export type Alignment = 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom';

/** Where `box` goes to line up with `bounds`. */
export const aligned = (box: Box, bounds: Box, alignment: Alignment): Point => {
  switch (alignment) {
    case 'left':
      return { x: bounds.x, y: box.y };
    case 'center':
      return { x: bounds.x + (bounds.width - box.width) / 2, y: box.y };
    case 'right':
      return { x: bounds.x + bounds.width - box.width, y: box.y };
    case 'top':
      return { x: box.x, y: bounds.y };
    case 'middle':
      return { x: box.x, y: bounds.y + (bounds.height - box.height) / 2 };
    case 'bottom':
      return { x: box.x, y: bounds.y + bounds.height - box.height };
  }
};

/**
 * New starts along `axis` that spread the boxes with equal space between them, in the order
 * they are given. The first and the last box stay where they are.
 */
export const distributed = (boxes: Box[], axis: Axis): number[] => {
  const size = SIZE[axis];
  const order = boxes.map((box, index) => ({ box, index })).sort((a, b) => a.box[axis] - b.box[axis]);
  const first = order[0]!.box;
  const last = order.reduce((end, { box }) => Math.max(end, box[axis] + box[size]), -Infinity);
  const filled = boxes.reduce((sum, box) => sum + box[size], 0);
  const space = (last - first[axis] - filled) / (boxes.length - 1);
  const starts: number[] = [];
  let next = first[axis];
  for (const { box, index } of order) {
    starts[index] = next;
    next += box[size] + space;
  }
  return starts;
};
