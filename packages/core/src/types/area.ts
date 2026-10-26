/** `makeDragArea`. */

import type { ComputedRef } from 'vue';
import type { ActivationOptions, MaybeReadonlyRefOrGetter } from './primitives';
import type { Modifier } from './collision';
import type { AutoScrollOptions } from './provider';

// ─── Drag area ─────────────────────────────────────────────────────────────────

/**
 * Options of `makeDragArea`: rules for the drags that start inside the area's element
 * (draggables and sortable items alike), so one provider can serve the whole app while
 * parts of the page drag their own way. The closest area wins when areas are nested.
 *
 * Every option takes a value, a ref or a getter and is read when it is needed: when a
 * press starts (`activation`, `disabled`) or when the drag starts.
 */
export interface DragAreaOptions {
  /**
   * Locks the drags to one axis, after the modifiers. A draggable's own `axis` (or its
   * list's) wins.
   */
  axis?: MaybeReadonlyRefOrGetter<'x' | 'y' | undefined>;
  /**
   * Modifiers for the drags, after the provider's and before the draggable's own (or its
   * list's): e.g. `[snapToGrid(20)]` for a board.
   */
  modifiers?: MaybeReadonlyRefOrGetter<Modifier[] | undefined>;
  /** `true`: the drags stay inside the area's element (after the modifiers, before the axis lock). */
  restrictToArea?: MaybeReadonlyRefOrGetter<boolean | undefined>;
  /**
   * Overrides the provider's `autoScroll` for the area's scroll container: the element
   * itself, or its closest scrollable ancestor. `false` turns it off there. Unlike the other
   * options it applies to every drag that scrolls the container, wherever it started.
   */
  autoScroll?: MaybeReadonlyRefOrGetter<boolean | AutoScrollOptions | undefined>;
  /**
   * Activation of the drags per pointer kind, between the draggable's own (which wins)
   * and the provider's: e.g. a longer touch press in a scrolling feed.
   */
  activation?: MaybeReadonlyRefOrGetter<ActivationOptions | undefined>;
  /**
   * `true`: no drag starts in the area, nor in the areas inside it (unlike the other
   * options, which come from the closest area). Its draggables report `aria-disabled`.
   */
  disabled?: MaybeReadonlyRefOrGetter<boolean | undefined>;
}

export interface DragAreaReturn {
  /** A drag that started in this area is running (until its drop is decided). */
  isDragging: ComputedRef<boolean>;
  /** Auto-scroll is moving the area's scroll container (the element, or its closest scrollable ancestor). */
  isAutoScrolling: ComputedRef<boolean>;
}
