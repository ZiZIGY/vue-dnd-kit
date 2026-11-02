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
import type { AutoAnimation, DropAnimation, LayoutAnimation } from './animation';
import type { ExternalAccept, ExternalData, NativeDragOptions } from './native';
import type { Modifier } from './collision';
import type { AutoScrollOptions } from './provider';

// ─── Sortable ──────────────────────────────────────────────────────────────────

/** How a list lays out its items: a column (`'vertical'`), a row (`'horizontal'`) or a grid that wraps (`'grid'`). */
export type SortableStrategy = 'vertical' | 'horizontal' | 'grid';
/** What hovering an item does: `'sort'` makes room (the items between shift), `'swap'` exchanges the two items. */
export type SortableBehavior = 'sort' | 'swap';
/**
 * How a drag shows where it goes: `'item'`, the dragged item's slot moves through the list;
 * `'indicator'`, the list stays as it is and `indicator` says where the drop goes (you draw the line).
 */
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
/**
 * What a drop outside every target does: `'placeholder'` keeps the items where their slot
 * is, `'cancel'` sends them back, `'remove'` takes them out of their list.
 */
export type DropOutside = 'placeholder' | 'cancel' | 'remove';

/** What a function `group.put` is asked with: the items that would enter the list. */
export interface SortablePutContext<T = unknown> {
  /** Keys of the items. */
  keys: Key[];
  /** The items (for a plain draggable, the item `createItem` made). */
  items: T[];
  /** The types of the items, together. */
  types: string[];
  /** Source list, `null` for external draggables. */
  from: Key | null;
  /** Id of the list asked. */
  to: Key;
}

/** A list's group: the lists that exchange items, and whether items may leave and enter this one. */
export interface SortableGroupOptions<T = unknown> {
  /** Lists and trees with the same name exchange items. */
  name: string;
  /** Can items leave this list: move, copy (`'clone'`, a palette) or not at all. */
  pull?: boolean | 'clone';
  /**
   * Can items enter this list: `true` (default), `false`, a type or types the items must
   * have (as a drop target's `accept`: with `acceptMode`, all of them or some), or a
   * function of the drag.
   */
  put?: boolean | string | string[] | ((context: SortablePutContext<T>) => boolean);
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
  /** Keys of the dragged items. */
  keys: Key[];
  /** The items that land: the dragged ones, their copies (`mode: 'copy'`), or the item `createItem` made (`'insert'`). */
  items: T[];
  /** Keys that go through: all of them, unless the list or `onBeforeDrop` takes only some. */
  accepted: Key[];
  /** Keys that fly back to where they were. */
  rejected: Key[];
  /** Where the drag started: the list and index of the active item. `list` is `null` for a plain draggable from outside. */
  from: { list: Key | null; index: number };
  /** `index` is -1 when nothing landed: the items left their lists (`e.source.remove()`, `dropOutside: 'remove'`). */
  to: { list: Key; index: number };
  /** The drop stays in the list the drag started from. */
  sameList: boolean;
  /** What the drop does (see `DragMode`). */
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
  /** A drag from outside the page (`external`): what it carried, with its data (it was dropped). */
  external?: ExternalData;
}

/** Where the drop goes with `placeholder: 'indicator'`: the list doesn't move, you draw the line. */
export interface SortableIndicator {
  /** Id of the list (or tree) the drop goes into. */
  list: Key;
  /** Insertion position in the list as rendered. */
  index: number;
  /** Item the indicator is attached to; `null` in an empty list. */
  key: Key | null;
  /**
   * Side of `key` the line goes on. `'inside'` (trees): the middle of a row that takes
   * the dragged nodes is hovered, the drop goes into it as its first child. `'swap'`
   * (`behavior: 'swap'`): `key` is the item the drop exchanges with; mark the item itself.
   */
  side: 'before' | 'after' | 'inside' | 'swap';
  /** Trees: depth the dropped nodes get (roots are 0), e.g. to indent the line. */
  depth?: number;
  /** Trees: parent the dropped nodes get, `null` at the root level. */
  parentKey?: Key | null;
}

