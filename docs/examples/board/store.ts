import { computed, inject, ref, shallowRef, type InjectionKey } from 'vue';
import type { Key, SortableDropEvent } from '@vue-dnd-kit/core';
import { useDnDActions } from '@vue-dnd-kit/actions';

export interface Person {
  id: string;
  name: string;
  color: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

/** 0 none, 1 low, 2 medium, 3 high, 4 urgent. */
export type Priority = 0 | 1 | 2 | 3 | 4;

export interface Card {
  id: string;
  title: string;
  description: string;
  labels: string[];
  people: string[];
  priority: Priority;
  due: Date | null;
  comments: number;
  files: number;
  /** A cover drawn by Card.vue's CSS. */
  cover?: 'aurora' | 'blueprint' | 'dusk';
}

export interface Column {
  id: string;
  title: string;
  color: string;
  /** How far along its status icon is: 0 to 1. */
  progress: number;
  /** Work-in-progress limit: the column takes no more cards than this. */
  limit?: number;
  /** Cards coming in from another column ask first. */
  confirm?: boolean;
  cards: Card[];
}

/** What the Done question answers: words that `onBeforeDrop` understands as they are. */
export type Answer = 'accept' | 'continue' | 'reject';

export const PEOPLE: Person[] = [
  { id: 'ada', name: 'Ada', color: '#e8590c' },
  { id: 'kenji', name: 'Kenji', color: '#1c7ed6' },
  { id: 'maya', name: 'Maya', color: '#c2255c' },
  { id: 'noor', name: 'Noor', color: '#0ca678' },
  { id: 'theo', name: 'Theo', color: '#7048e8' },
];

export const LABELS: Label[] = [
  { id: 'bug', name: 'Bug', color: '#f43f5e' },
  { id: 'feature', name: 'Feature', color: '#3b82f6' },
  { id: 'design', name: 'Design', color: '#a855f7' },
  { id: 'docs', name: 'Docs', color: '#f59e0b' },
  { id: 'perf', name: 'Perf', color: '#14b8a6' },
  { id: 'a11y', name: 'A11y', color: '#22c55e' },
];

export const PRIORITIES = ['No priority', 'Low', 'Medium', 'High', 'Urgent'] as const;

export const person = (id: string) => PEOPLE.find((entry) => entry.id === id)!;
export const label = (id: string) => LABELS.find((entry) => entry.id === id)!;

/** Midnight, `offset` days from today: the due dates stay close to whenever you look. */
const day = (offset: number) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
};

/** How a due date reads on a card: overdue and close ones stand out. */
export const dueOf = (date: Date) => {
  const days = Math.round((date.getTime() - day(0).getTime()) / 86_400_000);
  const text = days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  if (days < 0) return { text, tone: 'overdue', hint: `Overdue by ${-days} day${days < -1 ? 's' : ''}` };
  if (days <= 1) return { text, tone: 'soon', hint: `Due ${text.toLowerCase()}` };
  return { text, tone: '', hint: `Due in ${days} days` };
};

/** A sample card: `due` in days from today. */
const card = (id: number, title: string, fields: Omit<Partial<Card>, 'due'> & { due?: number } = {}): Card => ({
  description: '',
  labels: [],
  people: [],
  priority: 0,
  comments: 0,
  files: 0,
  ...fields,
  id: `VDK-${id}`,
  title,
  due: fields.due === undefined ? null : day(fields.due),
});

