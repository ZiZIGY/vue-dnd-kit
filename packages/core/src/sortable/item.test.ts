import { createApp, defineComponent, h, nextTick, ref, useTemplateRef, type Component, type PropType } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { SortableItemOptions, SortableListOptions } from '../types';
import { DnDProvider } from '../core/DnDProvider';
import { restrictToHorizontalAxis, restrictToVerticalAxis, snapCenterToCursor } from '../core/modifiers';
import { useManager } from '../core/context';
import type { DnDManager } from '../core/manager';
import { makeSortableItem } from './makeSortableItem';
import { makeSortableList } from './makeSortableList';
import { makeSortableTree } from './makeSortableTree';

interface Task {
  uid: string;
  id?: string;
}

let manager: DnDManager;
const mounted: Array<() => void> = [];

const mount = (root: Component) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const errors: unknown[] = [];
  const app = createApp(root);
  app.config.errorHandler = (error) => errors.push(error);
  app.config.warnHandler = () => {};
  app.mount(container);
  mounted.push(() => {
    app.unmount();
    container.remove();
  });
  return { container, errors };
};

const Row = defineComponent({
  props: { options: { type: Object as PropType<SortableItemOptions>, required: true } },
  setup(props) {
    const { index } = makeSortableItem(useTemplateRef<HTMLElement>('el'), props.options);
    return () => h('li', { ref: 'el', 'data-index': index.value });
  },
});

/** A provider, a list (or tree) of `tasks`, and a row per task with `options(task)`. */
const renderList = (
  tasks: Task[],
  options: (task: Task) => SortableItemOptions,
  list: { tree?: boolean; getKey?: (task: Task) => string } & Pick<SortableListOptions<Task>, 'axis' | 'modifiers'> = {},
) =>
  mount({
    setup: () => () =>
      h(DnDProvider, null, {
        default: () =>
          h({
            setup() {
              manager = useManager();
              const target = useTemplateRef<HTMLElement>('list');
              const source = { items: ref(tasks), getKey: list.getKey, axis: list.axis, modifiers: list.modifiers };
              const items = list.tree
                ? makeSortableTree(target, source).items.value.map((node) => node.item)
                : makeSortableList(target, source).items.value;
              return () => h('ul', { ref: 'list' }, items.map((task) => h(Row, { options: options(task) })));
            },
          }),
      }),
  });

const rowOf = (key: string) => manager.getDraggable(key)?.getElement();

describe('makeSortableItem keys', () => {
  afterEach(() => mounted.splice(0).forEach((unmount) => unmount()));

  it('derives the key of `item` with the list getKey', () => {
    const tasks = [{ uid: 'u1' }, { uid: 'u2' }];
    const { container } = renderList(tasks, (task) => ({ item: () => task }), { getKey: (task) => task.uid });
    const rows = container.querySelectorAll('li');
    expect(rowOf('u2')).toBe(rows[1]);
    expect(rows[1]!.getAttribute('data-index')).toBe('1');
  });

  it('defaults to item.id', () => {
    const tasks = [{ uid: 'u1', id: 'a' }, { uid: 'u2', id: 'b' }];
    const { container } = renderList(tasks, (task) => ({ item: () => task }));
    expect(rowOf('b')).toBe(container.querySelectorAll('li')[1]);
  });

  it('uses the tree getKey in trees', () => {
    const nodes = [{ uid: 'root' }, { uid: 'next' }];
    const { container } = renderList(nodes, (node) => ({ item: () => node }), { tree: true, getKey: (node) => node.uid });
    expect(rowOf('next')).toBe(container.querySelectorAll('li')[1]);
  });

  it('prefers `id` when both are given', () => {
    const tasks = [{ uid: 'u1', id: 'a' }];
    renderList(tasks, (task) => ({ id: () => `own-${task.uid}`, item: () => task }));
    expect(rowOf('own-u1')).toBeInstanceOf(HTMLElement);
    expect(rowOf('a')).toBeUndefined();
  });

  it('throws without `id` and `item`, explaining why keys come from data', () => {
    const { errors } = renderList([{ uid: 'u1' }], () => ({}));
    expect(errors).toHaveLength(1);
    const message = (errors[0] as Error).message;
    expect(message).toContain('needs `id` or `item`');
    expect(message).toMatch(/recreated.*virtual list.*lose the item/s);
  });
});

