/**
 * Public contracts of @vue-dnd-kit/core v3 (see rfcs/0001-v3.md).
 * Modules implemented in later phases already have their types here;
 * implementations must not change these signatures without updating the RFC.
 */

import type {
  Component,
  ComponentPublicInstance,
  ComputedRef,
  Ref,
  WritableComputedRef,
} from 'vue';

// ─── Primitives ────────────────────────────────────────────────────────────────

export type Key = string | number;

/**
 * A value, a getter or any ref (writable, shallow, computed, readonly — e.g. from
 * `useTemplateRef`) that the library only reads. Unlike Vue's `MaybeRefOrGetter`
 * it accepts `Ref<string>` where `string | number` is expected.
 */
export type MaybeReadonlyRefOrGetter<T> = T | Readonly<Ref<T>> | (() => T);

/**
 * A component instance as a template ref gives it. Only `$el` is read: Vue's full
 * `ComponentPublicInstance` would reject every component that declares typed emits
 * (its `$emit` takes any event name), which is most UI kit components.
 */
type ComponentRef = Pick<ComponentPublicInstance, '$el'>;

export type MaybeElement =
  | HTMLElement
  | SVGElement
  | ComponentRef
  | null
  | undefined;
export type MaybeElementRef = MaybeReadonlyRefOrGetter<MaybeElement>;

export interface Coordinates {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
}

export type MaybePromise<T> = T | Promise<T>;

export type DnDStatus =
  | 'idle'
  | 'activating'
  | 'dragging'
  | 'dropping'
  | 'selecting';
export type SensorType = 'pointer' | 'keyboard';
export type PointerKind = 'mouse' | 'touch' | 'pen';

// ─── Activation ────────────────────────────────────────────────────────────────

export interface ActivationConstraint {
  /** Pixels the pointer must travel before the drag starts. */
  distance?: number;
  /** Milliseconds the pointer must be held before the drag starts. */
  delay?: number;
  /** With `delay`: movement in px that aborts activation, so the page can scroll. */
  tolerance?: number;
}

/** Per pointer kind. Defaults: mouse/pen `{ distance: 4 }` (immediate on a handle), touch `{ delay: 200, tolerance: 5 }`. */
export type ActivationOptions = Partial<
  Record<PointerKind, ActivationConstraint>
>;

// ─── Drag state ────────────────────────────────────────────────────────────────

export interface DragItem<T = unknown> {
  id: Key;
  /** Item object when the drag comes from a sortable list. */
  item?: T;
  data: unknown;
  /** Normalized `type` of the draggable; empty means it fits any drop target. */
  type: string[];
}

export interface Active<T = unknown> {
  /** Id of the item the drag started from. */
  id: Key;
  /** Every dragged id, the primary one first (multi-drag). */
  ids: Key[];
  items: DragItem<T>[];
  data: unknown;
  type: string[];
  /** Element the drag started from. It may get detached (virtual lists, cross-list moves). */
  element: HTMLElement;
  /** Layout rect of `element` at drag start. */
  rect: Rect;
  sensor: SensorType;
}

export interface Over {
  id: Key;
  data: unknown;
  element: HTMLElement;
  rect: Rect;
  /** Whether the target's `accept` rule accepts the dragged items. */
  accepted: boolean;
}

export interface DragSource {
  /** Sortable list the dragged items come from. */
  list: Key;
  /** Removes the dragged items from their list (trash zones). */
  remove(): void;
}

export type DragMode = 'move' | 'copy' | 'swap' | 'insert';

export interface DnDEvent<T = unknown> {
  active: Active<T>;
  over: Over | null;
  /** Pointer in viewport coordinates, after modifiers. */
  pointer: Coordinates;
  /** Offset from the drag start, after modifiers. */
  delta: Coordinates;
  /** Present when the dragged items come from a sortable list. */
  source?: DragSource;
}

export interface DnDEndEvent<T = unknown> extends DnDEvent<T> {
  /** False when the drag ended outside every drop target. */
  dropped: boolean;
  /** Ids accepted by `onBeforeDrop` (all dragged ids unless a subset was returned). */
  accepted: Key[];
}

/** `false` rejects the drop (animated return); a list of ids accepts only those items. */
export type BeforeDropResult = boolean | void | Key[];

