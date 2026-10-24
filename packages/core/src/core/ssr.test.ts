import { createSSRApp, defineComponent, h, nextTick, ref, useTemplateRef } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DnDProvider } from './DnDProvider';
import { makeSelectionArea } from './makeSelectionArea';
import { makeSortableItem } from '../sortable/makeSortableItem';
import { makeSortableList } from '../sortable/makeSortableList';

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
});
