import { createApp, defineComponent, h, nextTick, useTemplateRef } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { BeforeDropResult } from '../types';
import { DnDProvider } from './DnDProvider';
import { useManager } from './context';
import type { DnDManager } from './manager';
import { makeDraggable } from './makeDraggable';

let manager: DnDManager;
let unmount: (() => void) | null = null;

const mountCard = () => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const Card = defineComponent({
    setup() {
      manager = useManager();
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

describe('onBeforeDrop answers', () => {
  afterEach(() => {
    unmount?.();
    unmount = null;
  });

  it("'accept' and 'reject' read as true and false", async () => {
    mountCard();
    const ended: string[] = [];
    let answer: BeforeDropResult = 'reject';
    manager.addMonitor({
      onBeforeDrop: () => answer,
      onDragEnd: () => ended.push('end'),
      onDragCancel: () => ended.push('cancel'),
    });
    manager.start('card', { x: 1, y: 1 }, 'pointer');
    await manager.drop();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    answer = 'accept';
    manager.start('card', { x: 1, y: 1 }, 'pointer');
    await manager.drop();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    expect(ended).toEqual(['cancel', 'end']);
  });

  it("'continue': no drop, the drag goes on in drag mode; the next drop asks again", async () => {
    mountCard();
    const heard: string[] = [];
    const answers: BeforeDropResult[] = ['continue', 'accept'];
    manager.addMonitor({
      onBeforeDrop: () => answers.shift(),
      onDragResume: () => heard.push('resume'),
      onDragEnd: () => heard.push('end'),
      onDragCancel: () => heard.push('cancel'),
    });
    manager.start('card', { x: 1, y: 1 }, 'pointer');
    await manager.drop();
    expect(manager.status.value).toBe('dragging');
    expect(manager.active.value?.id).toBe('card');
    expect(dragging()).toBe('pointer');
    expect(heard).toEqual(['resume']);
    // It moves again, and drops when asked.
    manager.move({ x: 40, y: 30 });
    manager.flushFrame();
    expect(manager.pointer.value).toEqual({ x: 40, y: 30 });
    await manager.drop();
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
    expect(heard).toEqual(['resume', 'end']);
  });
});
