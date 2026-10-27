export interface Task {
  id: string;
  title: string;
  owner: string;
}

const TITLES = [
  'Review the release notes',
  'Fix the flaky drag test',
  'Write the migration guide',
  'Measure auto-scroll speed',
  'Design the empty state',
  'Ship keyboard drags',
  'Plan the next sprint',
  'Profile 10,000 rows',
  'Answer the open issues',
  'Record the demo video',
  'Test on a real phone',
  'Polish the overlay',
];
const OWNERS = ['AL', 'MK', 'JS', 'RP', 'TN'];

/** `count` tasks, the same every time. */
export const makeTasks = (count: number): Task[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `t${i + 1}`,
    title: TITLES[i % TITLES.length]!,
    owner: OWNERS[(i * 3) % OWNERS.length]!,
  }));
