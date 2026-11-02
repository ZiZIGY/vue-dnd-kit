export type Status = 'Backlog' | 'Todo' | 'In progress' | 'Done';

export interface Task {
  id: string;
  title: string;
  status: Status;
  assignee: string;
  points: number;
}

const VERBS = ['Fix', 'Add', 'Polish', 'Test', 'Document', 'Refactor', 'Speed up', 'Review'];
const THINGS = [
  'the login form',
  'touch drags on iPad',
  'the export to CSV',
  'dark mode colors',
  'the billing page',
  'keyboard shortcuts',
  'the search index',
  'empty states',
  'the onboarding tour',
  'image uploads',
  'the settings panel',
  'error messages',
];
const STATUSES: Status[] = ['Backlog', 'Todo', 'In progress', 'Done'];
const PEOPLE = ['Mia Chen', 'Leo Park', 'Nora King', 'Sam Reyes', 'Ava Moss', 'Ian Ruiz'];

/** `count` tasks, the same on the server and in the browser: a seeded sequence, no `Math.random`. */
export function makeTasks(count: number): Task[] {
  let seed = 7;
  const next = (length: number) => {
    seed = (seed * 16807) % 2147483647;
    return seed % length;
  };
  return Array.from({ length: count }, (_, index) => ({
    id: `T-${String(index + 1).padStart(4, '0')}`,
    title: `${VERBS[next(VERBS.length)]} ${THINGS[next(THINGS.length)]}`,
    status: STATUSES[next(STATUSES.length)]!,
    assignee: PEOPLE[next(PEOPLE.length)]!,
    points: [1, 2, 3, 5, 8][next(5)]!,
  }));
}
