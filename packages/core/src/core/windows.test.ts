import { createApp, defineComponent, h, nextTick, ref, Teleport, useTemplateRef, type Ref } from 'vue';
import { Window as HappyWindow } from 'happy-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { DnDEndEvent, DnDState } from '../types';
import { containsPoint, createRect } from '../animation/layout';
import { isElement, isHTMLElement, isShadowRoot, parentOf } from '../utils/dom';
import { createWindows } from './manager/windows';
import { DnDProvider } from './DnDProvider';
import { useDnD, useManager } from './context';
import type { DnDManager } from './manager';
import { makeDraggable } from './makeDraggable';
import { makeDroppable } from './makeDroppable';
import { makeSortableItem } from '../sortable/makeSortableItem';
import { makeSortableList } from '../sortable/makeSortableList';

/**
 * Another window of the app (a popup opened with `window.open`) that a teleport renders
 * into: one provider, two documents. happy-dom's second `Window` is another realm: its
 * nodes are of its own classes, as a real popup's are.
 */

const popups: HappyWindow[] = [];
const popup = () => {
  const view = new HappyWindow({ width: 800, height: 600 });
  popups.push(view);
  return view as unknown as Window;
};

const cleanups: Array<() => void> = [];

afterEach(() => {
  cleanups.splice(0).forEach((cleanup) => cleanup());
  vi.restoreAllMocks();
  for (const view of popups.splice(0)) void view.happyDOM.close();
});

describe('nodes of another window', () => {
  // In a browser they fail `instanceof` (happy-dom's windows share their classes).
  it('are elements, HTML elements and shadow roots by their node type', () => {
    const view = popup();
    const element = view.document.createElement('div');
    view.document.body.appendChild(element);
    expect(isElement(element)).toBe(true);
    expect(isHTMLElement(element)).toBe(true);
    const root = element.attachShadow({ mode: 'open' });
    const inner = view.document.createElement('span');
    root.appendChild(inner);
    expect(isShadowRoot(root)).toBe(true);
    expect(parentOf(inner)).toBe(element);
    expect(isElement(view.document.createTextNode('x'))).toBe(false);
    const svg = view.document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    expect(isElement(svg) && !isHTMLElement(svg)).toBe(true);
    // A stand-in of another realm: only its node type says what it is.
    const foreign = { nodeType: 1, namespaceURI: 'http://www.w3.org/1999/xhtml' };
    expect(isHTMLElement(foreign)).toBe(true);
  });
});

describe('createWindows', () => {
  it('runs a setup in the page and in every window as it joins, until it leaves', () => {
    const windows = createWindows();
    const seen: Window[] = [];
    const gone: Window[] = [];
    windows.each((view) => {
      seen.push(view);
      return () => gone.push(view);
    });
    expect(seen.length === 1 && seen[0] === window).toBe(true);

    const view = popup();
    const element = view.document.createElement('div');
    view.document.body.appendChild(element);
    windows.track(element);
    windows.track(element);
    expect(seen.length === 2 && seen[1] === view).toBe(true);
    expect(windows.list.length === 2 && windows.list[1] === view).toBe(true);

    // A setup added later runs in both at once.
    const later: Window[] = [];
    windows.each((one) => void later.push(one));
    expect(later.length === 2 && later[1] === view).toBe(true);

    view.dispatchEvent(new Event('pagehide'));
    expect(gone.length === 1 && gone[0] === view).toBe(true);
    expect(windows.list.length === 1 && windows.list[0] === window).toBe(true);
    windows.destroy();
    expect(gone.length === 2 && gone[1] === window).toBe(true);
  });

  it('keeps a window the app named until it lets go (or a node of it is tracked)', () => {
    const windows = createWindows();
    const gone: Window[] = [];
    windows.each((view) => () => gone.push(view));
    const view = popup();
    const release = windows.add(view);
    const again = windows.add(view);
    release();
    release();
    expect(windows.list.includes(view)).toBe(true);
    again();
    expect(windows.list.includes(view)).toBe(false);
    expect(gone.length === 1 && gone[0] === view).toBe(true);

    const tracked = popup();
    const releaseTracked = windows.add(tracked);
    windows.track(tracked.document.body);
    releaseTracked();
    expect(windows.list.includes(tracked)).toBe(true);
    windows.destroy();
  });

  it('stops a setup with its scope, in every window', () => {
    const windows = createWindows();
    const view = popup();
    windows.add(view);
    const stopped: Window[] = [];
    const stop = windows.each((one) => () => stopped.push(one));
    stop();
    expect(stopped.length === 2 && stopped[1] === view).toBe(true);
    windows.destroy();
  });
});

