import { createApp, defineComponent, h, ref, useTemplateRef, type Component, type PropType } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import type { SortableItemOptions } from '../types';
import { DnDProvider } from '../core/DnDProvider';
import { useDnDContext } from '../core/context';
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
  list: { tree?: boolean; getKey?: (task: Task) => string } = {},
) =>
  mount({
    setup: () => () =>
      h(DnDProvider, null, {
        default: () =>
          h({
            setup() {
              manager = useDnDContext();
              const target = useTemplateRef<HTMLElement>('list');
              const source = { items: ref(tasks), getKey: list.getKey };
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
