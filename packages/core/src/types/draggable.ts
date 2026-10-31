/** `makeDraggable` and `makeDroppable`. */

import type { Component, ComputedRef, WritableComputedRef } from 'vue';
import type {
  ActivationOptions,
  Coordinates,
  Key,
  MaybeElement,
  MaybePromise,
  MaybeReadonlyRef,
  MaybeReadonlyRefOrGetter,
} from './primitives';
import type { AcceptMode, AcceptRule, BeforeDropResult, DnDEvent } from './drag';
import type { Modifier } from './collision';
import type { DropAnimation } from './animation';

// ─── Draggable / droppable ─────────────────────────────────────────────────────

/**
 * Options of `makeDraggable`. Every option but `canDrag` takes a value, a ref or a
 * getter (`overlay`, `dropAnimation`: a value or a ref) and is read when it is needed,
 * so a change applies to the next drag at the latest.
 */
export interface DraggableOptions<TData = unknown> {
  /**
   * Stable id. Pass a getter in virtual lists, where elements are recycled. Default:
   * `useId()`, stable between server and client render but new for every component
   * instance.
   */
  id?: MaybeReadonlyRefOrGetter<Key>;
  data?: MaybeReadonlyRefOrGetter<TData>;
  type?: MaybeReadonlyRefOrGetter<string | string[] | undefined>;
  disabled?: MaybeReadonlyRefOrGetter<boolean>;
  /** Element or selector inside the draggable that starts the drag (and gets the attributes). */
  handle?: MaybeReadonlyRefOrGetter<MaybeElement | string>;
  /** Overrides the provider's `activation`. Read when a press starts. */
  activation?: MaybeReadonlyRefOrGetter<ActivationOptions | undefined>;
  /** Extra gate, e.g. drag only while a key is held. */
  canDrag?: (event: PointerEvent | KeyboardEvent) => boolean;
  /**
   * `true` (default): an overlay follows the pointer, rendered by the provider's
   * `#overlay` slot or as a clone of the element. A component: the overlay renders it
   * with `OverlayProps`, before the slot. `false`: no overlay, the element itself moves
   * via the returned `transform`. A value or a ref (a function is a functional
   * component, so `(props) => <Card {...props} />` works). Whether there is an overlay
   * is decided when the drag starts; a ref switched mid-drag swaps the component at once
   * (see the provider's `overlayTransition`). A drop target's own `overlay` wins while
   * the drag is over it. The clone leaves out the press effects of UI kits (ripples) and
   * any element inside marked `data-dnd-no-clone`.
   */
  overlay?: MaybeReadonlyRef<boolean | Component | undefined>;
  /**
   * How the overlay lands when a drag of this element ends, instead of the provider's
   * `dropAnimation`; a drop target's own `dropAnimation` wins. A value or a ref (a function
   * is the animation), read at the drop.
   */
  dropAnimation?: MaybeReadonlyRef<DropAnimation | undefined>;
  /**
   * Modifiers for drags that start here, applied after the provider's `modifiers`: e.g.
   * `[restrictToVerticalAxis]` for one element on a page where other drags move freely.
   * Read when the drag starts.
   */
  modifiers?: MaybeReadonlyRefOrGetter<Modifier[] | undefined>;
  /**
   * Locks drags that start here to one axis: `'x'` moves only horizontally, `'y'` only
   * vertically. The lock comes after `modifiers` (`restrictToHorizontalAxis` /
   * `restrictToVerticalAxis` last), so it holds whatever they do. Read when the drag starts.
   */
  axis?: MaybeReadonlyRefOrGetter<'x' | 'y' | undefined>;
  /**
   * Arrow keys in free drags: move by pixels (default) or jump between accepting drop
   * targets. Read on every arrow press.
   */
  keyboard?: MaybeReadonlyRefOrGetter<'pixels' | 'droppables' | undefined>;
  /**
   * Set role/tabindex/aria-* attributes (default `true`), never overriding the user's
   * own. The provider's instructions id joins an existing `aria-describedby` as one more
   * token (a UI kit tooltip on the same element keeps its own), and only that token is
   * ever removed. Live: turning it off removes what the library set.
   */
  attributes?: MaybeReadonlyRefOrGetter<boolean | undefined>;
}

