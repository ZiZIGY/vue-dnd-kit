import type { Column, Task } from './types';

export const makeTasks = (prefix: string, count: number, extra: Partial<Task> = {}): Task[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `${prefix}${index + 1}`,
    title: `${prefix.toUpperCase()}${index + 1}`,
    ...extra,
  }));

/** `id:key,key | id:key` — what specs compare against. */
export const describeLists = (lists: Column[]): string =>
  lists.map((list) => `${list.id}:${list.tasks.map((task) => task.id).join(',')}`).join(' | ');

let uid = 0;
/** New id for copies and created items. */
export const nextId = (prefix: string): string => `${prefix}-${++uid}`;
