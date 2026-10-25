import { computed, ref, shallowRef } from 'vue';
import type { Key } from '@vue-dnd-kit/core';

/**
 * State the lists never write: an immutable store changed only through its actions, a
 * pretend server, and a tree of class instances. The drops are applied from
 * `event.result` after `event.preventDefault()` (rfcs/0001-v3.md §5).
 */

export interface Card {
  readonly id: string;
  readonly title: string;
}

/**
 * A node of the controlled tree: a frozen class instance. `withChildren` makes a new
 * one, so the drop's `result` keeps the class (the default `{ ...node }` would lose it).
 */
export class Folder {
  readonly children: readonly Folder[];

  constructor(
    readonly id: string,
    children: readonly Folder[] = [],
  ) {
    this.children = Object.freeze([...children]);
    Object.freeze(this);
  }

  withChildren(children: readonly Folder[]): Folder {
    return new Folder(this.id, children);
  }
}

interface State {
  readonly lists: Readonly<Record<string, readonly Card[]>>;
  readonly tree: readonly Folder[];
}

const cards = (...ids: string[]): readonly Card[] =>
  Object.freeze(ids.map((id) => Object.freeze({ id, title: id.toUpperCase() })));

const freeze = (state: State): State => Object.freeze({ ...state, lists: Object.freeze({ ...state.lists }) });

export const createStore = () => {
  const state = shallowRef<State>(
    freeze({
      lists: { todo: cards('t1', 't2', 't3'), done: cards('d1', 'd2'), archive: cards('a1') },
      tree: Object.freeze([
        new Folder('src', [new Folder('components'), new Folder('main')]),
        new Folder('docs', [new Folder('intro')]),
        new Folder('assets'),
        new Folder('readme'),
      ]),
    }),
  );
  return {
    /** Read-only views for the lists' `items` getters. */
    list: (id: string): readonly Card[] => state.value.lists[id] ?? [],
    tree: (): readonly Folder[] => state.value.tree,
    /** The one way cards change: the new arrays of a drop's `result`, frozen. */
    applyLists(result: ReadonlyMap<Key, readonly Card[]>) {
      const lists = { ...state.value.lists };
      for (const [id, items] of result) lists[String(id)] = Object.freeze([...items]);
      state.value = freeze({ ...state.value, lists });
    },
    setTree(tree: readonly Folder[]) {
      state.value = freeze({ ...state.value, tree: Object.freeze([...tree]) });
    },
  };
};

export type Store = ReturnType<typeof createStore>;

/** A pretend server: every request takes `latency` ms, and fails while `failing` is on. */
export const createServer = (latency = 400) => {
  const failing = ref(false);
  const pending = ref(0);
  const log = ref<string[]>([]);
  const request = (text: string) => {
    pending.value++;
    return new Promise<void>((resolve, reject) =>
      setTimeout(() => {
        pending.value--;
        log.value.unshift(`${failing.value ? 'failed' : 'saved'}: ${text}`);
        if (failing.value) reject(new Error(`Could not ${text}`));
        else resolve();
      }, latency),
    );
  };
  return { failing, log, busy: computed(() => pending.value > 0), request };
};

/** `list:id,id | list:id` of a drop's `result`, as the e2e specs compare it. */
export const describeResult = (result: ReadonlyMap<Key, readonly Card[]>): string =>
  [...result].map(([list, items]) => `${String(list)}:${items.map((card) => card.id).join(',')}`).join(' | ');

/** `src(components,main),docs(intro),assets,readme` */
export const serializeFolders = (nodes: readonly Folder[]): string =>
  nodes.map((node) => (node.children.length ? `${node.id}(${serializeFolders(node.children)})` : node.id)).join(',');

/** Whether every node of the tree is still a `Folder` (the result kept the class). */
export const allFolders = (nodes: readonly Folder[]): boolean =>
  nodes.every((node) => node instanceof Folder && allFolders(node.children));
