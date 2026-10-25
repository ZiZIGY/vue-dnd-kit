/**
 * What a list kind (`makeSortableList`, `makeSortableTree`) gives its sortable group: its
 * keys, options and drop handlers, and its layout (`layout.ts`).
 */

import type { ShallowRef } from 'vue';
import type {
  AcceptMode,
  Active,
  BeforeDropResult,
  DropOutside,
  Key,
  LayoutAnimation,
  MaybePromise,
  MultipleMode,
  SortableBehavior,
  SortableDropEvent,
  SortablePlaceholder,
  SortablePutContext,
  SortableStrategy,
} from '../types';
import type { ListLayout } from './layout';

/** An item made by a list: a copy (`clone`) or an item for an external draggable (`createItem`). */
export interface CreatedItem {
  key: Key;
  item: unknown;
}

export interface ListEntry {
  id: Key;
  getElement(): HTMLElement | null;
  /** Keys of the source items, in order. */
  getKeys(): Key[];
  getItem(key: Key): unknown;
  /** Draft order during a drag, `null` when idle. */
  draft: ShallowRef<Key[] | null>;
  /** A flat list (`flatLayout`) or a tree. */
  layout: ListLayout;
  strategy(): SortableStrategy;
  placeholder(): SortablePlaceholder;
  animation(): LayoutAnimation | undefined;
  isDisabled(): boolean;
  canSort(): boolean;
  pull(): boolean | 'clone';
  canPut(context: SortablePutContext): boolean;
  dropOutside(): DropOutside;
  /** The source can't be written (a getter, a readonly ref, a computed): drops are the user's to apply. */
  isReadonly(): boolean;
  /**
   * The new items for the order `keys`, built without touching the source: the drop's
   * `result` for this list. `inserted`: the keys the drop puts at the slot, when this list
   * is the target.
   */
  build(keys: Key[], lookup: (key: Key) => unknown, inserted: readonly Key[]): unknown[];
  /** Writes the drop, the default action. `built`: what `build` returned for the same arguments. */
  commit(built: unknown[], keys: Key[], lookup: (key: Key) => unknown, inserted: readonly Key[]): void;
  beforeDrop?(event: SortableDropEvent): MaybePromise<BeforeDropResult>;
  /** The user's `onDrop`: before the write, which `event.preventDefault()` skips. */
  afterDrop?(event: SortableDropEvent): void;

  // Optional features; lists that don't implement them get the defaults.
  /** Default `'sort'`. */
  behavior?(): SortableBehavior;
  /** Default `'stack'`; sortable lists and trees use `'group'`. */
  multiple?(): MultipleMode;
  /** Default `'all'`. */
  acceptMode?(): AcceptMode;
  /** Copies an item (`pull: 'clone'`, the copy modifier). */
  clone?(item: unknown): CreatedItem | undefined;
  /** Makes an item for a plain draggable entering the list. */
  create?(active: Active): CreatedItem | undefined;
}
