/** The drag as everyone sees it: its state, events, accept rules, monitors and `useDnD()`. */

import type { Ref } from 'vue';
import type { Coordinates, DnDStatus, Key, MaybePromise, Rect, SensorType } from './primitives';
import type { ExternalData } from './native';

// ─── Drag state ────────────────────────────────────────────────────────────────

/** One dragged item: the one the drag started from, or another one of a multi-drag. */
export interface DragItem<T = unknown> {
  /** Id of its draggable (the key of a sortable item). */
  id: Key;
  /** Item object when the drag comes from a sortable list. */
  item?: T;
  /** Its `data` option. */
  data: unknown;
  /** Its `label`, what people call it. */
  label?: string;
  /** Normalized `type` of the draggable; empty means it fits any drop target. */
  type: string[];
}

/** The running drag: the item it started from, and every item it carries. */
export interface Active<T = unknown> {
  /** Id of the item the drag started from. */
  id: Key;
  /** Every dragged id, the primary one first (multi-drag). */
  ids: Key[];
  /** Every dragged item, the primary one first. */
  items: DragItem<T>[];
  /** The `data` of the item the drag started from. */
  data: unknown;
  /** The `label` of the item the drag started from, what people call it. */
  label?: string;
  /** The normalized `type` of the item the drag started from; empty means it fits any drop target. */
  type: string[];
  /** Element the drag started from. It may get detached (virtual lists, cross-list moves). */
  element: HTMLElement;
  /** Layout rect of `element` at drag start. */
  rect: Rect;
  /** How the drag moves: `'pointer'` follows points, `'keyboard'` moves by items (`SensorActivation.type`). */
  sensor: SensorType;
  /**
   * A drag from outside the page (files, a link, text, or items from another window of the
   * app): what it carries. Its `items` are made for it (`element` is a stand-in).
   */
  external?: ExternalData;
  /** The browser's own drag (`native`, or one from outside): the browser draws the dragged image, and there is no overlay. */
  native?: boolean;
}

/** The drop target under the drag. */
export interface Over {
  /** Id of the drop target. */
  id: Key;
  /** The target's `data` option. */
  data: unknown;
  /** The target's `label`, what people call it. */
  label?: string;
  /** The target's element. */
  element: HTMLElement;
  /** The rect of `element`, measured during the drag. */
  rect: Rect;
  /** Whether the target's `accept` rule accepts the dragged items. */
  accepted: boolean;
}

/**
 * Where a drop would put the dragged items: a place in a sortable list or tree, as the
 * drop event's `to` will say (the overlay's `to` prop, live).
 */
export interface DropDestination {
  /** Id of the list or tree. */
  list: Key;
  /** Index the dragged items take: in the list, or among the siblings under `parentKey` in a tree. */
  index: number;
  /** Trees: the node they go under; `null` at the root. */
  parentKey?: Key | null;
  /** Trees: the depth they go at (roots are 0). */
  depth?: number;
}

/** Where the dragged items come from, when that is a sortable list. */
export interface DragSource {
  /** Sortable list the dragged items come from. */
  list: Key;
  /** Removes the dragged items from their list (trash zones). */
  remove(): void;
}

/**
 * What a drop does: `'move'`, `'copy'` (the items stay, copies of them go in), `'swap'`
 * (`behavior: 'swap'`: two items exchange places) or `'insert'` (a plain draggable goes into
 * a list as the item its `createItem` made).
 */
export type DragMode = 'move' | 'copy' | 'swap' | 'insert';

/** What drag events carry: monitors, the provider's events and the hooks of drop targets get it. */
export interface DnDEvent<T = unknown> {
  /** The drag. */
  active: Active<T>;
  /** The drop target under the drag; `null` over nothing. */
  over: Over | null;
  /** Pointer in viewport coordinates, after modifiers. */
  pointer: Coordinates;
  /** Offset from the drag start, after modifiers. */
  delta: Coordinates;
  /**
   * Where the dragged box's top-left corner is in `over`, from its padding edge and with
   * its scroll: the `left`/`top` that put an absolutely positioned item where it was
   * dropped (a note on a board). `null` over nothing. Of the overlay box, or of the
   * element itself with `overlay: false`.
   */
  readonly position: Coordinates | null;
  /**
   * What a drop would do: `'move'`, `'copy'` (a list's `pull: 'clone'`, or the copy
   * modifier held over items whose list can `clone`), `'swap'` or `'insert'`. A plain drop
   * target reads it to copy instead of moving.
   */
  mode: DragMode;
  /** Present when the dragged items come from a sortable list. */
  source?: DragSource;
  /** A drag from outside the page: what it carries (`active.external`). Its data comes at the drop. */
  external?: ExternalData;
}

/** What `onDragEnd` (and the target's `onDrop`) gets: the event of the drop, and how it went. */
export interface DnDEndEvent<T = unknown> extends DnDEvent<T> {
  /** False when the drag ended outside every drop target. */
  dropped: boolean;
  /** Ids accepted by `onBeforeDrop` (all dragged ids unless a subset was returned). */
  accepted: Key[];
  /** The other dragged ids: `onBeforeDrop` left them out, and they fly back. Empty when it took them all. */
  rejected: Key[];
  /**
   * A drag out of the page (`native`) dropped somewhere else: what that place did with it.
   * `'move'` takes the items out of their sortable list here; `'copy'` and `'link'` leave them.
   */
  droppedOutside?: 'move' | 'copy' | 'link';
}

