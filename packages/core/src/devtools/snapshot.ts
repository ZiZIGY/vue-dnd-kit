/**
 * Read-only snapshots of a provider for the devtools: what its manager and sortable
 * groups know, as plain data. Nothing here changes state; the user's callbacks that run
 * are the ones a drag runs anyway (`accept` rules, `disabled` getters), except a list's
 * `createItem`, which is never called for a snapshot.
 */

import { toValue, unref } from 'vue';
import type { Active, Key, Over } from '../types';
import type { DnDManager, DraggableEntry, DroppableEntry } from '../core/manager';
import type { GroupContext, Session } from '../sortable/context';
import type { ListEntry } from '../sortable/entry';
import type {
  ActiveSnapshot,
  DraggableSnapshot,
  DroppableSnapshot,
  GroupSnapshot,
  ListSnapshot,
  OverSnapshot,
  ProviderSnapshot,
  SessionSnapshot,
  SortableDropSnapshot,
  SortableSessionSnapshot,
} from './types';

// ─── Drag state ────────────────────────────────────────────────────────────────

export const snapshotActive = (active: Active): ActiveSnapshot => ({
  id: active.id,
  ids: [...active.ids],
  items: active.items.map(({ id, type, data, item }) => (item === undefined ? { id, type, data } : { id, type, data, item })),
  type: active.type,
  sensor: active.sensor,
  element: active.element,
  rect: active.rect,
});

export const snapshotOver = (over: Over | null): OverSnapshot | null =>
  over && { id: over.id, accepted: over.accepted, data: over.data, element: over.element, rect: over.rect };

const snapshotSession = (manager: DnDManager): SessionSnapshot => {
  const active = manager.active.value;
  return {
    status: manager.status.value,
    active: active && snapshotActive(active),
    over: snapshotOver(manager.over.value),
    pointer: manager.pointer.value,
    transform: manager.transform.value,
    mode: manager.mode.value,
    landingKey: manager.landingKey.value,
    landings: [...manager.landings.value],
    fitSize: manager.fitSize.value,
    overlay: !!active && manager.hasOverlay,
    overlayElement: manager.overlayElement.value,
    previews: [...manager.previewIds],
    settling: manager.settling.value,
    dropTarget: snapshotOver(manager.dropTarget.value),
    autoScrolling: manager.isAutoScrolling.value,
    activation: manager.activationProgress.value,
    // The live region adds a space to repeat a text (screen readers speak changes only).
    announcement: manager.announcement.value.trim(),
  };
};

// ─── Sortable ──────────────────────────────────────────────────────────────────

export const snapshotSortableSession = (current: Session): SortableSessionSnapshot => ({
  activeKey: current.activeKey,
  lead: current.lead,
  keys: [...current.keys],
  origin: { ...current.origin },
  slot: current.slot,
  list: current.list,
  // The session's own mode: a held exchange shows in the drag's `mode` ('swap').
  kind: current.mode.name as SortableSessionSnapshot['kind'],
  block: [...current.block],
  swap: current.swap,
  removed: current.removed,
});

/** The drop a session prepared (in `onBeforeDrop`) or made, if any. */
export const snapshotSortableDrop = (g: GroupContext, current: Session): SortableDropSnapshot | null => {
  const event = current.result?.event;
  if (!event) return null;
  return {
    group: g.name,
    keys: [...event.keys],
    accepted: [...event.accepted],
    rejected: [...event.rejected],
    from: { ...event.from },
    to: { ...event.to },
    sameList: event.sameList,
    mode: event.mode,
    ...(event.partner ? { partner: event.partner.key } : {}),
    result: event.result,
    defaultPrevented: event.defaultPrevented,
  };
};

/**
 * Whether a drop target takes the drag: `null` while nothing is dragged (or the drop is
 * decided). A plain draggable entering a list makes the list create an item for it, so
 * lists are asked only as the target the drag is over.
 */
