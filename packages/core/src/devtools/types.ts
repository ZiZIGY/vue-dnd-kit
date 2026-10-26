/**
 * What the devtools bridge tells: read-only snapshots of a provider and the events of
 * its drags. Plain data (elements and the user's values by reference): the plugin shows
 * them, and never needs the library's internals.
 */

import type { App } from 'vue';
import type {
  AcceptMode,
  AcceptRule,
  Coordinates,
  DnDContext,
  DnDStatus,
  DragMode,
  DropOutside,
  Key,
  MultipleMode,
  Rect,
  SensorType,
  Size,
  SortableBehavior,
  SortableIndicator,
  SortablePlaceholder,
  SortableStrategy,
} from '../types';

// ─── Snapshots ─────────────────────────────────────────────────────────────────

export interface DraggableSnapshot {
  id: Key;
  /** Normalized `type`; empty fits any drop target. */
  type: string[];
  disabled: boolean;
  selected: boolean;
  /** One of the dragged items. */
  dragging: boolean;
  element: Element | null;
  /** Handle element or selector; `null` when the whole element is the handle. */
  handle: Element | string | null;
  data: unknown;
  /** A sortable item: the list or tree it is in (`null` while it is in none, e.g. a copy). */
  list: Key | null;
}

export interface DroppableSnapshot {
  id: Key;
  /** The `accept` option as given (`undefined`: everything). Sortable lists accept by their group's rules. */
  accept: AcceptRule | undefined;
  acceptMode: AcceptMode;
  priority: number;
  disabled: boolean;
  /** The drag is over it. */
  over: boolean;
  /** During a drag: whether it takes the dragged items. `null` while idle, or when it can't be told without side effects. */
  accepting: boolean | null;
  element: Element | null;
  data: unknown;
  /** A sortable list or tree (see `ListSnapshot`). */
  sortable: boolean;
}

export interface ListSnapshot {
  id: Key;
  kind: 'list' | 'tree';
  /** Name of its sortable group (`sortable:<id>` for a list without `group`). */
  group: string;
  strategy: SortableStrategy;
  placeholder: SortablePlaceholder;
  behavior: SortableBehavior;
  multiple: MultipleMode;
  pull: boolean | 'clone';
  /** `sort: false` keeps the order of its own items. */
  sort: boolean;
  dropOutside: DropOutside;
  acceptMode: AcceptMode;
  disabled: boolean;
  /** `items` can't be written (a getter, a readonly ref): drops are the user's to apply. */
  controlled: boolean;
  /** Items in the source (visible rows of a tree). */
  count: number;
  /** Keys of the source, in order. */
  keys: Key[];
  /** Draft order during a drag; `null` while idle. */
  draft: Key[] | null;
  element: Element | null;
  over: boolean;
  /** See `DroppableSnapshot.accepting`. */
  accepting: boolean | null;
}

/** A sortable group's drag session. */
export interface SortableSessionSnapshot {
  activeKey: Key;
  /** Dragged key the slot stands for (a tree node the active one rides in). */
  lead: Key;
  /** Every moved key, the lead included. */
  keys: Key[];
  /** Where the lead started; `list` is `null` for a plain draggable from outside. */
  origin: { list: Key | null; index: number };
  /** Key holding the slot in the drafts: the lead, its copy or a created item. */
  slot: Key;
  /** List whose draft holds the slot. */
  list: Key | null;
  /** What the slot is: the dragged item (`move`), its copy or an item made for a plain draggable. */
  kind: 'move' | 'copy' | 'insert';
  /** Keys travelling with the slot (multi-drag `'group'`). */
  block: Key[];
  /** Item the active one is exchanged with (`behavior: 'swap'`). */
  swap: Key | null;
  /** A trash zone or `dropOutside: 'remove'` takes the items out of their lists. */
  removed: boolean;
}

export interface GroupSnapshot {
  name: string;
  lists: ListSnapshot[];
  session: SortableSessionSnapshot | null;
  /** Insertion line of `placeholder: 'indicator'` lists. */
  indicator: SortableIndicator | null;
}

export interface ItemSnapshot {
  id: Key;
  type: string[];
  data: unknown;
  /** Item object of a sortable list. */
  item?: unknown;
}

export interface ActiveSnapshot {
  id: Key;
  ids: Key[];
  items: ItemSnapshot[];
  type: string[];
  sensor: SensorType;
  element: Element;
  /** Layout rect of `element` at drag start. */
  rect: Rect;
}

export interface OverSnapshot {
  id: Key;
  accepted: boolean;
  data: unknown;
  element: Element;
  rect: Rect;
}

export interface SessionSnapshot {
  status: DnDStatus;
  active: ActiveSnapshot | null;
  over: OverSnapshot | null;
  /** Pointer after modifiers. */
  pointer: Coordinates | null;
  /** Offset of the overlay from the drag start, after modifiers. */
  transform: Coordinates;
  /** What a drop would do. */
  mode: DragMode;
  /** Key whose element the overlay lands on, when it isn't the active id (copies, created items). */
  landingKey: Key | null;
  /** Multi-drag: slot key → dragged id that lands there. */
  landings: [Key, Key][];
  /** Size of the overlay box (`overlayFit`). */
  fitSize: Size | null;
  /** Whether the drag has an overlay (without one the element itself moves). */
  overlay: boolean;
  /** Ids with a clone taken at pickup, in drop order. */
  previews: Key[];
  /** The drop is decided; only the overlay animation is left. */
  settling: boolean;
  /** What a decided drop lands on. */
  dropTarget: OverSnapshot | null;
  autoScrolling: boolean;
  /** Progress of a press that is activating, 0–1. */
  activation: number;
  /** Last text of the live region. */
  announcement: string;
}