const sample = (): Column[] => [
  {
    id: 'todo',
    title: 'Todo',
    color: '#8b8b94',
    progress: 0,
    cards: [
      card(41, 'Overlay jumps when the page scrolls in Safari', {
        labels: ['bug'], people: ['ada'], priority: 4, due: -1, comments: 6, files: 1,
        description: 'Scroll the page while dragging a card in Safari 17: the overlay lags one frame behind, then snaps back under the pointer.',
      }),
      card(38, 'Drag handles for table rows', { labels: ['feature'], people: ['kenji'], priority: 2, due: 5, comments: 2 }),
      card(46, 'Snap guides on the canvas', { labels: ['feature', 'design'], people: ['noor', 'theo'], priority: 2, due: 12, cover: 'blueprint', files: 2 }),
      card(44, 'Migration guide from v2', {
        labels: ['docs'], people: ['maya'], priority: 1, due: 9, files: 3,
        description: 'Every renamed option, with a before and after. Start from the questions people asked most in v2 issues.',
      }),
      card(47, 'Flaky drop test on CI', { labels: ['bug'], people: ['theo'], priority: 3, comments: 4 }),
      card(45, 'Haptics on Android tablets', { labels: ['feature'] }),
    ],
  },
  {
    id: 'doing',
    title: 'In progress',
    color: '#f59e0b',
    progress: 0.5,
    limit: 4,
    cards: [
      card(33, 'Keyboard sorting across columns', {
        labels: ['feature', 'a11y'], people: ['ada', 'kenji'], priority: 3, due: 1, comments: 9,
        description: 'Arrow keys across the lists move the card to the next column of its group, level with where it was.',
      }),
      card(36, 'Empty state artwork', { labels: ['design'], people: ['noor'], priority: 2, cover: 'aurora', comments: 3, files: 4 }),
      card(39, 'Virtual list re-measure on resize', { labels: ['perf'], people: ['theo'], priority: 2, due: 3, comments: 1 }),
    ],
  },
  {
    id: 'review',
    title: 'In review',
    color: '#8b5cf6',
    progress: 0.75,
    limit: 2,
    cards: [
      card(30, 'Faster auto-scroll near the edges', { labels: ['perf'], people: ['kenji'], priority: 3, comments: 5, files: 1 }),
      card(31, 'Focus ring after a drop', { labels: ['bug', 'a11y'], people: ['maya'], priority: 2, due: 0, comments: 2 }),
    ],
  },
  {
    id: 'done',
    title: 'Done',
    color: '#42b883',
    progress: 1,
    confirm: true,
    cards: [
      card(21, 'Sortable trees', { labels: ['feature'], people: ['kenji', 'ada'], priority: 3, comments: 12, files: 2 }),
      card(24, 'Landing animation polish', { labels: ['design'], people: ['noor'], priority: 1, cover: 'dusk' }),
      card(26, 'Selection survives virtual scroll', { labels: ['bug'], people: ['theo'], priority: 2, comments: 3 }),
      card(27, 'Announcements in nine languages', { labels: ['a11y', 'docs'], people: ['maya'], priority: 1, comments: 4 }),
    ],
  },
];

/**
 * The board's state, shared by every part of it and by the overlay. The columns own the
 * cards; the lists only read them, filtered, and each drop is applied here (`apply`).
 */