describe('a drag in another window', () => {
  // happy-dom's pointer events lack `getModifierState` (the copy key listens while anything moves).
  const pointer = (view: Window, type: string, init: PointerEventInit) =>
    Object.assign(new (view as unknown as typeof globalThis).PointerEvent(type, init), {
      getModifierState: () => false,
    });

  /**
   * A card and a zone teleported into `view`, and a zone of the page at the same place:
   * coordinates are each window's own, so only the popup's zone is under the drag there.
   */
  const mount = async (view: Window, name: boolean) => {
    let manager!: DnDManager;
    let state!: DnDState;
    const drops: DnDEndEvent[] = [];
    const pageDrops: DnDEndEvent[] = [];
    const container = document.createElement('div');
    document.body.appendChild(container);
    // Defined once: the provider re-renders when the drag's window changes.
    const Content = defineComponent({
      setup() {
        manager = useManager();
        state = useDnD();
        if (name) cleanups.push(state.addWindow(view));
        makeDraggable(useTemplateRef<HTMLElement>('card'), { id: 'card' });
        makeDroppable(useTemplateRef<HTMLElement>('zone'), {
          id: 'zone',
          onDrop: (event) => void drops.push(event as DnDEndEvent),
        });
        makeDroppable(useTemplateRef<HTMLElement>('pageZone'), {
          id: 'pageZone',
          onDrop: (event) => void pageDrops.push(event as DnDEndEvent),
        });
        return () => [
          h('div', { ref: 'pageZone', 'data-page-zone': '' }),
          h(Teleport, { to: view.document.body }, [
            h('div', { ref: 'card', 'data-card': '' }, 'card'),
            h('div', { ref: 'zone', 'data-zone': '' }),
          ]),
        ];
      },
    });
    const app = createApp({
      setup: () => () => h(DnDProvider, { animation: false, dropAnimation: false }, { default: () => h(Content) }),
    });
    app.mount(container);
    cleanups.push(() => {
      app.unmount();
      container.remove();
    });
    await nextTick();
    const card = view.document.querySelector('[data-card]')!;
    const zone = view.document.querySelector('[data-zone]')!;
    const pageZone = container.querySelector('[data-page-zone]')!;
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      if (this.hasAttribute('data-card')) return createRect(0, 0, 100, 40) as DOMRect;
      if (this.hasAttribute('data-zone') || this.hasAttribute('data-page-zone')) return createRect(300, 0, 200, 200) as DOMRect;
      return createRect(0, 0, 0, 0) as DOMRect;
    });
    vi.spyOn(view.document, 'elementFromPoint').mockImplementation((x) => (x >= 300 ? zone : card));
    vi.spyOn(document, 'elementFromPoint').mockImplementation((x) => (x >= 300 ? pageZone : null));
    return { manager, state, card, zone, drops, pageDrops };
  };

  it.each([
    ['the app names the window', true],
    ['the window is found by its items', false],
  ])('starts there, runs in its viewport and drops on its target (%s)', async (_, name) => {
    const view = popup();
    const { manager, card, drops, pageDrops } = await mount(view, name);
    card.dispatchEvent(
      pointer(view, 'pointerdown', { bubbles: true, composed: true, isPrimary: true, button: 0, pointerType: 'mouse', clientX: 10, clientY: 10 }),
    );
    view.document.dispatchEvent(pointer(view, 'pointermove', { bubbles: true, pointerId: 0, clientX: 40, clientY: 10 }));
    manager.flushFrame();
    expect(manager.status.value).toBe('dragging');
    expect(manager.getDocument()).toBe(view.document);
    // Page in drag mode: the popup's, not the page's.
    expect(view.document.documentElement.getAttribute('data-dnd-dragging')).toBe('pointer');
    expect(document.documentElement.hasAttribute('data-dnd-dragging')).toBe(false);

    view.document.dispatchEvent(pointer(view, 'pointermove', { bubbles: true, pointerId: 0, clientX: 360, clientY: 90 }));
    manager.flushFrame();
    await nextTick();
    expect(manager.over.value?.id).toBe('zone');
    // The overlay renders in the window the drag runs in.
    await vi.waitFor(() => expect(view.document.querySelector('[data-dnd-overlay]')).not.toBeNull());
    expect(document.querySelector('[data-dnd-overlay]')).toBeNull();

    view.document.dispatchEvent(pointer(view, 'pointerup', { bubbles: true, pointerId: 0, clientX: 360, clientY: 90 }));
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    expect(drops).toHaveLength(1);
    expect(pageDrops).toHaveLength(0);
    expect(view.document.documentElement.hasAttribute('data-dnd-dragging')).toBe(false);
  });

  it('injects its styles into the window', async () => {
    const view = popup();
    await mount(view, true);
    expect(view.document.getElementById('vue-dnd-kit-behavior')).not.toBeNull();
  });

  it('cancels when that window hides, and stops listening once it closes', async () => {
    const view = popup();
    const { manager, card } = await mount(view, true);
    const press = () =>
      card.dispatchEvent(
        pointer(view, 'pointerdown', { bubbles: true, composed: true, isPrimary: true, button: 0, pointerType: 'mouse', clientX: 10, clientY: 10 }),
      );
    press();
    view.document.dispatchEvent(pointer(view, 'pointermove', { bubbles: true, pointerId: 0, clientX: 40, clientY: 10 }));
    expect(manager.status.value).toBe('dragging');
    Object.defineProperty(view.document, 'visibilityState', { value: 'hidden', configurable: true });
    view.document.dispatchEvent(new (view as unknown as typeof globalThis).Event('visibilitychange'));
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));

    Object.defineProperty(view.document, 'visibilityState', { value: 'visible', configurable: true });
    view.dispatchEvent(new (view as unknown as typeof globalThis).Event('pagehide'));
    press();
    expect(manager.status.value).toBe('idle');
  });
});

