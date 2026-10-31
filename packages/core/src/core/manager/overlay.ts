/**
 * The overlay of a drag: what it shows (whether there is one, its component, the clones
 * of the dragged items taken at pickup) and its box (where it is for a drag offset, at
 * which size, and the modifiers that move it). `overlayFit: 'slot'` glides the box to
 * the size of the slot the item will land in, around the point where the pointer holds it.
 */

import type { Component } from 'vue';
import type { Active, Coordinates, DropAnimation, Key, Modifier, Rect, Size } from '../../types';
import {
  getFraction,
  getLayoutRect,
  getRect,
  getWindowRect,
  offsetRect,
  prefersReducedMotion,
  resizeAround,
} from '../../animation/layout';
import { clonePreview, clonePreviews } from '../clone';
import type { ManagerContext } from './state';
import type { DraggableEntry } from './registry';

/** A clone taken at pickup and the rect of its source then (`DragPreview`). */
export interface PreviewSource {
  element: HTMLElement;
  rect: Rect;
}

/**
 * Items cloned at pickup by default (`overlayPreviews`): the grabbed one and the others
 * next to it in drop order. Cloning lays out the clones and reads their computed styles
 * (`snapshot.ts`), the most expensive part of a pickup, and a column of more clones covers
 * most of the screen; the overlay counts the rest instead.
 */
const DEFAULT_PREVIEWS = 5;
/** A placeholder styled smaller than this share of the source (a drop line) keeps the source size on that axis. */
const FIT_MIN_RATIO = 0.25;
/** Overlay box resizes (a target list with other item sizes) glide instead of jumping. */
const RESIZE_DURATION = 150;

export type Overlay = ReturnType<typeof createOverlay>;

