import { createApp, defineComponent, h, nextTick, useTemplateRef } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DnDProvider } from './DnDProvider';
import { useManager } from './context';
import type { DnDManager } from './manager';
import { makeDraggable } from './makeDraggable';
import { restrictToParent } from './modifiers';

let manager: DnDManager;
let unmount: (() => void) | null = null;

/** A 100×40 card at the top of a 200×300 parent; `parentTop` is where the page has scrolled it. */
let parentTop = 0;

const mount = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const Card = defineComponent({
    setup() {
      manager = useManager();
      makeDraggable(useTemplateRef<HTMLElement>('el'), { id: 'card' });
      return () => h('div', { 'data-parent': '' }, [h('div', { ref: 'el', 'data-card': '' }, 'card')]);
    },
  });
  const app = createApp({
    setup: () => () => h(DnDProvider, { dropAnimation: false, modifiers: [restrictToParent] }, { default: () => h(Card) }),
  });
  app.mount(container);
  const card = container.querySelector<HTMLElement>('[data-card]')!;
  const parent = container.querySelector<HTMLElement>('[data-parent]')!;
  card.getBoundingClientRect = () => ({ left: 0, top: 0, width: 100, height: 40, right: 100, bottom: 40, x: 0, y: 0 }) as DOMRect;
  parent.getBoundingClientRect = () =>
    ({ left: 0, top: parentTop, width: 200, height: 300, right: 200, bottom: parentTop + 300, x: 0, y: parentTop }) as DOMRect;
  unmount = () => {
    app.unmount();
    container.remove();
  };
};

afterEach(() => {
  unmount?.();
  unmount = null;
  parentTop = 0;
});

describe('restrictToParent', () => {
  it('follows the parent when the page scrolls during the drag', async () => {
    mount();
    expect(manager.start('card', { x: 50, y: 20 }, 'pointer')).toBe(true);
    await nextTick();
    manager.move({ x: 50, y: 1000 });
    manager.flushFrame();
    // The card's bottom stops at the parent's: 300 - 40.
    expect(manager.transform.value).toEqual({ x: 0, y: 260 });
    // The page scrolled 200px: the parent is higher on screen, and so is the limit.
    parentTop = -200;
    manager.move({ x: 50, y: 1001 });
    manager.flushFrame();
    expect(manager.transform.value).toEqual({ x: 0, y: 60 });
    manager.cancel();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  });
});