// ─── Accept rules ──────────────────────────────────────────────────────────────

export interface AcceptContext {
  active: Active;
  items: DragItem[];
  types: string[];
}

/** `'*'` or omitted accepts everything. Untyped items fit any string rule (v2 `groups: []` parity). */
export type AcceptRule =
  | '*'
  | string
  | string[]
  | ((context: AcceptContext) => boolean);

/** `'all'`: every dragged item must match; `'some'`: at least one (the rest can be rejected in `onBeforeDrop`). */
export type AcceptMode = 'all' | 'some';

// ─── Animation ─────────────────────────────────────────────────────────────────

export interface AnimationOptions {
  duration?: number;
  easing?: string;
}

export interface LayoutAnimationContext {
  key: Key;
  element: HTMLElement;
  /** Visual rect before the change. */
  from: Rect;
  /** Layout rect after the change. */
  to: Rect;
  options: Required<AnimationOptions>;
}

export type LayoutAnimation =
  | boolean
  | AnimationOptions
  | ((context: LayoutAnimationContext) => Animation | Promise<unknown> | void);

export interface DropAnimationContext {
  /**
   * The overlay box; it lands on the active item's slot. In a multi-drag the clones of the
   * other items riding inside it (the default overlay's, the `DragPreview`s of a custom
   * one) land on their own slots by themselves (with the default timing when this is a
   * custom function).
   */
  overlay: HTMLElement;
  from: Rect;
  /** Final rect of the dropped item; `null` when it isn't rendered or visible (the overlay fades out). */
  to: Rect | null;
  /**
   * The item isn't shown after a drop on a zone (not a sortable list), e.g. it was dropped
   * into another item (a folder) or a trash zone: the zone's visible rect. The default
   * animation shrinks the overlay into it as it fades out, instead of fading in place.
   */
  into: Rect | null;
  reason: 'drop' | 'cancel';
  active: Active;
  options: Required<AnimationOptions>;
}

export type DropAnimation =
  | boolean
  | AnimationOptions
  | ((context: DropAnimationContext) => Animation | Promise<unknown> | void);

// ─── Collision ─────────────────────────────────────────────────────────────────

export interface CollisionCandidate {
  id: Key;
  /** Visible part of the target: clipped by its scroll containers and the viewport. */
  rect: Rect;
  priority: number;
  /** Nesting level among drop targets: 0 at the top, deeper targets have higher values. */
  depth?: number;
}

export interface CollisionArgs {
  pointer: Coordinates;
  overlayRect: Rect | null;
  candidates: CollisionCandidate[];
  /** Drop targets under the pointer from hit-testing (respects z-order and shadow roots), best first. */
  hits: Key[];
}

/** Returns candidate ids, best first. */
export type CollisionDetection = (args: CollisionArgs) => Key[];

// ─── Modifiers ─────────────────────────────────────────────────────────────────

export interface ModifierArgs {
  /** Offset from the drag start, as modified by the previous modifiers. */
  transform: Coordinates;
  active: Active;
  /** Rect of the dragged element at drag start. */
  activeRect: Rect;
  /**
   * Rect of the overlay box if it were moved by `transform`, at the size it has now. With
   * `overlayFit: 'slot'` the box resizes around the pointer, so it isn't always
   * `activeRect` moved by `transform`.
   */
  overlayRect: Rect;
  /** Pointer position at drag start. */
  origin: Coordinates;
  /** Sortable list container (or parent element) of the dragged item, measured at drag start. */
  containerRect: Rect | null;
  windowRect: Rect;
  over: Over | null;
}

export type Modifier = (args: ModifierArgs) => Coordinates;

// ─── Provider ──────────────────────────────────────────────────────────────────

/**
 * Screen reader texts per event. A text is spoken by the provider's live region (moves
 * once the drag rests for 500 ms); `undefined` leaves the event to the next source (the
 * texts of integrations such as sortable positions, then the defaults); `''` says
 * nothing. A move isn't announced for the target found at pickup: nothing moved yet.
 */
export interface Announcements {
  onDragStart(event: DnDEvent): string | undefined;
  onDragOver(event: DnDEvent): string | undefined;
  onDragEnd(event: DnDEndEvent): string | undefined;
  onDragCancel(event: DnDEvent): string | undefined;
}

