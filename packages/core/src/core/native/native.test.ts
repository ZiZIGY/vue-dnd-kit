import { createApp, defineComponent, h, nextTick, ref, useTemplateRef, type Component, type Ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Active, DnDEndEvent, DnDEvent, DroppableReturn, ExternalAccept, SortableDropEvent } from '../../types';
import { containsPoint, createRect } from '../../animation/layout';
import { DnDProvider } from '../DnDProvider';
import { useManager } from '../context';
import type { DnDManager } from '../manager';
import { makeDraggable } from '../makeDraggable';
import { makeDroppable } from '../makeDroppable';
import { makeSortableItem } from '../../sortable/makeSortableItem';
import { makeSortableList } from '../../sortable/makeSortableList';
import { readDropped, readHeld, readRemoteHint, takesExternal, writeRemote, ITEMS_TYPE } from './data';

/**
 * The browser's own drag and drop, driven by its events on the document with what their
 * `dataTransfer` carries (happy-dom has no drag and drop of its own).
 */

interface Held {
  type: string;
  name: string;
  folder?: boolean;
}

/** A `DataTransfer` carrying `files` and `data` (MIME type → text), writable like the browser's. */
const transfer = (files: Held[] = [], data: Record<string, string> = {}) => {
  const values = new Map(Object.entries(data));
  const result = {
    effectAllowed: 'all',
    dropEffect: 'none',
    get types() {
      return [...(files.length ? ['Files'] : []), ...values.keys()];
    },
    get items() {
      return [
        ...files.map((file) => ({
          kind: 'file',
          type: file.type,
          getAsFile: () => new File(['x'], file.name, { type: file.type }),
          webkitGetAsEntry: () => ({ isDirectory: !!file.folder }),
        })),
        ...[...values.keys()].map((type) => ({ kind: 'string', type })),
      ];
    },
    getData: (type: string) => values.get(type) ?? '',
    setData: (type: string, value: string) => void values.set(type.toLowerCase(), value),
    setDragImage: () => {},
  };
  return result as unknown as Omit<DataTransfer, 'dropEffect'> & DataTransfer & { dropEffect: string };
};

/** A browser drag event of `type` at `point`. */
const fire = (target: EventTarget, type: string, data: DataTransfer, point = { x: 50, y: 50 }) => {
  const event = new Event(type, { bubbles: true, cancelable: true });
  Object.defineProperties(event, {
    dataTransfer: { value: data },
    clientX: { value: point.x },
    clientY: { value: point.y },
    relatedTarget: { value: null },
  });
  target.dispatchEvent(event);
  return event;
};

const PNG = { type: 'image/png', name: 'cat.png' };
const PDF = { type: 'application/pdf', name: 'cv.pdf' };

let manager: DnDManager;
const mounted: Array<() => void> = [];

afterEach(() => {
  mounted.splice(0).forEach((unmount) => unmount());
  vi.restoreAllMocks();
});

/** Mounts `content` in a provider; elements with `data-rect="left,top,width,height"` get that layout. */
const mount = (content: Component) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, { animation: false, dropAnimation: false }, {
        default: () => [h({ setup: () => () => ((manager = useManager()), null) }), h(content)],
      }),
  });
  app.mount(container);
  mounted.push(() => {
    app.unmount();
    container.remove();
  });
  const rectOf = (element: Element): ReturnType<typeof createRect> => {
    const rect = element.getAttribute('data-rect');
    if (rect) {
      const [left, top, width, height] = rect.split(',').map(Number);
      return createRect(left!, top!, width!, height!);
    }
    // Rows stack in their list, 40px each.
    const list = element.parentElement?.closest('[data-rect]');
    if (list && element.hasAttribute('data-row')) {
      const base = rectOf(list);
      return createRect(base.left, base.top + [...element.parentElement!.children].indexOf(element) * 40, base.width, 40);
    }
    return createRect(0, 0, 0, 0);
  };
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return rectOf(this) as DOMRect;
  });
  vi.spyOn(document, 'elementFromPoint').mockImplementation((x, y) => {
    const candidates = [...container.querySelectorAll('[data-row], [data-rect]')];
    return candidates.find((element) => containsPoint(rectOf(element), { x, y })) ?? null;
  });
  return container;
};

