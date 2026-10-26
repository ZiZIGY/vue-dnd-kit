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
import type { AutoScrollOptions, Coordinates } from '../../types';
import type { DnDManager } from '../manager';
import { elementFromPoint, parentOf } from '../../utils/dom';
import {
  createScrollIntent,
  getScrollVelocity,
  resolveAutoScrollOptions,
  updateScrollIntent,
  type ScrollIntent,
} from './math';
import {
  isPageRoot,
  measureElement,
  measureWindow,
  readPageScroll,
  readScrollStyle,
  scrollBy,
  type Measured,
  type PageScroll,
  type Scroller,
  type ScrollStyle,
} from './dom';

/** Speeds are px per 60fps frame; steps scale with the real frame time. */
const FRAME_MS = 1000 / 60;
/** Caps the step after a stalled frame (tab switch, long task). */
const MAX_FRAME_MS = 50;

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
  page: PageScroll;
  /** Inline `scroll-snap-type` of the scrollers whose snapping is suspended, restored when the drag ends. */
  snaps: Map<HTMLElement, { value: string; priority: string }>;
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

  /**
   * Scroll snapping and small relative steps don't mix: Chromium snaps every
   * programmatic `scrollBy` in its direction (a whole column per frame with
   * `mandatory`), and a step shorter than the `proximity` range snaps back. Snapping
   * is suspended on a scroller from its first step until the drag ends; restoring it
   * re-snaps to the nearest snap position.
   */
  const suspendSnapping = (current: Session, scroller: Scroller) => {
    const snaps = scroller === window ? current.page.snap : styleOf(current, scroller as Element).snap;
    const element = scroller === window ? document.documentElement : scroller;
    if (!snaps || !(element instanceof HTMLElement) || current.snaps.has(element)) return;
    const { style } = element;
    current.snaps.set(element, {
      value: style.getPropertyValue('scroll-snap-type'),
      priority: style.getPropertyPriority('scroll-snap-type'),
    });
    style.setProperty('scroll-snap-type', 'none', 'important');
  };

  const restoreSnapping = (current: Session) => {
    for (const [element, { value, priority }] of current.snaps) {
      if (value) element.style.setProperty('scroll-snap-type', value, priority);
      else element.style.removeProperty('scroll-snap-type');
    }
    current.snaps.clear();
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
    if (!left && !top) return;
    suspendSnapping(current, scroller);
    scrollBy(scroller, left, top);
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

    // Read pass: innermost first, the window last. What is under the pointer comes from
    // the manager's hit test of the last frame: a hit test brings the page's rendering
    // up to date, which with thousands of items costs more than the rest of the frame.
    const candidates: Element[] = [];
    addScrollers(current, manager.getPointerElement() ?? elementFromPoint(pointer.x, pointer.y), candidates);
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
      if (options) consider(window, measureWindow(current.page), options);
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
    const scrolled = [x?.scroller, y?.scroller].filter(
      (scroller, index, all): scroller is Element => !!scroller && scroller !== window && all.indexOf(scroller) === index,
    );
    const { autoScrollers } = manager;
    if (scrolled.length !== autoScrollers.value.length || scrolled.some((element, i) => element !== autoScrollers.value[i])) {
      autoScrollers.value = scrolled;
    }
    current.previous = scrolled;
    manager.isAutoScrolling.value = !!(x || y);
    frame = requestAnimationFrame(tick);
  };

  const start = () => {
    const provider = manager.props.autoScroll;
    // Lists' options are read once per drag; `undefined` leaves the provider's.
    const entries: Array<{ element: Element | null; options: boolean | AutoScrollOptions }> = [];
    for (const entry of manager.autoScrollEntries) {
      const options = entry.getOptions();
      if (options !== undefined) entries.push({ element: entry.getElement(), options });
    }
    if (provider === false && !entries.some((entry) => entry.options !== false)) return;
    const current: Session = {
      last: 0,
      intent: null,
      styles: new WeakMap(),
      overrides: new Map(),
      remainders: new Map(),
      previous: [],
      page: readPageScroll(),
      snaps: new Map(),
    };
    // A list's option applies to its scroll container: the list itself or its closest scrollable ancestor.
    for (const entry of entries) {
      let node = entry.element;
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
    if (session) restoreSnapping(session);
    session = null;
    manager.isAutoScrolling.value = false;
    if (manager.autoScrollers.value.length) manager.autoScrollers.value = [];
  };

  watch(isPointerDrag, (dragging) => (dragging ? start() : stop()), { flush: 'sync' });
  onScopeDispose(stop);
}
