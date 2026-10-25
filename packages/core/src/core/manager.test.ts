import { createApp, defineComponent, h, nextTick, useTemplateRef } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { BeforeDropResult } from '../types';
import { DnDProvider } from './DnDProvider';
import { useDnDContext } from './context';
import type { DnDManager } from './manager';
import { makeDraggable } from './makeDraggable';

let manager: DnDManager;
let unmount: (() => void) | null = null;

const mountCard = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const Card = defineComponent({
    setup() {
      manager = useDnDContext();
      makeDraggable(useTemplateRef<HTMLElement>('el'), { id: 'card' });
      return () => h('div', { ref: 'el' }, 'card');
    },
  });
  const app = createApp({ setup: () => () => h(DnDProvider, { dropAnimation: false }, { default: () => h(Card) }) });
  app.mount(container);
  unmount = () => {
    app.unmount();
    container.remove();
  };
};

const dragging = () => document.documentElement.getAttribute('data-dnd-dragging');
/** Whether the page lets a text selection start. */
const canSelect = () => document.dispatchEvent(new Event('selectstart', { cancelable: true }));

describe('the document while a drop waits for onBeforeDrop', () => {
  afterEach(() => {
    unmount?.();
    unmount = null;
  });

  it('is out of drag mode (cursor, text selection); the drag state and the overlay stay', async () => {
    mountCard();
    let answer!: (result: BeforeDropResult) => void;
    manager.addMonitor({ onBeforeDrop: () => new Promise((resolve) => (answer = resolve)) });
    expect(manager.start('card', { x: 1, y: 1 }, 'pointer')).toBe(true);
    await nextTick();
    expect(dragging()).toBe('pointer');
    expect(canSelect()).toBe(false);

    const dropped = manager.drop();
    await nextTick();
    expect(manager.status.value).toBe('dropping');
    expect(dragging()).toBeNull();
    expect(canSelect()).toBe(true);
    expect(manager.active.value?.id).toBe('card');
    expect(manager.pointer.value).not.toBeNull();
    expect(document.querySelector('[data-dnd-overlay]')).not.toBeNull();

    answer(false);
    await dropped;
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    expect(dragging()).toBeNull();
    expect(canSelect()).toBe(true);
  });

  it('a drop nothing waits for and a cancel restore it too', async () => {
    mountCard();
    manager.start('card', { x: 1, y: 1 }, 'keyboard');
    expect(dragging()).toBe('keyboard');
    await manager.drop();
    expect(dragging()).toBeNull();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));

    manager.start('card', { x: 1, y: 1 }, 'pointer');
    expect(dragging()).toBe('pointer');
    manager.cancel();
    expect(dragging()).toBeNull();
    expect(canSelect()).toBe(true);
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  });
});
