/**
 * A provider with a plain draggable, a drop target, a sortable list and a tree, mounted
 * in happy-dom with the layout it lacks: containers (`data-col`) sit side by side 300px
 * apart, their children stack 40px high. List `a` is column 0, tree `t` column 1, the
 * drop target `trash` column 2 and the draggable `chip` column 3.
 *
 * Drags are driven through the provider's manager, as the core's own tests do.
 */

import { createApp, defineComponent, h, nextTick, ref, useTemplateRef, type App, type Plugin } from 'vue';
import { expect, vi } from 'vitest';
import {
  DnDProvider,
  makeDraggable,
  makeDroppable,
  makeSortableItem,
  makeSortableList,
  makeSortableTree,
  type Coordinates,
  type SortableListOptions,
} from '@vue-dnd-kit/core';
// The manager is internal: tests reach it the way the library's components do.
import { useManager } from '../../core/src/core/context';
import type { DnDManager } from '../../core/src/core/manager';

const ROW = 40;

export const createRect = (left: number, top: number, width: number, height: number) =>
  ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) }) as DOMRect;

const rectOf = (element: Element): DOMRect => {
  if (element.closest('[data-dnd-overlay]')) return createRect(0, 0, 0, 0);
  const column = element.getAttribute('data-col');
  if (column != null) return createRect(Number(column) * 300, 0, 200, Math.max(element.children.length, 1) * ROW);
  const parent = element.parentElement;
  const parentColumn = parent?.getAttribute('data-col');
  if (parent && parentColumn != null) {
    return createRect(Number(parentColumn) * 300, [...parent.children].indexOf(element) * ROW, 200, ROW);
  }
  return createRect(0, 0, 0, 0);
};

const contains = (rect: DOMRect, { x, y }: Coordinates) => x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom;

/** A point on row `index` of column `column`, `fraction` of the way down it. */
export const at = (column: number, index: number, fraction = 0.5): Coordinates => ({
  x: column * 300 + 100,
  y: (index + fraction) * ROW,
});

const Row = defineComponent({
  props: { rowId: { type: String, required: true } },
  setup(props) {
    makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId });
    return () => h('li', { ref: 'el', 'data-id': props.rowId }, props.rowId);
  },
});

export interface FixtureOptions {
  /** Options of list `a` on top of its items. */
  list?: Partial<SortableListOptions<{ id: string }>>;
}

export interface Fixture {
  app: App;
  manager: DnDManager;
  unmount(): void;
}

/** The mounted board's manager and list options. */
let manager: DnDManager;
let listOptions: FixtureOptions['list'] = {};

// Components defined once: inline ones would be new types on every render of the
// provider's slot, and remount.

const Probe = defineComponent({
  setup() {
    manager = useManager();
    return () => null;
  },
});

const List = defineComponent({
  setup() {
    const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
      id: 'a',
      group: 'cards',
      items: ref(['a1', 'a2', 'a3'].map((id) => ({ id }))),
      ...listOptions,
    });
    return () => h('ul', { ref: 'list', 'data-col': 0 }, items.value.map((item) => h(Row, { key: item.id, rowId: item.id })));
  },
});

const Tree = defineComponent({
  setup() {
    const { items } = makeSortableTree(useTemplateRef<HTMLElement>('tree'), {
      id: 't',
      items: ref([{ id: 'f', children: [{ id: 'f1' }] }, { id: 'x' }]),
    });
    return () => h('ul', { ref: 'tree', 'data-col': 1 }, items.value.map((row) => h(Row, { key: row.key, rowId: String(row.key) })));
  },
});

const Zones = defineComponent({
  setup() {
    makeDroppable(useTemplateRef<HTMLElement>('trash'), { id: 'trash', accept: 'chip', priority: 1 });
    makeDraggable(useTemplateRef<HTMLElement>('chip'), { id: 'chip', type: 'chip', data: { color: 'red' } });
    return () => [h('div', { ref: 'trash', 'data-col': 2 }), h('span', { ref: 'chip', 'data-col': 3 }, 'chip')];
  },
});

const Board = defineComponent({
  name: 'Board',
  setup: () => () =>
    h(DnDProvider, { animation: false, dropAnimation: false }, () => [h(Probe), h(List), h(Tree), h(Zones)]),
});

/** Mounts the board; `install` runs on the app before it mounts (`app.use`). */
export const mountBoard = async (options: FixtureOptions = {}, install?: Plugin): Promise<Fixture> => {
  listOptions = options.list ?? {};
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp(Board);
  if (install) app.use(install);
  app.mount(container);
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return rectOf(this);
  });
  vi.spyOn(document, 'elementFromPoint').mockImplementation((x, y) => {
    const candidates = [...container.querySelectorAll('[data-col] > *'), ...container.querySelectorAll('[data-col]')];
    return candidates.find((element) => contains(rectOf(element), { x, y })) ?? null;
  });
  await nextTick();
  return {
    app,
    manager,
    unmount() {
      app.unmount();
      container.remove();
    },
  };
};

/** Picks `id` up at `from` and moves it to `to`, letting the drafts render. */
export const drag = async (manager: DnDManager, id: string, from: Coordinates, to: Coordinates) => {
  expect(manager.start(id, from, 'pointer')).toBe(true);
  await nextTick();
  manager.move(to);
  manager.flushFrame();
  await nextTick();
  await nextTick();
};

/** Drops and waits for the session to end. */
export const drop = async (manager: DnDManager) => {
  await manager.drop();
  await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
};
