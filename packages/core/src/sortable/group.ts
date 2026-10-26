/**
 * A sortable group: lists that exchange items. Holds the draft order of every list
 * during a drag, projects the pointer onto it, commits the result on drop, and runs
 * FLIP for every change it causes.
 *
 * This module wires a group to its manager; the group's state is a `GroupContext`
 * (`context.ts`) that every part gets passed: the session core (`session.ts`) running
 * the modes (`modes/`), the multi-drag block (`block.ts`) and slot moves (`slot.ts`),
 * insertion lines (`indicator.ts`), drops into items (`combine.ts`), keyboard moves
 * (`keyboard.ts`), the drop (`drop.ts`), the overlay (`landing.ts`), FLIP (`flip.ts`)
 * and announcements (`announcements.ts`).
 *
 * Multi-drag `'group'`: the other dragged items travel with the slot as a block,
 * contiguous in the draft and in drop order. Projection and keyboard moves count the
 * block once (`viewOf`), and every move takes the whole block along.
 */

import { effectScope, type ShallowRef } from 'vue';
import type { Active, Coordinates, Key, SortableIndicator } from '../types';
import type { DnDManager } from '../core/manager';
import { devtoolsHook } from '../core/devtoolsHook';
import { createContext, indexOf, keysOf, lookup, type Session } from './context';
import type { ListEntry } from './entry';
import { accepts, isInert } from './accept';
import { viewOf } from './block';
import { showIndicator } from './indicator';
import { leadOffset } from './landing';
import { targetRule } from './combine';
import { captureLayout, watchLayout } from './flip';
import { watchChanges } from './autoAnimate';
import { useCopyModifier } from './modifier';
import { move, start } from './session';
import { beforeDrop, cancel, end } from './drop';
import { getKeyboardCoordinates } from './keyboard';
import { placeAt } from './place';
import { createAnnouncer } from './announcements';

export interface SortableGroup {
  name: string;
  manager: DnDManager;
  session: ShallowRef<Session | null>;
  /** Insertion line of `placeholder: 'indicator'` lists, while the pointer is over one. */
  indicator: ShallowRef<SortableIndicator | null>;
  /** Shows the insertion line (trees move it with their own keys). */
  showIndicator(value: SortableIndicator | null): void;
  addList(entry: ListEntry): () => void;
  /** Animates `entry`'s changes that no drag made, while its `animate` is on. Call in the list's setup. */
  animateChanges(entry: ListEntry): void;
  registerItem(key: Key, getElement: () => HTMLElement | null): () => void;
  lookup(key: Key): unknown;
  keysOf(list: ListEntry): Key[];
  /** `list`'s draft as projection counts it: a multi-drag block once, as the slot. */
  viewOf(list: ListEntry): Key[];
  indexOf(list: ListEntry, key: Key): number;
  accepts(list: ListEntry, active: Active): boolean;
  /** The current drag can never enter this list (another group, or a plain draggable it can't create items for). */
  isInert(list: ListEntry): boolean;
  /** Where the lead's clone sits in the overlay, from the pointer (see `leadOffset`). */
  leadOffset(): Coordinates;
  captureLayout(): void;
}

const registries = new WeakMap<DnDManager, Map<string, SortableGroup>>();

function createGroup(manager: DnDManager, name: string, release: () => void): SortableGroup {
  const g = createContext(manager, name);
  devtoolsHook()?.group(g);
  const { lists, items, session } = g;
  const scope = effectScope(true);
  scope.run(() => {
    watchLayout(g);
    g.copyHeld = useCopyModifier(manager);
  });

  // An integration: the drop is written before the user's monitors hear `onDragEnd`.
  const removeMonitor = manager.addMonitor(
    {
      onDragStart: (event) => start(g, event),
      onDragMove: (event) => move(g, event),
      onBeforeDrop: (event) => beforeDrop(g, event),
      onDragEnd: (event) => end(g, event),
      onDragCancel: (event) => cancel(g, event),
      getKeyboardCoordinates: (_event, context) => getKeyboardCoordinates(g, context),
      placeAt: (active, position) => placeAt(g, active, position),
    },
    true,
  );
  const removeAnnouncer = manager.addAnnouncer(createAnnouncer(g));
  const removeRule = manager.addTargetRule(targetRule(g));
  // `e.source.remove()` in a trash zone's onDrop marks the dragged items for removal.
  const removeSource = manager.addSourceResolver((active) => {
    const current = session.value;
    if (!current || current.activeKey !== active.id || current.origin.list == null) return undefined;
    return {
      list: current.origin.list,
      remove: () => {
        current.removed = true;
      },
    };
  });

  return {
    name,
    manager,
    session,
    indicator: g.indicator,
    addList(entry) {
      lists.set(entry.id, entry);
      return () => {
        if (lists.get(entry.id) !== entry) return;
        lists.delete(entry.id);
        if (lists.size) return;
        removeMonitor();
        removeAnnouncer();
        removeRule();
        removeSource();
        scope.stop();
        release();
      };
    },
    animateChanges: (entry) => watchChanges(g, entry),
    registerItem(key, getElement) {
      items.set(key, getElement);
      // Created by the render a FLIP pass waits for.
      g.fresh?.add(key);
      return () => {
        if (items.get(key) === getElement) items.delete(key);
      };
    },
    showIndicator: (value) => showIndicator(g, value),
    lookup: (key) => lookup(g, key),
    keysOf,
    viewOf: (list) => (session.value ? viewOf(list, session.value) : keysOf(list)),
    indexOf: (list, key) => indexOf(g, list, key),
    accepts: (list, active) => accepts(g, list, active),
    isInert: (list) => isInert(g, list),
    leadOffset: () => leadOffset(g, session.value),
    captureLayout: () => captureLayout(g),
  };
}

export function useSortableGroup(manager: DnDManager, name: string): SortableGroup {
  let groups = registries.get(manager);
  if (!groups) {
    groups = new Map();
    registries.set(manager, groups);
  }
  const existing = groups.get(name);
  if (existing) return existing;
  const group = createGroup(manager, name, () => groups!.delete(name));
  groups.set(name, group);
  return group;
}
