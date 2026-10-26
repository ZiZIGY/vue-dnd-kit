/** `makeSortableList` and `makeSortableItem`. */

import type { Component, ComputedRef, Ref, WritableComputedRef } from 'vue';
import type {
  ActivationOptions,
  Key,
  MaybeElement,
  MaybeElementRef,
  MaybePromise,
  MaybeReadonlyRef,
  MaybeReadonlyRefOrGetter,
  Size,
} from './primitives';
import type { AcceptMode, Active, BeforeDropResult, DragMode } from './drag';
import type { AutoAnimation, LayoutAnimation } from './animation';
import type { Modifier } from './collision';
import type { AutoScrollOptions } from './provider';

// ─── Sortable ──────────────────────────────────────────────────────────────────

export type SortableStrategy = 'vertical' | 'horizontal' | 'grid';
export type SortableBehavior = 'sort' | 'swap';
export type SortablePlaceholder = 'item' | 'indicator';
/**
 * What the other selected items do in a multi-drag:
 * - `'group'`: they leave their places and travel with the active item as contiguous
 *   placeholders, so while hovering the list already shows the result of the drop;
 * - `'gaps'`: they stay in place until the drop;
 * - `'stack'`: they collapse into the overlay.
 *
 * The default overlay shows the dragged items in a column along the list (`'group'`,
 * `'gaps'`; a row in horizontal lists, a pile behind the active one in grids), or the active
 * one with a count (`'stack'`).
 */
export type MultipleMode = 'group' | 'gaps' | 'stack';
export type DropOutside = 'placeholder' | 'cancel' | 'remove';

export interface SortablePutContext {
  keys: Key[];
  items: unknown[];
  types: string[];
  /** Source list, `null` for external draggables. */
  from: Key | null;
  to: Key;
}

export interface SortableGroupOptions {
  name: string;
  /** Can items leave this list: move, copy (`'clone'`, a palette) or not at all. */
  pull?: boolean | 'clone';
  /** Can items enter this list. */
  put?: boolean | ((context: SortablePutContext) => boolean);
}

/**
 * A source of sortable items. A writable ref: the library writes each drop into it. A
 * read-only one (a getter, a readonly ref, a computed: an immutable store, server state,
 * a store changed only through actions): you apply each drop from `event.result`, after
 * `event.preventDefault()` (see `SortableDropEvent`).
 */
export type SortableItems<T> = Ref<T[]> | Readonly<Ref<readonly T[]>> | (() => readonly T[]);

/**
 * A drop on a sortable list or tree. Its hooks run in order: `onBeforeDrop` decides,
 * `onDrop` is told, then the default action writes `result` into the `items` of every
 * list it names, and the overlay lands. `preventDefault()` in either hook skips that
 * write, so you can apply `result` yourself.
 */
export interface SortableDropEvent<T = unknown> {
  keys: Key[];
  items: T[];
  accepted: Key[];
  rejected: Key[];
  from: { list: Key | null; index: number };
  /** `index` is -1 when nothing landed: the items left their lists (`e.source.remove()`, `dropOutside: 'remove'`). */
  to: { list: Key; index: number };
  sameList: boolean;
  mode: DragMode;
  /**
   * `mode: 'swap'`: the item the dragged one was exchanged with. It moved the other way,
   * `from` the place the dragged item took (`to` above) `to` the one the dragged item
   * started at (`from` above); between lists, into the dragged item's list.
   */
  partner?: { key: Key; item: T; from: { list: Key; index: number }; to: { list: Key; index: number } };
  /**
   * The new items of every list the drop changes, by list id: exactly what the default
   * write puts in their `items`, as new arrays. Moves, copies, created items, a partial
   * accept, both sides of a swap and items removed (`e.source.remove()` in a target
   * inside an item, a trash zone, `dropOutside: 'remove'`) are all in it; a list the drop
   * leaves as it is isn't. A tree's entry is a new root array: the nodes on the changed
   * paths are copies (`withChildren`), untouched subtrees are shared, your nodes are never
   * mutated. In `onBeforeDrop` it is the drop as it stands before the hook answers
   * (returning some keys changes it); `onDrop` gets the final one.
   */
  result: ReadonlyMap<Key, T[]>;
  /**
   * Skips the default write, into every list in `result` (writing only some would lose
   * or duplicate items). Apply `result` yourself in `onDrop`, or before an async
   * `onBeforeDrop` resolves, and the overlay lands in the new order. Applied nowhere,
   * the lists stay as they were and the overlay flies back (copies and created items,
   * which have no place yet, fade out).
   */
  preventDefault(): void;
  /** `preventDefault()` was called, in `onBeforeDrop` or `onDrop`. */
  readonly defaultPrevented: boolean;
}

export interface SortableIndicator {
  list: Key;
  /** Insertion position in the list as rendered. */
  index: number;
  /** Item the indicator is attached to; `null` in an empty list. */
  key: Key | null;
  /**
   * Side of `key` the line goes on. `'inside'` (trees): the middle of a row that takes
   * the dragged nodes is hovered, the drop goes into it as its first child.
   */
  side: 'before' | 'after' | 'inside';
  /** Trees: depth the dropped nodes get (roots are 0), e.g. to indent the line. */
  depth?: number;
  /** Trees: parent the dropped nodes get, `null` at the root level. */
  parentKey?: Key | null;
}

