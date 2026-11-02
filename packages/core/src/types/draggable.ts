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
import type { AcceptMode, AcceptRule, BeforeDropResult, DnDEndEvent, DnDEvent } from './drag';
import type { Modifier } from './collision';
import type { DropAnimation } from './animation';
import type { ExternalAccept, NativeDragOptions } from './native';

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
  /** Anything the drag should carry: events and drop targets read it as `active.data`. */
  data?: MaybeReadonlyRefOrGetter<TData>;
  /**
   * What people call it: screen reader texts say it instead of the id (`Picked up Tomato`).
   * Events carry it as `active.label` and in `items`.
   */
  label?: MaybeReadonlyRefOrGetter<string | undefined>;
  /** Its type or types, matched by the `accept` rules of drop targets. Without one it fits any target. */
  type?: MaybeReadonlyRefOrGetter<string | string[] | undefined>;
  /** `true`: it can't be dragged (it reports `aria-disabled`). */
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
   * (see the provider's `overlayTransition`). A drop target's `overOverlay` wins while
   * the drag is over it. The clone leaves out the press effects of UI kits (ripples) and
   * any element inside marked `data-dnd-no-clone`.
   */
  overlay?: MaybeReadonlyRef<boolean | Component | undefined>;
  /**
   * How the overlay lands when a drag of this element ends, instead of the provider's
   * `dropAnimation`; a drop target's `overDropAnimation` wins. A value or a ref (a function
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
  keyboardMode?: MaybeReadonlyRefOrGetter<'pixels' | 'droppables' | undefined>;
  /**
   * Set role/tabindex/aria-* attributes (default `true`), never overriding the user's
   * own. The provider's instructions id joins an existing `aria-describedby` as one more
   * token (a UI kit tooltip on the same element keeps its own), and only that token is
   * ever removed. Live: turning it off removes what the library set.
   */
  attributes?: MaybeReadonlyRefOrGetter<boolean | undefined>;
  /**
   * A mouse drag of it is the browser's own drag, which can leave the page: onto the
   * desktop, into another app or tab, into another window of the app. On the page it works
   * as usual (targets, lists that make room), but the browser draws the dragged image
   * instead of the overlay. Touch and keyboard drags stay the library's. `true` carries
   * the `label` as text. Read when a press starts. `canDrag` is asked at the press; the
   * browser decides how far a mouse moves before its drag starts (`activation` doesn't
   * apply to it).
   */
  native?: MaybeReadonlyRefOrGetter<boolean | NativeDragOptions | undefined>;
}

/** What `makeDraggable` returns. */
export interface DraggableReturn {
  /** The draggable's id: the `id` option, or the one made for it. */
  id: ComputedRef<Key>;
  /** It is being dragged (also as another item of a multi-drag), or its overlay is still landing. */
  isDragging: ComputedRef<boolean>;
  /**
   * Offset to apply when `overlay: false`: the drag's, less how far the content the
   * element is in has moved since the start (the page or a container scrolled), so the
   * element stays under the pointer.
   */
  transform: ComputedRef<Coordinates | null>;
  /** It is in the provider's selection: a drag of one selected item carries them all. Set it to select or deselect. */
  selected: WritableComputedRef<boolean>;
}

