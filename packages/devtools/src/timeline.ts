/**
 * The timeline layer: what happened in a drag, as the bridge tells it. The events of one
 * drag share a group (the DevTools draw its span). Moves aren't logged (one per frame);
 * the inspector shows where the drag is.
 */

import type { DevtoolsEvent, DevtoolsProvider, OverSnapshot, SortableDropSnapshot } from '@vue-dnd-kit/core/devtools';
import { keyLabel, keysLabel, type TimelineEvent } from './format';

/** A timeline event without its time (the DevTools API's clock sets it). */
export type TimelineEntry = Omit<TimelineEvent, 'time'>;

const target = (over: OverSnapshot | null) => (over ? keyLabel(over.id) : 'no target');

/** `list a 0 → list b 2`, and whether the write was prevented. */
const sortableLabel = (drop: SortableDropSnapshot) => {
  const to = drop.to.index === -1 ? `removed from ${keyLabel(drop.to.list)}` : `${keyLabel(drop.to.list)}[${drop.to.index}]`;
  const from = drop.from.list == null ? 'outside' : `${keyLabel(drop.from.list)}[${drop.from.index}]`;
  return `${drop.mode} ${from} → ${to}${drop.defaultPrevented ? ' (prevented)' : ''}`;
};

/** What `onBeforeDrop` decided, from how the drag ended after the release. */
const verdict = (event: Extract<DevtoolsEvent, { type: 'drop' | 'cancel' }>): TimelineEntry => {
  const waited = `${event.waited ?? 0} ms`;
  if (event.type === 'cancel') {
    const refused = event.reason === 'refused';
    return {
      title: 'onBeforeDrop',
      subtitle: `${refused ? `refused by ${target(event.over)}'s accept` : 'rejected'} · ${waited}`,
      logType: 'warning',
      data: { verdict: refused ? 'refused (accept rule)' : 'rejected (false)', waited: event.waited },
    };
  }
  const partial = event.rejected.length > 0;
  return {
    title: 'onBeforeDrop',
    subtitle: `${partial ? `accepted ${event.accepted.length} of ${event.accepted.length + event.rejected.length}` : 'accepted'} · ${waited}`,
    data: { verdict: partial ? 'partial' : 'accepted', accepted: event.accepted, rejected: event.rejected, waited: event.waited },
  };
};

/** Where an event happened. */
export interface DragContext {
  /** The drag running at the provider: events without one of their own (announcements, auto-scroll) join it. */
  drag: number | null;
  /** The drag was released before it ended, so `onBeforeDrop` decided. */
  released: boolean;
}

/** The timeline entries of an event (none for moves and plain state changes). */
export const timelineEntries = (provider: DevtoolsProvider, event: DevtoolsEvent, { drag, released }: DragContext): TimelineEntry[] => {
  const within = 'drag' in event ? event.drag : drag;
  const groupId = within == null ? undefined : `${provider.id}:${within}`;
  const entry = (value: TimelineEntry): TimelineEntry => ({
    ...value,
    ...(groupId ? { groupId } : {}),
    data: { provider: provider.label, ...value.data },
  });

  switch (event.type) {
    case 'start': {
      const { active, sensor } = event;
      // The sensor by name (its kind of drag when that differs); the kind alone without one (`manager.start`).
      const by = sensor
        ? `${sensor.name ?? 'sensor'}${sensor.name === active.sensor ? '' : ` (${active.sensor})`}${sensor.touch ? ' · touch' : ''}`
        : active.sensor;
      return [
        entry({
          title: 'drag start',
          subtitle: `${keysLabel(active.ids)} · ${by}${event.source != null ? ` · from ${keyLabel(event.source)}` : ''}`,
          data: { active, sensor, pointer: event.pointer, source: event.source },
        }),
      ];
    }
    case 'over':
      return [
        entry({
          title: event.over ? 'over' : 'left',
          subtitle: event.over
            ? `${keyLabel(event.over.id)} · ${event.over.accepted ? 'accepts' : 'refuses'}`
            : `${keyLabel(event.previous)}`,
          logType: event.over && !event.over.accepted ? 'warning' : 'default',
          data: { over: event.over, previous: event.previous },
        }),
      ];
    case 'release':
      return [entry({ title: 'release', subtitle: `on ${target(event.over)} · onBeforeDrop…`, data: { over: event.over } })];
    case 'drop': {
      const sortable = event.sortable.map(sortableLabel).join('; ');
      return [
        ...(released ? [entry(verdict(event))] : []),
        entry({
          title: 'drop',
          subtitle: event.dropped ? `on ${target(event.over)}${sortable ? ` · ${sortable}` : ''}` : 'outside every drop target',
          data: {
            over: event.over,
            dropped: event.dropped,
            accepted: event.accepted,
            rejected: event.rejected,
            ...(event.sortable.length ? { sortable: event.sortable } : {}),
          },
        }),
      ];
    }
    case 'cancel':
      return [
        ...(released ? [entry(verdict(event))] : []),
        entry({
          title: 'cancel',
          subtitle: event.reason === 'cancelled' ? 'cancelled' : `drop ${event.reason}`,
          logType: event.reason === 'cancelled' ? 'default' : 'warning',
          data: { reason: event.reason, over: event.over, ...(event.sortable.length ? { sortable: event.sortable } : {}) },
        }),
      ];
    case 'announcement':
      return [entry({ title: 'announcement', subtitle: event.text, data: { text: event.text } })];
    case 'autoScroll':
      return [entry({ title: event.scrolling ? 'auto-scroll on' : 'auto-scroll off', data: { scrolling: event.scrolling } })];
    case 'change': {
      // A change of the items no drag made, which the list's `animate` plays.
      const what = [
        event.added.length ? `+${event.added.length}` : '',
        event.removed.length ? `−${event.removed.length}` : '',
        event.reordered ? 'reordered' : '',
      ].filter(Boolean);
      return [
        entry({
          title: 'animate',
          subtitle: `${keyLabel(event.list)} · ${what.join(' ')}`,
          data: { list: event.list, group: event.group, added: event.added, removed: event.removed, reordered: event.reordered },
        }),
      ];
    }
    default:
      return [];
  }
};
