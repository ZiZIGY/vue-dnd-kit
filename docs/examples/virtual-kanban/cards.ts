import { shallowRef, type ShallowRef } from 'vue';

export interface Card {
  id: string;
  title: string;
  /** Every third card has a note: the cards differ in height. */
  note?: string;
  points: number;
}

export interface Column {
  id: string;
  title: string;
  color: string;
  /** A shallowRef per column: its list writes the drops into it, and 1,000 cards get no deep proxies. */
  cards: ShallowRef<Card[]>;
}

const TITLES = ['Sync the calendar', 'Fix the login redirect', 'Export to CSV', 'Onboarding emails', 'Search by tag', 'Retry failed uploads'];
const NOTES = ['Blocked by the API review', 'Needs a design pass', 'Customer request'];

const makeCards = (prefix: string, count: number, shift: number): Card[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `${prefix}-${i + 1}`,
    title: TITLES[(i + shift) % TITLES.length]!,
    note: i % 3 === 1 ? NOTES[(i + shift) % NOTES.length] : undefined,
    points: [1, 2, 3, 5, 8][(i + shift) % 5]!,
  }));

export const makeColumns = (perColumn: number): Column[] => [
  { id: 'todo', title: 'To do', color: '#3b82f6', cards: shallowRef(makeCards('TD', perColumn, 0)) },
  { id: 'doing', title: 'In progress', color: '#f59e0b', cards: shallowRef(makeCards('IP', perColumn, 2)) },
  { id: 'done', title: 'Done', color: '#42b883', cards: shallowRef(makeCards('DN', perColumn, 4)) },
];