/** The browser moves the drag to `point` over `target`: the provider's frame runs. */
const over = async (target: EventTarget, data: DataTransfer, point: { x: number; y: number }) => {
  const event = fire(target, 'dragover', data, point);
  manager.flushFrame();
  await nextTick();
  return event;
};

const settle = async () => {
  await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  await nextTick();
};

describe('data: what a browser drag carries', () => {
  it('while held: the types, and the files by type only; at the drop, the data', () => {
    const data = transfer([PNG, PDF], { 'text/uri-list': '# comment\nhttps://a.dev\r\nhttps://b.dev', 'text/plain': 'hi' });
    const external = readHeld(data);
    expect(external).toMatchObject({ fileTypes: ['image/png', 'application/pdf'], files: [], dropped: false, text: '' });
    readDropped(external, data, { files: 'image/*' });
    expect(external.files.map((file) => file.name)).toEqual(['cat.png']);
    expect(external.urls).toEqual(['https://a.dev', 'https://b.dev']);
    expect(external.text).toBe('hi');
    expect(external.getData('TEXT/PLAIN')).toBe('hi');
    expect(external.dropped).toBe(true);
  });

  it('takesExternal: files by type (extensions at the drop), one only without `multiple`, links, text, types', () => {
    const held = (files: Held[], data: Record<string, string> = {}) => readHeld(transfer(files, data));
    const images: ExternalAccept = { files: 'image/*' };
    expect(takesExternal(images, held([PNG]))).toBe(true);
    expect(takesExternal(images, held([PNG, PDF]))).toBe(false);
    expect(takesExternal({ files: '.md' }, held([{ type: '', name: 'a.md' }]))).toBe(true);
    expect(takesExternal({ files: true, multiple: false }, held([PNG, PNG]))).toBe(false);
    expect(takesExternal({ files: (file) => file.type !== 'image/png' }, held([PNG]))).toBe(false);
    expect(takesExternal({ links: true }, held([], { 'text/uri-list': 'https://a.dev' }))).toBe(true);
    expect(takesExternal({ text: true }, held([], { 'text/plain': 'hi' }))).toBe(true);
    expect(takesExternal({ types: ['application/x-thing'] }, held([], { 'application/x-thing': '1' }))).toBe(true);
    expect(takesExternal(undefined, held([PNG]))).toBe(false);
  });

  it("a window's items ride in the names of the types too: another window reads them while the drag is held", () => {
    const data = transfer();
    writeRemote(data, { group: 'Board', items: [{ id: 'c1', item: { id: 'c1', title: 'Ünïcode' }, data: null, type: ['Board'] }] });
    expect(data.getData(ITEMS_TYPE)).toContain('Ünïcode');
    expect(readRemoteHint(data.types)).toEqual({ group: 'Board', items: [{ id: 'c1', item: { id: 'c1', title: 'Ünïcode' }, data: null, type: ['Board'] }] });
  });
});