export function createOverlay(ctx: ManagerContext) {
  /** Clones taken at pickup by id (`DragPreview`), and the ids that have one, in drop order. */
  let previews = new Map<Key, PreviewSource>();
  let previewIds: Key[] = [];
  let previewEnabled = false;
  /**
   * The draggable the drag started from. Its `overlay` and `dropAnimation` are read live
   * (a ref switched mid-drag applies at once); its options outlive an unmounted element.
   */
  let source: DraggableEntry | null = null;
  /** Where the pointer holds the overlay box, as fractions of its size: it resizes around this point. */
  let grab: Coordinates = { x: 0, y: 0 };
  /** The container the drag started in (`restrictToParent`, `snapToGrid`), measured on every move. */
  let container: Element | null = null;
  /** Where the container was at the start, and how far its content was scrolled (`containerShift`). */
  let containerStart: { rect: Rect; scroll: Coordinates } | null = null;
  /** Modifiers of the draggable the drag started from, taken at start like the overlay. */
  let sourceModifiers: readonly Modifier[] = [];
  /**
   * Glide of `fitSize` to a new slot size. It runs in the frame loop rather than as a
   * CSS transition: the box resizes around the grab point, so its position depends
   * on its size, and collision and modifiers must see the box as it is shown.
   */
  let resize: { from: Size; to: Size; start: number } | null = null;

  // ─── Content ─────────────────────────────────────────────────────────────────

  /** Where the overlay renders: the clones are laid out there, with its styles. */
  const overlayContainer = () => {
    const to = ctx.props.overlayTo;
    return typeof to === 'string' ? document.querySelector(to) : to;
  };

  /** The rendered element of a dragged item, if it can be cloned. */
  const sourceOf = (id: Key) => {
    const element = ctx.draggables.get(id)?.getElement();
    return element?.isConnected ? element : null;
  };

  const takePreview = (id: Key): PreviewSource | null => {
    const element = sourceOf(id);
    if (!element) return null;
    return { element: clonePreview(element, { container: overlayContainer() }), rect: getRect(element) };
  };

  /**
   * Clones of the other dragged items, next to the active one in drop order (the overlay
   * column's order, else `ids`), as many as `overlayPreviews` asks for. Runs right after
   * `onDragStart`: the sortable layer has set the order, and the DOM hasn't re-rendered
   * yet. They are cloned together: the page lays out once per snapshot pass for all.
   */
  const takePreviews = (current: Active) => {
    const order = ctx.overlayColumn.value?.ids ?? current.ids;
    const wanted = ctx.props.overlayPreviews ?? DEFAULT_PREVIEWS;
    const limit = wanted === 'all' ? order.length : Math.max(1, Math.floor(wanted));
    const at = Math.max(order.indexOf(current.id), 0);
    const from = Math.max(0, Math.min(at - ((limit - 1) >> 1), order.length - limit));
    const ids = order.slice(from, from + limit);
    const missing = ids.flatMap((id) => {
      const element = previews.has(id) ? null : sourceOf(id);
      return element ? [{ id, element, rect: getRect(element) }] : [];
    });
    const clones = clonePreviews(
      missing.map(({ element }) => element),
      { container: overlayContainer() },
    );
    missing.forEach(({ id, rect }, index) => previews.set(id, { element: clones[index]!, rect }));
    previewIds = ids.filter((id) => previews.has(id));
  };

  // ─── Box ─────────────────────────────────────────────────────────────────────

  /**
   * The overlay box for a drag offset: the dragged element's rect moved by `offset`,
   * at the box's current size, resized around the grab point. The overlay, collision
   * and modifiers all place the box with this, so they never disagree.
   */
  const getOverlayRect = (current: Active, offset: Coordinates): Rect =>
    resizeAround(offsetRect(current.rect, offset.x, offset.y), ctx.fitSize.value ?? current.rect, grab);

  /** The provider's modifiers, then those of the draggable (or list) the drag started from. */
  const getModifiers = (): readonly Modifier[] => {
    const { modifiers } = ctx.props;
    return sourceModifiers.length ? [...(modifiers ?? []), ...sourceModifiers] : (modifiers ?? []);
  };

  /**
   * How far the content the drag started in has moved on screen: the container itself,
   * less what its content scrolled inside it. Kept as it was once the container is gone.
   */
  const shiftOf = (containerRect: Rect | null): Coordinates => {
    const previous = ctx.containerShift.value;
    if (!containerRect || !containerStart) return previous;
    const { rect, scroll } = containerStart;
    const x = containerRect.left - rect.left - (container!.scrollLeft - scroll.x);
    const y = containerRect.top - rect.top - (container!.scrollTop - scroll.y);
    return x === previous.x && y === previous.y ? previous : (ctx.containerShift.value = { x, y });
  };

  const applyModifiers = (current: Active, offset: Coordinates): Coordinates => {
    let result = offset;
    // Where it is now: the page may have scrolled since the drag started.
    const containerRect = container?.isConnected ? getRect(container) : null;
    const containerShift = shiftOf(containerRect);
    for (const modifier of getModifiers()) {
      result = modifier({
        transform: result,
        active: current,
        activeRect: current.rect,
        overlayRect: getOverlayRect(current, result),
        origin: ctx.origin,
        containerRect,
        containerShift,
        windowRect: getWindowRect(),
        over: ctx.over.value,
      });
    }
    return result;
  };

  /**
   * `overlayFit: 'slot'`: the overlay takes the size of the slot the item will land in,
   * so it matches the items of the list it hovers. Layout sizes (`offset*`) ignore
   * FLIP translates; each axis is taken on its own, so a thin custom placeholder
   * still passes its width.
   */
  const updateFitSize = (current: Active) => {
    const { fitSize } = ctx;
    // Without an overlay the element itself moves: it keeps its size.
    if (ctx.props.overlayFit === 'source' || !previewEnabled) return;
    const slot = ctx.draggables.get(ctx.landingKey.value ?? current.id)?.getElement();
    if (!slot?.isConnected) return;
    const size =
      slot instanceof HTMLElement
        ? { width: slot.offsetWidth, height: slot.offsetHeight }
        : getLayoutRect(slot);
    const { width: sourceWidth, height: sourceHeight } = current.rect;
    const width = size.width >= sourceWidth * FIT_MIN_RATIO ? size.width : sourceWidth;
    const height = size.height >= sourceHeight * FIT_MIN_RATIO ? size.height : sourceHeight;
    const previous = resize?.to ?? fitSize.value;
    if (previous && Math.abs(previous.width - width) < 0.5 && Math.abs(previous.height - height) < 0.5) {
      return;
    }
    const shown = fitSize.value;
    if (!shown || prefersReducedMotion()) {
      resize = null;
      fitSize.value = { width, height };
      return;
    }
    resize = { from: shown, to: { width, height }, start: performance.now() };
    ctx.loop.requestFrame();
  };

  /** Moves `fitSize` along the running glide; asks for frames until it ends. */
  const stepResize = () => {
    if (!resize) return;
    const { from, to, start } = resize;
    const progress = (performance.now() - start) / RESIZE_DURATION;
    if (progress >= 1) {
      resize = null;
      ctx.fitSize.value = to;
      return;
    }
    // Ease-out: quick at first, settling on the slot size.
    const eased = 1 - (1 - progress) ** 3;
    ctx.fitSize.value = {
      width: from.width + (to.width - from.width) * eased,
      height: from.height + (to.height - from.height) * eased,
    };
    ctx.loop.requestFrame();
  };

  return {
    /** Whether the drag has an overlay; without one the element itself moves. */
    get enabled() {
      return previewEnabled;
    },
    /** The drag's own component (the item's, else its list's); `null`: the provider's slot or the clone. Reactive. */
    get component(): Component | null {
      if (!previewEnabled || !source) return null;
      const overlay = source.getOverlay();
      return typeof overlay === 'boolean' ? null : overlay;
    },
    /** The drag's own drop animation (the item's, else its list's); `undefined`: the provider's. */
    get dropAnimation(): DropAnimation | undefined {
      return source?.getDropAnimation?.();
    },
    get previewIds(): readonly Key[] {
      return previewIds;
    },
    getPreview: (id: Key): PreviewSource | undefined => previews.get(id),
    takePreviews,
    getOverlayRect,
    getModifiers,
    applyModifiers,
    updateFitSize,
    stepResize,

    /**
     * Takes a drag's overlay from the draggable's `overlay` option: whether there is one
     * is decided here, its component is read live. The grabbed item's clone is taken
     * synchronously, before the placeholder re-renders. Overlay components get it too:
     * they may show it (`DragPreview`).
     */
    pickUp(id: Key, entry: DraggableEntry, caught?: ReadonlyMap<Key, PreviewSource>) {
      source = entry;
      previewEnabled = entry.getOverlay() !== false;
      // A drag that catches a landing overlay takes its clones: the slots are still hidden.
      previews = new Map(previewEnabled ? caught : undefined);
      const preview = previewEnabled && !previews.has(id) ? takePreview(id) : null;
      if (preview) previews.set(id, preview);
      previewIds = [];
    },

    /**
     * The box of a new drag, at the source size; `parent` is the container of
     * `restrictToParent`. The modifiers run: `origin` and `over` must be set. `caught`:
     * the box of a landing overlay the drag catches in flight, where the box starts.
     */
    place(current: Active, coordinates: Coordinates, modifiers: readonly Modifier[], parent: Element | null, caught?: Rect | null) {
      sourceModifiers = modifiers;
      container = parent;
      containerStart = parent?.isConnected
        ? { rect: getRect(parent), scroll: { x: parent.scrollLeft, y: parent.scrollTop } }
        : null;
      ctx.containerShift.value = { x: 0, y: 0 };
      resize = null;
      if (caught) {
        // The box goes on from where it was caught, at its size there, held where it was
        // pressed: the item's rect moved so that point is under the pointer. It glides to
        // the slot's size as any box does. Pointer, box and drop offset stay consistent:
        // the origin moves back by the offset the drag starts with.
        ctx.fitSize.value = { width: caught.width, height: caught.height };
        grab = getFraction(caught, coordinates);
        const offset = {
          x: coordinates.x - grab.x * current.rect.width - current.rect.left,
          y: coordinates.y - grab.y * current.rect.height - current.rect.top,
        };
        ctx.origin = { x: coordinates.x - offset.x, y: coordinates.y - offset.y };
        ctx.transform.value = offset;
        return;
      }
      ctx.fitSize.value = { width: current.rect.width, height: current.rect.height };
      // Where the pointer holds the box on the first frame, after modifiers (the center
      // with snapCenterToCursor). The box has the source size here: no grab applies yet.
      const first = applyModifiers(current, { x: 0, y: 0 });
      grab = getFraction(offsetRect(current.rect, first.x, first.y), coordinates);
    },

    /**
     * The drop is decided: what the overlay shows goes to the flight that lands it (its
     * clones, its component and own drop animation, its size), read as they are now.
     */
    release() {
      return {
        previews: previews as ReadonlyMap<Key, PreviewSource>,
        previewIds: previewIds as readonly Key[],
        component: this.component,
        dropAnimation: this.dropAnimation,
        fitSize: ctx.fitSize.value,
      };
    },

    end() {
      ctx.fitSize.value = null;
      resize = null;
      previews = new Map();
      previewIds = [];
      previewEnabled = false;
      source = null;
      sourceModifiers = [];
      container = null;
      containerStart = null;
      ctx.containerShift.value = { x: 0, y: 0 };
    },
  };
}