describe("the browser's drag between windows", () => {
  /** A minimal `DataTransfer` (happy-dom has no drag and drop of its own). */
  const transfer = () => {
    const values = new Map<string, string>();
    return {
      effectAllowed: 'all',
      dropEffect: 'none',
      get types() {
        return [...values.keys()];
      },
      items: [],
      getData: (type: string) => values.get(type) ?? '',
      setData: (type: string, value: string) => void values.set(type.toLowerCase(), value),
      setDragImage: () => {},
    } as unknown as DataTransfer;
  };

  const fire = (target: EventTarget, type: string, data: DataTransfer, point = { x: 0, y: 0 }) => {
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

  it('carries a `native` item from the page into the popup, onto the popup’s target', async () => {
    const view = popup();
    let manager!: DnDManager;
    const drops: DnDEndEvent[] = [];
    const container = document.createElement('div');
    document.body.appendChild(container);
    const Content = defineComponent({
      setup() {
        manager = useManager();
        cleanups.push(useDnD().addWindow(view));
        makeDraggable(useTemplateRef<HTMLElement>('card'), { id: 'card', native: true });
        makeDroppable(useTemplateRef<HTMLElement>('zone'), {
          id: 'zone',
          onDrop: (event) => void drops.push(event as DnDEndEvent),
        });
        return () => [
          h('div', { ref: 'card', 'data-card': '' }, 'card'),
          h(Teleport, { to: view.document.body }, [h('div', { ref: 'zone', 'data-zone': '' })]),
        ];
      },
    });
    const app = createApp({
      setup: () => () => h(DnDProvider, { animation: false, dropAnimation: false }, { default: () => h(Content) }),
    });
    app.mount(container);
    cleanups.push(() => {
      app.unmount();
      container.remove();
    });
    await nextTick();
    const card = container.querySelector('[data-card]')!;
    const zone = view.document.querySelector('[data-zone]')!;
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      if (this.hasAttribute('data-card')) return createRect(0, 0, 100, 40) as DOMRect;
      if (this.hasAttribute('data-zone')) return createRect(0, 0, 200, 200) as DOMRect;
      return createRect(0, 0, 0, 0) as DOMRect;
    });
    vi.spyOn(document, 'elementFromPoint').mockReturnValue(card);
    vi.spyOn(view.document, 'elementFromPoint').mockReturnValue(zone);

    const data = transfer();
    card.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, isPrimary: true, button: 0, pointerType: 'mouse', clientX: 10, clientY: 10 }));
    expect(card.getAttribute('draggable')).toBe('true');
    fire(card, 'dragstart', data, { x: 10, y: 10 });
    fire(card, 'dragenter', data, { x: 10, y: 10 });
    expect(manager.getDocument()).toBe(document);

    // Out of the page and into the popup: the drag runs there, over its target.
    fire(card, 'dragleave', data);
    fire(zone, 'dragenter', data, { x: 50, y: 50 });
    const overZone = fire(zone, 'dragover', data, { x: 50, y: 50 });
    manager.flushFrame();
    await nextTick();
    expect(overZone.defaultPrevented).toBe(true);
    expect(manager.outside.value).toBe(false);
    expect(manager.getDocument()).toBe(view.document);
    expect(manager.over.value?.id).toBe('zone');

    fire(zone, 'drop', data, { x: 50, y: 50 });
    fire(card, 'dragend', data);
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    expect(drops).toHaveLength(1);
    expect(drops[0]!.over?.id).toBe('zone');
  });

  it('moves a `native` row from a list of the page into a list of its group in the popup', async () => {
    const view = popup();
    let manager!: DnDManager;
    const page = ref([{ id: 'a' }, { id: 'b' }]);
    const away = ref([{ id: 'x' }, { id: 'y' }]);
    const Row = defineComponent({
      props: { rowId: { type: String, required: true } },
      setup(props) {
        makeSortableItem(useTemplateRef<HTMLElement>('el'), { id: () => props.rowId, native: true });
        return () => h('li', { ref: 'el', 'data-row': props.rowId }, props.rowId);
      },
    });
    const List = defineComponent({
      props: { listId: { type: String, required: true }, rows: { type: Object, required: true } },
      setup(props) {
        const { items } = makeSortableList(useTemplateRef<HTMLElement>('list'), {
          id: props.listId,
          items: props.rows as Ref<{ id: string }[]>,
          group: 'rows',
        });
        return () =>
          h('ul', { ref: 'list', 'data-list': props.listId }, items.value.map((row) => h(Row, { key: row.id, rowId: row.id })));
      },
    });
    const Content = defineComponent({
      setup() {
        manager = useManager();
        cleanups.push(useDnD().addWindow(view));
        return () => [
          h(List, { listId: 'page', rows: page }),
          h(Teleport, { to: view.document.body }, [h(List, { listId: 'away', rows: away })]),
        ];
      },
    });
    const container = document.createElement('div');
    document.body.appendChild(container);
    const app = createApp({
      setup: () => () => h(DnDProvider, { animation: false, dropAnimation: false }, { default: () => h(Content) }),
    });
    app.mount(container);
    cleanups.push(() => {
      app.unmount();
      container.remove();
    });
    await nextTick();

    // Each list at the top left of its own window, its rows 40px tall.
    const rectOf = (element: Element) => {
      if (element.hasAttribute('data-list')) return createRect(0, 0, 200, 200);
      if (element.hasAttribute('data-row')) {
        const index = [...element.parentElement!.children].indexOf(element);
        return createRect(0, index * 40, 200, 40);
      }
      return createRect(0, 0, 0, 0);
    };
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
      return rectOf(this) as DOMRect;
    });
    const hit = (doc: Document) => (x: number, y: number) =>
      [...doc.querySelectorAll('[data-row]')].find((element) => containsPoint(rectOf(element), { x, y })) ??
      doc.querySelector('[data-list]');
    vi.spyOn(document, 'elementFromPoint').mockImplementation(hit(document));
    vi.spyOn(view.document, 'elementFromPoint').mockImplementation(hit(view.document));

    const data = transfer();
    const row = container.querySelector('[data-row="a"]')!;
    row.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, isPrimary: true, button: 0, pointerType: 'mouse', clientX: 100, clientY: 20 }));
    fire(row, 'dragstart', data, { x: 100, y: 20 });
    fire(row, 'dragenter', data, { x: 100, y: 20 });
    fire(row, 'dragleave', data);
    const target = view.document.querySelector('[data-row="y"]')!;
    fire(target, 'dragenter', data, { x: 100, y: 70 });
    for (const y of [70, 75]) {
      fire(target, 'dragover', data, { x: 100, y });
      manager.flushFrame();
      await nextTick();
    }
    expect(manager.getDocument()).toBe(view.document);
    fire(target, 'drop', data, { x: 100, y: 75 });
    fire(row, 'dragend', data);
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    expect(page.value.map((item) => item.id)).toEqual(['b']);
    expect(away.value.map((item) => item.id).sort()).toEqual(['a', 'x', 'y']);
  });
});
