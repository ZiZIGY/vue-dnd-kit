/**
 * Measuring service (rfcs/0001-v3.md §3, §6, §12; research: dnd-kit.md §9,
 * virtualization.md §4–§5).
 *
 * - Rects are layout rects: an in-flight FLIP `translate` is excluded.
 * - During a drag session a rect is cached per element together with the scroll
 *   offsets of its scroll containers. Reads add the scroll delta lazily, so
 *   scrolling never re-measures (dnd-kit classic `Rect`).
 * - Visible rects are clipped by every clipping ancestor and the viewport. A fully
 *   clipped element (a virtualizer's overscan row) has none and can't be hit.
 * - Scroll offsets and clip rects are read once per frame (`nextFrame()`), and
 *   nothing here writes to the DOM, so a frame reads layout in one pass.
 */

import type { Coordinates, Rect } from '../types';
import {
  createRect,
  expandRect,
  getLayoutRect,
  intersectRect,
  offsetRect,
} from '../animation/layout';
import { parentOf } from '../utils/dom';

/** FLIP runs within this many sizes of a scroll container's visible area around it. */
export const NEAR_VIEWPORT = 1;

interface Flags {
  clipX: boolean;
  clipY: boolean;
  fixed: boolean;
  sticky: boolean;
}

/** What moves and clips an element. */
interface Chain {
  /** Clipping (and possibly scrolling) ancestors, nearest first. */
  scrollers: readonly Element[];
  /** The window scroll moves the element (no fixed ancestor). */
  window: boolean;
  /** Sticky positioning in the chain: a scroll delta can't predict the rect. */
  volatile: boolean;
}

interface Entry {
  rect: Rect;
  chain: Chain;
  /** Scroll offsets at measure time: x and y of each scroller, then of the window. */
  offsets: number[];
  frame: number;
  /** Padding box relative to the border box, read when the element clips others. */
  client?: Rect;
}

const ROOT: Chain = { scrollers: [], window: true, volatile: false };
const FIXED: Chain = { scrollers: [], window: false, volatile: false };

// DOM emulations (happy-dom, jsdom) report unset longhands as ''.
const clipsOverflow = (value: string) => value !== 'visible' && value !== '';

export interface Measurer {
  /** Starts caching for a drag session. */
  begin(): void;
  /** Drops the cache and the session listeners. */
  end(): void;
  /** Scroll offsets and clip rects are re-read at most once per frame. */
  nextFrame(): void;
  /** Layout rect in viewport coordinates, without in-flight FLIP translates. */
  measure(element: Element): Rect;
  /** `measure()` clipped by scroll containers and the viewport; `null` when fully clipped. */
  measureVisible(element: Element): Rect | null;
  /** Whether the element is within `margin` sizes of its scroll container's visible area. */
  isNearViewport(element: Element, margin?: number): boolean;
  /** Forgets cached rects: of `elements`, or all of them (draft changes, resizes). */
  invalidate(elements?: Iterable<Element>): void;
  /** Invalidates the cache when `element` resizes during the session. */
  observe(element: Element): void;
}

export interface MeasurerOptions {
  /**
   * A scroll container inside a shadow root scrolled during the session. Its `scroll`
   * event isn't composed, so document listeners never see it.
   */
  onShadowScroll?: () => void;
}

