/**
 * The overlay of a drag: what it shows (whether there is one, its component, the clones
 * of the dragged items taken at pickup) and its box (where it is for a drag offset, at
 * which size, and the modifiers that move it). `overlayFit: 'slot'` glides the box to
 * the size of the slot the item will land in, around the point where the pointer holds it.
 */

import type { Component } from 'vue';
import type { Active, Coordinates, Key, Modifier, Rect, Size } from '../../types';
import {
  getFraction,
  getLayoutRect,
  getRect,
  getWindowRect,
  offsetRect,
  prefersReducedMotion,
  resizeAround,
} from '../../animation/layout';
import { clonePreview } from '../clone';
import type { ManagerContext } from './state';

/** A clone taken at pickup and the rect of its source then (`DragPreview`). */
export interface PreviewSource {
  element: HTMLElement;
  rect: Rect;
}

/**
 * Most items cloned at pickup: the grabbed one and the others next to it in drop order.
 * Cloning lays out each clone and reads its computed styles (`snapshot.ts`), the most
 * expensive part of a pickup, and a column of more clones covers most of the screen;
 * the overlay counts the rest instead.
 */
const MAX_PREVIEWS = 5;
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
  /** Overlay component of the drag, taken at start: the source may unmount mid-drag. */
  let overlayComponent: Component | null = null;
  /** Where the pointer holds the overlay box, as fractions of its size: it resizes around this point. */
  let grab: Coordinates = { x: 0, y: 0 };
  let containerRect: Rect | null = null;
  /** Modifiers of the draggable the drag started from, taken at start like the overlay. */
  let sourceModifiers: readonly Modifier[] = [];
  /**
   * Glide of `fitSize` to a new slot size. It runs in the frame loop rather than as a
   * CSS transition: the box resizes around the grab point, so its position depends
   * on its size, and collision and modifiers must see the box as it is shown.
   */
  let resize: { from: Size; to: Size; start: number } | null = null;

  // ─── Content ─────────────────────────────────────────────────────────────────

  const takePreview = (id: Key): PreviewSource | null => {
    const entry = ctx.draggables.get(id);
    const element = entry?.getElement();
    if (!entry || !element?.isConnected) return null;
    const to = ctx.props.overlayTo;
    // Sortable items (they have a container) stay opaque: their background is often the list's.
    return {
      element: clonePreview(element, {
        opaque: !!entry.getContainer,
        container: typeof to === 'string' ? document.querySelector(to) : to,
      }),
      rect: getRect(element),
    };
  };

  /**
   * Clones of the other dragged items, next to the active one in drop order (the overlay
   * column's order, else `ids`). Runs right after `onDragStart`: the sortable layer has
   * set the order, and the DOM hasn't re-rendered yet.
   */
  const takePreviews = (current: Active) => {
    const order = ctx.overlayColumn.value?.ids ?? current.ids;
    const at = Math.max(order.indexOf(current.id), 0);
    const from = Math.max(0, Math.min(at - ((MAX_PREVIEWS - 1) >> 1), order.length - MAX_PREVIEWS));
    const ids = order.slice(from, from + MAX_PREVIEWS);
    for (const id of ids) {
      if (previews.has(id)) continue;
      const preview = takePreview(id);
      if (preview) previews.set(id, preview);
    }
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

  const applyModifiers = (current: Active, offset: Coordinates): Coordinates => {
    let result = offset;
    for (const modifier of getModifiers()) {
      result = modifier({
        transform: result,
        active: current,
        activeRect: current.rect,
        overlayRect: getOverlayRect(current, result),
        origin: ctx.origin,
        containerRect,
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
    get component() {
      return overlayComponent;
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
     * Takes a drag's overlay from the draggable's `overlay` option. The grabbed item's
     * clone is taken synchronously, before the placeholder re-renders. Overlay components
     * get it too: they may show it (`DragPreview`).
     */
    pickUp(id: Key, overlay: boolean | Component) {
      previewEnabled = overlay !== false;
      overlayComponent = typeof overlay === 'boolean' ? null : overlay;
      const preview = previewEnabled ? takePreview(id) : null;
      previews = new Map(preview ? [[id, preview]] : []);
      previewIds = [];
    },

    /**
     * The box of a new drag, at the source size; `container` is measured for
     * `restrictToParent`. The modifiers run: `origin` and `over` must be set.
     */
    place(current: Active, coordinates: Coordinates, modifiers: readonly Modifier[], container: Element | null) {
      sourceModifiers = modifiers;
      containerRect = container ? getRect(container) : null;
      ctx.fitSize.value = { width: current.rect.width, height: current.rect.height };
      resize = null;
      // Where the pointer holds the box on the first frame, after modifiers (the center
      // with snapCenterToCursor). The box has the source size here: no grab applies yet.
      const first = applyModifiers(current, { x: 0, y: 0 });
      grab = getFraction(offsetRect(current.rect, first.x, first.y), coordinates);
    },

    end() {
      ctx.fitSize.value = null;
      resize = null;
      previews = new Map();
      previewIds = [];
      previewEnabled = false;
      overlayComponent = null;
      sourceModifiers = [];
      containerRect = null;
    },
  };
}
