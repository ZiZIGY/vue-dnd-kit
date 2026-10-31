export interface Card {
  id: string;
  title: string;
  tag: 'bug' | 'feature' | 'chore';
}

export interface Column {
  id: string;
  name: string;
  /** Most cards it may hold (work in progress); none for no limit. */
  limit?: number;
  cards: Card[];
}

export const COLUMNS: Column[] = [
  {
    id: 'todo',
    name: 'To do',
    cards: [
      { id: 'c1', title: 'Rate-limit the login form', tag: 'feature' },
      { id: 'c2', title: 'Crash on empty search', tag: 'bug' },
      { id: 'c3', title: 'Bump the Node version', tag: 'chore' },
      { id: 'c4', title: 'CSV export for invoices', tag: 'feature' },
    ],
  },
  {
    id: 'doing',
    name: 'In progress',
    limit: 3,
    cards: [{ id: 'c5', title: 'Dark mode toggle', tag: 'feature' }],
  },
  {
    id: 'review',
    name: 'Review',
    limit: 2,
    cards: [
      { id: 'c6', title: 'Fix the flaky upload test', tag: 'bug' },
      { id: 'c7', title: 'Cache the avatars', tag: 'chore' },
    ],
  },
];