/**
 * Options of `makeSortableList`. A component may make several lists (and trees): each
 * item rendered in it joins the innermost one whose element holds it.
 *
 * Options take a value, a ref or a getter (`overlay`, `overOverlay`, `dropAnimation`,
 * `overDropAnimation`, `animation`: a value or a ref) and are read when the list needs
 * them, so a change applies to the next drag at the latest.
 * Exceptions: `id` and `group` are read once, when the list is created; `items` is the
 * model itself; functions (`getKey`, `filter`, `clone`, `createItem`, the callbacks) are
 * passed as they are.
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
  /**
   * Shows only the items it returns `true` for (a search, a tag): `items` (the returned
   * one) has them, and a drag sorts among them. The others keep their places in the source:
   * a drop writes the whole array, each hidden item still after the shown one it followed
   * (after the nearest that stayed, when that one moved). Reactive: what it reads (a query
   * ref) applies at once. `e.to.index` and `activeIndex` count the shown items.
   */
  filter?: (item: T) => boolean;
  /** Default: `useId()`, stable between server and client render. Read once. */
  id?: Key;
  /** What people call the list: screen reader texts say it instead of its id (`position 2 of 5 in Garden`). */
  label?: MaybeReadonlyRefOrGetter<string | undefined>;
  /** Anything to tell about the list as a drop target: events carry it as `over.data` while a drag is over it. */
  data?: MaybeReadonlyRefOrGetter<unknown>;
  /**
   * How a press on this list's items starts a drag, instead of the provider's `activation`
   * (an item's own wins). Read when a press starts.
   */
  activation?: MaybeReadonlyRefOrGetter<ActivationOptions | undefined>;
  /**
   * Overlay component for this list's items (an item's own `overlay` wins). It receives
   * `OverlayProps` and stays for the whole drag, also over other lists, unless the target
   * under the drag has an overlay of its own (`overOverlay`). A ref switched mid-drag
   * swaps it at once.
   */
  overlay?: MaybeReadonlyRef<Component | undefined>;
  /**
   * What the overlay shows while a drag this list accepts is over it, whatever list it
   * comes from: a component that gets `OverlayProps` and the drag's own overlay as its
   * default slot (see `DroppableOptions.overOverlay`). Read live.
   */
  overOverlay?: MaybeReadonlyRef<Component | undefined>;
  /**
   * How the overlay lands when a drag of this list's items ends, instead of the
   * provider's `dropAnimation` (an item's own wins; a drop target's wins over both).
   * Read at the drop.
   */
  dropAnimation?: MaybeReadonlyRef<DropAnimation | undefined>;
  /**
   * How the overlay lands when it is dropped into this list, whatever list it comes from:
   * wins over the dragged item's and the provider's `dropAnimation`. Read at the drop.
   */
  overDropAnimation?: MaybeReadonlyRef<DropAnimation | undefined>;
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
  group?: string | SortableGroupOptions<T>;
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
   *
   * A drag from outside the page (`external`) is asked twice: while it is held, for the
   * item that shows where it goes (only `active.external.fileTypes` and `types` are known
   * then), and at the drop, with its data (`active.external.ready`), for what is
   * inserted. A list of items inserts them all where the slot was: a file each.
   */
  createItem?: (active: Active) => T | T[] | undefined;
  /**
   * Takes drags from outside the page: files, links, text (see `ExternalAccept`). The list
   * makes room for them as for a plain draggable, with `createItem`, which it needs. Items
   * of its group dragged in from another window of the app (`native`) need neither option:
   * they come in as themselves. A value, a ref or a getter, read live.
   */
  external?: MaybeReadonlyRefOrGetter<ExternalAccept | undefined>;
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
   * items (see `AutoAnimation`). Default: the provider's `animateChanges`, off unless set
   * there. Read when `items` changes.
   */
  animateChanges?: MaybeReadonlyRefOrGetter<AutoAnimation | undefined>;
  /**
   * The list's own size follows its items: when a drag brings an item in or takes one out
   * (and at the drop, and for the changes `animateChanges` shows), it grows or shrinks to its new
   * size with `animation`'s duration and easing instead of jumping, and what is around it
   * moves along. Default `true`; `false` lets it jump. Read on every change.
   */
  animateSize?: MaybeReadonlyRefOrGetter<boolean | undefined>;
  /** Overrides the provider's `autoScroll` for this list's scroll container. Read when the drag starts. */
  autoScroll?: MaybeReadonlyRefOrGetter<boolean | AutoScrollOptions | undefined>;
  /**
   * The element that takes drops for the list, default the list element itself: e.g. the
   * whole column around a short list of cards, so a card let go below the last one still
   * lands in the list (at its end). The items stay in the list element.
   */
  dropzone?: MaybeElementRef;
  /** `true`: its items can't be dragged, and it takes no items. */
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

