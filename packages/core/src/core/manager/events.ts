/**
 * What a drag tells: events to the monitors, texts to screen readers.
 *
 * Integrations (library layers, see `addMonitor`) hear events first, so the user's
 * `onDragEnd` sees the drop they wrote, and decide `onBeforeDrop` last, after the user's
 * monitors. Texts are spoken by the provider's live region (`announcement`): the
 * provider's own `announcements` win, then integrations' (sortable positions), then the
 * defaults; moves are debounced, only the target the drag rests on is spoken.
 */

import type { Announcements, DnDEndEvent, DnDEvent, DnDMonitor, DragSource } from '../../types';
import { defaultAnnouncements } from '../a11y';
import type { ManagerContext } from './state';

type MonitorHandler = Exclude<keyof DnDMonitor, 'onBeforeDrop' | 'getKeyboardCoordinates'>;

const OVER_ANNOUNCE_DELAY = 500;

export type Events = ReturnType<typeof createEvents>;

export function createEvents(ctx: ManagerContext) {
  let announceTimer: ReturnType<typeof setTimeout> | undefined;
  let lastAnnouncement = '';

  // ─── Events ──────────────────────────────────────────────────────────────────

  const createEvent = (): DnDEvent => {
    const current = ctx.active.value!;
    const { origin } = ctx;
    const p = ctx.pointer.value ?? origin;
    let source: DragSource | undefined;
    for (const resolve of ctx.sourceResolvers) {
      source = resolve(current);
      if (source) break;
    }
    return {
      active: current,
      over: ctx.over.value,
      pointer: p,
      delta: { x: p.x - origin.x, y: p.y - origin.y },
      source,
    };
  };

  /** The monitors with integrations first (or last), each side in registration order. */
  const orderMonitors = (integrationsFirst: boolean): DnDMonitor[] => {
    const rank = (monitor: DnDMonitor) => Number(ctx.integrations.has(monitor) === integrationsFirst);
    return [...ctx.monitors].sort((a, b) => rank(b) - rank(a));
  };

  const emit = (name: MonitorHandler, event: DnDEvent | DnDEndEvent) => {
    // Integrations first (see `addMonitor`), each side in registration order.
    for (const monitor of orderMonitors(true)) {
      try {
        (monitor[name] as ((event: DnDEvent) => void) | undefined)?.(event);
      } catch (error) {
        console.error(error);
      }
    }
  };

  // ─── Announcements ───────────────────────────────────────────────────────────

  const setAnnouncement = (text: string) => {
    const { announcement } = ctx;
    // Screen readers only speak changes: repeating the same text needs a different string.
    announcement.value =
      text === lastAnnouncement && announcement.value === text ? `${text} ` : text;
    lastAnnouncement = text;
  };

  const announce = (name: keyof Announcements, event: DnDEvent = createEvent()) => {
    const custom = ctx.props.announcements;
    if (custom === false) return clearTimeout(announceTimer);
    type Announce = (this: unknown, event: DnDEvent) => string | undefined;
    let text: string | undefined;
    try {
      // The provider's own text wins, then announcers (sortable positions), then defaults.
      // `undefined`: not this source's business, the next one speaks; '': nothing to say.
      text = (custom?.[name] as Announce | undefined)?.call(custom, event);
      for (const announcer of ctx.announcers) {
        if (text !== undefined) break;
        text = (announcer[name] as Announce | undefined)?.call(announcer, event);
      }
      text ??= (defaultAnnouncements[name] as Announce).call(defaultAnnouncements, event);
    } catch (error) {
      // A throwing announcement must not break the session (§13).
      clearTimeout(announceTimer);
      console.error(error);
      return;
    }
    // Nothing new (e.g. the first target of a drag is where it started): neither speak
    // nor cancel what is pending.
    if (text === '') return;
    clearTimeout(announceTimer);
    if (!text) return;
    if (name === 'onDragOver') {
      // Debounced: only the target the pointer settles on is spoken, and only if it changed.
      announceTimer = setTimeout(() => {
        if (text !== lastAnnouncement) setAnnouncement(text);
      }, OVER_ANNOUNCE_DELAY);
    } else {
      setAnnouncement(text);
    }
  };

  return {
    createEvent,
    orderMonitors,
    emit,
    announce,
    /** Drops the pending move announcement (the provider unmounts). */
    stopAnnouncing: () => clearTimeout(announceTimer),
  };
}