export interface DraggableReturn {
  id: ComputedRef<Key>;
  isDragging: ComputedRef<boolean>;
  /**
   * Offset to apply when `overlay: false`: the drag's, less how far the content the
   * element is in has moved since the start (the page or a container scrolled), so the
   * element stays under the pointer.
   */
  transform: ComputedRef<Coordinates | null>;
  selected: WritableComputedRef<boolean>;
}

export interface Placement {
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
}

/**
 * Options of `makeDroppable`.
 *
 * **Drop into an item.** A drop target on a sortable item's element (or inside it) works
 * as everywhere else, with one rule while that item's list would sort the drag: it counts
 * only while the pointer is in the middle of the item (25–75% along the list's axis; x in
 * grids), where the drop goes into the target and the list doesn't move for it. Near the
 * item's edges the list sorts as usual. A target whose `accept` refuses the drag is left
 * out, so the list sorts over the item like over any other (no need to disable it). The
 * keyboard stops on such a target before moving past its item. A target is never one of
 * its own drag: not in (or on) any dragged item, nor in the slot one lands in. To move the
 * items out of their list in `onDrop`, call `e.source.remove()`.
 *
 * Every option but the callbacks takes a value, a ref or a getter (`accept`, `overlay`,
 * `dropAnimation`: a value or a ref) and is read live, while a drag looks for its target.
 */
export interface DroppableOptions<TData = unknown> {
  /** Default: `useId()`, stable between server and client render. */
  id?: MaybeReadonlyRefOrGetter<Key>;
  data?: MaybeReadonlyRefOrGetter<TData>;
  /**
   * What this target takes. Inside a sortable item, one that refuses the drag lets the
   * list sort over it. A value or a ref: a function is a rule.
   */
  accept?: MaybeReadonlyRef<AcceptRule | undefined>;
  /** Default `'all'`. */
  acceptMode?: MaybeReadonlyRefOrGetter<AcceptMode | undefined>;
  disabled?: MaybeReadonlyRefOrGetter<boolean>;
  /** Higher wins when targets overlap without nesting (default 0). Sortable items beat containers. */
  priority?: MaybeReadonlyRefOrGetter<number | undefined>;
  /**
   * What the overlay shows while a drag this target accepts is over it: a component that
   * gets `OverlayProps`, rendered instead of the drag's own overlay (the dragged item's
   * component, the provider's slot or the clone), which it gets as its default slot to
   * wrap or leave out (`<slot />`). It stays while the drop lands here. Drags without an
   * overlay (`overlay: false`) keep none. A value or a ref, read live; the change of
   * component animates with the provider's `overlayTransition`.
   */
  overlay?: MaybeReadonlyRef<Component | undefined>;
  /**
   * How the overlay lands when it is dropped here, instead of the dragged item's and the
   * provider's `dropAnimation`: `false` leaves it where it was dropped (an overlay
   * component's own animation, a splash, plays there), a function animates it. A value or
   * a ref, read at the drop.
   */
  dropAnimation?: MaybeReadonlyRef<DropAnimation | undefined>;
  onDragEnter?(event: DnDEvent): void;
  onDragLeave?(event: DnDEvent): void;
  onBeforeDrop?(event: DnDEvent): MaybePromise<BeforeDropResult>;
  onDrop?(event: DnDEvent): void;
}

export interface DroppableReturn {
  id: ComputedRef<Key>;
  isOver: ComputedRef<boolean>;
  /** Something is being dragged and this target accepts it. */
  isAccepting: ComputedRef<boolean>;
  /** Pointer position relative to the target's halves while it is hovered. */
  placement: ComputedRef<Placement | null>;
}
