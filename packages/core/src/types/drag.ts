/** The drag as everyone sees it: its state, events, accept rules, monitors and `useDnD()`. */

import type { Ref } from 'vue';
import type { Coordinates, DnDStatus, Key, MaybePromise, Rect, SensorType } from './primitives';

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
}

export interface DnDEndEvent<T = unknown> extends DnDEvent<T> {
  /** False when the drag ended outside every drop target. */
  dropped: boolean;
  /** Ids accepted by `onBeforeDrop` (all dragged ids unless a subset was returned). */
  accepted: Key[];
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
  /** Runs before the drop is committed (see `BeforeDropResult`): `'reject'` refuses it, ids accept a subset. */
  onBeforeDrop?(event: DnDEvent): MaybePromise<BeforeDropResult>;
  /** A notification once the drop is done: sortable lists have run their `onDrop` and written it. */
  onDragEnd?(event: DnDEndEvent): void;
  onDragCancel?(event: DnDEvent): void;
  /** `onBeforeDrop` answered `'continue'`: there was no drop, and the drag goes on. */
  onDragResume?(event: DnDEvent): void;
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
  /**
   * Where the dragged box's top-left corner is in `over`, live: `DnDEvent.position` on every
   * move. `null` over nothing. An overlay component reads it to show where it would land
   * (a time on a calendar).
   */
  position: Readonly<Ref<Coordinates | null>>;
  activation: { progress: Readonly<Ref<number>> };
  isAutoScrolling: Readonly<Ref<boolean>>;
  selection: DnDSelection;
  cancel(): void;
}