export interface KeyboardOptions {
  keys?: { start?: string[]; drop?: string[]; cancel?: string[] };
  /** Pixels per arrow press for free (non-sortable) drags. Default 25. */
  step?: number;
}

export interface AutoScrollOptions {
  /** Edge zone as a fraction of the container size. Default 0.2 (clamped to 24–96px). */
  threshold?: number;
  /** Maximum speed in px per 16ms frame. */
  maxSpeed?: number;
  acceleration?: number;
}

export interface DnDProviderProps {
  collision?: CollisionDetection;
  modifiers?: Modifier[];
  /** Default FLIP animation for sortable lists. */
  animation?: LayoutAnimation;
  dropAnimation?: DropAnimation;
  autoScroll?: boolean | AutoScrollOptions;
  activation?: ActivationOptions;
  keyboard?: KeyboardOptions | false;
  /** Key (KeyboardEvent.key) that turns a move into a copy. Default `'Alt'`; `null` disables. */
  copyModifier?: string | null;
  overlayTo?: string | HTMLElement;
  /**
   * Overlay size while dragging. `'slot'` (default): it follows the slot the item will
   * land in, so over another list it takes the size of that list's items, and the drop
   * needs no resize. It resizes around the pointer, which stays at the same fraction of
   * the box. `'source'`: it keeps the dragged element's size. The default overlay
   * content re-lays out at the new size; it is never scaled.
   */
  overlayFit?: 'slot' | 'source';
  /** Own texts for some events (see `Announcements`); `false` keeps the live region silent. */
  announcements?: Partial<Announcements> | false;
  screenReaderInstructions?: string;
  /** Inject zero-specificity default styles (placeholder opacity, no text selection while dragging). */
  defaultStyles?: boolean;
}

/**
 * What the overlay shows: the props of the provider's `#overlay` slot and of overlay
 * components (`overlay` option of draggables, sortable items, lists and trees).
 */
export interface OverlaySlotProps {
  active: Active;
  /** Every dragged item, the primary one first: one overlay for the whole multi-drag. */
  items: DragItem[];
  /**
   * The drop target under the drag. While a decided drop animates, the target it lands
   * on (as it was at the drop); `null` while a cancelled drag flies back.
   */
  over: Over | null;
  /** Whether `over` accepts the dragged items; `false` when over nothing. */
  accepted: boolean;
  status: DnDStatus;
  mode: DragMode;
}

/**
 * Props of an overlay component, for `defineProps<OverlayProps>()`.
 *
 * The component renders inside the overlay box, which follows the slot size
 * (`overlayFit: 'slot'`) and animates it on drop. Give the root `width: 100%` (and
 * `height: 100%`) to follow that size; a fixed size keeps the component's own.
 */
export type OverlayProps = OverlaySlotProps;

/**
 * Props of `DragPreview`: the default clone of one dragged item, for custom overlays (an
 * `overlay` component or the provider's `#overlay` slot) that lay out several items
 * themselves, e.g. `<DragPreview v-for="item in items" :key="item.id" :id="item.id" />`.
 *
 * Clones are taken at pickup, of the grabbed item and of up to four others next to it in
 * drop order (those that are rendered then). For any other item `DragPreview` renders its
 * default slot, or nothing. The clone fills the element, which has the item's size at
 * pickup unless you style it (`class` and `style` fall through).
 *
 * In a sortable multi-drag (`multiple: 'group'` or `'gaps'`), the preview of an item other
 * than the grabbed one lands on that item's slot with the drop (back on its place when
 * cancelled), from wherever the layout put it: wrappers turned or scaled with `transform`
 * are undone on the way, its size animates as width and height. Style the preview itself
 * (corners, shadow): its wrappers stay in the box. Items without a clone fade in instead.
 */
export interface DragPreviewProps {
  /** Id of a dragged item: one of `items` in `OverlayProps`. */
  id: Key;
}

// ─── Monitor ───────────────────────────────────────────────────────────────────

export interface KeyboardMoveContext {
  active: Active;
  pointer: Coordinates;
  /** Unit vector of the pressed arrow key. */
  direction: Coordinates;
}

