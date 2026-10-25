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
   * The overlay box; it lands on the active item's slot. In a multi-drag the default
   * overlay's clones of the other items ride inside it and land on their own slots by
   * themselves (with the default timing when this is a custom function).
   */
  overlay: HTMLElement;
  from: Rect;
  /** Final rect of the dropped item; `null` when it isn't rendered (the overlay fades out). */
  to: Rect | null;
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
 * While an async `onBeforeDrop` decides, the state is kept as it was at release.
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
  /** Arrow keys in free drags: move by pixels or jump between accepting drop targets. */
  keyboard?: 'pixels' | 'droppables';
  /** Set role/tabindex/aria-* attributes (never overriding the user's own). */
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

export interface DroppableOptions<TData = unknown> {
  /** Default: `useId()`, stable between server and client render. */
  id?: MaybeReadonlyRefOrGetter<Key>;
  data?: MaybeReadonlyRefOrGetter<TData>;
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

export interface SortableDropEvent<T = unknown> {
  keys: Key[];
  items: T[];
  accepted: Key[];
  rejected: Key[];
  from: { list: Key | null; index: number };
  to: { list: Key; index: number };
  sameList: boolean;
  mode: DragMode;
}

export interface SortableIndicator {
  list: Key;
  /** Insertion position in the list as rendered. */
  index: number;
  /** Item the indicator is attached to; `null` in an empty list. */
  key: Key | null;
  side: 'before' | 'after';
}

export interface SortableListOptions<T> {
  /** Source of truth; the library writes the new array here on drop. */
  items: Ref<T[]>;
  /** Default: `item.id`, or the item itself for primitives. Also keys `makeSortableItem({ item })`. */
  getKey?: (item: T) => Key;
  /** Default: `useId()`, stable between server and client render. */
  id?: Key;
  /**
   * Overlay component for this list's items (an item's own `overlay` wins). It receives
   * `OverlayProps` and is kept for the whole drag, also over other lists.
   */
  overlay?: Component;
  /** Lists with the same group name exchange items. Default: a group of its own. */
  group?: string | SortableGroupOptions;
  acceptMode?: AcceptMode;
  strategy?: SortableStrategy;
  behavior?: SortableBehavior;
  placeholder?: SortablePlaceholder;
  /** Multi-drag mode of drags that start in this list. Default `'group'`. */
  multiple?: MultipleMode;
  /** `false`: items can't be reordered inside this list (palettes). */
  sort?: boolean;
  /** Creates copies (`pull: 'clone'`, copy modifier key). Required for copying. */
  clone?: (item: T) => T;
  /** Accepts plain draggables from outside: creates the item to insert. */
  createItem?: (active: Active) => T | undefined;
  dropOutside?: DropOutside;
  animation?: LayoutAnimation;
  autoScroll?: boolean | AutoScrollOptions;
  disabled?: MaybeReadonlyRefOrGetter<boolean>;
  onBeforeDrop?: (
    event: SortableDropEvent<T>,
  ) => MaybePromise<BeforeDropResult>;
  /** Called after the result was written to `items`. */
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
  /** Indicator mode: side of this item where the drop line goes. */
  indicator: ComputedRef<'before' | 'after' | null>;
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
 */
export interface SortableTreeDropEvent<T = unknown> extends SortableDropEvent<T> {
  from: { list: Key | null; index: number; parentKey: Key | null };
  to: { list: Key; index: number; parentKey: Key | null };
}

export interface SortableTreeOptions<T> {
  items: Ref<T[]>;
  /** Default: `node.id`. Also keys `makeSortableItem({ item })`. */
  getKey?: (node: T) => Key;
  getChildren?: (node: T) => T[] | undefined;
  setChildren?: (node: T, children: T[]) => void;
  /** Default: `useId()`, stable between server and client render. */
  id?: Key;
  /** Overlay component for this tree's rows (a row's own `overlay` wins). */
  overlay?: Component;
  group?: string | SortableGroupOptions;
  /** Pixels of horizontal offset per depth level. Default 24. */
  indentation?: number;
  /** How the depth is chosen: horizontal offset, hovering the middle of a row, or both (default). */
  nesting?: TreeNesting;
  /** Deepest allowed depth (roots are 0). The dragged node's own descendants count. */
  maxDepth?: number;
  canNest?: (node: T, parent: T) => boolean;
  collapsed?: Ref<Set<Key>>;
  animation?: LayoutAnimation;
  disabled?: MaybeReadonlyRefOrGetter<boolean>;
  onBeforeDrop?: (
    event: SortableTreeDropEvent<T>,
  ) => MaybePromise<BeforeDropResult>;
  /** Called after the result was written to `items`. */
  onDrop?: (event: SortableTreeDropEvent<T>) => void;
}

export interface SortableTreeReturn<T> {
  id: Key;
  /** Visible nodes in draft order; the active node carries its projected depth. */
  items: ComputedRef<FlatNode<T>[]>;
  /** Where the active node would land, `null` when it isn't in this tree. */
  projected: ComputedRef<TreeProjection | null>;
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
