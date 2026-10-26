/**
 * The event log: what happened in each drag, as the bridge tells it. The events of one
 * drag share its number (the tab groups them). Moves aren't logged (one per frame); the
 * mini-map shows where the drag is.
 */

import type { DevtoolsEvent, DevtoolsProvider, OverSnapshot, SortableDropSnapshot } from '@vue-dnd-kit/core/devtools';
import type { LogEntry } from '../protocol';
import { keyLabel, keysLabel, preview } from './preview';

/** An entry before it is numbered and timed. */
export type LogLine = Pick<LogEntry, 'title' | 'subtitle'> & { level?: LogEntry['level']; data: Record<string, unknown> };

const target = (over: OverSnapshot | null) => (over ? keyLabel(over.id) : 'no target');

/** `list a 0 → list b 2`, and whether the write was prevented. */
const sortableLabel = (drop: SortableDropSnapshot) => {
  const to = drop.to.index === -1 ? `removed from ${keyLabel(drop.to.list)}` : `${keyLabel(drop.to.list)}[${drop.to.index}]`;
  const from = drop.from.list == null ? 'outside' : `${keyLabel(drop.from.list)}[${drop.from.index}]`;
  return `${drop.mode} ${from} → ${to}${drop.defaultPrevented ? ' (prevented)' : ''}`;
};

/** What `onBeforeDrop` decided, from how the drag ended after the release. */
const verdict = (event: Extract<DevtoolsEvent, { type: 'drop' | 'cancel' }>): LogLine => {
  const waited = `${event.waited ?? 0} ms`;
  if (event.type === 'cancel') {
    const refused = event.reason === 'refused';
    return {
      title: 'onBeforeDrop',
      subtitle: `${refused ? `refused by ${target(event.over)}'s accept` : 'rejected'} · ${waited}`,
      level: 'warning',
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

/** The lines of an event (none for moves and plain state changes); `released`: `onBeforeDrop` decided its end. */
export const logLines = (event: DevtoolsEvent, released: boolean): LogLine[] => {
  switch (event.type) {
    case 'start': {
      const { active, sensor } = event;
      // The sensor by name (its kind of drag when that differs); the kind alone without one (`manager.start`).
      const by = sensor
        ? `${sensor.name ?? 'sensor'}${sensor.name === active.sensor ? '' : ` (${active.sensor})`}${sensor.touch ? ' · touch' : ''}`
        : active.sensor;
      return [
        {
          title: 'drag start',
          subtitle: `${keysLabel(active.ids)} · ${by}${event.source != null ? ` · from ${keyLabel(event.source)}` : ''}`,
          data: { active, sensor, pointer: event.pointer, source: event.source },
        },
      ];
    }
    case 'over':
      return [
        {
          title: event.over ? 'over' : 'left',
          subtitle: event.over ? `${keyLabel(event.over.id)} · ${event.over.accepted ? 'accepts' : 'refuses'}` : keyLabel(event.previous),
          level: event.over && !event.over.accepted ? 'warning' : 'default',
          data: { over: event.over, previous: event.previous },
        },
      ];
    case 'release':
      return [{ title: 'release', subtitle: `on ${target(event.over)} · onBeforeDrop…`, data: { over: event.over } }];
    case 'drop': {
      const sortable = event.sortable.map(sortableLabel).join('; ');
      return [
        ...(released ? [verdict(event)] : []),
        {
          title: 'drop',
          subtitle: event.dropped ? `on ${target(event.over)}${sortable ? ` · ${sortable}` : ''}` : 'outside every drop target',
          data: {
            over: event.over,
            dropped: event.dropped,
            accepted: event.accepted,
            rejected: event.rejected,
            ...(event.sortable.length ? { sortable: event.sortable } : {}),
          },
        },
      ];
    }
    case 'cancel':
      return [
        ...(released ? [verdict(event)] : []),
        {
          title: 'cancel',
          subtitle: event.reason === 'cancelled' ? 'cancelled' : `drop ${event.reason}`,
          level: event.reason === 'cancelled' ? 'default' : 'warning',
          data: { reason: event.reason, over: event.over, ...(event.sortable.length ? { sortable: event.sortable } : {}) },
        },
      ];
    case 'announcement':
      return [{ title: 'announcement', subtitle: event.text, data: { text: event.text } }];
    case 'autoScroll':
      return [{ title: event.scrolling ? 'auto-scroll on' : 'auto-scroll off', subtitle: '', data: { scrolling: event.scrolling } }];
    case 'change': {
      // A change of the items no drag made, which the list's `animate` plays.
      const what = [
        event.added.length ? `+${event.added.length}` : '',
        event.removed.length ? `−${event.removed.length}` : '',
        event.reordered ? 'reordered' : '',
      ].filter(Boolean);
      return [
        {
          title: 'animate',
          subtitle: `${keyLabel(event.list)} · ${what.join(' ')}`,
          data: { list: event.list, group: event.group, added: event.added, removed: event.removed, reordered: event.reordered },
        },
      ];
    }
    default:
      return [];
  }
};

/** Most entries kept: a tab opened later sees the drags before it. */
const KEPT = 500;

/** The log of the page: its entries, numbered, and the drag running at each provider. */
export function createLog() {
  let next = 0;
  const entries: LogEntry[] = [];
  /** The drag running at each provider: events without one of their own (announcements, auto-scroll) join it. */
  const drags = new Map<DevtoolsProvider, { drag: number | null; released: boolean }>();

  return {
    entries,
    /** Logs `event`; returns the new entries. */
    add(provider: DevtoolsProvider, event: DevtoolsEvent): LogEntry[] {
      let context = drags.get(provider) ?? { drag: null, released: false };
      if (event.type === 'start') context = { drag: event.drag, released: false };
      else if (event.type === 'release') context = { ...context, released: true };
      const drag = 'drag' in event ? event.drag : context.drag;
      const added = logLines(event, context.released).map(
        (line): LogEntry => ({
          id: ++next,
          time: Date.now(),
          provider: provider.id,
          drag,
          title: line.title,
          subtitle: line.subtitle,
          level: line.level ?? 'default',
          data: preview({ provider: provider.label, ...line.data }),
        }),
      );
      // The drop's announcement and the end of auto-scroll still belong to the drag.
      if (event.type === 'status' && event.status === 'idle') context = { drag: null, released: false };
      drags.set(provider, context);
      entries.push(...added);
      if (entries.length > KEPT) entries.splice(0, entries.length - KEPT);
      return added;
    },
    forget(provider: DevtoolsProvider) {
      drags.delete(provider);
    },
    clear() {
      entries.length = 0;
    },
  };
}

export type Log = ReturnType<typeof createLog>;