export interface DnDMonitor {
  onDragStart?(event: DnDEvent): void;
  onDragMove?(event: DnDEvent): void;
  onDragOver?(event: DnDEvent): void;
  /** Runs before the drop is committed: `false` rejects, a list of ids accepts a subset. */
  onBeforeDrop?(event: DnDEvent): MaybePromise<BeforeDropResult>;
  /** A notification once the drop is done: sortable lists have run their `onDrop` and written it. */
  onDragEnd?(event: DnDEndEvent): void;
  onDragCancel?(event: DnDEvent): void;
  /** Keyboard drags: next pointer position for an arrow key (e.g. the next sortable slot). */
  getKeyboardCoordinates?(
    event: KeyboardEvent,
    context: KeyboardMoveContext,
  ): MaybePromise<Coordinates | undefined>;
}

// ─── Selection ─────────────────────────────────────────────────────────────────

export interface DnDSelection {
  readonly ids: ReadonlySet<Key>;
  has(id: Key): boolean;
  add(...ids: Key[]): void;
  delete(...ids: Key[]): void;
  toggle(id: Key, force?: boolean): void;
  set(ids: Iterable<Key>): void;
  clear(): void;
}

/**
 * The drag state ends when the drop is decided: `active`, `over` and `pointer` read
 * `null` (and droppables stop accepting) while the overlay still animates into place
 * (`status` stays `'dropping'`). Derived UI never mixes the old drag with the new data.
 * While an async `onBeforeDrop` decides, the state is kept as it was at release, but the
 * page is out of drag mode: its own cursor and text selection are back (a confirmation
 * dialog works normally), and the overlay waits where it was dropped.
 */
export interface DnDState {
  status: Readonly<Ref<DnDStatus>>;
  active: Readonly<Ref<Active | null>>;
  over: Readonly<Ref<Over | null>>;
  pointer: Readonly<Ref<Coordinates | null>>;
  activation: { progress: Readonly<Ref<number>> };
  isAutoScrolling: Readonly<Ref<boolean>>;
  selection: DnDSelection;
  cancel(): void;
}

// ─── Draggable / droppable ─────────────────────────────────────────────────────

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
  /** Element (ref) or selector inside the draggable that starts the drag. */
  handle?: MaybeElementRef | string;
  activation?: ActivationOptions;
  /** Extra gate, e.g. drag only while a key is held. */
  canDrag?: (event: PointerEvent | KeyboardEvent) => boolean;
  /**
   * `true` (default): an overlay follows the pointer, rendered by the provider's
   * `#overlay` slot or as a clone of the element. A component: the overlay renders it
   * with `OverlayProps`, before the slot. `false`: no overlay, the element itself moves
   * via the returned `transform`.
   */
  overlay?: boolean | Component;
  /**
   * Modifiers for drags that start here, applied after the provider's `modifiers`: e.g.
   * `[restrictToVerticalAxis]` for one element on a page where other drags move freely.
   * Read when the drag starts.
   */
  modifiers?: MaybeReadonlyRefOrGetter<Modifier[] | undefined>;
  /** Arrow keys in free drags: move by pixels or jump between accepting drop targets. */
  keyboard?: 'pixels' | 'droppables';
  /**
   * Set role/tabindex/aria-* attributes, never overriding the user's own. The provider's
   * instructions id joins an existing `aria-describedby` as one more token (a UI kit
   * tooltip on the same element keeps its own), and only that token is ever removed.
   */
  attributes?: boolean;
}

