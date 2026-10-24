/**
 * Auto-scroll during pointer drags (rfcs/0001-v3.md §11).
 *
 * One rAF loop per drag. Each frame first reads every candidate scroller (the
 * element under the pointer and its scrollable ancestors, the ancestors of the
 * current drop target, the window last), picks per axis the first one that wants
 * to and can scroll, and only then writes. Steps are always relative (`scrollBy`):
 * virtualizers correct `scrollTop` themselves when rows get measured, and an
 * absolute target would fight those corrections.
 */

import { onScopeDispose, watch } from 'vue';
import type { AutoScrollOptions, Coordinates, Rect } from '../types';
import type { DnDManager } from './manager';
import { createRect, getRect } from '../animation/layout';
import { elementFromPoint, parentOf } from '../utils/dom';

export interface Directions {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export const DEFAULT_AUTO_SCROLL: Required<AutoScrollOptions> = {
  threshold: 0.2,
  maxSpeed: 25,
  acceleration: 10,
};

const MIN_EDGE = 24;
const MAX_EDGE = 96;
/** A pointer this far beside a container (across the scroll axis) still scrolls it. */
const CROSS_AXIS_TOLERANCE = 10;
/** Pointer travel in px that unlocks a scroll direction. */
const INTENT_DISTANCE = 5;
/** Speeds are px per 60fps frame; steps scale with the real frame time. */
const FRAME_MS = 1000 / 60;
/** Caps the step after a stalled frame (tab switch, long task). */
const MAX_FRAME_MS = 50;

// ─── Pure math ─────────────────────────────────────────────────────────────────

/** Edge zone for a container `size` px long: `threshold × size`, clamped to 24–96px and to half the size. */
export const getEdgeSize = (size: number, threshold: number): number =>
  threshold > 0 && size > 0
    ? Math.min(Math.max(threshold * size, MIN_EDGE), MAX_EDGE, size / 2)
    : 0;

/**
 * Speed in px per frame for a pointer `depth` zones into the edge zone: 0 at its
 * inner border, 1 at the container edge, more beyond it. Quadratic inside the zone
 * for fine control, linear past the edge (same slope at 1), capped by `maxSpeed`.
 */
export const getEdgeSpeed = (
  depth: number,
  { acceleration, maxSpeed }: Required<AutoScrollOptions>,
): number => {
  if (depth <= 0) return 0;
  const curve = depth <= 1 ? depth * depth : 2 * depth - 1;
  return Math.min(acceleration * curve, maxSpeed);
};

const axisVelocity = (
  position: number,
  start: number,
  end: number,
  backward: boolean,
  forward: boolean,
  options: Required<AutoScrollOptions>,
): number => {
  const edge = getEdgeSize(end - start, options.threshold);
  if (!edge) return 0;
  if (backward && position < start + edge) {
    return -getEdgeSpeed((start + edge - position) / edge, options);
  }
  if (forward && position > end - edge) {
    return getEdgeSpeed((position - end + edge) / edge, options);
  }
  return 0;
};

/**
 * Velocity in px per 60fps frame (negative: up/left) for a container whose visible
 * client area is `rect`. A direction needs room to scroll and the user's intent;
 * a pointer beside the container (past the cross-axis tolerance) doesn't scroll it.
 */
export const getScrollVelocity = (
  pointer: Coordinates,
  rect: Rect,
  canScroll: Directions,
  intent: Directions,
  options: Required<AutoScrollOptions>,
): Coordinates => {
  const t = CROSS_AXIS_TOLERANCE;
  const besideX = pointer.x < rect.left - t || pointer.x > rect.right + t;
  const besideY = pointer.y < rect.top - t || pointer.y > rect.bottom + t;
  return {
    x: besideY
      ? 0
      : axisVelocity(
          pointer.x,
          rect.left,
          rect.right,
          canScroll.left && intent.left,
          canScroll.right && intent.right,
          options,
        ),
    y: besideX
      ? 0
      : axisVelocity(
          pointer.y,
          rect.top,
          rect.bottom,
          canScroll.up && intent.up,
          canScroll.down && intent.down,
          options,
        ),
  };
};

export interface ScrollIntent {
  /** Extremes of the pointer since the drag started. */
  min: Coordinates;
  max: Coordinates;
  directions: Directions;
}

export const createScrollIntent = (pointer: Coordinates): ScrollIntent => ({
  min: { ...pointer },
  max: { ...pointer },
  directions: { up: false, down: false, left: false, right: false },
});

/**
 * Unlocks a direction once the pointer has moved that way since the drag started,
 * so an item picked up near an edge doesn't scroll by itself. Directions stay unlocked.
 */
export const updateScrollIntent = (intent: ScrollIntent, pointer: Coordinates): Directions => {
  const { min, max, directions } = intent;
  if (pointer.y - min.y > INTENT_DISTANCE) directions.down = true;
  if (max.y - pointer.y > INTENT_DISTANCE) directions.up = true;
  if (pointer.x - min.x > INTENT_DISTANCE) directions.right = true;
  if (max.x - pointer.x > INTENT_DISTANCE) directions.left = true;
  min.x = Math.min(min.x, pointer.x);
  min.y = Math.min(min.y, pointer.y);
  max.x = Math.max(max.x, pointer.x);
  max.y = Math.max(max.y, pointer.y);
  return directions;
};

const mergeOptions = (
  base: Required<AutoScrollOptions>,
  patch: boolean | AutoScrollOptions | undefined,
): Required<AutoScrollOptions> => {
  if (typeof patch !== 'object' || !patch) return base;
  const result = { ...base };
  for (const key of Object.keys(patch) as Array<keyof AutoScrollOptions>) {
    const value = patch[key];
    if (typeof value === 'number' && Number.isFinite(value)) result[key] = value;
  }
  return result;
};

/** Options for one container: a per-container override wins over the provider; `null` means off. */
export const resolveAutoScrollOptions = (
  provider: boolean | AutoScrollOptions | undefined,
  override?: boolean | AutoScrollOptions,
): Required<AutoScrollOptions> | null => {
  if ((override ?? provider ?? true) === false) return null;
  return mergeOptions(mergeOptions(DEFAULT_AUTO_SCROLL, provider), override);
};

/** How far to scroll so `rect` fits into `view` (its start edge wins when it is larger). */
export const getRevealDelta = (rect: Rect, view: Rect, margin = 0): Coordinates => {
  const axis = (start: number, end: number, viewStart: number, viewEnd: number) => {
    if (start < viewStart + margin) return start - viewStart - margin;
    if (end > viewEnd - margin) return Math.min(end - viewEnd + margin, start - viewStart - margin);
    return 0;
  };
  return {
    x: axis(rect.left, rect.right, view.left, view.right),
    y: axis(rect.top, rect.bottom, view.top, view.bottom),
  };
};

// ─── DOM ───────────────────────────────────────────────────────────────────────

interface ScrollStyle {
  x: boolean;
  y: boolean;
  /** Scroll offsets run from -max to 0 (RTL, `*-reverse` flex containers). */
  reverseX: boolean;
  reverseY: boolean;
}

interface Measured {
  /** Visible client area in viewport coordinates. */
  rect: Rect;
  canScroll: Directions;
}

const OVERFLOW = /^(auto|scroll|overlay)$/;

const readScrollStyle = (element: Element): ScrollStyle => {
  const style = getComputedStyle(element);
  const flex = style.display.endsWith('flex');
  return {
    x: OVERFLOW.test(style.overflowX),
    y: OVERFLOW.test(style.overflowY),
    reverseX: (style.direction === 'rtl') !== (flex && style.flexDirection === 'row-reverse'),
    reverseY: flex && style.flexDirection === 'column-reverse',
  };
};

/** The page itself scrolls through the window, which is always the last candidate. */
const isPageRoot = (element: Element): boolean =>
  element === document.body || element === document.documentElement;

/** Room to scroll backward/forward; 1px slack absorbs fractional offsets. */
const room = (position: number, max: number, reversed: boolean): [boolean, boolean] => {
  if (max < 1) return [false, false];
  const low = reversed ? -max : 0;
  const high = reversed ? 0 : max;
  return [position > low + 1, position < high - 1];
};

const clientRect = (element: Element): Rect => {
  const box = element.getBoundingClientRect();
  return createRect(
    box.left + element.clientLeft,
    box.top + element.clientTop,
    element.clientWidth,
    element.clientHeight,
  );
};

const measureElement = (element: Element, style: ScrollStyle): Measured | null => {
  const maxX = style.x ? element.scrollWidth - element.clientWidth : 0;
  const maxY = style.y ? element.scrollHeight - element.clientHeight : 0;
  if (maxX < 1 && maxY < 1) return null;
  const [left, right] = room(element.scrollLeft, maxX, style.reverseX);
  const [up, down] = room(element.scrollTop, maxY, style.reverseY);
  return { rect: clientRect(element), canScroll: { up, down, left, right } };
};

const measureWindow = (reverseX: boolean): Measured => {
  const root = document.scrollingElement ?? document.documentElement;
  // The root's client size is the viewport without scrollbars.
  const { clientWidth: width, clientHeight: height } = document.documentElement;
  const [left, right] = room(window.scrollX, root.scrollWidth - width, reverseX);
  const [up, down] = room(window.scrollY, root.scrollHeight - height, false);
  return { rect: createRect(0, 0, width, height), canScroll: { up, down, left, right } };
};

type Scroller = Element | Window;

const scrollBy = (scroller: Scroller, left: number, top: number) => {
  // 'instant' overrides a page-level `scroll-behavior: smooth`, which would lag behind the loop.
  const options: ScrollToOptions = { left, top, behavior: 'instant' };
  if (scroller === window) window.scrollBy(options);
  else (scroller as Element).scrollBy(options);
};

/**
 * Scrolls the scrollers around `element` by relative steps until it is visible.
 * Not `scrollIntoView`: it jumps virtual lists and scrolls unrelated ancestors.
 * Runs once per key press, so reading after each write is fine.
 */
export const revealElement = (element: Element, margin = 8): void => {
  for (let node = parentOf(element); node && !isPageRoot(node); node = parentOf(node)) {
    const measured = measureElement(node, readScrollStyle(node));
    if (!measured) continue;
    const delta = getRevealDelta(getRect(element), measured.rect, margin);
    if (delta.x || delta.y) scrollBy(node, delta.x, delta.y);
  }
  const { clientWidth, clientHeight } = document.documentElement;
  const delta = getRevealDelta(getRect(element), createRect(0, 0, clientWidth, clientHeight), margin);
  if (delta.x || delta.y) scrollBy(window, delta.x, delta.y);
};

// ─── Loop ──────────────────────────────────────────────────────────────────────

interface Target {
  scroller: Scroller;
  speed: number;
}

interface Session {
  last: number;
  intent: ScrollIntent | null;
  styles: WeakMap<Element, ScrollStyle>;
  /** Per-list options, keyed by the list's scroll container. */
  overrides: Map<Element, boolean | AutoScrollOptions>;
  /** Sub-pixel steps carried over to the next frame, so slow speeds still move. */
  remainders: Map<Scroller, Coordinates>;
  /** Elements that scrolled last frame: they keep scrolling while the pointer is past their edge. */
  previous: Element[];
  rootReverseX: boolean;
}

/** Runs auto-scroll for the provider's pointer drags. Keyboard drags never auto-scroll. */
export function useAutoScroll(manager: DnDManager): void {
  let frame = 0;
  let session: Session | null = null;

  const styleOf = (current: Session, element: Element): ScrollStyle => {
    let style = current.styles.get(element);
    if (!style) {
      style = readScrollStyle(element);
      current.styles.set(element, style);
    }
    return style;
  };

  const isScrollContainer = (current: Session, element: Element) => {
    const style = styleOf(current, element);
    return style.x || style.y;
  };

  const addScrollers = (current: Session, from: Element | null | undefined, into: Element[]) => {
    for (let node = from ?? null; node && !isPageRoot(node); node = parentOf(node)) {
      if (isScrollContainer(current, node) && !into.includes(node)) into.push(node);
    }
  };

  const step = (current: Session, scroller: Scroller, dx: number, dy: number) => {
    let remainder = current.remainders.get(scroller);
    if (!remainder) current.remainders.set(scroller, (remainder = { x: 0, y: 0 }));
    const x = remainder.x + dx;
    const y = remainder.y + dy;
    const left = Math.trunc(x);
    const top = Math.trunc(y);
    remainder.x = x - left;
    remainder.y = y - top;
    if (left || top) scrollBy(scroller, left, top);
  };

  const isPointerDrag = () =>
    manager.status.value === 'dragging' && manager.active.value?.sensor === 'pointer';

  const tick = (now: number) => {
    frame = 0;
    const current = session;
    if (!current || !isPointerDrag()) return;
    const elapsed = current.last ? Math.min(now - current.last, MAX_FRAME_MS) : FRAME_MS;
    current.last = now;

    const pointer = manager.getRawPointer();
    current.intent ??= createScrollIntent(pointer);
    const intent = updateScrollIntent(current.intent, pointer);
    const provider = manager.props.autoScroll;

    // Read pass: innermost first, the window last.
    const candidates: Element[] = [];
    addScrollers(current, elementFromPoint(pointer.x, pointer.y), candidates);
    const over = manager.over.value?.element;
    if (over?.isConnected) addScrollers(current, over, candidates);
    for (const element of current.previous) {
      if (element.isConnected && !candidates.includes(element)) candidates.push(element);
    }

    // Per axis, only the first container that wants to and can scroll does.
    const picked: { x: Target | null; y: Target | null } = { x: null, y: null };
    const consider = (scroller: Scroller, measured: Measured, options: Required<AutoScrollOptions>) => {
      const velocity = getScrollVelocity(pointer, measured.rect, measured.canScroll, intent, options);
      if (!picked.x && velocity.x) picked.x = { scroller, speed: velocity.x };
      if (!picked.y && velocity.y) picked.y = { scroller, speed: velocity.y };
    };
    for (const element of candidates) {
      if (picked.x && picked.y) break;
      const options = resolveAutoScrollOptions(provider, current.overrides.get(element));
      const measured = options && measureElement(element, styleOf(current, element));
      if (options && measured) consider(element, measured, options);
    }
    if (!picked.x || !picked.y) {
      const options = resolveAutoScrollOptions(provider);
      if (options) consider(window, measureWindow(current.rootReverseX), options);
    }

    // Write pass.
    const scale = elapsed / FRAME_MS;
    const { x, y } = picked;
    if (x && y && x.scroller === y.scroller) {
      step(current, x.scroller, x.speed * scale, y.speed * scale);
    } else {
      if (x) step(current, x.scroller, x.speed * scale, 0);
      if (y) step(current, y.scroller, 0, y.speed * scale);
    }
    current.previous = [x?.scroller, y?.scroller].filter(
      (scroller): scroller is Element => !!scroller && scroller !== window,
    );
    manager.isAutoScrolling.value = !!(x || y);
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    const provider = manager.props.autoScroll;
    const entries = [...manager.autoScrollEntries];
    if (provider === false && !entries.some((entry) => entry.options !== false)) return;
    const current: Session = {
      last: 0,
      intent: null,
      styles: new WeakMap(),
      overrides: new Map(),
      remainders: new Map(),
      previous: [],
      rootReverseX: getComputedStyle(document.documentElement).direction === 'rtl',
    };
    // A list's option applies to its scroll container: the list itself or its closest scrollable ancestor.
    for (const entry of entries) {
      let node = entry.getElement();
      while (node && !isPageRoot(node) && !isScrollContainer(current, node)) node = parentOf(node);
      if (node && !isPageRoot(node) && !current.overrides.has(node)) {
        current.overrides.set(node, entry.options);
      }
    }
    session = current;
    frame = requestAnimationFrame(tick);
  };

  const stop = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    session = null;
    manager.isAutoScrolling.value = false;
  };

  watch(isPointerDrag, (dragging) => (dragging ? start() : stop()), { flush: 'sync' });
  onScopeDispose(stop);
}
