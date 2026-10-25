/**
 * The layout of a list, as the group sees it: a flat list (`flatLayout`) or a tree
 * (`tree/layout.ts`), whose rows have a depth and whose nodes carry their subtrees. The
 * session core, the modes and the keyboard ask the list's layout for projections, drafts
 * and indicator lines, so none of them branches on trees. What a drop writes is the
 * list's own (`ListEntry.build`, `commit`): an array, or a tree.
 */

import type { DnDEvent, Key, Rect, SortableStrategy } from '../types';
import { projectIndex, projectIndicator, type IndicatorProjection, type Projection, type ProjectionItem } from './projection';
import { sameKeys } from './context';

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
  /**
   * Current draft of this list: as projection counts it (a multi-drag block once, see
   * `viewOf`), and as it is for an insertion line.
   */
  keys: Key[];
  /** Mounted items of this list, with layout rects, in draft order. */
  items: ProjectionItem[];
  /** Key of the active slot (the active key unless copying or inserting). */
  activeKey: Key;
  /** Index of the active key in this draft, -1 when it is in another list (or for a line). */
  activeIndex: number;
  strategy: SortableStrategy;
  /** Grid only: the item that just moved under the pointer, ignored until the pointer leaves it. */
  lock: Key | null;
  /** Items holding a drop target for this drag, with their middle band (`combine.ts`). */
  targets?: ReadonlyMap<Key, Rect>;
}

export interface ListLayout {
  /**
   * Rows have a depth (trees): the list keeps projecting where its order can't change
   * (the list the slot just left, `sort: false`: the depth still can), and moves the slot
   * by keyboard itself (its arrow keys pick a row and a depth, which the next move applies).
   */
  readonly nested: boolean;
  /**
   * Dragged keys of this list that travel inside another dragged one (a tree's selected
   * descendants), each with the dragged key it rides in: they leave the drag. The active
   * key may be one: the key it rides in then leads the drag.
   */
  carried(keys: readonly Key[]): ReadonlyMap<Key, Key>;
  /** Adjusts a draft at drag start or when copying turns on or off, e.g. hides the descendants of the dragged nodes. */
  prepareDraft(keys: Key[], context: DraftContext): Key[];
  /** The new index of the active key (`null` keeps it), the grid lock, and the item that made it move (hysteresis). */
  project(event: DnDEvent, context: ProjectContext): Projection;
  /** Indicator mode: the line under the pointer (trees add the depth); `undefined` keeps the last one. */
  indicate(event: DnDEvent, context: ProjectContext): IndicatorProjection | null | undefined;
  /** Indicator mode: the line at `index` of the draft `keys` when the keyboard enters the list; `null` when none fits. */
  indicateAt(keys: Key[], index: number): IndicatorProjection | null;
  /** Runs on every move while this list holds the active slot (after any reorder). */
  afterMove(event: DnDEvent): void;
  /** Whether committing `keys` to the list that holds `source` changes anything. */
  hasChanges(keys: Key[], inserted: readonly Key[], source: Key[]): boolean;
  /** Runs when the session ends (drop, cancel, reject). */
  reset(): void;
}

const NO_CARRIERS: ReadonlyMap<Key, Key> = new Map();

const nothing = () => {};

export const flatLayout: ListLayout = {
  nested: false,
  carried: () => NO_CARRIERS,
  prepareDraft: (keys) => keys,
  project: ({ pointer }, { keys, items, activeKey, activeIndex, strategy, lock, targets }) =>
    projectIndex({ strategy, pointer, items, activeKey, activeIndex, length: keys.length, lock, targets }),
  indicate: ({ pointer }, { keys, strategy, items, activeKey, targets }) =>
    projectIndicator({ strategy, pointer, items, activeKey, length: keys.length, targets }),
  indicateAt: (keys, index) =>
    index < keys.length
      ? { index, key: keys[index]!, side: 'before' }
      : { index, key: keys[keys.length - 1] ?? null, side: 'after' },
  afterMove: nothing,
  hasChanges: (keys, _inserted, source) => !sameKeys(keys, source),
  reset: nothing,
};