/**
 * Options of `makeSortableList`. One list (or tree) per component: it provides the
 * context its items read, so a second one in the same component would take the first
 * one's items (development builds warn about it).
 *
 * Options take a value, a ref or a getter (`overlay`, `animation`: a value or a ref) and
 * are read when the list needs them, so a change applies to the next drag at the latest.
 * Exceptions: `id` and `group` are read once, when the list is created; `items` is the
 * model itself; functions (`getKey`, `clone`, `createItem`, the callbacks) are passed as
 * they are.
 */
export interface SortableListOptions<T> {
  /**
   * Source of truth. A writable ref takes the new array on drop, right after `onDrop`.
   * A read-only source (a getter, a readonly ref, a computed) can't: call
   * `event.preventDefault()` and apply `event.result` yourself. Development builds warn
   * about a drop left to the library there, which then changes nothing.
   */
  items: SortableItems<T>;
  /** Default: `item.id`, or the item itself for primitives. Also keys `makeSortableItem({ item })`. */
  getKey?: (item: T) => Key;
  /** Default: `useId()`, stable between server and client render. Read once. */
  id?: Key;
  /**
   * Overlay component for this list's items (an item's own `overlay` wins). It receives
   * `OverlayProps` and is kept for the whole drag, also over other lists. Read when the
   * drag starts.
   */
  overlay?: MaybeReadonlyRef<Component | undefined>;
  /**
   * Modifiers for drags of this list's items, applied after the provider's `modifiers`
   * (an item's own `modifiers` win): e.g. `[restrictToVerticalAxis]` to keep a vertical
   * list's items on their axis. Read when the drag starts.
   */
  modifiers?: MaybeReadonlyRefOrGetter<Modifier[] | undefined>;
  /**
   * Locks drags of this list's items to one axis: `'y'` for a vertical list, `'x'` for a
   * horizontal one (an item's own `axis` wins). The lock comes after the modifiers, so it
   * holds whatever they do. Read when the drag starts.
   */
  axis?: MaybeReadonlyRefOrGetter<'x' | 'y' | undefined>;
  /** Lists with the same group name exchange items. Default: a group of its own. Read once. */
  group?: string | SortableGroupOptions;
  /** Multi-drag of items of several types: `'all'` (default) or `'some'` must be accepted (`group.put`). */
  acceptMode?: MaybeReadonlyRefOrGetter<AcceptMode | undefined>;
  /** Default `'vertical'`. */
  strategy?: MaybeReadonlyRefOrGetter<SortableStrategy | undefined>;
  /**
   * `'swap'`: the dragged item exchanges places with the hovered one, live; moving back
   * onto it or off the lists reverts. Lists of one group that both swap exchange items
   * between them: the hovered item moves into the dragged one's place, so it must be
   * able to leave its list (`group.pull: true`) and enter the dragged item's
   * (`group.put`). Multi-drag sorts instead. Default `'sort'`.
   */
  behavior?: MaybeReadonlyRefOrGetter<SortableBehavior | undefined>;
  /** `'indicator'`: the list doesn't move, `indicator` says where the drop goes. Default `'item'`. */
  placeholder?: MaybeReadonlyRefOrGetter<SortablePlaceholder | undefined>;
  /** Multi-drag mode of drags that start in this list. Default `'group'`. Read when the drag starts. */
  multiple?: MaybeReadonlyRefOrGetter<MultipleMode | undefined>;
  /** `false`: items can't be reordered inside this list (palettes). */
  sort?: MaybeReadonlyRefOrGetter<boolean | undefined>;
  /** Creates copies (`pull: 'clone'`, copy modifier key). Required for copying. */
  clone?: (item: T) => T;
  /**
   * Accepts plain draggables from outside: creates the item to insert. With the keyboard,
   * an arrow toward the list takes the draggable in (level with it, as moves between
   * lists go), and the created item then moves by slots like any other.
   */
  createItem?: (active: Active) => T | undefined;
  /**
   * A drop outside every target: keep the items where the placeholder is, cancel, or
   * remove them. Default `'placeholder'` (`'cancel'` with `placeholder: 'indicator'`).
   * Read at the drop.
   */
  dropOutside?: MaybeReadonlyRefOrGetter<DropOutside | undefined>;
  /** FLIP animation of this list; default: the provider's `animation`. A value or a ref (a function is a custom animation). */
  animation?: MaybeReadonlyRef<LayoutAnimation | undefined>;
  /**
   * Animates changes of `items` that no drag made: added, removed, moved and filtered
   * items (see `AutoAnimation`). Default: the provider's `animate`, off unless set there.
   * Read when `items` changes.
   */
  animate?: MaybeReadonlyRefOrGetter<AutoAnimation | undefined>;
  /** Overrides the provider's `autoScroll` for this list's scroll container. Read when the drag starts. */
  autoScroll?: MaybeReadonlyRefOrGetter<boolean | AutoScrollOptions | undefined>;
  /**
   * The element that takes drops for the list, default the list element itself: e.g. the
   * whole column around a short list of cards, so a card let go below the last one still
   * lands in the list (at its end). The items stay in the list element.
   */
  dropzone?: MaybeElementRef;
  disabled?: MaybeReadonlyRefOrGetter<boolean>;
  /**
   * Asked before a drop into this list, and before `dropOutside: 'remove'` takes its items
   * out: `false` rejects it (the items fly back), some keys accept only those. May be
   * async: the overlay waits where it was dropped. An error rejects the drop too. See
   * `SortableDropEvent` for `result` and `preventDefault`.
   */
  onBeforeDrop?: (
    event: SortableDropEvent<T>,
  ) => MaybePromise<BeforeDropResult>;
  /**
   * Called once a drop into this list is accepted, before it is written: `items` still
   * holds the old order, `event.result` the new one. Synchronous: the write follows as it
   * returns, unless it called `event.preventDefault()`. Also called on the list the items
   * came from when they are removed (`to.index` is -1).
   */
  onDrop?: (event: SortableDropEvent<T>) => void;
}

