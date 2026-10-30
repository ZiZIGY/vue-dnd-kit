import { ref, shallowRef, type ComputedRef, type InjectionKey } from 'vue';
import type { Active, Announcements, DnDEvent, Key } from '@vue-dnd-kit/core';

export interface Track {
  id: string;
  title: string;
  artist: string;
  /** Seconds. */
  duration: number;
  color: string;
}

/** A queue slot: the same track can be queued more than once. */
export interface QueueEntry {
  id: string;
  trackId: string;
}

const track = (id: string, title: string, artist: string, duration: number, color: string): Track => ({
  id,
  title,
  artist,
  duration,
  color,
});

export const LIBRARY: readonly Track[] = [
  track('midnight', 'Midnight Drive', 'The Velvet Hours', 222, '#6366f1'),
  track('ocean', 'Ocean Static', 'Low Tide', 245, '#0ea5e9'),
  track('neon', 'Neon Lights', 'Aurora Lane', 198, '#ec4899'),
  track('glass', 'Glass Houses', 'Paper Kites Club', 177, '#14b8a6'),
  track('ember', 'Ember', 'Northbound', 213, '#f97316'),
  track('satellite', 'Satellite Hearts', 'Mono Bloom', 261, '#8b5cf6'),
  track('paper', 'Paper Planes', 'Sunday Static', 185, '#65a30d'),
  track('tides', 'Slow Tides', 'Harbor Lights', 312, '#0891b2'),
];

export const formatDuration = (seconds: number): string =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

/** Id of the library droppable (dropping a queued track there removes it). */
export const LIBRARY_ZONE = 'library';
/** Item type of library tracks (plain draggables the queue makes entries for). */
export const TRACK_TYPE = 'track';

export interface LogEntry {
  id: number;
  kind: keyof Announcements;
  text: string;
}

/** Same pacing as the provider's live region: moves are spoken once the drag rests for 500 ms. */
const OVER_DELAY = 500;

/**
 * State of the player, shared by the provider's `announcements` (created outside the
 * provider) and the lists inside it.
 */
export function createPlayer() {
  const queue = ref<QueueEntry[]>([
    { id: 'q1', trackId: 'midnight' },
    { id: 'q2', trackId: 'ocean' },
    { id: 'q3', trackId: 'neon' },
    { id: 'q4', trackId: 'glass' },
  ]);
  /** Draft order of the queue while dragging; bound by the queue list. */
  const draft = shallowRef<ComputedRef<QueueEntry[]> | null>(null);
  const log = ref<LogEntry[]>([]);

  let created = queue.value.length;
  /** Entry made for the library track being dragged (`createItem`). */
  let pending: string | null = null;

  const trackOf = (entry: QueueEntry): Track => LIBRARY.find((item) => item.id === entry.trackId)!;

  const createEntry = (active: Active): QueueEntry | undefined => {
    if (!active.type.includes(TRACK_TYPE)) return undefined;
    pending = `q${++created}`;
    return { id: pending, trackId: (active.data as Track).id };
  };

  const add = (trackId: string) => queue.value.push({ id: `q${++created}`, trackId });
  const remove = (id: Key) => (queue.value = queue.value.filter((entry) => entry.id !== id));

  // ─── Announcements: track names and queue positions ──────────────────────────
  const isTrack = (active: Active) => active.type.includes(TRACK_TYPE);
  // Library tracks carry the track, queue entries carry the entry (it may be gone from the queue by now).
  const name = (active: Active) => {
    const item = isTrack(active) ? (active.data as Track) : trackOf(active.data as QueueEntry);
    return `“${item.title}” by ${item.artist}`;
  };
  /** Key of the dragged slot in the queue: the entry itself, or the one made for a library track. */
  const slotKey = (active: Active) => (isTrack(active) ? pending : active.id);
  const position = (entries: readonly QueueEntry[], key: Key | null) => {
    const index = key == null ? -1 : entries.findIndex((entry) => entry.id === key);
    return index === -1 ? null : `position ${index + 1} of ${entries.length}`;
  };

  /** Pick-up text and spot: until the entry really moves there is nothing new to say. */
  let start: { text: string; spot: string | null } | null = null;

  const texts: Partial<Announcements> = {
    onDragStart: ({ active }) => {
      pending = null;
      const spot = isTrack(active) ? null : position(queue.value, active.id);
      const text = spot
        ? `Picked up ${name(active)}, ${spot} in the queue.`
        : `Picked up ${name(active)} from the library.`;
      start = { text, spot };
      return text;
    },
    onDragOver: ({ active, over }) => {
      if (over?.id === LIBRARY_ZONE && !isTrack(active)) {
        start = null;
        return `${name(active)} is over the library. Drop to remove it from the queue.`;
      }
      const spot = position(draft.value?.value ?? queue.value, slotKey(active));
      // Repeating the last text makes both debouncers (live region, log) skip it.
      if (start && spot === start.spot) return start.text;
      start = null;
      if (!spot) return `${name(active)} is not over the queue.`;
      return isTrack(active)
        ? `${name(active)} will be added at ${spot} in the queue.`
        : `${name(active)} moved to ${spot} in the queue.`;
    },
    // Runs after the drop was written into the queue.
    onDragEnd: ({ active, over }) => {
      if (over?.id === LIBRARY_ZONE && !isTrack(active)) return `${name(active)} removed from the queue.`;
      const spot = position(queue.value, slotKey(active));
      if (!spot) return `${name(active)} was not added to the queue.`;
      return isTrack(active)
        ? `${name(active)} added to the queue at ${spot}.`
        : `${name(active)} dropped at ${spot} in the queue.`;
    },
    onDragCancel: ({ active }) =>
      isTrack(active)
        ? `Cancelled. ${name(active)} was not added to the queue.`
        : `Cancelled. ${name(active)} returned to ${position(queue.value, active.id)} in the queue.`,
  };

  // The log shows what the live region says: moves are debounced like the provider's.
  let entryId = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  let last = '';
  const write = (kind: keyof Announcements, text: string) => {
    log.value.unshift({ id: ++entryId, kind, text });
    last = text;
  };
  const logged = (kind: keyof Announcements) => (event: DnDEvent) => {
    clearTimeout(timer);
    // The announcement types are distinct per kind; the end event is a DnDEvent too.
    const text = (texts[kind] as ((event: DnDEvent) => string | undefined) | undefined)?.(event);
    if (!text) return text;
    if (kind === 'onDragOver') {
      timer = setTimeout(() => text !== last && write(kind, text), OVER_DELAY);
    } else {
      write(kind, text);
    }
    return text;
  };

  const announcements: Partial<Announcements> = {
    onDragStart: logged('onDragStart'),
    onDragOver: logged('onDragOver'),
    onDragEnd: logged('onDragEnd'),
    onDragCancel: logged('onDragCancel'),
  };

  return {
    queue,
    draft,
    log,
    trackOf,
    createEntry,
    add,
    remove,
    announcements,
  };
}

export type Player = ReturnType<typeof createPlayer>;

export const PLAYER: InjectionKey<Player> = Symbol('player');
