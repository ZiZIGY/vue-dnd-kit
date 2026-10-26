import { createApp, defineComponent, h, nextTick, shallowRef, useTemplateRef, type PropType } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DragAreaOptions, DragAreaReturn, DraggableOptions, Modifier } from '../types';
import { DnDProvider } from './DnDProvider';
import { useManager } from './context';
import type { DnDManager } from './manager';
import { makeDraggable } from './makeDraggable';
import { makeDragArea } from './makeDragArea';

let manager: DnDManager;
const areas: Record<string, DragAreaReturn> = {};
let unmount: (() => void) | null = null;

const rect = (left: number, top: number, width: number, height: number) =>
  ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top }) as DOMRect;

const Card = defineComponent({
  props: { id: { type: String, required: true }, options: { type: Object as PropType<DraggableOptions>, default: () => ({}) } },
  setup(props) {
    manager = useManager();
    makeDraggable(useTemplateRef<HTMLElement>('el'), { ...props.options, id: props.id });
    return () => h('div', { ref: 'el', 'data-card': props.id }, props.id);
  },
});

const Area = defineComponent({
  props: { id: { type: String, required: true }, options: { type: Object as PropType<DragAreaOptions>, default: () => ({}) } },
  setup(props, { slots }) {
    areas[props.id] = makeDragArea(useTemplateRef<HTMLElement>('el'), props.options);
    return () => h('div', { ref: 'el', 'data-area': props.id }, slots.default?.());
  },
});

/**
 * `outer` (with `inside` and the nested area `inner` holding `nested`) and `outside`,
 * under one provider. Every card is 100×40 at (0, 0); the outer area is 300×200 at (0, 0).
 */
const mount = async (
  outer: DragAreaOptions,
  { inner = {}, inside = {}, provider }: { inner?: DragAreaOptions; inside?: DraggableOptions; provider?: Modifier[] } = {},
) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp({
    setup: () => () =>
      h(
        DnDProvider,
        { dropAnimation: false, modifiers: provider },
        {
          default: () => [
            h(Area, { id: 'outer', options: outer }, () => [
              h(Card, { id: 'inside', options: inside }),
              h(Area, { id: 'inner', options: inner }, () => h(Card, { id: 'nested' })),
            ]),
            h(Card, { id: 'outside' }),
          ],
        },
      ),
  });
  app.mount(container);
  for (const card of container.querySelectorAll<HTMLElement>('[data-card]')) card.getBoundingClientRect = () => rect(0, 0, 100, 40);
  container.querySelector<HTMLElement>('[data-area="outer"]')!.getBoundingClientRect = () => rect(0, 0, 300, 200);
  // Template refs and the areas bound to them settle after the mount.
  await nextTick();
  unmount = () => {
    app.unmount();
    container.remove();
  };
  return container;
};

/** Drags `id` from (50, 20) to `to` and returns the offset the modifiers let through. */
const dragTo = async (id: string, to = { x: 130, y: 80 }) => {
  expect(manager.start(id, { x: 50, y: 20 }, 'pointer')).toBe(true);
  await nextTick();
  manager.move(to);
  vi.advanceTimersByTime(16);
  const offset = { ...manager.transform.value };
  manager.cancel();
  vi.advanceTimersByTime(16);
  await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  return offset;
};