/** Which halves of a hovered drop target the pointer is in (`DroppableReturn.placement`). */
export interface Placement {
  /** In its top half. */
  top: boolean;
  /** In its right half. */
  right: boolean;
  /** In its bottom half. */
  bottom: boolean;
  /** In its left half. */
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
 * keyboard stops on such a target before moving past its item. A drag never targets what
 * it carries: no target in (or on) a dragged item, nor in the slot one lands in. To move the
 * items out of their list in `onDrop`, call `e.source.remove()`.
 *
 * Every option but the callbacks takes a value, a ref or a getter (`accept`, `overOverlay`,
 * `overDropAnimation`: a value or a ref) and is read live, while a drag looks for its target.
 */
export interface DroppableOptions<TData = unknown> {
  /** Default: `useId()`, stable between server and client render. */
  id?: MaybeReadonlyRefOrGetter<Key>;
  /** Anything to tell about the target: events carry it as `over.data`. */
  data?: MaybeReadonlyRefOrGetter<TData>;
  /** What people call it: screen reader texts say it instead of the id (`over Trash`); events carry it as `over.label`. */
  label?: MaybeReadonlyRefOrGetter<string | undefined>;
  /**
   * What this target takes. Inside a sortable item, one that refuses the drag lets the
   * list sort over it. A value or a ref: a function is a rule.
   */
  accept?: MaybeReadonlyRef<AcceptRule | undefined>;
  /** Default `'all'`. */
  acceptMode?: MaybeReadonlyRefOrGetter<AcceptMode | undefined>;
  /** `true`: drags pass over it as if it weren't there. */
  disabled?: MaybeReadonlyRefOrGetter<boolean>;
  /** Higher wins when targets overlap without nesting (default 0). Sortable items beat containers. */
  priority?: MaybeReadonlyRefOrGetter<number | undefined>;
  /**
   * What the overlay shows while a drag this target accepts is over it: a component that
   * gets `OverlayProps`, rendered instead of the drag's own overlay (the dragged item's
   * component, the provider's slot or the clone), which it gets as its default slot to
   * wrap or leave out (`<slot />`). It stays while the drop lands here. Drags without an
   * overlay (`overlay: false`) keep none. A value or a ref, read live; the change of
   * component animates with the provider's `overlayTransition`. (On draggables, items and
   * lists, `overlay` is the drag's own overlay; sortable lists and trees take this one as
   * `overOverlay` too.)
   */
  overOverlay?: MaybeReadonlyRef<Component | undefined>;
  /**
   * How the overlay lands when it is dropped here, instead of the dragged item's and the
   * provider's `dropAnimation`: `false` leaves it where it was dropped (an overlay
   * component's own animation, a splash, plays there), a function animates it. A value or
   * a ref, read at the drop.
   */
  overDropAnimation?: MaybeReadonlyRef<DropAnimation | undefined>;
  /** A drag came over this target, whether it accepts the drag or not (`event.over.accepted`). */
  onDragEnter?(event: DnDEvent): void;
  /** The drag left this target. */
  onDragLeave?(event: DnDEvent): void;
  /**
   * Asked before a drop on this target goes through, after the monitors' `onBeforeDrop`,
   * if it accepts the drag (see `BeforeDropResult`). May be async: the overlay waits where
   * it was dropped. An error rejects the drop.
   */
  onBeforeDrop?(event: DnDEvent): MaybePromise<BeforeDropResult>;
  /**
   * A drop on this target went through: do what it means (move the item, upload the file).
   * When an `onBeforeDrop` took only some of the dragged items, `event.accepted` has their
   * ids and `event.rejected` the others, which fly back; `active` is still the whole drag.
   */
  onDrop?(event: DnDEndEvent): void;
  /**
   * Takes drags from outside the page: files from the desktop, a link or text from another
   * app or tab (the browser's drag and drop). They work as the library's drags do (`isOver`,
   * `isAccepting`, the events), and `e.external` has their data at the drop. Targets
   * without `external` ignore them. A value, a ref or a getter, read live.
   */
  external?: MaybeReadonlyRefOrGetter<ExternalAccept | undefined>;
}

/** What `makeDroppable` returns. */
export interface DroppableReturn {
  /** The target's id: the `id` option, or the one made for it. */
  id: ComputedRef<Key>;
  /** A drag is over it (one from outside the page too, with `external`). */
  isOver: ComputedRef<boolean>;
  /** Something is being dragged and this target accepts it. */
  isAccepting: ComputedRef<boolean>;
  /** Pointer position relative to the target's halves while it is hovered. */
  placement: ComputedRef<Placement | null>;
}