/**
 * What `onBeforeDrop` decides:
 * - `'accept'` (or `true`, or nothing): the drop goes through;
 * - `'reject'` (or `false`): no drop, the items fly back;
 * - a list of ids: only those items are accepted, the others fly back;
 * - `'continue'`: no drop, and the drag goes on. With a pointer the item follows it again
 *   (no button held) and the next release drops it, a click does; a touch takes it again;
 *   the keyboard moves it as before. Escape cancels it. The drop asks `onBeforeDrop` again.
 */
export type BeforeDropResult = boolean | void | Key[] | 'accept' | 'reject' | 'continue';

// ─── Accept rules ──────────────────────────────────────────────────────────────

/** What a function `accept` rule is asked with. */
export interface AcceptContext {
  /** The drag. */
  active: Active;
  /** Every dragged item. */
  items: DragItem[];
  /** The types of every dragged item, together. */
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

// ─── Monitor ───────────────────────────────────────────────────────────────────

/** What `getKeyboardCoordinates` is asked with, for an arrow key. */
export interface KeyboardMoveContext {
  /** The drag. */
  active: Active;
  /** Where the drag is now, in viewport coordinates. */
  pointer: Coordinates;
  /** Unit vector of the pressed arrow key. */
  direction: Coordinates;
}

/** Hooks for every drag under the provider (`useDnDMonitor`). */
export interface DnDMonitor {
  /** A drag started, after its activation. */
  onDragStart?(event: DnDEvent): void;
  /** The drag moved (once per frame at most). */
  onDragMove?(event: DnDEvent): void;
  /** The target under the drag changed. */
  onDragOver?(event: DnDEvent): void;
  /** Runs before the drop is committed (see `BeforeDropResult`): `'reject'` refuses it, ids accept a subset. */
  onBeforeDrop?(event: DnDEvent): MaybePromise<BeforeDropResult>;
  /** A notification once the drop is done: sortable lists have run their `onDrop` and written it. */
  onDragEnd?(event: DnDEndEvent): void;
  /** The drag was cancelled, or its drop refused: the items fly back. */
  onDragCancel?(event: DnDEvent): void;
  /** `onBeforeDrop` answered `'continue'`: there was no drop, and the drag goes on. */
  onDragResume?(event: DnDEvent): void;
  /**
   * The overlay of an ended drag has landed: after its drop animation (or the flight back
   * of a cancel), with the event `onDragEnd` (a `DnDEndEvent`) or `onDragCancel` got.
   * The next drag may have started meanwhile: drags don't wait for landings.
   */
  onDragSettle?(event: DnDEvent | DnDEndEvent): void;
  /** Keyboard drags: next pointer position for an arrow key (e.g. the next sortable slot). */
  getKeyboardCoordinates?(
    event: KeyboardEvent,
    context: KeyboardMoveContext,
  ): MaybePromise<Coordinates | undefined>;
}

// ─── Selection ─────────────────────────────────────────────────────────────────

/**
 * The selected draggables, by id: a drag of one of them carries them all (multi-drag). Kept
 * by id, a selection survives unmounts (virtual lists).
 */
export interface DnDSelection {
  /** The selected ids, reactive. */
  readonly ids: ReadonlySet<Key>;
  /** Whether `id` is selected. */
  has(id: Key): boolean;
  /** Selects these ids. */
  add(...ids: Key[]): void;
  /** Deselects these ids. */
  delete(...ids: Key[]): void;
  /** Selects `id` or deselects it; `force: true` selects it, `false` deselects it. */
  toggle(id: Key, force?: boolean): void;
  /** Selects these ids and no others. */
  set(ids: Iterable<Key>): void;
  /** Deselects every id. */
  clear(): void;
}

/**
 * The drag state ends when the drop is decided: `active`, `over` and `pointer` read
 * `null` (and droppables stop accepting) while the overlay still animates into place.
 * Derived UI never mixes the old drag with the new data. While an async `onBeforeDrop`
 * decides, the state is kept as it was at release, but the page is out of drag mode: its
 * own cursor and text selection are back (a confirmation dialog works normally), and the
 * overlay waits where it was dropped.
 *
 * `status` is `'dragging'` while a drag runs, else `'dropping'` while a drop is decided or
 * an overlay still lands, else `'idle'` (`'activating'` and `'selecting'` aside). A new drag
 * doesn't wait for the landings: it starts at once, and they finish around it.
 */
export interface DnDState {
  /** What the provider is doing (see `DnDStatus`). */
  status: Readonly<Ref<DnDStatus>>;
  /** The running drag; `null` without one, and as soon as its drop is decided. */
  active: Readonly<Ref<Active | null>>;
  /** The drop target under the drag; `null` over nothing. */
  over: Readonly<Ref<Over | null>>;
  /** Pointer in viewport coordinates, after modifiers; `null` without a drag. */
  pointer: Readonly<Ref<Coordinates | null>>;
  /**
   * Where the dragged box's top-left corner is in `over`, live: `DnDEvent.position` on every
   * move. `null` over nothing. An overlay component reads it to show where it would land
   * (a time on a calendar).
   */
  position: Readonly<Ref<Coordinates | null>>;
  /**
   * `progress`: how far a press has come toward its activation constraint, from 0 to 1,
   * while `status` is `'activating'`: e.g. a ring that fills during a long press.
   */
  activation: { progress: Readonly<Ref<number>> };
  /** Auto-scroll is moving a container. */
  isAutoScrolling: Readonly<Ref<boolean>>;
  /** The selected draggables (see `DnDSelection`). */
  selection: DnDSelection;
  /** Cancels the drag (it flies back), or the pending activation. */
  cancel(): void;
}
