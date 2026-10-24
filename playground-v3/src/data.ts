import type { Task } from './types';

/** `count` tasks with ids `${prefix}0`, `${prefix}1`, … so the id tells the initial index. */
export const makeTasks = (prefix: string, count: number, label = 'Row'): Task[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `${prefix}${index}`,
    title: `${label} ${prefix.toUpperCase()}${index}`,
  }));

/** `id@index` of the key in `tasks`, plus its neighbours: what e2e checks after a drop. */
export const describeDrop = (tasks: Task[], key: unknown): string => {
  const index = tasks.findIndex((task) => task.id === key);
  const around = tasks.slice(Math.max(0, index - 1), index + 2).map((task) => task.id);
  return `${String(key)}@${index}:${around.join(',')}`;
};
