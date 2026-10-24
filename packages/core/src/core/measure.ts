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
  /** Invalidation generation at measure time: older entries are stale. */
  generation: number;
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
  /**
   * Whether the element is within `margin` sizes of its scroll container's visible
   * area. An estimate: it may use a rect made stale by `invalidate()`.
   */
  isNearViewport(element: Element, margin?: number): boolean;
  /**
   * After layout changes (draft changes): cached rects of `elements`, or all of
   * them, go stale. Exact reads re-measure them; `isNearViewport()` may still use
   * them, because a draft change moves items by a few item sizes at most, well
   * within its margin, and re-measuring thousands of far items for FLIP would cost
   * more than the animation saves.
   */
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
  let generation = 0;
  // Computed styles barely change during a drag: read them once per session.
  let flags = new WeakMap<Element, Flags>();
  const entries = new Map<Element, Entry>();
  /** Chain applying to the descendants of a container. */
  const chains = new Map<Element, Chain>();

  // Per frame.
  const scroll = new Map<Element, Coordinates>();
  const clips = new Map<Element, Rect | null>();
  const nearRegions = new Map<Element, Rect | null>();
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
    nearRegions.clear();
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
      // Overflow and containment don't apply without a box of their own.
      const boxed = style.display !== 'contents' && style.display !== 'inline';
      const paint = boxed && /paint|strict|content/.test(style.contain ?? '');
      result = {
        clipX: paint || (boxed && clipsOverflow(style.overflowX)),
        clipY: paint || (boxed && clipsOverflow(style.overflowY)),
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
    const entry: Entry = { rect: getLayoutRect(element), chain, offsets, frame, generation };
    entries.set(element, entry);
    return entry;
  };

  /** `exact: false` accepts a stale rect (estimates). */
  const entryOf = (element: Element, exact = true): Entry => {
    const entry = entries.get(element);
    if (
      entry &&
      (!exact || entry.generation === generation) &&
      !(entry.chain.volatile && entry.frame !== frame)
    ) {
      return entry;
    }
    return record(element);
  };

  // Scroll delta of the last `measureDelta()`; plain variables keep hot loops allocation-free.
  let dx = 0;
  let dy = 0;

  /** Scroll since the entry was measured, into `dx`/`dy`. */
  const measureDelta = (entry: Entry) => {
    const { chain, offsets } = entry;
    dx = 0;
    dy = 0;
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
  };

  /** Cached rect moved by the scroll that happened since it was measured. */
  const rectOf = (entry: Entry): Rect => {
    measureDelta(entry);
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

  /** Visible area of the chain's nearest scroller grown by `margin` of its size; per frame. */
  const nearRegionOf = (chain: Chain, margin: number): Rect | null => {
    const key = chain.scrollers[0] ?? document.documentElement;
    if (margin === NEAR_VIEWPORT) {
      const cached = nearRegions.get(key);
      if (cached !== undefined) return cached;
    }
    const clip = clipOf(chain);
    const region = clip && expandRect(clip, clip.width * margin, clip.height * margin);
    if (margin === NEAR_VIEWPORT) nearRegions.set(key, region);
    return region;
  };

  // Called for every item of a group on each draft change: no allocations.
  const isNearViewport = (element: Element, margin = NEAR_VIEWPORT): boolean => {
    prepare();
    const entry = entryOf(element, false);
    const region = nearRegionOf(entry.chain, margin);
    if (!region) return false;
    measureDelta(entry);
    const { left, top, right, bottom } = entry.rect;
    return (
      right + dx > region.left &&
      left + dx < region.right &&
      bottom + dy > region.top &&
      top + dy < region.bottom
    );
  };

  const invalidate = (elements?: Iterable<Element>) => {
    if (elements) {
      for (const element of elements) entries.delete(element);
    } else {
      generation++;
      chains.clear();
    }
    // Clip rects derive from the containers' entries.
    clips.clear();
    nearRegions.clear();
  };

  /** Resizes reflow anything: not even estimates survive. */
  const reset = () => {
    entries.clear();
    chains.clear();
    clips.clear();
    nearRegions.clear();
  };

  const onResize = () => reset();

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
      if (changed) reset();
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
