/** Data for the phone demos (`#touch-*`). */

export interface TouchTask {
  id: string;
  title: string;
  note: string;
}

export interface TouchColumn {
  id: string;
  title: string;
  tasks: TouchTask[];
}

export interface TouchNode {
  id: string;
  name: string;
  type: 'folder' | 'note';
  children?: TouchNode[];
}

const NOTES = [
  'Call back about the invoice',
  'Pick up the parcel',
  'Review the pull request',
  'Book the dentist',
  'Water the plants',
  'Renew the passport',
  'Write the weekly update',
  'Fix the bike light',
];

export const createTasks = (prefix: string, count: number, label = 'Task'): TouchTask[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `${prefix}${index + 1}`,
    title: `${label} ${prefix.toUpperCase()}${index + 1}`,
    note: NOTES[index % NOTES.length]!,
  }));

const folder = (id: string, name: string, children: TouchNode[] = []): TouchNode => ({
  id,
  name,
  type: 'folder',
  children,
});
const note = (id: string, name: string): TouchNode => ({ id, name, type: 'note' });

/**
 * inbox/        (0)
 *   today       (1)
 * projects/     (0)
 *   app/        (1)
 *     design    (2)
 *   site/       (1, empty)
 * archive/      (0, empty)
 * ideas         (0)
 * groceries     (0)
 */
export const createTouchTree = (): TouchNode[] => [
  folder('inbox', 'Inbox', [note('today', 'Today')]),
  folder('projects', 'Projects', [folder('app', 'App', [note('design', 'Design review')]), folder('site', 'Site')]),
  folder('archive', 'Archive'),
  note('ideas', 'Ideas'),
  note('groceries', 'Groceries'),
];

/** `inbox(today),projects(app(design),site),archive,ideas,groceries` for assertions. */
export const serializeTouchTree = (nodes: readonly TouchNode[]): string =>
  nodes
    .map((node) => (node.children?.length ? `${node.id}(${serializeTouchTree(node.children)})` : node.id))
    .join(',');