/** What `makeSortableList` returns. */
export interface SortableListReturn<T> {
  /** The list's id: the `id` option, or the one made for it. */
  id: Key;
  /** Draft order: render this, not the source array. */
  items: ComputedRef<T[]>;
  /** A drag is over the list. */
  isOver: ComputedRef<boolean>;
  /** Something is being dragged and this list takes it. */
  isAccepting: ComputedRef<boolean>;
  /** Indicator mode: where the drop goes in this list; `null` when not here. */
  indicator: ComputedRef<SortableIndicator | null>;
  /**
   * The row a virtualizer must keep mounted: the slot while it is in this list (a copy, a
   * created item), otherwise the dragged item; `null` without a drag.
   */
  activeKey: ComputedRef<Key | null>;
  /** Index of the active item in this list's draft, -1 when it isn't here. */
  activeIndex: ComputedRef<number>;
  /** Size of the dragged item at drag start: e.g. for the size of a virtual row it holds. */
  activeSize: ComputedRef<Size | null>;
  /** Animates layout changes the library didn't cause (e.g. a virtualizer re-measure). */
  captureLayout(): void;
}

/**
 * Pass `id` or `item` (`id` wins when both are given). Sortable keys must come from the
 * data: an automatic id would change whenever the component is recreated (moved to
 * another list, recycled by a virtual list), and the drag would lose the item.
 *
 * Options but `canDrag` take a value, a ref or a getter (`overlay`, `dropAnimation`: a
 * value or a ref) and mean what they mean on `makeDraggable`. There is no `keyboardMode`:
 * the keyboard moves a sortable item by slots.
 */
export interface SortableItemOptions<TData = unknown> {
  /** Key of the item in its list. A getter keeps it current in virtual lists. */
  id?: MaybeReadonlyRefOrGetter<Key>;
  /**
   * The item this element renders, e.g. `() => props.task`. Its key comes from the
   * owning list's (or tree's) `getKey`, by default `item.id`.
   */
  item?: MaybeReadonlyRefOrGetter<unknown>;
  /** Overlay component for this item; wins over the list's `overlay`. A ref switched mid-drag swaps it at once. */
  overlay?: MaybeReadonlyRef<Component | undefined>;
  /** How the overlay lands when a drag of this item ends; wins over the list's `dropAnimation`. Read at the drop. */
  dropAnimation?: MaybeReadonlyRef<DropAnimation | undefined>;
  /** Modifiers for drags of this item, after the provider's; win over the list's `modifiers`. */
  modifiers?: MaybeReadonlyRefOrGetter<Modifier[] | undefined>;
  /** Locks drags of this item to one axis (`'x'`, `'y'`); wins over the list's `axis`. */
  axis?: MaybeReadonlyRefOrGetter<'x' | 'y' | undefined>;
  /** Element or selector inside the item that starts the drag (and gets the attributes). */
  handle?: MaybeReadonlyRefOrGetter<MaybeElement | string>;
  /** `true`: the item can't be dragged (as every item of a disabled list). */
  disabled?: MaybeReadonlyRefOrGetter<boolean>;
  /** Its type or types, for `group.put` rules and drop targets' `accept`. Default: the name of its list's group. */
  type?: MaybeReadonlyRefOrGetter<string | string[] | undefined>;
  /** Anything the drag should carry: events and drop targets read it as `active.data`. */
  data?: MaybeReadonlyRefOrGetter<TData>;
  /**
   * What people call the item: screen reader texts say it instead of its key (`Picked up
   * Tomato at position 2 of 5 in Garden`). Events carry it as `active.label` and in `items`.
   */
  label?: MaybeReadonlyRefOrGetter<string | undefined>;
  /** Overrides its list's (or tree's) `activation` and the provider's. Read when a press starts. */
  activation?: MaybeReadonlyRefOrGetter<ActivationOptions | undefined>;
  /** Extra gate, e.g. drag only while a key is held. */
  canDrag?: (event: PointerEvent | KeyboardEvent) => boolean;
  /**
   * Set role/tabindex/aria-* attributes (default `true`), never overriding the user's
   * own. Live: turning it off removes what the library set.
   */
  attributes?: MaybeReadonlyRefOrGetter<boolean | undefined>;
  /**
   * A mouse drag of it is the browser's own drag, which can leave the page (see
   * `DraggableOptions.native`). It carries the item too: the lists of its group in another
   * window of the app take it, and when one does, it leaves this list (`'move'`).
   */
  native?: MaybeReadonlyRefOrGetter<boolean | NativeDragOptions | undefined>;
}

/** What `makeSortableItem` returns. */
export interface SortableItemReturn {
  /** This item is being dragged (also true for the other items of a multi-drag), or its overlay is still landing. */
  isDragging: ComputedRef<boolean>;
  /**
   * This element is a slot a dragged item will land in: the active item's, and in
   * multi-drag `'group'` mode the slots of the items travelling with it.
   */
  isPlaceholder: ComputedRef<boolean>;
  /** It is in the provider's selection: a drag of one selected item carries them all. Set it to select or deselect. */
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