export interface SortableListReturn<T> {
  id: Key;
  /** Draft order: render this, not the source array. */
  items: ComputedRef<T[]>;
  isOver: ComputedRef<boolean>;
  isAccepting: ComputedRef<boolean>;
  indicator: ComputedRef<SortableIndicator | null>;
  activeKey: ComputedRef<Key | null>;
  /** Index of the active item in this list's draft, -1 when it isn't here. */
  activeIndex: ComputedRef<number>;
  activeSize: ComputedRef<Size | null>;
  /** Animates layout changes the library didn't cause (e.g. a virtualizer re-measure). */
  captureLayout(): void;
}

/**
 * Pass `id` or `item` (`id` wins when both are given). Sortable keys must come from the
 * data: an automatic id would change whenever the component is recreated (moved to
 * another list, recycled by a virtual list), and the drag would lose the item.
 *
 * Options but `canDrag` take a value, a ref or a getter (`overlay`: a value or a ref) and
 * mean what they mean on `makeDraggable`. There is no `keyboard`: the keyboard moves a
 * sortable item by slots.
 */
export interface SortableItemOptions<TData = unknown> {
  /** Key of the item in its list. A getter keeps it current in virtual lists. */
  id?: MaybeReadonlyRefOrGetter<Key>;
  /**
   * The item this element renders, e.g. `() => props.task`. Its key comes from the
   * owning list's (or tree's) `getKey`, by default `item.id`.
   */
  item?: MaybeReadonlyRefOrGetter<unknown>;
  /** Overlay component for this item; wins over the list's `overlay`. Read when the drag starts. */
  overlay?: MaybeReadonlyRef<Component | undefined>;
  /** Modifiers for drags of this item, after the provider's; win over the list's `modifiers`. */
  modifiers?: MaybeReadonlyRefOrGetter<Modifier[] | undefined>;
  /** Locks drags of this item to one axis (`'x'`, `'y'`); wins over the list's `axis`. */
  axis?: MaybeReadonlyRefOrGetter<'x' | 'y' | undefined>;
  /** Element or selector inside the item that starts the drag (and gets the attributes). */
  handle?: MaybeReadonlyRefOrGetter<MaybeElement | string>;
  disabled?: MaybeReadonlyRefOrGetter<boolean>;
  type?: MaybeReadonlyRefOrGetter<string | string[] | undefined>;
  data?: MaybeReadonlyRefOrGetter<TData>;
  /** Overrides the provider's `activation`. Read when a press starts. */
  activation?: MaybeReadonlyRefOrGetter<ActivationOptions | undefined>;
  /** Extra gate, e.g. drag only while a key is held. */
  canDrag?: (event: PointerEvent | KeyboardEvent) => boolean;
  /**
   * Set role/tabindex/aria-* attributes (default `true`), never overriding the user's
   * own. Live: turning it off removes what the library set.
   */
  attributes?: MaybeReadonlyRefOrGetter<boolean | undefined>;
}

export interface SortableItemReturn {
  /** This item is being dragged (also true for the other items of a multi-drag). */
  isDragging: ComputedRef<boolean>;
  /**
   * This element is a slot a dragged item will land in: the active item's, and in
   * multi-drag `'group'` mode the slots of the items travelling with it.
   */
  isPlaceholder: ComputedRef<boolean>;
  selected: WritableComputedRef<boolean>;
  /**
   * Indicator mode: the list's `indicator` while it is attached to this item, `null`
   * otherwise. `side` says where the line goes; in trees `depth` and `parentKey` say
   * where the drop lands (`side: 'inside'`: into this item).
   */
  indicator: ComputedRef<SortableIndicator | null>;
  /** Index in the rendered draft, -1 when unknown. */
  index: ComputedRef<number>;
}