describe('drags from outside the page into drop targets (`external`)', () => {
  const renderZones = (external: ExternalAccept, onDrop: (event: DnDEvent) => void) => {
    const zones: { files?: DroppableReturn; other?: DroppableReturn } = {};
    const container = mount(
      defineComponent({
        setup() {
          zones.files = makeDroppable(useTemplateRef<HTMLElement>('files'), { id: 'files', external, onDrop });
          zones.other = makeDroppable(useTemplateRef<HTMLElement>('other'), { id: 'other' });
          return () =>
            h('div', [h('div', { ref: 'files', 'data-rect': '0,0,100,100' }), h('div', { ref: 'other', 'data-rect': '0,200,100,100' })]);
        },
      }),
    );
    return { zones, container };
  };

  it('runs as a drag of the provider: over the zone, isOver and isAccepting; the drop brings the files', async () => {
    const drops: DnDEvent[] = [];
    const { zones, container } = renderZones({ files: 'image/*' }, (event) => drops.push(event));
    await nextTick();
    const data = transfer([PNG]);
    const zone = container.querySelector('[data-rect="0,0,100,100"]')!;
    fire(zone, 'dragenter', data);
    expect(manager.status.value).toBe('dragging');
    const active = manager.active.value as Active;
    expect(active).toMatchObject({ native: true, label: 'a file', external: { fileTypes: ['image/png'], dropped: false } });
    const event = await over(zone, data, { x: 50, y: 50 });
    expect(event.defaultPrevented).toBe(true);
    expect(data.dropEffect).toBe('copy');
    expect(zones.files!.isOver.value).toBe(true);
    expect(zones.files!.isAccepting.value).toBe(true);
    // No overlay: the browser draws the dragged image.
    expect(manager.hasOverlay).toBe(false);

    fire(zone, 'drop', data, { x: 50, y: 50 });
    await settle();
    expect(drops).toHaveLength(1);
    expect(drops[0]!.external?.files.map((file) => file.name)).toEqual(['cat.png']);
    expect(drops[0]!.external?.dropped).toBe(true);
    // The stand-in is gone.
    expect(document.querySelector('[data-dnd-external]')).toBeNull();
  });

  it('targets without `external` ignore it; one whose rule refuses it says so, and no drop comes', async () => {
    const { zones, container } = renderZones({ files: 'image/*' }, () => {});
    await nextTick();
    const data = transfer([PDF]);
    const zone = container.querySelector('[data-rect="0,0,100,100"]')!;
    const other = container.querySelector('[data-rect="0,200,100,100"]')!;
    fire(zone, 'dragenter', data);
    await over(zone, data, { x: 50, y: 50 });
    expect(manager.over.value).toMatchObject({ id: 'files', accepted: false });
    expect(data.dropEffect).toBe('none');
    await over(other, data, { x: 50, y: 250 });
    expect(zones.other!.isOver.value).toBe(false);
    expect(manager.over.value).toBeNull();
    expect(data.dropEffect).toBe('none');
  });

  it('without a target that takes drags from outside, no drag starts: the browser keeps it', async () => {
    mount(
      defineComponent({
        setup() {
          makeDroppable(useTemplateRef<HTMLElement>('zone'), { id: 'zone' });
          return () => h('div', { ref: 'zone', 'data-rect': '0,0,100,100' });
        },
      }),
    );
    await nextTick();
    const event = fire(document.body, 'dragenter', transfer([PNG]));
    expect(manager.status.value).toBe('idle');
    expect(event.defaultPrevented).toBe(false);
  });

  it('leaving the window cancels it', async () => {
    const { container } = renderZones({ files: true }, () => {});
    await nextTick();
    const data = transfer([PNG]);
    const zone = container.querySelector('[data-rect="0,0,100,100"]')!;
    fire(zone, 'dragenter', data);
    // Within the page: the next element is entered before the last one is left.
    fire(document.body, 'dragenter', data);
    fire(zone, 'dragleave', data);
    expect(manager.status.value).toBe('dragging');
    fire(document.body, 'dragleave', data);
    await settle();
    expect(document.querySelector('[data-dnd-external]')).toBeNull();
  });
});

