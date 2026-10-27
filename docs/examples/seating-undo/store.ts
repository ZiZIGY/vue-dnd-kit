import { reactive } from 'vue';
import type { Key } from '@vue-dnd-kit/core';

export interface Guest {
  id: string;
  name: string;
}

export interface Seating {
  state: { tables: Record<Key, Guest[]>; history: { label: string; before: [Key, Guest[]][] }[] };
  apply(result: ReadonlyMap<Key, Guest[]>, label: string): void;
  undo(): void;
}

/**
 * A small store: the lists only read it, and every change goes through `apply`, which
 * keeps what it replaced, so `undo` can put it back.
 */
export const createSeating = (): Seating => {
  const state = reactive<Seating['state']>({
    tables: {
      a: [
        { id: 'ana', name: 'Ana' },
        { id: 'bo', name: 'Bo' },
        { id: 'cy', name: 'Cy' },
      ],
      b: [
        { id: 'di', name: 'Di' },
        { id: 'ed', name: 'Ed' },
      ],
    },
    history: [],
  });

  /** Writes a drop's `result`: the new arrays of every table it changes. */
  const apply = (result: ReadonlyMap<Key, Guest[]>, label: string) => {
    const before = [...result.keys()].map((id): [Key, Guest[]] => [id, state.tables[id]!]);
    for (const [id, guests] of result) state.tables[id] = guests;
    state.history.unshift({ label, before });
  };

  const undo = () => {
    const last = state.history.shift();
    for (const [id, guests] of last?.before ?? []) state.tables[id] = guests;
  };

  return { state, apply, undo };
};
