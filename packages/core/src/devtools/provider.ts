/**
 * A provider as the devtools bridge follows it. It listens the way the library's own
 * layers do: a monitor for the drag events and watchers on the manager's state, in a
 * scope of its own that ends when the provider unmounts. The verdict of `onBeforeDrop`
 * is told by how the drag ends after a release; the drop of a sortable list by the
 * group's session, read as the session ends.
 */

import { effectScope, getCurrentInstance, watch, type ComponentInternalInstance } from 'vue';
import type { DnDEvent, Key } from '../types';
import type { DnDManager } from '../core/manager';
import type { GroupContext } from '../sortable/context';
import { snapshotActive, snapshotOver, snapshotProvider, snapshotSortableDrop } from './snapshot';
import type { CancelReason, DevtoolsEvent, DevtoolsProvider, SortableDropSnapshot } from './types';

export interface ProviderRecord extends DevtoolsProvider {
  /** Follows a sortable group of this provider. */
  addGroup(g: GroupContext): void;
  /** Stops following the provider. */
  stop(): void;
}

let providers = 0;

/** `DnDProvider · KanbanBoard`: the component that renders the provider, by name or file. */
const labelOf = (instance: ComponentInternalInstance | null): string => {
  const type = instance?.parent?.type as { name?: string; __name?: string; __file?: string } | undefined;
  const name = type?.name ?? type?.__name ?? type?.__file?.match(/([^/\\]+)\.vue$/)?.[1];
  return name ? `DnDProvider · ${name}` : 'DnDProvider';
};

/** Follows `manager`; called in the provider's `setup`. `emit` gets every event. */
export function createProviderRecord(
  manager: DnDManager,
  emit: (provider: DevtoolsProvider, event: DevtoolsEvent) => void,
): ProviderRecord {
  const instance = getCurrentInstance();
  const scope = effectScope(true);
  /** Followed groups, with the stop of their watcher. */
  const groups = new Map<GroupContext, () => void>();

  // The current drag: its number, the target it is over, when it was released (the
  // `onBeforeDrop` hooks run from then on) and the drops its sortable groups made.
  let drag = 0;
  let over: Key | null = null;
  let releasedAt: number | null = null;
  let drops: SortableDropSnapshot[] = [];

  const record: ProviderRecord = {
    id: `provider-${++providers}`,
    label: labelOf(instance),
    app: instance?.appContext.app ?? null,
    snapshot() {
      // Released groups (their last list unmounted) are done.
      for (const [g, stop] of groups) {
        if (g.lists.size) continue;
        stop();
        groups.delete(g);
      }
      return snapshotProvider(manager, groups.keys());
    },
    cancel: () => manager.cancel(),
    clearSelection: () => manager.selection.clear(),
    addGroup(g) {
      if (groups.has(g)) return;
      // The session is set when a drag starts and cleared when it ends: what it held then
      // is the drop it made (or prepared before a rejection).
      const stop = scope.run(() =>
        watch(
          g.session,
          (_next, previous) => {
            const drop = previous && snapshotSortableDrop(g, previous);
            if (drop) drops.push(drop);
          },
          { flush: 'sync' },
        ),
      )!;
      groups.set(g, stop);
    },
    stop() {
      scope.stop();
      removeMonitor();
      groups.clear();
    },
  };

  const send = (event: DevtoolsEvent) => emit(record, event);
  const waited = () => (releasedAt === null ? null : Math.round(performance.now() - releasedAt));
  const takeDrops = () => {
    const taken = drops;
    drops = [];
    return taken;
  };
  const ended = () => {
    over = null;
    releasedAt = null;
  };
  /** The list a drag comes from. The start event is made before the groups start their sessions: ask them. */
  const sourceOf = (id: Key): Key | null => {
    for (const g of groups.keys()) {
      const current = g.session.value;
      if (current?.activeKey === id) return current.origin.list;
    }
    return null;
  };

  // An ordinary monitor: it hears the drop after the sortable groups wrote it.
  const removeMonitor = manager.addMonitor({
    onDragStart(event) {
      drag++;
      ended();
      drops = [];
      send({
        type: 'start',
        drag,
        active: snapshotActive(event.active),
        pointer: event.pointer,
        source: event.source?.list ?? sourceOf(event.active.id),
      });
    },
    onDragOver(event) {
      const previous = over;
      over = event.over?.id ?? null;
      send({ type: 'over', drag, over: snapshotOver(event.over), previous });
    },
    onDragMove: () => send({ type: 'move', drag }),
    onBeforeDrop(event: DnDEvent) {
      releasedAt = performance.now();
      send({ type: 'release', drag, over: snapshotOver(event.over) });
    },
    onDragEnd(event) {
      const accepted = new Set(event.accepted);
      send({
        type: 'drop',
        drag,
        over: snapshotOver(event.over),
        dropped: event.dropped,
        accepted: [...event.accepted],
        rejected: event.active.ids.filter((id) => !accepted.has(id)),
        waited: waited() ?? 0,
        sortable: takeDrops(),
      });
      ended();
    },
    onDragCancel(event) {
      // After a release the drop was decided against: by a hook, or by the target's `accept`.
      const reason: CancelReason =
        releasedAt === null ? 'cancelled' : event.over && !event.over.accepted ? 'refused' : 'rejected';
      send({ type: 'cancel', drag, reason, over: snapshotOver(event.over), waited: waited(), sortable: takeDrops() });
      ended();
    },
  });

  scope.run(() => {
    const sync = { flush: 'sync' } as const;
    watch(manager.status, (status) => send({ type: 'status', status }), sync);
    watch(manager.isAutoScrolling, (scrolling) => send({ type: 'autoScroll', scrolling }), sync);
    watch(
      manager.announcement,
      (text) => {
        // A repeated text gets a trailing space (screen readers speak changes only).
        if (text.trim()) send({ type: 'announcement', text: text.trim() });
      },
      sync,
    );
    // Iterating the set tracks every change of it.
    watch(
      () => [...manager.selection],
      (ids) => send({ type: 'selection', ids }),
    );
  });

  return record;
}