export function createBoard() {
  const columns = ref(sample());
  let lastId = 47;

  const cards = computed(() => columns.value.flatMap((column) => column.cards));
  const find = (id: Key) => {
    for (const column of columns.value) {
      const index = column.cards.findIndex((entry) => entry.id === id);
      if (index >= 0) return { column, index, card: column.cards[index]! };
    }
    return null;
  };
  const column = (id: Key) => columns.value.find((entry) => entry.id === id);
  /** The card open in the side panel. */
  const opened = ref<string | null>(null);
  const openedCard = computed(() => (opened.value ? find(opened.value)?.card : undefined));
  /** Room left in a column for these cards: those already in it don't count twice. */
  const fits = (target: Column, ids: Key[]) =>
    !target.limit || target.cards.filter((entry) => !ids.includes(entry.id)).length + ids.length <= target.limit;

  // ─── Filters ─────────────────────────────────────────────────────────────────

  const query = ref('');
  /** People whose cards are shown; none picked shows everyone's. */
  const people = ref<string[]>([]);
  const filtering = computed(() => !!query.value.trim() || people.value.length > 0);

  const matches = (entry: Card) => {
    const words = query.value.trim().toLowerCase();
    const text = [entry.id, entry.title, ...entry.labels.map((id) => label(id).name), ...entry.people.map((id) => person(id).name)]
      .join(' ')
      .toLowerCase();
    return (!words || text.includes(words)) && (!people.value.length || entry.people.some((id) => people.value.includes(id)));
  };
  const clearFilters = () => {
    query.value = '';
    people.value = [];
  };

  /**
   * A column's cards once a drop has changed the ones shown: those fill the places the
   * shown cards had, in their new order, and the filtered-out cards stay where they were.
   */
  const merge = (all: Card[], shown: Card[]) => {
    const queue = [...shown];
    const merged: Card[] = [];
    for (const entry of all) {
      if (!matches(entry)) merged.push(entry);
      else if (queue.length) merged.push(queue.shift()!);
    }
    // Cards that came in from another column and found no place left: at the end.
    return [...merged, ...queue];
  };

  /** Applies a drop: `result` holds the new (filtered) cards of every column it changed. */
  const apply = (event: SortableDropEvent<Card>) => {
    for (const [id, shown] of event.result) {
      const target = column(id);
      if (target) target.cards = merge(target.cards, shown);
    }
  };

  // ─── Notices and undo ────────────────────────────────────────────────────────

  const notice = shallowRef<{ text: string; undo?: () => void } | null>(null);
  let timer: ReturnType<typeof setTimeout> | undefined;
  const notify = (text: string, undo?: () => void) => {
    clearTimeout(timer);
    notice.value = { text, undo };
    timer = setTimeout(() => (notice.value = null), 6000);
  };
  const dismiss = () => {
    clearTimeout(timer);
    notice.value = null;
  };

  /** Deletes cards, keeping where each one was: Undo puts them back there. */
  const remove = (ids: Key[]) => {
    const removed = ids.flatMap((id) => {
      const place = find(id);
      return place ? [{ columnId: place.column.id, index: place.index, card: place.card }] : [];
    });
    if (!removed.length) return;
    for (const entry of columns.value) entry.cards = entry.cards.filter((each) => !ids.includes(each.id));
    if (opened.value && ids.includes(opened.value)) opened.value = null;
    const what = removed.length > 1 ? `${removed.length} cards` : removed[0]!.card.id;
    notify(`Deleted ${what}`, () => {
      // The first places first: each one is counted with the cards already back.
      for (const { columnId, index, card: back } of [...removed].sort((a, b) => a.index - b.index)) {
        column(columnId)?.cards.splice(index, 0, back);
      }
      notify(`Restored ${what}`);
    });
  };

  const add = (target: Column, title: string) => {
    const created = card(++lastId, title);
    target.cards.push(created);
    // A new card shows up even when the filters would hide it.
    if (!matches(created)) clearFilters();
    return created;
  };

  // ─── The Done question and the check ─────────────────────────────────────────

  /** The open question about cards moving into Done, and how to answer the waiting drop. */
  const question = shallowRef<{ cards: Card[]; resolve: (answer: Answer) => void } | null>(null);
  const ask = (moving: Card[]) => new Promise<Answer>((resolve) => (question.value = { cards: moving, resolve }));
  const answer = (value: Answer) => {
    question.value?.resolve(value);
    question.value = null;
  };

  /** Cards that have just landed in Done: they play their check for a moment. */
  const completed = ref(new Set<Key>());
  const complete = (ids: Key[]) => {
    completed.value = new Set(ids);
    setTimeout(() => (completed.value = new Set()), 1400);
  };

  return {
    columns,
    cards,
    find,
    column,
    fits,
    query,
    people,
    filtering,
    matches,
    clearFilters,
    apply,
    notice,
    notify,
    dismiss,
    remove,
    add,
    opened,
    openedCard,
    question,
    ask,
    answer,
    completed,
    complete,
  };
}

export type Board = ReturnType<typeof createBoard>;
export const BOARD: InjectionKey<Board> = Symbol('board');

/**
 * Moves cards to a column without a drag of yours: the Status buttons of the panel and
 * the selection bar. `moveItem` plays a real keyboard drag of the first card (a selected
 * one brings the selection), so it is announced and animated, and the column's limit and
 * the Done question apply as they do to your drags. Call it in a component's setup.
 */
export function useMove() {
  const board = inject(BOARD)!;
  const { moveItem } = useDnDActions();
  return (ids: Key[], target: Column) => {
    if (!board.fits(target, ids)) return board.notify(`${target.title} is full: ${target.limit} cards at most`);
    void moveItem(ids[0]!, { list: target.id });
  };
}