export function createMeasurer(options: MeasurerOptions = {}): Measurer {
  let active = false;
  let frame = 0;
  // Computed styles barely change during a drag: read them once per session.
  let flags = new WeakMap<Element, Flags>();
  const entries = new Map<Element, Entry>();
  /** Chain applying to the descendants of a container. */
  const chains = new Map<Element, Chain>();

  // Per frame.
  const scroll = new Map<Element, Coordinates>();
  const clips = new Map<Element, Rect | null>();
  let windowScroll: Coordinates | null = null;
  let viewport: Rect | null = null;

  let observer: ResizeObserver | null = null;
  const sizes = new Map<Element, string>();
  const shadowRoots = new Set<ShadowRoot>();

  const onShadowScroll = () => options.onShadowScroll?.();

  const watchShadowRoot = (element: Element) => {
    const root = element.getRootNode();
    if (!active || !(root instanceof ShadowRoot) || shadowRoots.has(root)) return;
    shadowRoots.add(root);
    root.addEventListener('scroll', onShadowScroll, { capture: true, passive: true });
  };

  const clearFrame = () => {
    scroll.clear();
    clips.clear();
    windowScroll = null;
    viewport = null;
  };

  /** Outside a session nothing is cached: every read is fresh. */
  const prepare = () => {
    if (active) return;
    flags = new WeakMap();
    entries.clear();
    chains.clear();
    clearFrame();
  };

  const flagsOf = (element: Element): Flags => {
    let result = flags.get(element);
    if (!result) {
      const style = getComputedStyle(element);
      const paint = /paint|strict|content/.test(style.contain ?? '');
      result = {
        clipX: paint || clipsOverflow(style.overflowX),
        clipY: paint || clipsOverflow(style.overflowY),
        fixed: style.position === 'fixed',
        sticky: style.position === 'sticky',
      };
      flags.set(element, result);
    }
    return result;
  };

  const clipsContent = (element: Element) => {
    const own = flagsOf(element);
    if (!own.clipX && !own.clipY) return false;
    // `overflow` on <body> applies to the viewport unless <html> sets its own.
    if (element === document.body) {
      const root = flagsOf(document.documentElement);
      return root.clipX || root.clipY;
    }
    return true;
  };

  const withSticky = (chain: Chain, sticky: boolean): Chain =>
    sticky && !chain.volatile ? { ...chain, volatile: true } : chain;

  const chainBelow = (container: Element | null): Chain => {
    if (!container || container === document.documentElement) return ROOT;
    let chain = chains.get(container);
    if (chain) return chain;
    const own = flagsOf(container);
    const outer = own.fixed ? FIXED : chainBelow(parentOf(container));
    const clipping = clipsContent(container);
    if (clipping) watchShadowRoot(container);
    chain = clipping
      ? {
          scrollers: [container, ...outer.scrollers],
          window: outer.window,
          volatile: outer.volatile || own.sticky,
        }
      : withSticky(outer, own.sticky);
    chains.set(container, chain);
    return chain;
  };

  const chainOf = (element: Element): Chain => {
    const own = flagsOf(element);
    if (own.fixed) return FIXED;
    return withSticky(chainBelow(parentOf(element)), own.sticky);
  };

  const scrollOf = (scroller: Element): Coordinates => {
    let value = scroll.get(scroller);
    if (!value) {
      value = { x: scroller.scrollLeft, y: scroller.scrollTop };
      scroll.set(scroller, value);
    }
    return value;
  };

  const windowOffset = (): Coordinates =>
    (windowScroll ??= { x: window.scrollX, y: window.scrollY });

  const record = (element: Element): Entry => {
    const chain = chainOf(element);
    const offsets: number[] = [];
    for (const scroller of chain.scrollers) {
      const { x, y } = scrollOf(scroller);
      offsets.push(x, y);
    }
    if (chain.window) {
      const { x, y } = windowOffset();
      offsets.push(x, y);
    }
    const entry: Entry = { rect: getLayoutRect(element), chain, offsets, frame };
    entries.set(element, entry);
    return entry;
  };

  const entryOf = (element: Element): Entry => {
    const entry = entries.get(element);
    if (entry && !(entry.chain.volatile && entry.frame !== frame)) return entry;
    return record(element);
  };

  /** Cached rect moved by the scroll that happened since it was measured. */
  const rectOf = (entry: Entry): Rect => {
    const { chain, offsets } = entry;
    let dx = 0;
    let dy = 0;
    let index = 0;
    for (const scroller of chain.scrollers) {
      const now = scrollOf(scroller);
      dx += offsets[index++]! - now.x;
      dy += offsets[index++]! - now.y;
    }
    if (chain.window) {
      const now = windowOffset();
      dx += offsets[index++]! - now.x;
      dy += offsets[index]! - now.y;
    }
    return dx || dy ? offsetRect(entry.rect, dx, dy) : entry.rect;
  };

  const viewportRect = (): Rect =>
    (viewport ??= createRect(0, 0, window.innerWidth, window.innerHeight));

  /** Visible area for the content of the chain's nearest scroller. */
  const clipOf = (chain: Chain): Rect | null => {
    const scroller = chain.scrollers[0];
    if (!scroller) return viewportRect();
    const cached = clips.get(scroller);
    if (cached !== undefined) return cached;
    const entry = entryOf(scroller);
    const outer = clipOf(entry.chain);
    let result: Rect | null = null;
    if (outer) {
      const border = rectOf(entry);
      // Content is clipped at the padding box, scrollbars excluded.
      const client = (entry.client ??= createRect(
        scroller.clientLeft,
        scroller.clientTop,
        scroller.clientWidth,
        scroller.clientHeight,
      ));
      const box = offsetRect(client, border.left, border.top);
      const { clipX, clipY } = flagsOf(scroller);
      // `overflow-x: clip` alone leaves the other axis unclipped.
      result = intersectRect(
        outer,
        createRect(
          clipX ? box.left : outer.left,
          clipY ? box.top : outer.top,
          clipX ? box.width : outer.width,
          clipY ? box.height : outer.height,
        ),
      );
    }
    clips.set(scroller, result);
    return result;
  };

  const measure = (element: Element): Rect => {
    prepare();
    return rectOf(entryOf(element));
  };

  const measureVisible = (element: Element): Rect | null => {
    prepare();
    const entry = entryOf(element);
    const clip = clipOf(entry.chain);
    return clip && intersectRect(rectOf(entry), clip);
  };

  const isNearViewport = (element: Element, margin = NEAR_VIEWPORT): boolean => {
    prepare();
    const entry = entryOf(element);
    const clip = clipOf(entry.chain);
    if (!clip) return false;
    return !!intersectRect(rectOf(entry), expandRect(clip, clip.width * margin, clip.height * margin));
  };

  const invalidate = (elements?: Iterable<Element>) => {
    if (elements) {
      for (const element of elements) entries.delete(element);
    } else {
      entries.clear();
      chains.clear();
    }
    // Clip rects derive from the containers' entries.
    clips.clear();
  };

  const onResize = () => invalidate();

  const observe = (element: Element) => {
    if (!active || sizes.has(element) || typeof ResizeObserver === 'undefined') return;
    observer ??= new ResizeObserver((records) => {
      let changed = false;
      for (const { target, contentRect } of records) {
        const size = `${contentRect.width}x${contentRect.height}`;
        // The first notification only reports the initial size.
        if (sizes.get(target) && sizes.get(target) !== size) changed = true;
        sizes.set(target, size);
      }
      // No new frame: the target follows the pointer, never a layout shift alone.
      if (changed) invalidate();
    });
    sizes.set(element, '');
    observer.observe(element);
  };

  const end = () => {
    if (active) window.removeEventListener('resize', onResize);
    active = false;
    observer?.disconnect();
    observer = null;
    sizes.clear();
    for (const root of shadowRoots) {
      root.removeEventListener('scroll', onShadowScroll, { capture: true });
    }
    shadowRoots.clear();
    flags = new WeakMap();
    entries.clear();
    chains.clear();
    clearFrame();
  };

  const begin = () => {
    end();
    active = true;
    window.addEventListener('resize', onResize, { passive: true });
  };

  const nextFrame = () => {
    frame++;
    clearFrame();
  };

  return { begin, end, nextFrame, measure, measureVisible, isNearViewport, invalidate, observe };
}