describe('axis of sortable items', () => {
  afterEach(() => mounted.splice(0).forEach((unmount) => unmount()));

  const modifiersOf = (key: string) => manager.getDraggable(key)?.getModifiers?.();

  it("the list's axis locks its items (in lists and trees); an item's own axis wins", () => {
    const tasks = [{ uid: 'a', id: 'a' }, { uid: 'b', id: 'b' }];
    const options = (task: Task): SortableItemOptions => ({ item: () => task, axis: task.id === 'b' ? 'x' : undefined });
    renderList(tasks, options, { axis: 'y' });
    expect(modifiersOf('a')).toEqual([restrictToVerticalAxis]);
    expect(modifiersOf('b')).toEqual([restrictToHorizontalAxis]);
    mounted.splice(0).forEach((unmount) => unmount());
    renderList(tasks, options, { axis: 'y', tree: true });
    expect(modifiersOf('a')).toEqual([restrictToVerticalAxis]);
    expect(modifiersOf('b')).toEqual([restrictToHorizontalAxis]);
  });

  it('comes after the modifiers', () => {
    renderList([{ uid: 'a', id: 'a' }], (task) => ({ item: () => task }), { axis: 'y', modifiers: [snapCenterToCursor] });
    expect(modifiersOf('a')).toEqual([snapCenterToCursor, restrictToVerticalAxis]);
  });
});

describe('several lists in one component', () => {
  afterEach(() => {
    mounted.splice(0).forEach((unmount) => unmount());
    vi.restoreAllMocks();
  });

  /** An item keyed by its list's `getKey`, showing its index; its slot goes inside it. */
  const Item = defineComponent({
    props: { task: { type: Object as PropType<Task>, required: true } },
    setup(props, { slots }) {
      const { index } = makeSortableItem(useTemplateRef<HTMLElement>('el'), { item: () => props.task });
      return () => h('li', { ref: 'el', 'data-index': index.value }, slots.default?.());
    },
  });

  const renderIn = (child: Component) =>
    mount({
      setup: () => () =>
        h(DnDProvider, null, {
          default: () => [h({ setup: () => () => ((manager = useManager()), null) }), h(child)],
        }),
    });

  const typesOf = (key: string) => manager.getDraggable(key)?.getTypes();

  it('each item is in the list whose element holds it: its key, its group, its index', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    renderIn(
      defineComponent({
        setup() {
          const todo = makeSortableList(useTemplateRef<HTMLElement>('todo'), {
            items: ref([{ uid: 't1' }, { uid: 't2' }]),
            getKey: (task: Task) => `todo-${task.uid}`,
            group: 'todo',
          });
          const done = makeSortableList(useTemplateRef<HTMLElement>('done'), {
            items: ref([{ uid: 'd1' }]),
            getKey: (task: Task) => `done-${task.uid}`,
            group: 'done',
          });
          return () =>
            h('div', [
              h('ul', { ref: 'todo' }, todo.items.value.map((task) => h(Item, { key: task.uid, task }))),
              h('ul', { ref: 'done' }, done.items.value.map((task) => h(Item, { key: task.uid, task }))),
            ]);
        },
      }),
    );
    await nextTick();
    expect(rowOf('todo-t2')?.getAttribute('data-index')).toBe('1');
    expect(rowOf('done-d1')?.getAttribute('data-index')).toBe('0');
    expect(typesOf('todo-t1')).toEqual(['todo']);
    expect(typesOf('done-d1')).toEqual(['done']);
    // Known by the first list's key only until it rendered.
    expect(rowOf('todo-d1')).toBeUndefined();
    expect(warn).not.toHaveBeenCalled();
  });

  it('nested lists of one component: an item is in the innermost list around it', async () => {
    renderIn(
      defineComponent({
        setup() {
          const columns = makeSortableList(useTemplateRef<HTMLElement>('columns'), {
            items: ref([{ uid: 'todo', id: 'todo' }]),
            group: 'columns',
          });
          const cards = makeSortableList(useTemplateRef<HTMLElement>('cards'), {
            items: ref([{ uid: 'c1', id: 'c1' }, { uid: 'c2', id: 'c2' }]),
            group: 'cards',
          });
          return () =>
            h(
              'ul',
              { ref: 'columns' },
              columns.items.value.map((column) =>
                h(Item, { key: column.uid, task: column }, () =>
                  h('ul', { ref: 'cards' }, cards.items.value.map((card) => h(Item, { key: card.uid, task: card }))),
                ),
              ),
            );
        },
      }),
    );
    await nextTick();
    expect(typesOf('todo')).toEqual(['columns']);
    expect(typesOf('c2')).toEqual(['cards']);
    expect(rowOf('c2')?.getAttribute('data-index')).toBe('1');
  });
});
