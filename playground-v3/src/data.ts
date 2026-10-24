import type { Column, Task } from './types';

/** `count` tasks `${prefix}1`, `${prefix}2`, … (sortable demos). */
export const makeTasks = (prefix: string, count: number, extra: Partial<Task> = {}): Task[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `${prefix}${index + 1}`,
    title: `${prefix.toUpperCase()}${index + 1}`,
    ...extra,
  }));

/** `count` rows with ids `${prefix}0`, `${prefix}1`, … so the id tells the initial index (virtual demos, benches). */
export const makeRows = (prefix: string, count: number, label = 'Row'): Task[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `${prefix}${index}`,
    title: `${label} ${prefix.toUpperCase()}${index}`,
  }));

/** `id:key,key | id:key` — what specs compare against. */
export const describeLists = (lists: Column[]): string =>
  lists.map((list) => `${list.id}:${list.tasks.map((task) => task.id).join(',')}`).join(' | ');

/** `id@index` of the key in `tasks`, plus its neighbours: what e2e checks after a drop. */
export const describeDrop = (tasks: Task[], key: unknown): string => {
  const index = tasks.findIndex((task) => task.id === key);
  const around = tasks.slice(Math.max(0, index - 1), index + 2).map((task) => task.id);
  return `${String(key)}@${index}:${around.join(',')}`;
};

let uid = 0;
/** New id for copies and created items. */
export const nextId = (prefix: string): string => `${prefix}-${++uid}`;
