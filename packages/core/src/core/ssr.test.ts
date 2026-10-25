import { createSSRApp, defineComponent, h, nextTick, ref, useTemplateRef } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Key } from '../types';
import { DnDProvider } from './DnDProvider';
import { makeDraggable } from './makeDraggable';
import { makeDroppable } from './makeDroppable';
import { makeSelectionArea } from './makeSelectionArea';
import { makeSortableItem } from '../sortable/makeSortableItem';
import { makeSortableList } from '../sortable/makeSortableList';
import { makeSortableTree } from '../sortable/makeSortableTree';

const Item = defineComponent({
  props: { itemId: { type: String, required: true } },
  setup(props) {
    makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.itemId });
    return () => h('li', { ref: 'el', 'data-id': props.itemId }, props.itemId);
  },
});

const List = defineComponent({
  setup() {
    const tasks = ref(['a', 'b', 'c'].map((id) => ({ id })));
    const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), { items: tasks });
    const { isSelecting, style } = makeSelectionArea(useTemplateRef<HTMLElement>('area'));
    return () =>
      h('div', { ref: 'area' }, [
        h('ul', { ref: 'list' }, items.value.map((task) => h(Item, { key: task.id, itemId: task.id }))),
        isSelecting.value ? h('div', { style: style.value }) : null,
      ]);
  },
});

const App = defineComponent({
  setup: () => () => h(DnDProvider, null, { default: () => h(List) }),
});

describe('SSR', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  it('renders the items on the server and hydrates without mismatches', async () => {
    const html = await renderToString(createSSRApp(App));
    expect(html).toContain('data-id="a"');
    // Overlay, instructions and live region are client-only.
    expect(html).not.toContain('role="status"');

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    const app = createSSRApp(App);
    app.mount(container);
    await nextTick();

    const messages = [...warn.mock.calls, ...error.mock.calls].map((call) => String(call[0]));
    expect(messages.filter((message) => /hydrat/i.test(message))).toEqual([]);
    expect(document.querySelectorAll('[role="status"]')).toHaveLength(1);
    const item = container.querySelector('[data-id="a"]')!;
    expect(item.getAttribute('aria-roledescription')).toBe('sortable');
    expect(document.getElementById(item.getAttribute('aria-describedby')!)).not.toBeNull();
    app.unmount();
  });

  describe('default ids', () => {
    /** Default ids seen by the current render, in setup order. */
    let seen: Key[] = [];

    const Piece = defineComponent({
      setup() {
        const { id } = makeDraggable(useTemplateRef<HTMLElement>('el'));
        const zone = makeDroppable(useTemplateRef<HTMLElement>('zone'));
        seen.push(id.value, zone.id.value);
        return () => h('div', { ref: 'zone', 'data-zone': zone.id.value }, [h('span', { ref: 'el', 'data-drag': id.value })]);
      },
    });

    const Row = defineComponent({
      props: { task: { type: Object, required: true } },
      setup(props) {
        makeSortableItem(useTemplateRef<HTMLElement>('el'), { item: () => props.task });
        return () => h('li', { ref: 'el' }, String(props.task.id));
      },
    });

    // Each list in its own component: they provide the context their items read.
    const Tree = defineComponent({
      setup() {
        const tree = makeSortableTree(useTemplateRef<HTMLElement>('tree'), { items: ref([{ id: 'root' }]) });
        seen.push(tree.id);
        return () => h('ul', { ref: 'tree', 'data-tree': tree.id });
      },
    });

    const Lists = defineComponent({
      setup() {
        const list = makeSortableList(useTemplateRef<HTMLElement>('list'), { items: ref([{ id: 'a' }, { id: 'b' }]) });
        seen.push(list.id);
        return () =>
          h('div', [
            h('ul', { ref: 'list', 'data-list': list.id }, list.items.value.map((task) => h(Row, { key: task.id, task }))),
            h(Tree),
            h(Piece),
            h(Piece),
          ]);
      },
    });

    const IdsApp = defineComponent({
      setup: () => () => h(DnDProvider, null, { default: () => h(Lists) }),
    });

    it('are the same on the server and after hydration', async () => {
      seen = [];
      const html = await renderToString(createSSRApp(IdsApp));
      const server = seen;
      expect(server).toHaveLength(6);
      // useId() based: scoped by the app's id prefix, unique within the app.
      expect(new Set(server).size).toBe(6);
      for (const id of server) expect(String(id)).toMatch(/^(draggable|droppable|sortable|tree)-v-/);

      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      const container = document.createElement('div');
      container.innerHTML = html;
      document.body.appendChild(container);
      seen = [];
      const app = createSSRApp(IdsApp);
      app.mount(container);
      await nextTick();

      expect(seen).toEqual(server);
      const messages = [...warn.mock.calls, ...error.mock.calls].map((call) => String(call[0]));
      expect(messages.filter((message) => /hydrat/i.test(message))).toEqual([]);
      expect(container.querySelector('[data-list]')!.getAttribute('data-list')).toBe(server[0]);
      app.unmount();
    });

    it('follow app.config.idPrefix', async () => {
      seen = [];
      const app = createSSRApp(IdsApp);
      app.config.idPrefix = 'shadow';
      await renderToString(app);
      expect(seen[0]).toMatch(/^sortable-shadow-/);
    });
  });
});