export interface DraggableReturn {
  id: ComputedRef<Key>;
  isDragging: ComputedRef<boolean>;
  /** Offset to apply when `overlay: false`. */
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
 */
export interface DroppableOptions<TData = unknown> {
  /** Default: `useId()`, stable between server and client render. */
  id?: MaybeReadonlyRefOrGetter<Key>;
  data?: MaybeReadonlyRefOrGetter<TData>;
  /** What this target takes. Inside a sortable item, one that refuses the drag lets the list sort over it. */
  accept?: AcceptRule | Ref<AcceptRule>;
  acceptMode?: AcceptMode;
  disabled?: MaybeReadonlyRefOrGetter<boolean>;
  /** Higher wins when targets overlap without nesting. Sortable items beat containers. */
  priority?: number;
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
 * The default overlay shows every dragged item in a column along the list (`'group'`,
 * `'gaps'`; a row in horizontal lists and grids), or the active one with a count (`'stack'`).
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
  /** Default: `useId()`, stable between server and client render. */
  id?: Key;
  /**
   * Overlay component for this list's items (an item's own `overlay` wins). It receives
   * `OverlayProps` and is kept for the whole drag, also over other lists.
   */
  overlay?: Component;
  /**
   * Modifiers for drags of this list's items, applied after the provider's `modifiers`
   * (an item's own `modifiers` win): e.g. `[restrictToVerticalAxis]` to keep a vertical
   * list's items on their axis. Read when the drag starts.
   */
  modifiers?: MaybeReadonlyRefOrGetter<Modifier[] | undefined>;
  /** Lists with the same group name exchange items. Default: a group of its own. */
  group?: string | SortableGroupOptions;
  acceptMode?: AcceptMode;
  strategy?: SortableStrategy;
  /**
   * `'swap'`: the dragged item exchanges places with the hovered one, live; moving back
   * onto it or off the lists reverts. Lists of one group that both swap exchange items
   * between them: the hovered item moves into the dragged one's place, so it must be
   * able to leave its list (`group.pull: true`) and enter the dragged item's
   * (`group.put`). Multi-drag sorts instead.
   */
  behavior?: SortableBehavior;
  placeholder?: SortablePlaceholder;
  /** Multi-drag mode of drags that start in this list. Default `'group'`. */
  multiple?: MultipleMode;
  /** `false`: items can't be reordered inside this list (palettes). */
  sort?: boolean;
  /** Creates copies (`pull: 'clone'`, copy modifier key). Required for copying. */
  clone?: (item: T) => T;
  /**
   * Accepts plain draggables from outside: creates the item to insert. With the keyboard,
   * an arrow toward the list takes the draggable in (level with it, as moves between
   * lists go), and the created item then moves by slots like any other.
   */
  createItem?: (active: Active) => T | undefined;
  dropOutside?: DropOutside;
  animation?: LayoutAnimation;
  autoScroll?: boolean | AutoScrollOptions;
  disabled?: MaybeReadonlyRefOrGetter<boolean>;
  /**
   * Asked before a drop into this list: `false` rejects it (the items fly back), some
   * keys accept only those. May be async: the overlay waits where it was dropped. An
   * error rejects the drop too. See `SortableDropEvent` for `result` and `preventDefault`.
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
 */
export interface SortableItemOptions<TData = unknown> {
  /** Key of the item in its list. A getter keeps it current in virtual lists. */
  id?: MaybeReadonlyRefOrGetter<Key>;
  /**
   * The item this element renders, e.g. `() => props.task`. Its key comes from the
   * owning list's (or tree's) `getKey`, by default `item.id`.
   */
  item?: MaybeReadonlyRefOrGetter<unknown>;
  /** Overlay component for this item; wins over the list's `overlay`. */
  overlay?: Component;
  /** Modifiers for drags of this item, after the provider's; win over the list's `modifiers`. */
  modifiers?: MaybeReadonlyRefOrGetter<Modifier[] | undefined>;
  handle?: MaybeElementRef | string;
  disabled?: MaybeReadonlyRefOrGetter<boolean>;
  type?: MaybeReadonlyRefOrGetter<string | string[] | undefined>;
  data?: MaybeReadonlyRefOrGetter<TData>;
  activation?: ActivationOptions;
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

// ─── Tree ──────────────────────────────────────────────────────────────────────

export type TreeNesting = 'offset' | 'hover' | 'both';

export interface FlatNode<T> {
  key: Key;
  item: T;
  depth: number;
  parentKey: Key | null;
  /** Index among siblings. */
  index: number;
  hasChildren: boolean;
  collapsed: boolean;
}

export interface TreeProjection {
  depth: number;
  parentKey: Key | null;
}

/**
 * Drop event of a tree. `index` is the position among the siblings under `parentKey`
 * (`from`: before the move; `to`: after it, with the node already removed from its
 * old place). `from.parentKey` is `null` for root nodes and for items from another list.
 * A multi-drag moves `keys` (each with its subtree) side by side: `from` is where the
 * dragged node was, `to` where the first of them lands.
 */
export interface SortableTreeDropEvent<T = unknown> extends SortableDropEvent<T> {
  from: { list: Key | null; index: number; parentKey: Key | null };
  to: { list: Key; index: number; parentKey: Key | null };
}

/**
 * Options of `makeSortableTree`. A multi-drag moves the selected nodes as one block, each
 * with its subtree, to one place and depth (in document order); a selected node inside
 * another selected one rides along in its subtree. `canNest` and `maxDepth` apply to
 * the whole block.
 */
export interface SortableTreeOptions<T> {
  /**
   * The root nodes. A writable ref: on drop the library gives the changed nodes their new
   * children (`setChildren`) and writes a new root array. A read-only source (a getter, a
   * readonly ref, a computed): call `event.preventDefault()` and apply `event.result`
   * yourself (as in `SortableListOptions.items`).
   */
  items: SortableItems<T>;
  /** Default: `node.id`. Also keys `makeSortableItem({ item })`. */
  getKey?: (node: T) => Key;
  getChildren?: (node: T) => T[] | undefined;
  /** How the default write gives a node its new children. Default: `node.children = children`. */
  setChildren?: (node: T, children: T[]) => void;
  /**
   * A copy of `node` with `children`, for `event.result`: a new tree that leaves your
   * nodes as they are (the default write still goes through `setChildren`). Default:
   * `{ ...node }` given the children through `setChildren` (`{ ...node, children }`
   * without a `setChildren`). Pass it for class instances and nodes that need more
   * than a shallow copy.
   */
  withChildren?: (node: T, children: T[]) => T;
  /** Default: `useId()`, stable between server and client render. */
  id?: Key;
  /** Overlay component for this tree's rows (a row's own `overlay` wins). */
  overlay?: Component;
  group?: string | SortableGroupOptions;
  /** Pixels of horizontal offset per depth level. Default 24. */
  indentation?: number;
  /** How the depth is chosen: horizontal offset, hovering the middle of a row, or both (default). */
  nesting?: TreeNesting;
  /**
   * `'item'` (default): the dragged node moves through the rows at its projected depth.
   * `'indicator'`: the tree doesn't move; `indicator` (on the tree and on each row's
   * `makeSortableItem`) says where the drop goes, with its `depth` and `parentKey`, and
   * you draw the line. Dropping outside then cancels.
   */
  placeholder?: SortablePlaceholder;
  /** Deepest allowed depth (roots are 0). The dragged nodes' own descendants count. */
  maxDepth?: number;
  /** Whether `node` may go under `parent`; a multi-drag asks for every dragged node. */
  canNest?: (node: T, parent: T) => boolean;
  collapsed?: Ref<Set<Key>>;
  animation?: LayoutAnimation;
  disabled?: MaybeReadonlyRefOrGetter<boolean>;
  /** As in `SortableListOptions`. */
  onBeforeDrop?: (
    event: SortableTreeDropEvent<T>,
  ) => MaybePromise<BeforeDropResult>;
  /** As in `SortableListOptions`: before the write, which `event.preventDefault()` skips. */
  onDrop?: (event: SortableTreeDropEvent<T>) => void;
}

export interface SortableTreeReturn<T> {
  id: Key;
  /** Visible nodes in draft order; the active node carries its projected depth. */
  items: ComputedRef<FlatNode<T>[]>;
  /** Where the active node would land, `null` when it isn't in this tree. */
  projected: ComputedRef<TreeProjection | null>;
  /** Indicator mode: where the drop goes, with its `depth` and `parentKey`; `null` when not here. */
  indicator: ComputedRef<SortableIndicator | null>;
  isOver: ComputedRef<boolean>;
  activeKey: ComputedRef<Key | null>;
  captureLayout(): void;
}

// ─── Selection area ────────────────────────────────────────────────────────────

export interface SelectionAreaOptions {
  /** Defaults to the provider's selection. */
  selection?: Ref<Set<Key>>;
  modifier?: { keys: string[]; method: 'every' | 'some' };
  strategy?: 'toggle' | 'select';
  accept?: AcceptRule;
  disabled?: MaybeReadonlyRefOrGetter<boolean>;
  onSelected?: (ids: Key[]) => void;
}

export interface SelectionAreaReturn {
  isSelecting: ComputedRef<boolean>;
  /** Style for the selection rectangle element (absolute, container-relative). */
  style: ComputedRef<Record<string, string>>;
}