describe('drags from outside the page into a sortable list', () => {
  interface Doc {
    id: string;
    name: string;
    file?: File;
  }

  let made = 0;
  const Row = defineComponent({
    props: { rowId: { type: String, required: true } },
    setup(props) {
      makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId });
      return () => h('li', { ref: 'el', 'data-row': '' }, props.rowId);
    },
  });

  /** A list of a, b, c at 0,0 (40px rows) that takes images: a pending row while held, a row per file at the drop. */
  const renderList = (docs: Ref<Doc[]>, drops: SortableDropEvent[], createItem?: (active: Active) => Doc | Doc[] | undefined) =>
    mount(
      defineComponent({
        setup() {
          const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
            id: 'docs',
            items: docs,
            group: 'docs',
            external: { files: 'image/*' },
            createItem:
              createItem ??
              ((active) =>
                active.external!.dropped
                  ? active.external!.files.map((file) => ({ id: `f${++made}`, name: file.name, file }))
                  : { id: 'pending', name: `${active.external!.fileTypes.length} files` }),
            onDrop: (event) => drops.push(event),
          });
          return () => h('ul', { ref: 'list', 'data-rect': '0,0,200,400' }, items.value.map((doc) => h(Row, { key: doc.id, rowId: doc.id })));
        },
      }),
    );

  const rows = (container: Element) => [...container.querySelectorAll('[data-row]')].map((row) => row.textContent);

  it('makes room for the files while they are held, and inserts a row per file at the drop', async () => {
    made = 0;
    const docs = ref<Doc[]>(['a', 'b', 'c'].map((id) => ({ id, name: id })));
    const drops: SortableDropEvent[] = [];
    const container = renderList(docs, drops);
    await nextTick();
    const list = container.querySelector('ul')!;
    const data = transfer([PNG, { type: 'image/jpeg', name: 'dog.jpg' }]);
    fire(list, 'dragenter', data, { x: 100, y: 10 });
    // Between a and b.
    await over(list, data, { x: 100, y: 45 });
    await over(list, data, { x: 100, y: 50 });
    await nextTick();
    expect(rows(container)).toContain('pending');
    expect(data.dropEffect).toBe('copy');

    fire(list, 'drop', data, { x: 100, y: 50 });
    await settle();
    expect(docs.value.map((doc) => doc.name)).toEqual(['a', 'cat.png', 'dog.jpg', 'b', 'c']);
    expect(docs.value[1]!.file).toBeInstanceOf(File);
    expect(drops[0]!.external?.files).toHaveLength(2);
  });

  it("another window's items of its group come in as themselves (no `createItem` needed)", async () => {
    const docs = ref<Doc[]>([{ id: 'a', name: 'a' }]);
    const drops: SortableDropEvent[] = [];
    // A list of the group without `createItem`.
    const container = mount(
      defineComponent({
        setup() {
          const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), { id: 'docs', items: docs, group: 'docs', onDrop: (event) => drops.push(event) });
          return () => h('ul', { ref: 'list', 'data-rect': '0,0,200,400' }, items.value.map((doc) => h(Row, { key: doc.id, rowId: doc.id })));
        },
      }),
    );
    await nextTick();
    const list = container.querySelector('ul')!;
    // Window A's drag: its own key `a` is an item here too.
    const data = transfer();
    writeRemote(data, { group: 'docs', items: [{ id: 'x', item: { id: 'x', name: 'from A' }, data: null, type: ['docs'] }] });
    fire(list, 'dragenter', data, { x: 100, y: 10 });
    expect(manager.active.value?.external?.group).toBe('docs');
    // The local `a` is no slot: the drag has ids of its own.
    expect(container.querySelector('[data-row]')!.hasAttribute('data-dnd-placeholder')).toBe(false);
    await over(list, data, { x: 100, y: 10 });
    await over(list, data, { x: 100, y: 5 });
    expect(rows(container)).toEqual(['x', 'a']);
    expect(data.dropEffect).toBe('move');
    fire(list, 'drop', data, { x: 100, y: 5 });
    await settle();
    expect(docs.value).toEqual([{ id: 'x', name: 'from A' }, { id: 'a', name: 'a' }]);
  });
});

