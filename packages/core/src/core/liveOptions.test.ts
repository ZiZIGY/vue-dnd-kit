import { createApp, defineComponent, h, nextTick, shallowRef, useTemplateRef, type PropType, type VNodeChild } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type {
  AcceptMode,
  ActivationOptions,
  DraggableOptions,
  DraggableReturn,
  DroppableOptions,
  Key,
  SelectionModifier,
  SelectionStrategy,
} from '../types';
import { createRect } from '../animation/layout';
import { DnDProvider } from './DnDProvider';
import { useDnDContext } from './context';
import type { DnDManager } from './manager';
import { makeDraggable } from './makeDraggable';
import { makeDroppable } from './makeDroppable';
import { makeSelectionArea } from './makeSelectionArea';

// Options given as a ref or a getter are read when they are needed: a change made
// between two drags applies to the second one.

let manager: DnDManager;
let card: DraggableReturn;
const mounted: Array<() => void> = [];

const Probe = defineComponent({
  setup() {
    manager = useDnDContext();
    return () => null;
  },
});

const Card = defineComponent({
  props: {
    cardId: { type: String, required: true },
    options: { type: Object as PropType<DraggableOptions>, default: () => ({}) },
  },
  setup(props) {
    const draggable = makeDraggable(useTemplateRef<HTMLElement>('el'), { id: props.cardId, ...props.options });
    if (props.cardId === 'card') card = draggable;
    return () => h('div', { ref: 'el', 'data-card': props.cardId }, props.cardId);
  },
});

const Zone = defineComponent({
  props: {
    zoneId: { type: String, required: true },
    options: { type: Object as PropType<DroppableOptions>, default: () => ({}) },
  },
  setup(props, { slots }) {
    makeDroppable(useTemplateRef<HTMLElement>('el'), { id: props.zoneId, ...props.options });
    return () => h('div', { ref: 'el', 'data-zone': props.zoneId }, slots.default?.());
  },
});

const mount = (content: () => VNodeChild) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const app = createApp({
    setup: () => () => h(DnDProvider, { dropAnimation: false }, { default: () => [h(Probe), content()] }),
  });
  app.mount(container);
  mounted.push(() => {
    app.unmount();
    container.remove();
  });
  return container;
};

const pointer = (type: string, target: EventTarget, init: PointerEventInit = {}) =>
  target.dispatchEvent(
    new PointerEvent(type, { bubbles: true, composed: true, isPrimary: true, button: 0, pointerId: 1, pointerType: 'mouse', ...init }),
  );

const settle = () => vi.waitFor(() => expect(manager.status.value).toBe('idle'));

const cancel = async () => {
  manager.cancel();
  await settle();
};

afterEach(() => {
  mounted.splice(0).forEach((unmount) => unmount());
  vi.restoreAllMocks();
});

describe('makeDraggable options are read when needed', () => {
  it('`activation` when a press starts', async () => {
    const activation = shallowRef<ActivationOptions>({ mouse: {} });
    const container = mount(() => h(Card, { cardId: 'card', options: { activation: () => activation.value } }));
    await nextTick();
    const element = container.querySelector('[data-card]')!;

    pointer('pointerdown', element);
    expect(manager.status.value).toBe('dragging');
    pointer('pointerup', document);
    await settle();

    activation.value = { mouse: { distance: 50 } };
    pointer('pointerdown', element);
    expect(manager.status.value).toBe('activating');
    pointer('pointerup', document);
    expect(manager.status.value).toBe('idle');
  });

  it('`overlay` (a ref) when the drag starts', async () => {
    const overlay = shallowRef(true);
    mount(() => h(Card, { cardId: 'card', options: { overlay } }));
    await nextTick();

    manager.start('card', { x: 0, y: 0 }, 'pointer');
    manager.move({ x: 30, y: 0 });
    manager.flushFrame();
    expect(manager.hasOverlay).toBe(true);
    expect(card.transform.value).toBeNull();
    await cancel();

    overlay.value = false;
    manager.start('card', { x: 0, y: 0 }, 'pointer');
    manager.move({ x: 30, y: 0 });
    manager.flushFrame();
    expect(manager.hasOverlay).toBe(false);
    expect(card.transform.value).toEqual({ x: 30, y: 0 });
    await cancel();
  });

  it('`keyboard` on every arrow press', async () => {
    const keyboard = shallowRef<'pixels' | 'droppables'>('pixels');
    const container = mount(() => [h(Card, { cardId: 'card', options: { keyboard: () => keyboard.value } }), h(Zone, { zoneId: 'zone' })]);
    await nextTick();
    const zone = container.querySelector('[data-zone]')!;
    vi.spyOn(zone, 'getBoundingClientRect').mockReturnValue(createRect(300, 0, 100, 100) as DOMRect);
    const arrowRight = async () => {
      const before = manager.pointer.value;
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      await vi.waitFor(() => expect(manager.pointer.value).not.toBe(before));
    };

    manager.start('card', { x: 50, y: 50 }, 'keyboard');
    await arrowRight();
    expect(manager.pointer.value).toEqual({ x: 75, y: 50 });
    keyboard.value = 'droppables';
    await arrowRight();
    expect(manager.pointer.value).toEqual({ x: 350, y: 50 });
    await cancel();
  });

  it('`attributes` live: turning it off removes what the library set', async () => {
    const attributes = shallowRef(true);
    const container = mount(() => h(Card, { cardId: 'card', options: { attributes } }));
    await nextTick();
    const element = container.querySelector('[data-card]')!;
    expect(element.getAttribute('role')).toBe('button');
    expect(element.getAttribute('aria-roledescription')).toBe('draggable');

    attributes.value = false;
    await nextTick();
    expect(element.hasAttribute('role')).toBe(false);
    expect(element.hasAttribute('tabindex')).toBe(false);
    expect(element.hasAttribute('aria-describedby')).toBe(false);

    attributes.value = true;
    await nextTick();
    expect(element.getAttribute('role')).toBe('button');
  });
});

