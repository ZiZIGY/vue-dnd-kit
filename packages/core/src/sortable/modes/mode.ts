/**
 * The modes of a sortable session (rfcs/0001-v3.md §6): what its slot is, how the slot
 * moves over a list, and what the drop puts there. A session (`Session.mode`) sorts the
 * dragged item itself (`sort`), its copy (`copy`) or the item a list made for a plain
 * draggable (`insert`); while it holds an exchange (`behavior: 'swap'`) its mode is
 * `swap` (`modeOf`). The group calls the steps of the mode; multi-drag blocks
 * (`block.ts`), insertion lines (`indicator.ts`), trees and drops into an item
 * (`combine.ts`) are handled apart from the modes.
 */

import type { Coordinates, DnDEvent, DragMode, Key, KeyboardMoveContext } from '../../types';
import { listOf, type GroupContext, type Session } from '../context';
import type { ListEntry } from '../entry';
import type { DropFacts } from '../group';
import { isSwapping, partitionMoved, type Partition } from '../accept';

export interface SortableMode {
  /** The drop event's `mode`. */
  readonly name: DragMode;
  /**
   * The dragged items leave their places on drop (keys a list rejects go back there), and
   * a removal (trash zones, `dropOutside: 'remove'`) takes them out of their lists.
   */
  readonly moves: boolean;
  /** `manager.mode` while the session is as it is. */
  dragMode(g: GroupContext, current: Session): DragMode;
  /** Which dragged keys `list`, which isn't disabled, takes. */
  partition(g: GroupContext, list: ListEntry, current: Session): Partition;
  /** The drag can never enter `list`. */
  inert?(list: ListEntry): boolean;
  /** The drag enters `target`: makes its slot there; `false` when it can have none. */
  enter?(g: GroupContext, current: Session, target: ListEntry): boolean;
  /**
   * The pointer moves over `target`, a list that takes the drag and shows items (no
   * insertion line). `blocked`: the list the slot just left, which can't take it back
   * yet. `true`: the slot moved to where the pointer projects it, so a block lines up
   * with the pointer again once rendered (`followBlock`).
   */
  over(g: GroupContext, current: Session, target: ListEntry, event: DnDEvent, blocked: boolean): boolean;
  /** The pointer left the lists, or is over one that refuses the drag. */
  leave?(g: GroupContext, current: Session): void;
  /** Keys put at the slot for the dragged `keys`: the block that travels, what a drop inserts. */
  inserted(g: GroupContext, current: Session, keys: Key[]): Key[];
  /** Key standing for the dragged `key` where it lands: whose item the drop event reports, where its clone lands. */
  placed(current: Session, key: Key): Key;
  /** Dragged key the block member `key` stands for (by default `key` itself). */
  original?(current: Session, key: Key): Key;
  /** What the drop event tells in this mode on top of the rest (a swap's partner). */
  facts?(g: GroupContext, current: Session): Partial<DropFacts>;
  /** The drag was cancelled. */
  cancel?(g: GroupContext, current: Session): void;
  /** Keyboard, while no list holds the slot: the arrow may take the drag into one. */
  enterByKey?(g: GroupContext, current: Session, context: KeyboardMoveContext): Promise<Coordinates | undefined>;
}

/** The steps of the modes in which the dragged items themselves move (`sort`, `swap`). */
export const moving = {
  moves: true,
  // In a list that swaps (as the origin does), the drop exchanges.
  dragMode: (g: GroupContext, current: Session): DragMode =>
    isSwapping(g, current, listOf(g, current.list)) ? 'swap' : 'move',
  partition: partitionMoved,
  inserted: (_g: GroupContext, _current: Session, keys: Key[]) => keys,
  placed: (_current: Session, key: Key) => key,
};