describe("the page's own drags out of it (`native`)", () => {
  const Row = defineComponent({
    props: { rowId: { type: String, required: true } },
    setup(props) {
      makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId, label: () => `Row ${props.rowId}`, native: true });
      return () => h('li', { ref: 'el', 'data-row': '' }, props.rowId);
    },
  });

  const renderList = (tasks: Ref<Array<{ id: string }>>) =>
    mount(
      defineComponent({
        setup() {
          const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), { id: 'tasks', items: tasks, group: 'tasks' });
          return () => h('ul', { ref: 'list', 'data-rect': '0,0,200,400' }, items.value.map((task) => h(Row, { key: task.id, rowId: task.id })));
        },
      }),
    );

  const pressMouse = (target: Element, x = 100, y = 20) =>
    target.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, isPrimary: true, button: 0, pointerType: 'mouse', clientX: x, clientY: y }));

  /** The browser starts its drag of `row`. */
  const start = (row: Element, data: DataTransfer) => {
    pressMouse(row);
    expect(row.getAttribute('draggable')).toBe('true');
    // The library's own pointer drag stays out of it.
    expect(manager.status.value).toBe('idle');
    fire(row, 'dragstart', data, { x: 100, y: 20 });
    fire(row, 'dragenter', data, { x: 100, y: 20 });
  };

  it('a mouse drag is the browser’s: it carries the label and the item, sorts on the page, drops there', async () => {
    const tasks = ref(['a', 'b', 'c'].map((id) => ({ id })));
    const container = renderList(tasks);
    await nextTick();
    const [first] = container.querySelectorAll('[data-row]');
    const data = transfer();
    start(first!, data);
    expect(manager.active.value).toMatchObject({ id: 'a', native: true });
    expect(data.getData('text/plain')).toBe('Row a');
    expect(readRemoteHint(data.types)?.group).toBe('tasks');
    await over(first!, data, { x: 100, y: 70 });
    await over(first!, data, { x: 100, y: 75 });
    fire(first!, 'drop', data, { x: 100, y: 75 });
    fire(first!, 'dragend', data);
    await settle();
    expect(tasks.value.map((task) => task.id)).toEqual(['b', 'a', 'c']);
    expect(first!.hasAttribute('draggable')).toBe(false);
  });

  it('dropped elsewhere as a move, it leaves its list; as a copy, it stays; cancelled, nothing changes', async () => {
    const tasks = ref(['a', 'b', 'c'].map((id) => ({ id })));
    const ends: DnDEndEvent[] = [];
    const container = renderList(tasks);
    await nextTick();
    manager.addMonitor({ onDragEnd: (event) => ends.push(event) });
    const drag = async (index: number, effect: DataTransfer['dropEffect']) => {
      const row = container.querySelectorAll('[data-row]')[index]!;
      const data = transfer();
      start(row, data);
      // Out of the window, dropped in another app.
      fire(row, 'dragleave', data);
      expect(manager.outside.value).toBe(true);
      data.dropEffect = effect;
      fire(row, 'dragend', data);
      await settle();
    };
    await drag(0, 'copy');
    expect(tasks.value.map((task) => task.id)).toEqual(['a', 'b', 'c']);
    expect(ends.at(-1)).toMatchObject({ droppedOutside: 'copy', dropped: false });
    await drag(1, 'move');
    expect(tasks.value.map((task) => task.id)).toEqual(['a', 'c']);
    expect(ends.at(-1)).toMatchObject({ droppedOutside: 'move' });
    await drag(0, 'none');
    expect(tasks.value.map((task) => task.id)).toEqual(['a', 'c']);
    expect(ends).toHaveLength(2);
  });

  it('plain draggables too; touch presses stay the library’s drags', async () => {
    const container = mount(
      defineComponent({
        setup() {
          makeDraggable(useTemplateRef<HTMLElement>('card'), { id: 'card', native: { data: () => ({ 'text/uri-list': 'https://card.dev' }), effect: 'copy' } });
          return () => h('div', { ref: 'card', 'data-rect': '0,0,100,40' }, 'card');
        },
      }),
    );
    await nextTick();
    const card = container.querySelector('[data-rect]')!;
    card.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, isPrimary: true, button: 0, pointerType: 'touch' }));
    expect(card.hasAttribute('draggable')).toBe(false);
    card.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true, isPrimary: true }));
    const data = transfer();
    pressMouse(card, 50, 20);
    fire(card, 'dragstart', data, { x: 50, y: 20 });
    expect(data.getData('text/uri-list')).toBe('https://card.dev');
    expect(data.effectAllowed).toBe('copy');
    expect(readRemoteHint(data.types)).toBeNull();
    data.dropEffect = 'none';
    fire(card, 'dragend', data);
    await settle();
  });
});