describe('makeDroppable options are read live', () => {
  it('`priority` and `acceptMode` while the drag looks for its target', async () => {
    const priority = shallowRef(0);
    const acceptMode = shallowRef<AcceptMode>('all');
    const container = mount(() => [
      h(Card, { cardId: 'card', options: { type: 'x' } }),
      h(Card, { cardId: 'other', options: { type: 'y' } }),
      h(Zone, { zoneId: 'outer', options: { priority: () => priority.value } }, () =>
        h(Zone, { zoneId: 'inner', options: { accept: 'x', acceptMode: () => acceptMode.value } }),
      ),
    ]);
    await nextTick();
    vi.spyOn(document, 'elementFromPoint').mockReturnValue(container.querySelector('[data-zone="inner"]'));
    const drag = async (ids: Key[]) => {
      manager.selection.clear();
      for (const id of ids) manager.selection.add(id);
      manager.start(ids[0]!, { x: 10, y: 10 }, 'pointer');
      const over = manager.over.value && { id: manager.over.value.id, accepted: manager.over.value.accepted };
      await cancel();
      return over;
    };

    // The deeper target wins at equal priority; a higher priority wins over nesting.
    expect(await drag(['card'])).toEqual({ id: 'inner', accepted: true });
    priority.value = 1;
    expect(await drag(['card'])).toEqual({ id: 'outer', accepted: true });

    priority.value = 0;
    expect(await drag(['card', 'other'])).toEqual({ id: 'inner', accepted: false });
    acceptMode.value = 'some';
    expect(await drag(['card', 'other'])).toEqual({ id: 'inner', accepted: true });
  });
});

describe('makeSelectionArea options are read when a band starts', () => {
  const Area = defineComponent({
    props: {
      modifier: { type: Function as PropType<() => SelectionModifier | undefined>, required: true },
      strategy: { type: Function as PropType<() => SelectionStrategy>, required: true },
    },
    setup(props) {
      makeSelectionArea(useTemplateRef<HTMLElement>('area'), { modifier: props.modifier, strategy: props.strategy });
      return () => h('div', { ref: 'area', 'data-area': '' }, [h('p', 'empty space'), h(Card, { cardId: 'card' })]);
    },
  });

  it('`modifier` and `strategy`', async () => {
    const modifier = shallowRef<SelectionModifier | undefined>({ keys: ['Shift'], method: 'every' });
    const strategy = shallowRef<SelectionStrategy>('toggle');
    const container = mount(() => h(Area, { modifier: () => modifier.value, strategy: () => strategy.value }));
    await nextTick();
    // The item lies outside the (empty) band: `'toggle'` keeps it selected, `'select'` drops it.
    vi.spyOn(container.querySelector('[data-card]')!, 'getBoundingClientRect').mockReturnValue(
      createRect(0, 100, 100, 40) as DOMRect,
    );
    const band = async () => {
      manager.selection.add('card');
      pointer('pointerdown', container.querySelector('p')!);
      const selecting = manager.status.value === 'selecting';
      pointer('pointerup', document);
      await nextTick();
      return { selecting, selected: [...manager.selection] };
    };

    expect(await band()).toEqual({ selecting: false, selected: ['card'] });
    modifier.value = undefined;
    expect(await band()).toEqual({ selecting: true, selected: ['card'] });
    strategy.value = 'select';
    expect(await band()).toEqual({ selecting: true, selected: [] });
  });
});
