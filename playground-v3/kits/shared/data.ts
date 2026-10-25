/** Data shared by the UI kit pages; each kit renders it with its own components. */

export interface KitTask {
  id: string;
  title: string;
  tag: string;
}

export interface KitColumn {
  id: string;
  title: string;
  cards: KitTask[];
}

export interface KitPerson {
  id: string;
  name: string;
  role: string;
}

export const createTasks = (): KitTask[] => [
  { id: 't1', title: 'Write the spec', tag: 'docs' },
  { id: 't2', title: 'Review the API', tag: 'api' },
  { id: 't3', title: 'Fix the overlay', tag: 'bug' },
  { id: 't4', title: 'Add e2e tests', tag: 'qa' },
  { id: 't5', title: 'Ship v3', tag: 'release' },
];

/** Ids are unique per provider: the dialog's list gets its own. */
export const createFiles = (): KitTask[] => [
  { id: 'f1', title: 'index.ts', tag: 'ts' },
  { id: 'f2', title: 'App.vue', tag: 'vue' },
  { id: 'f3', title: 'style.css', tag: 'css' },
];

export const createTags = (): string[] => ['vue', 'nuxt', 'vite', 'pinia'];

export const createColumns = (): KitColumn[] => [
  {
    id: 'todo',
    title: 'To do',
    cards: [
      { id: 'c1', title: 'Design tokens', tag: 'design' },
      { id: 'c2', title: 'Login form', tag: 'feature' },
      { id: 'c3', title: 'Empty states', tag: 'design' },
    ],
  },
  {
    id: 'doing',
    title: 'Doing',
    cards: [
      { id: 'c4', title: 'Drag and drop', tag: 'feature' },
      { id: 'c5', title: 'Flaky test', tag: 'bug' },
    ],
  },
  { id: 'done', title: 'Done', cards: [{ id: 'c6', title: 'Project setup', tag: 'chore' }] },
];

export const createPeople = (): KitPerson[] => [
  { id: 'p1', name: 'Ada Lovelace', role: 'Analyst' },
  { id: 'p2', name: 'Alan Turing', role: 'Cryptographer' },
  { id: 'p3', name: 'Grace Hopper', role: 'Admiral' },
  { id: 'p4', name: 'Edsger Dijkstra', role: 'Professor' },
];

/** `todo:c1,c2 | doing:c4 | done:` for assertions. */
export const serializeBoard = (columns: readonly KitColumn[]): string =>
  columns.map((column) => `${column.id}:${column.cards.map((card) => card.id).join(',')}`).join(' | ');

export const ids = (items: ReadonlyArray<{ id: string }>): string => items.map((item) => item.id).join(',');

/** Demo pages of a kit, selected by the URL hash. */
export const KIT_DEMOS = ['list', 'kanban', 'tree'] as const;
export type KitDemo = (typeof KIT_DEMOS)[number];

export const readDemoHash = (): KitDemo => {
  const name = location.hash.slice(1);
  return (KIT_DEMOS as readonly string[]).includes(name) ? (name as KitDemo) : 'list';
};
