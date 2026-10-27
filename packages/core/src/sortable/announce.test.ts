import { createApp, defineComponent, h, nextTick, ref, useTemplateRef } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AnnouncementContext, Announcements } from '../types';
import { createRect } from '../animation/layout';
import { DnDProvider } from '../core/DnDProvider';
import { useManager } from '../core/context';
import type { DnDManager } from '../core/manager';
import { makeSortableItem } from './makeSortableItem';
import { makeSortableList } from './makeSortableList';

const ROW = 40;
let manager: DnDManager;
let unmount: (() => void) | null = null;
let heard: Array<[keyof Announcements, AnnouncementContext]>;

const Row = defineComponent({
  props: { rowId: { type: String, required: true } },
  setup(props) {
    makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId });
    return () => h('li', { ref: 'el' }, props.rowId);
  },
});

/** Every announcement of the provider's own: its name and context. Each says nothing new. */
const record = (name: keyof Announcements) => (_event: unknown, context: AnnouncementContext) => {
  heard.push([name, context]);
  return undefined;
};

const mount = () => {
  heard = [];
  const container = document.createElement('div');
  document.body.appendChild(container);
  const announcements: Partial<Announcements> = {
    onDragStart: record('onDragStart'),
    onDragOver: record('onDragOver'),
    onDragEnd: record('onDragEnd'),
    onDragCancel: record('onDragCancel'),
  };
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, { dropAnimation: false, animation: false, announcements }, {
        default: () =>
          h({
            setup() {
              manager = useManager();
              const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
                id: 'todo',
                items: ref(['a', 'b', 'c'].map((id) => ({ id }))),
              });
              return () => h('ul', { ref: 'list' }, items.value.map((item) => h(Row, { key: item.id, rowId: item.id })));
            },
          }),
      }),
  });
  app.mount(container);
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    if (this.tagName === 'UL') return createRect(0, 0, 200, this.children.length * ROW) as DOMRect;
    if (this.parentElement?.tagName === 'UL') return createRect(0, [...this.parentElement.children].indexOf(this) * ROW, 200, ROW) as DOMRect;
    return createRect(0, 0, 0, 0) as DOMRect;
  });
  unmount = () => {
    app.unmount();
    container.remove();
  };
};

const press = async (key: string) => {
  const before = manager.pointer.value;
  document.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  await vi.waitFor(() => expect(manager.pointer.value).not.toBe(before));
  await nextTick();
};

const contextOf = (name: keyof Announcements) => heard.filter(([heardName]) => heardName === name).at(-1)?.[1];

afterEach(() => {
  unmount?.();
  unmount = null;
  vi.restoreAllMocks();
});

describe('the context of the provider’s own announcements', () => {
  it('names where the item was picked up, where it would land and where it landed', async () => {
    mount();
    await nextTick();
    manager.start('a', { x: 100, y: ROW / 2 }, 'keyboard');
    await nextTick();
    expect(contextOf('onDragStart')).toEqual({ count: 1, copy: false, position: { list: 'todo', index: 0, length: 3 } });
    await press('ArrowDown');
    expect(contextOf('onDragOver')).toMatchObject({ position: { list: 'todo', index: 1, length: 3 } });
    await manager.drop();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    expect(contextOf('onDragEnd')).toEqual({ count: 1, copy: false, position: { list: 'todo', index: 1, length: 3 } });
  });

  it('names where a cancelled drag went back to', async () => {
    mount();
    await nextTick();
    manager.start('b', { x: 100, y: 1.5 * ROW }, 'keyboard');
    await nextTick();
    await press('ArrowDown');
    manager.cancel();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    expect(contextOf('onDragCancel')).toMatchObject({ position: { list: 'todo', index: 1, length: 3 } });
  });
});