export interface ProviderSnapshot {
  status: DnDStatus;
  /** The provider's props as given (`undefined`: the default). */
  options: Record<string, unknown>;
  draggables: DraggableSnapshot[];
  /** Drop targets, the droppables of sortable lists included (`sortable: true`). */
  droppables: DroppableSnapshot[];
  groups: GroupSnapshot[];
  selection: Key[];
  session: SessionSnapshot;
}

// ─── Events ────────────────────────────────────────────────────────────────────

/** A drop on a sortable list or tree, as its `SortableDropEvent` told it. */
export interface SortableDropSnapshot {
  group: string;
  keys: Key[];
  accepted: Key[];
  rejected: Key[];
  from: { list: Key | null; index: number };
  to: { list: Key; index: number };
  sameList: boolean;
  mode: DragMode;
  /** `mode: 'swap'`: the exchanged item. */
  partner?: Key;
  /** The new items of every list the drop changes. */
  result: ReadonlyMap<Key, unknown[]>;
  /** `preventDefault()` was called: the drop wasn't written. */
  defaultPrevented: boolean;
}

/** The sensor that started a drag. */
export interface SensorSnapshot {
  /** Its `name` (`'pointer'`, `'keyboard'` for the built-in ones); `undefined` when it has none. */
  name: string | undefined;
  /** Started by touch. */
  touch: boolean;
}

/** Why a drag ended without a drop. */
export type CancelReason =
  /** Escape, `cancel()`, the provider unmounted. */
  | 'cancelled'
  /** An `onBeforeDrop` (a monitor's, the target's or a list's) returned `false`, or a list's `dropOutside: 'cancel'`. */
  | 'rejected'
  /** Dropped on a target whose `accept` rule refuses the items. */
  | 'refused';

interface OfDrag {
  /** Drags of the provider, counted from 1: the events of one drag share it. */
  drag: number;
}

export type DevtoolsEvent =
  | (OfDrag & {
      type: 'start';
      active: ActiveSnapshot;
      pointer: Coordinates;
      /** The list the items come from. */
      source: Key | null;
      /** `null`: started without a sensor (`manager.start`). */
      sensor: SensorSnapshot | null;
    })
  | (OfDrag & { type: 'over'; over: OverSnapshot | null; previous: Key | null })
  /** The pointer moved (every frame of a drag): for live views, not for logs. */
  | (OfDrag & { type: 'move' })
  /** Released: the `onBeforeDrop` hooks decide. */
  | (OfDrag & { type: 'release'; over: OverSnapshot | null })
  | (OfDrag & {
      type: 'drop';
      over: OverSnapshot | null;
      /** False when dropped outside every drop target. */
      dropped: boolean;
      accepted: Key[];
      rejected: Key[];
      /** Milliseconds the `onBeforeDrop` hooks took. */
      waited: number;
      sortable: SortableDropSnapshot[];
    })
  | (OfDrag & {
      type: 'cancel';
      reason: CancelReason;
      over: OverSnapshot | null;
      /** Milliseconds the `onBeforeDrop` hooks took; `null` when the drag was cancelled before a drop. */
      waited: number | null;
      /** Drops a list prepared before it was rejected. */
      sortable: SortableDropSnapshot[];
    })
  | { type: 'status'; status: DnDStatus }
  | { type: 'selection'; ids: Key[] }
  | { type: 'announcement'; text: string }
  | { type: 'autoScroll'; scrolling: boolean }
  /**
   * The items of a list with `animate` on changed, and no drag changed them: the list
   * animates the change (its keys; a tree's visible rows).
   */
  | { type: 'change'; group: string; list: Key; added: Key[]; removed: Key[]; reordered: boolean };

// ─── Bridge ────────────────────────────────────────────────────────────────────

/** A provider as the devtools see it. */
export interface DevtoolsProvider {
  /** Unique on the page: `provider-1`, … in the order providers were set up. */
  readonly id: string;
  /** `DnDProvider` and the component that renders it. */
  readonly label: string;
  /** The app the provider renders in. */
  readonly app: App | null;
  /**
   * The provider's handle (`useDnDContext()`): with `provideDnDContext`, a sensor runs in
   * it from outside its components (the plugin's drags from the inspector).
   */
  readonly context: DnDContext;
  /** Everything the provider knows, now. */
  snapshot(): ProviderSnapshot;
  /** Cancels the current drag (or a press that is activating, a running rubber band). */
  cancel(): void;
  /** Empties the selection. */
  clearSelection(): void;
}

export interface DevtoolsListener {
  added?(provider: DevtoolsProvider): void;
  /** The provider unmounted. */
  removed?(provider: DevtoolsProvider): void;
  /** A listener with this handler makes the bridge follow the providers (until then they are only recorded). */
  event?(provider: DevtoolsProvider, event: DevtoolsEvent): void;
}

export interface DevtoolsBridge {
  /** Providers set up since the bridge was connected (and still mounted), in setup order. */
  providers(): DevtoolsProvider[];
  /** Tells `listener` about providers and their events. Returns the unsubscribe. */
  subscribe(listener: DevtoolsListener): () => void;
  /** Removes the hook and forgets every provider (tests, hot reload). */
  disconnect(): void;
}
