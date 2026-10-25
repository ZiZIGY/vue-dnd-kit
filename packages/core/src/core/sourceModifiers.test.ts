import { createApp, defineComponent, h, nextTick, shallowRef, useTemplateRef } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Modifier } from '../types';
import { DnDProvider } from './DnDProvider';
import { useDnDContext } from './context';
import type { DnDManager } from './manager';
import { makeDraggable } from './makeDraggable';
import { restrictToVerticalAxis } from './modifiers';

let manager: DnDManager;
let unmount: (() => void) | null = null;

/** Two cards under one provider: `locked` with its own modifiers, `free` without. */
const mount = (own: () => Modifier[] | undefined, provider?: Modifier[]) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const Card = defineComponent({
    props: { id: { type: String, required: true }, modifiers: Function },
    setup(props) {
      manager = useDnDContext();
      makeDraggable(useTemplateRef<HTMLElement>('el'), {
        id: props.id,
        modifiers: props.modifiers as (() => Modifier[] | undefined) | undefined,
      });
      return () => h('div', { ref: 'el', 'data-card': props.id }, props.id);
    },
  });
  const app = createApp({
    setup: () => () =>
      h(
        DnDProvider,
        { dropAnimation: false, modifiers: provider },
        { default: () => [h(Card, { id: 'locked', modifiers: own }), h(Card, { id: 'free' })] },
      ),
  });
  app.mount(container);
  for (const card of container.querySelectorAll<HTMLElement>('[data-card]')) {
    card.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 100, height: 40, right: 100, bottom: 40, x: 0, y: 0 }) as DOMRect;
  }
  unmount = () => {
    app.unmount();
    container.remove();
  };
};

/** Drags `id` from (50, 20) by (+80, +60) and returns the offset the modifiers let through. */
const dragBy = async (id: string) => {
  expect(manager.start(id, { x: 50, y: 20 }, 'pointer')).toBe(true);
  await nextTick();
  manager.move({ x: 130, y: 80 });
  vi.advanceTimersByTime(16);
  const offset = { ...manager.transform.value };
  manager.cancel();
  vi.advanceTimersByTime(16);
  await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  return offset;
};

describe('modifiers of a draggable (or list)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
  });

  afterEach(() => {
    unmount?.();
    unmount = null;
    vi.useRealTimers();
  });

  it('apply only to drags that start there', async () => {
    mount(() => [restrictToVerticalAxis]);
    expect(await dragBy('locked')).toEqual({ x: 0, y: 60 });
    expect(await dragBy('free')).toEqual({ x: 80, y: 60 });
  });

  it('run after the provider modifiers', async () => {
    const order: string[] = [];
    const provider: Modifier = ({ transform }) => (order.push('provider'), transform);
    const own: Modifier = ({ transform }) => (order.push('own'), transform);
    mount(() => [own], [provider]);
    await dragBy('locked');
    expect(order.slice(0, 2)).toEqual(['provider', 'own']);
  });

  it('are read when the drag starts, so a toggle takes effect on the next drag', async () => {
    const locked = shallowRef(false);
    mount(() => (locked.value ? [restrictToVerticalAxis] : undefined));
    expect(await dragBy('locked')).toEqual({ x: 80, y: 60 });
    locked.value = true;
    expect(await dragBy('locked')).toEqual({ x: 0, y: 60 });
  });
});