describe('makeDragArea', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
  });

  afterEach(() => {
    unmount?.();
    unmount = null;
    vi.useRealTimers();
  });

  it('its modifiers and axis apply to the drags that start inside it, read when they start', async () => {
    const axis = shallowRef<'x' | 'y' | undefined>('y');
    await mount({ axis: () => axis.value });
    expect(await dragTo('inside')).toEqual({ x: 0, y: 60 });
    expect(await dragTo('outside')).toEqual({ x: 80, y: 60 });
    axis.value = undefined;
    expect(await dragTo('inside')).toEqual({ x: 80, y: 60 });
  });

  it("runs between the provider's modifiers and the draggable's; the draggable's axis wins", async () => {
    const order: string[] = [];
    const named = (name: string): Modifier => ({ transform }) => (order.push(name), transform);
    await mount(
      { modifiers: [named('area')], axis: 'y' },
      { provider: [named('provider')], inside: { modifiers: [named('own')], axis: 'x' } },
    );
    expect(await dragTo('inside')).toEqual({ x: 80, y: 0 });
    expect(order.slice(0, 3)).toEqual(['provider', 'area', 'own']);
  });

  it('restrictToArea keeps the drag inside the area', async () => {
    await mount({ restrictToArea: true });
    // The card (100×40 at 0,0) may move at most 200 right and 160 down in the 300×200 area.
    expect(await dragTo('inside', { x: 650, y: 520 })).toEqual({ x: 200, y: 160 });
    expect(await dragTo('outside', { x: 650, y: 520 })).toEqual({ x: 600, y: 500 });
  });

  it('the closest area wins', async () => {
    await mount({ axis: 'y' }, { inner: { axis: 'x' } });
    expect(await dragTo('nested')).toEqual({ x: 80, y: 0 });
    expect(await dragTo('inside')).toEqual({ x: 0, y: 60 });
  });

  it('disabled: no drag starts inside, nor in the areas inside it, and its draggables say so', async () => {
    const disabled = shallowRef(true);
    const container = await mount({ disabled: () => disabled.value });
    await nextTick();
    const card = (id: string) => container.querySelector(`[data-card="${id}"]`)!;
    expect(manager.start('inside', { x: 50, y: 20 }, 'pointer')).toBe(false);
    expect(manager.start('nested', { x: 50, y: 20 }, 'pointer')).toBe(false);
    expect(card('inside').getAttribute('aria-disabled')).toBe('true');
    expect(card('outside').getAttribute('aria-disabled')).toBe('false');
    disabled.value = false;
    await nextTick();
    expect(card('inside').getAttribute('aria-disabled')).toBe('false');
    expect(await dragTo('inside')).toEqual({ x: 80, y: 60 });
  });

  it("activation: the draggable's own constraint per pointer kind, else the area's", async () => {
    await mount({ activation: { touch: { delay: 500 }, mouse: { distance: 10 } } }, { inside: { activation: { mouse: { distance: 2 } } } });
    expect(manager.getDraggable('inside')?.getActivation?.()).toEqual({ touch: { delay: 500 }, mouse: { distance: 2 } });
    expect(manager.getDraggable('nested')?.getActivation?.()).toBeUndefined();
    expect(manager.getDraggable('outside')?.getActivation?.()).toBeUndefined();
  });

  it('isDragging: a drag that started in the area runs', async () => {
    await mount({});
    expect(manager.start('nested', { x: 50, y: 20 }, 'pointer')).toBe(true);
    expect(areas.inner!.isDragging.value).toBe(true);
    // The closest area only.
    expect(areas.outer!.isDragging.value).toBe(false);
    manager.cancel();
    expect(areas.inner!.isDragging.value).toBe(false);
    expect(manager.start('outside', { x: 50, y: 20 }, 'pointer')).toBe(true);
    expect(areas.inner!.isDragging.value).toBe(false);
    manager.cancel();
  });

  it('autoScroll overrides the scrolling of its container; isAutoScrolling follows it', async () => {
    const container = await mount({ autoScroll: { maxSpeed: 5 } });
    const area = container.querySelector<HTMLElement>('[data-area="outer"]')!;
    const overrides = [...manager.autoScrollEntries].map((entry) => [entry.getElement(), entry.getOptions()]);
    expect(overrides).toContainEqual([area, { maxSpeed: 5 }]);
    area.style.overflowY = 'auto';
    expect(areas.outer!.isAutoScrolling.value).toBe(false);
    manager.autoScrollers.value = [area];
    expect(areas.outer!.isAutoScrolling.value).toBe(true);
    manager.autoScrollers.value = [];
    expect(areas.outer!.isAutoScrolling.value).toBe(false);
  });
});
