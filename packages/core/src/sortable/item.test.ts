import { createApp, defineComponent, h, ref, useTemplateRef, type Component, type PropType } from 'vue';
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

describe('two lists in one component', () => {
  afterEach(() => {
    mounted.splice(0).forEach((unmount) => unmount());
    vi.restoreAllMocks();
  });

  /** A component with one list, or `count` lists (and trees) of its own. */
  const Lists = (count: number, tree = false) =>
    defineComponent({
      setup() {
        for (let i = 0; i < count; i++) {
          const target = useTemplateRef<HTMLElement>(`list${i}`);
          if (tree && i === count - 1) makeSortableTree(target, { items: ref([{ id: `t${i}` }]) });
          else makeSortableList(target, { items: ref([{ id: `a${i}` }]) });
        }
        return () => h('div', Array.from({ length: count }, (_, i) => h('ul', { ref: `list${i}` })));
      },
    });

  const renderIn = (child: Component) => mount({ setup: () => () => h(DnDProvider, null, { default: () => h(child) }) });

  it('warns in development: the first list loses its items; each list needs its own component', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    renderIn(Lists(2));
    expect(warn).toHaveBeenCalledTimes(1);
    expect(String(warn.mock.calls[0]![0])).toMatch(/^\[vue-dnd-kit\] Two sortable lists.*Render each list in its own component\.$/);
    // A list and a tree share the same context.
    renderIn(Lists(2, true));
    expect(warn).toHaveBeenCalledTimes(2);
  });

  it('one list per component, nested or side by side, does not warn', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const One = Lists(1);
    renderIn(defineComponent({ setup: () => () => h('div', [h(One), h(One), h(Lists(1, true))]) }));
    renderIn(
      defineComponent({
        setup() {
          makeSortableList(useTemplateRef<HTMLElement>('outer'), { items: ref([{ id: 'column' }]) });
          return () => h('div', { ref: 'outer' }, [h(One)]);
        },
      }),
    );
    expect(warn).not.toHaveBeenCalled();
  });
});