const acceptingOf = (manager: DnDManager, entry: DroppableEntry, g: GroupContext | undefined): boolean | null => {
  const active = manager.active.value;
  if (!active || manager.settling.value) return null;
  if (entry.isDisabled()) return false;
  const over = manager.over.value;
  if (over?.id === entry.id) return over.accepted;
  if (g && g.session.value?.mode.name === 'insert') return null;
  return entry.accepts(active);
};

const snapshotList = (manager: DnDManager, g: GroupContext, list: ListEntry): ListSnapshot => {
  const keys = list.getKeys();
  const droppable = manager.getDroppable(list.id);
  return {
    id: list.id,
    kind: list.layout.nested ? 'tree' : 'list',
    group: g.name,
    strategy: list.strategy(),
    placeholder: list.placeholder(),
    behavior: list.behavior?.() ?? 'sort',
    multiple: list.multiple?.() ?? 'stack',
    pull: list.pull(),
    sort: list.canSort(),
    dropOutside: list.dropOutside(),
    acceptMode: list.acceptMode?.() ?? 'all',
    disabled: list.isDisabled(),
    controlled: list.isReadonly(),
    count: keys.length,
    keys,
    draft: list.draft.value,
    element: list.getElement(),
    over: manager.over.value?.id === list.id,
    accepting: droppable ? acceptingOf(manager, droppable, g) : null,
  };
};

const snapshotGroup = (manager: DnDManager, g: GroupContext): GroupSnapshot => {
  const current = g.session.value;
  return {
    name: g.name,
    lists: [...g.lists.values()].map((list) => snapshotList(manager, g, list)),
    session: current && snapshotSortableSession(current),
    indicator: g.indicator.value,
  };
};

// ─── Registry ──────────────────────────────────────────────────────────────────

const snapshotDraggable = (manager: DnDManager, entry: DraggableEntry, listOf: Map<Key, Key>): DraggableSnapshot => ({
  id: entry.id,
  type: entry.getTypes(),
  disabled: entry.isDisabled(),
  selected: manager.selection.has(entry.id),
  dragging: manager.active.value?.ids.includes(entry.id) ?? false,
  element: entry.getElement(),
  handle: entry.getHandle(),
  data: entry.getData(),
  // Sortable items have a container: their list.
  list: entry.getContainer ? (listOf.get(entry.id) ?? null) : null,
});

const snapshotDroppable = (manager: DnDManager, entry: DroppableEntry, g: GroupContext | undefined): DroppableSnapshot => ({
  id: entry.id,
  // A function is a rule, not a getter: `unref`, as the droppable reads it.
  accept: unref(entry.options?.accept),
  acceptMode: toValue(entry.options?.acceptMode) ?? 'all',
  priority: entry.getPriority(),
  disabled: entry.isDisabled(),
  over: manager.over.value?.id === entry.id,
  accepting: acceptingOf(manager, entry, g),
  element: entry.getElement(),
  data: entry.getData(),
  sortable: !!entry.sortable,
});

/** Everything the provider knows; `groups` are its sortable groups (released ones are skipped). */
export const snapshotProvider = (manager: DnDManager, groups: Iterable<GroupContext>): ProviderSnapshot => {
  const live = [...groups].filter((g) => g.lists.size > 0);
  // Which list each key is in (draft order while dragging), and the group of each list.
  const listOf = new Map<Key, Key>();
  const groupOf = new Map<Key, GroupContext>();
  for (const g of live) {
    for (const list of g.lists.values()) {
      groupOf.set(list.id, g);
      for (const key of list.draft.value ?? list.getKeys()) listOf.set(key, list.id);
    }
  }
  return {
    status: manager.status.value,
    options: { ...manager.props },
    draggables: [...manager.getDraggables()].map((entry) => snapshotDraggable(manager, entry, listOf)),
    droppables: [...manager.getDroppables()].map((entry) =>
      snapshotDroppable(manager, entry, entry.sortable ? groupOf.get(entry.id) : undefined),
    ),
    groups: live.map((g) => snapshotGroup(manager, g)),
    selection: [...manager.selection],
    session: snapshotSession(manager),
  };
};
