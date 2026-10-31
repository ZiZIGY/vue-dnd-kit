/**
 * A multi-drag of plain draggables: the default overlay is a pile of their clones. Dropped
 * into a zone, the clones go in one after another and the box last; cancelled, they fly
 * back to their items.
 */

import { createApp, defineComponent, h, nextTick, ref, useTemplateRef, type Ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Rect } from '../types';
import { createRect } from '../animation/layout';
import { DnDProvider } from './DnDProvider';
import { useManager } from './context';
import type { DnDManager } from './manager';
import { makeDraggable } from './makeDraggable';
import { makeDroppable } from './makeDroppable';

let manager: DnDManager;
let unmount: (() => void) | null = null;

/** Files side by side 60px apart, the folder below them. */
const rectOf = (element: Element): Rect => {
  if (element.closest('[data-dnd-overlay]')) return createRect(0, 0, 50, 50);
  const file = element.getAttribute('data-file');
  if (file != null) return createRect(Number(file) * 60, 0, 50, 50);
  if (element.hasAttribute('data-folder')) return createRect(0, 200, 100, 100);
  return createRect(0, 0, 0, 0);
};

const File = defineComponent({
  props: { fileId: { type: String, required: true }, at: { type: Number, required: true } },
  setup(props) {
    makeDraggable(useTemplateRef<HTMLElement>('el'), { id: props.fileId });
    return () => h('div', { ref: 'el', 'data-file': props.at }, props.fileId);
  },
});

const Folder = defineComponent({
  props: { files: { type: Object as () => Ref<string[]>, required: true } },
  setup(props) {
    // Dropped in, the files leave the desktop: no item is left to land on.
    makeDroppable(useTemplateRef<HTMLElement>('el'), {
      id: 'folder',
      onDrop: (event) => (props.files.value = props.files.value.filter((id) => !event.active.ids.includes(id))),
    });
    return () => h('div', { ref: 'el', 'data-folder': '' }, 'folder');
  },
});

/** Every animation started, with its element and options. */
let started: Array<{ element: Element; options: KeyframeAnimationOptions }>;

const mount = () => {
  started = [];
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    return rectOf(this) as DOMRect;
  });
  Element.prototype.animate = function (this: Element, _keyframes: unknown, options?: number | KeyframeAnimationOptions) {
    started.push({ element: this, options: typeof options === 'object' ? options : {} });
    return { finished: Promise.resolve(), cancel() {}, playState: 'finished' } as unknown as Animation;
  };
  const container = document.createElement('div');
  document.body.appendChild(container);
  const files = ref(['f1', 'f2', 'f3', 'f4']);
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, { overlayPreviews: 'all' }, () => [
        h({ setup: () => () => ((manager = useManager()), null) }),
        ...files.value.map((id) => h(File, { key: id, fileId: id, at: Number(id.slice(1)) - 1 })),
        h(Folder, { files }),
      ]),
  });
  app.mount(container);
  vi.spyOn(document, 'elementFromPoint').mockImplementation((_x, y) =>
    y >= 200 ? container.querySelector('[data-folder]') : null,
  );
  unmount = () => {
    app.unmount();
    container.remove();
  };
  return files;
};

const settle = async () => {
  for (let i = 0; i < 4; i++) {
    await new Promise((resolve) => setTimeout(resolve, 0));
    await nextTick();
  }
};

const pickAll = async () => {
  await settle();
  for (const id of ['f1', 'f2', 'f3', 'f4']) manager.selection.add(id);
  expect(manager.start('f1', { x: 25, y: 25 }, 'pointer')).toBe(true);
  await settle();
};

const box = () => document.querySelector<HTMLElement>('[data-dnd-overlay]')!;
const pile = () => [...box().querySelectorAll('[data-dnd-overlay-item]')];

afterEach(() => {
  unmount?.();
  unmount = null;
  vi.restoreAllMocks();
  // @ts-expect-error: happy-dom has no WAAPI; the test put one in.
  delete Element.prototype.animate;
});

describe('a multi-drag of plain draggables', () => {
  it('shows a pile: the grabbed item on top of every other one', async () => {
    mount();
    await pickAll();
    expect(pile()).toHaveLength(3);
    expect(box().textContent).toContain('f1');
    expect(box().textContent).toContain('4');
    manager.cancel();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  });

  it('dropped into a zone, the clones go in one after another, the box last', async () => {
    const files = mount();
    await pickAll();
    manager.move({ x: 50, y: 250 });
    manager.flushFrame();
    await settle();
    expect(manager.over.value?.id).toBe('folder');
    await manager.drop();
    expect(files.value).toEqual([]);
    const clones = started.filter(({ element }) => element.hasAttribute('data-dnd-overlay-item'));
    const boxes = started.filter(({ element }) => element.hasAttribute('data-dnd-overlay'));
    expect(clones.map(({ options }) => options.delay)).toEqual([0, 60, 120]);
    expect(boxes.map(({ options }) => options.delay)).toEqual([180]);
  });

  it('cancelled, the clones fly back to their items with the box', async () => {
    mount();
    await pickAll();
    manager.move({ x: 300, y: 120 });
    manager.flushFrame();
    await settle();
    manager.cancel();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    const clones = started.filter(({ element }) => element.hasAttribute('data-dnd-overlay-item'));
    expect(clones).toHaveLength(3);
    expect(clones.every(({ options }) => !options.delay)).toBe(true);
  });
});
