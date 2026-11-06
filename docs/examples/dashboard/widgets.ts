/** A widget's size in cells of the grid: columns wide, rows tall. */
export type Size = { w: number; h: number };

export type Widget = Size & {
  id: string;
  title: string;
  kind: 'metric' | 'chart' | 'tasks' | 'notes' | 'team' | 'uptime';
  value?: string;
  delta?: string;
};

/** The grid: a row is at least ROW px tall (more if its content needs it), cells are GAP px apart. */
export const ROW = 92;
export const GAP = 12;
export const MAX_ROWS = 4;

export const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/** The columns of a grid this wide: fewer on narrow screens. */
export const columnsFor = (width: number) => (width >= 760 ? 4 : width >= 500 ? 3 : 2);

export const initialWidgets = (): Widget[] => [
  { id: 'revenue', title: 'Revenue', kind: 'metric', value: '$48.2k', delta: '+12%', w: 1, h: 1 },
  { id: 'users', title: 'Active users', kind: 'metric', value: '3,214', delta: '+4%', w: 1, h: 1 },
  { id: 'traffic', title: 'Traffic', kind: 'chart', w: 2, h: 2 },
  { id: 'tasks', title: 'Tasks', kind: 'tasks', w: 1, h: 2 },
  { id: 'notes', title: 'Notes', kind: 'notes', w: 2, h: 1 },
  { id: 'team', title: 'Team', kind: 'team', w: 1, h: 1 },
  { id: 'uptime', title: 'Uptime', kind: 'uptime', w: 2, h: 1 },
];
