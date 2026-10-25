/**
 * What a list kind (`makeSortableList`, `makeSortableTree`) gives its sortable group: its
 * keys, options and drop handlers.
 */

import type { ShallowRef } from 'vue';
import type {
  AcceptMode,
  Active,
  BeforeDropResult,
  DnDEvent,
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
import type { IndicatorProjection, ProjectionItem } from './projection';

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

  // Extension points for list kinds built on the group (the tree uses them).
  /**
   * Dragged keys of this list that travel inside another dragged one (a tree's selected
   * descendants), each with the dragged key it rides in: they leave the drag. The active
   * key may be one: the key it rides in then leads the drag.
   */
  carried?(keys: readonly Key[]): ReadonlyMap<Key, Key>;
  /** Adjusts a draft at drag start or when copying turns on or off, e.g. hides the descendants of the dragged nodes. */
  prepareDraft?(keys: Key[], context: DraftContext): Key[];
  /** Replaces the index projection: new index of the active key, or `null` to keep it. */
  project?(event: DnDEvent, context: ProjectContext): number | null;
  /** Indicator mode: replaces `projectIndicator` (trees add the depth). */
  indicate?(event: DnDEvent, items: ProjectionItem[]): IndicatorProjection | null | undefined;
  /** Indicator mode: the line at `index` when the keyboard enters the list; `null` when none fits. */
  indicateAt?(index: number): IndicatorProjection | null;
  /** Runs on every move while this list holds the active slot (after any reorder). */
  afterMove?(event: DnDEvent): void;
  /** Whether committing `keys` changes anything; defaults to comparing with `getKeys()`. */
  hasChanges?(keys: Key[], inserted: readonly Key[]): boolean;
  /** Runs when the session ends (drop, cancel, reject). */
  reset?(): void;
}

/** What `prepareDraft` is told about the drag. */
export interface DraftContext {
  /** Dragged key the slot stands for: the active key, or the tree node it rides in. */
  lead: Key;
  /** Dragged keys that travel on their own, in drop order (the lead included). */
  keys: Key[];
  /** The dragged items stay where they are; their copies travel. */
  copying: boolean;
}

export interface ProjectContext {
  /** Current draft of this list. */
  keys: Key[];
  /** Mounted items of this list, with layout rects, in draft order. */
  items: ProjectionItem[];
  /** Key of the active slot (the active key unless copying or inserting). */
  activeKey: Key;
  /** Index of the active key in this draft, -1 when it is in another list. */
  activeIndex: number;
}
