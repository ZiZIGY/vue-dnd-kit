import { createApp, defineComponent, h, nextTick, shallowRef, useTemplateRef, type PropType, type VNodeChild } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type {
  BeforeDropResult,
  DnDProviderProps,
  DnDState,
  DraggableOptions,
  Sensor,
  SensorActivation,
  SensorContext,
  SensorDrag,
} from '../../types';
import { DnDProvider } from '../DnDProvider';
import { useDnD, useDnDMonitor, useManager } from '../context';
import type { DnDManager } from '../manager';
import { makeDraggable } from '../makeDraggable';
import { defineSensor, useSensor } from './host';
import { keyboardSensor } from './keyboard';
import { pointerSensor } from './pointer';

/**
 * The sensor API's contract: a sensor only says "drag this item from here", where it
 * moved, drop or cancel; the provider runs every check and the rest of the drag.
 */

let manager: DnDManager;
let context: SensorContext;
const mounted: Array<() => void> = [];

/** A sensor that does nothing on its own: the tests drive it through its context. */
const probe = defineSensor({
  name: 'probe',
  setup: (ctx) => {
    context = ctx;
  },
});

const Probe = defineComponent({
  setup() {
    manager = useManager();
    return () => null;
  },
});

/** A card with a grip, a button and an input inside. */
const Card = defineComponent({
  props: {
    cardId: { type: String, required: true },
    options: { type: Object as PropType<DraggableOptions>, default: () => ({}) },
  },
  setup(props) {
    makeDraggable(useTemplateRef<HTMLElement>('el'), { id: props.cardId, ...props.options });
    return () =>
      h('div', { ref: 'el', 'data-card': props.cardId }, [
        h('span', { class: 'grip' }, '::'),
        h('button', 'edit'),
        h('input'),
      ]);
  },
});

const mount = (content: () => VNodeChild, props: Partial<DnDProviderProps> | (() => Partial<DnDProviderProps>) = {}) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const read = typeof props === 'function' ? props : () => props;
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, { dropAnimation: false, sensors: [probe], ...read() }, { default: () => [h(Probe), content()] }),
  });
  app.mount(container);
  mounted.push(() => {
    app.unmount();
    container.remove();
  });
  return container;
};

const card = (container: Element, id: string) => container.querySelector<HTMLElement>(`[data-card="${id}"]`)!;
const settle = () => vi.waitFor(() => expect(manager.status.value).toBe('idle'));

afterEach(() => {
  mounted.splice(0).forEach((unmount) => unmount());
  vi.restoreAllMocks();
});

describe('activate: where a drag may start', () => {
  it('only from a draggable of this provider that is not disabled', async () => {
    const container = mount(() => [
      h(Card, { cardId: 'card' }),
      h(Card, { cardId: 'off', options: { disabled: true } }),
      // A nested provider owns its items.
      h(DnDProvider, null, () => h(Card, { cardId: 'nested' })),
    ]);
    await nextTick();
    expect(context.activate({ target: document.body })).toBeNull();
    expect(context.activate({ target: card(container, 'off') })).toBeNull();
    expect(context.activate({ target: 'off' })).toBeNull();
    expect(context.activate({ target: 'missing' })).toBeNull();
    expect(context.activate({ target: card(container, 'nested') })).toBeNull();
    const drag = context.activate({ target: card(container, 'card') });
    expect(drag?.state).toBe('dragging');
    expect(manager.active.value?.id).toBe('card');
  });

  it('pointer drags: on the handle, never from an interactive child; an id skips both', async () => {
    const container = mount(() => [h(Card, { cardId: 'card' }), h(Card, { cardId: 'handled', options: { handle: '.grip' } })]);
    await nextTick();
    expect(context.activate({ target: card(container, 'card').querySelector('button')! })).toBeNull();
    expect(context.activate({ target: card(container, 'card').querySelector('input')! })).toBeNull();
    expect(context.activate({ target: card(container, 'handled') })).toBeNull();
    const drag = context.activate({ target: card(container, 'handled').querySelector('.grip')! })!;
    expect(drag.id).toBe('handled');
    drag.cancel();
    await settle();
    expect(context.activate({ target: 'handled' })?.state).toBe('dragging');
  });

  it('keyboard drags: only from the focus target (the handle, else the draggable)', async () => {
    const container = mount(() => [h(Card, { cardId: 'card' }), h(Card, { cardId: 'handled', options: { handle: '.grip' } })]);
    await nextTick();
    const own = card(container, 'card');
    expect(context.activate({ target: own.querySelector('.grip')!, type: 'keyboard' })).toBeNull();
    expect(context.activate({ target: own.querySelector('input')!, type: 'keyboard' })).toBeNull();
    expect(context.activate({ target: card(container, 'handled'), type: 'keyboard' })).toBeNull();
    const drag = context.activate({ target: card(container, 'handled').querySelector('.grip')!, type: 'keyboard' })!;
    expect(manager.active.value?.sensor).toBe('keyboard');
    drag.cancel();
    await settle();
    expect(context.activate({ target: own, type: 'keyboard' })?.type).toBe('keyboard');
  });

  it('canDrag gets the input event; a drag without one is not gated', async () => {
    const canDrag = vi.fn((event: PointerEvent | KeyboardEvent) => event.shiftKey);
    const container = mount(() => h(Card, { cardId: 'card', options: { canDrag } }));
    await nextTick();
    const target = card(container, 'card');
    expect(context.activate({ target, event: new PointerEvent('pointerdown') })).toBeNull();
    const drag = context.activate({ target, event: new PointerEvent('pointerdown', { shiftKey: true }) })!;
    expect(drag.state).toBe('dragging');
    drag.cancel();
    await settle();
    expect(canDrag).toHaveBeenCalledTimes(2);
    expect(context.activate({ target })?.state).toBe('dragging');
    expect(canDrag).toHaveBeenCalledTimes(2);
  });
});

describe('one drag per provider', () => {
  it('nothing starts while a drag waits, runs or lands; then it does again', async () => {
    const container = mount(() => [h(Card, { cardId: 'card' }), h(Card, { cardId: 'other' })]);
    await nextTick();
    const pending = context.activate({ target: card(container, 'card'), activation: { distance: 10 } })!;
    expect(pending.state).toBe('pending');
    expect(context.activate({ target: 'other' })).toBeNull();
    pending.cancel();
    expect(manager.status.value).toBe('idle');

    let answer!: (verdict: boolean) => void;
    manager.addMonitor({ onBeforeDrop: () => new Promise<boolean>((resolve) => (answer = resolve)) });
    const drag = context.activate({ target: 'card' })!;
    expect(context.activate({ target: 'other' })).toBeNull();
    const dropped = drag.drop();
    await vi.waitFor(() => expect(answer).toBeTypeOf('function'));
    expect(manager.status.value).toBe('dropping');
    // Input while the drop is decided is ignored.
    expect(context.activate({ target: 'other' })).toBeNull();
    const raw = manager.getRawPointer();
    drag.move({ x: 500, y: 500 });
    expect(manager.getRawPointer()).toEqual(raw);
    answer(true);
    expect(await dropped).toBe(true);
    await settle();
    expect(context.activate({ target: 'other' })?.state).toBe('dragging');
  });
});

describe('activation constraints', () => {
  it('distance: pending with progress, then the drag starts where the input is', async () => {
    const onStart = vi.fn();
    const container = mount(() => h(Card, { cardId: 'card' }));
    await nextTick();
    const drag = context.activate({ target: card(container, 'card'), point: { x: 0, y: 0 }, activation: { distance: 10 }, onStart })!;
    expect(manager.status.value).toBe('activating');
    drag.move({ x: 5, y: 0 });
    expect(manager.activationProgress.value).toBe(0.5);
    expect(drag.state).toBe('pending');
    drag.move({ x: 0, y: 12 });
    expect(drag.state).toBe('dragging');
    expect(drag.started).toBe(true);
    expect(onStart).toHaveBeenCalledWith(drag);
    manager.flushFrame();
    expect(manager.pointer.value).toEqual({ x: 0, y: 12 });
  });

  it('delay: moving past the tolerance aborts; holding still starts it', async () => {
    const onEnd = vi.fn();
    const container = mount(() => h(Card, { cardId: 'card' }));
    await nextTick();
    const target = card(container, 'card');
    const aborted = context.activate({ target, point: { x: 0, y: 0 }, activation: { delay: 30, tolerance: 5 }, onEnd })!;
    aborted.move({ x: 6, y: 0 });
    expect(aborted.state).toBe('ended');
    expect(aborted.started).toBe(false);
    expect(onEnd).toHaveBeenCalledWith(aborted);
    expect(manager.status.value).toBe('idle');
    expect(manager.activationProgress.value).toBe(0);

    const held = context.activate({ target, point: { x: 0, y: 0 }, activation: { delay: 30, tolerance: 5 } })!;
    held.move({ x: 3, y: 0 });
    expect(held.state).toBe('pending');
    await vi.waitFor(() => expect(held.state).toBe('dragging'));
    expect(manager.status.value).toBe('dragging');
  });

  it("a pointer kind reads the draggable's activation option, then the provider's", async () => {
    const container = mount(() => [h(Card, { cardId: 'card', options: { activation: { mouse: { distance: 20 } } } }), h(Card, { cardId: 'other' })], {
      activation: { pen: { distance: 8 } },
    });
    await nextTick();
    const drag = context.activate({ target: card(container, 'card'), point: { x: 0, y: 0 }, activation: 'mouse' })!;
    drag.move({ x: 10, y: 0 });
    expect(drag.state).toBe('pending');
    drag.move({ x: 20, y: 0 });
    expect(drag.state).toBe('dragging');
    drag.cancel();
    await settle();
    const pen = context.activate({ target: card(container, 'other'), point: { x: 0, y: 0 }, activation: 'pen' })!;
    pen.move({ x: 7, y: 0 });
    expect(pen.state).toBe('pending');
    pen.move({ x: 8, y: 0 });
    expect(pen.state).toBe('dragging');
  });

  it('Escape (the keyboard sensor) aborts a pending activation of any sensor', async () => {
    const container = mount(() => h(Card, { cardId: 'card' }), { sensors: [keyboardSensor, probe] });
    await nextTick();
    const drag = context.activate({ target: card(container, 'card'), activation: { delay: 1000 } })!;
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true }));
    expect(drag.state).toBe('ended');
    expect(manager.status.value).toBe('idle');
  });
});

describe('the drag', () => {
  it('runs in the document drag mode of its type, restored at the end', async () => {
    const container = mount(() => h(Card, { cardId: 'card' }));
    await nextTick();
    const pointer = context.activate({ target: card(container, 'card') })!;
    expect(document.documentElement.getAttribute('data-dnd-dragging')).toBe('pointer');
    expect(manager.active.value?.sensor).toBe('pointer');
    expect(await pointer.drop()).toBe(true);
    expect(document.documentElement.hasAttribute('data-dnd-dragging')).toBe(false);
    await settle();
    const keyboard = context.activate({ target: 'card', type: 'keyboard' })!;
    expect(document.documentElement.getAttribute('data-dnd-dragging')).toBe('keyboard');
    keyboard.cancel();
    expect(document.documentElement.hasAttribute('data-dnd-dragging')).toBe(false);
  });

  it('drop() resolves whether the drop went through', async () => {
    mount(() => h(Card, { cardId: 'card' }));
    await nextTick();
    manager.addMonitor({ onBeforeDrop: () => false });
    const drag = context.activate({ target: 'card' })!;
    expect(await drag.drop()).toBe(false);
    expect(drag.state).toBe('ended');
    // A second drop of an ended drag does nothing.
    expect(await drag.drop()).toBe(false);
  });

  it('ends whoever ends it; it ignores every call afterwards', async () => {
    const onEnd = vi.fn();
    mount(() => h(Card, { cardId: 'card' }));
    await nextTick();
    const drag = context.activate({ target: 'card', onEnd })!;
    context.cancel();
    expect(drag.state).toBe('ended');
    expect(drag.started).toBe(true);
    expect(onEnd).toHaveBeenCalledTimes(1);
    const raw = manager.getRawPointer();
    drag.move({ x: 300, y: 300 });
    expect(manager.getRawPointer()).toEqual(raw);
    expect(await drag.drop()).toBe(false);
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it('keyboard drags step by items (pixels in free drags); pointer drags ignore steps', async () => {
    mount(() => h(Card, { cardId: 'card' }), { keyboard: { step: 10 } });
    await nextTick();
    const keyboard = context.activate({ target: 'card', type: 'keyboard', point: { x: 50, y: 50 } })!;
    await keyboard.step('right');
    expect(manager.pointer.value).toEqual({ x: 60, y: 50 });
    await keyboard.step('down', { fast: true });
    expect(manager.pointer.value).toEqual({ x: 60, y: 90 });
    // Queued: a step and the drop right after it both happen, in order.
    void keyboard.step('left');
    expect(await keyboard.drop()).toBe(true);
    expect(manager.getRawPointer()).toEqual({ x: 50, y: 90 });
    await settle();

    const pointer = context.activate({ target: 'card', point: { x: 50, y: 50 } })!;
    await pointer.step('right');
    manager.flushFrame();
    expect(manager.pointer.value).toEqual({ x: 50, y: 50 });
  });

  it('a drag started elsewhere is the context’s drag too: sensors can drive it', async () => {
    mount(() => h(Card, { cardId: 'card' }), { sensors: [keyboardSensor, probe] });
    await nextTick();
    expect(context.drag).toBeNull();
    manager.start('card', { x: 50, y: 50 }, 'keyboard');
    const drag = context.drag!;
    expect(drag.type).toBe('keyboard');
    // The keyboard sensor moves every keyboard drag, whoever picked it up.
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    await vi.waitFor(() => expect(manager.pointer.value).toEqual({ x: 50, y: 75 }));
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await vi.waitFor(() => expect(drag.state).toBe('ended'));
    expect(context.drag).toBeNull();
    await settle();

    // A press still waiting is over when a drag starts elsewhere.
    const pending = context.activate({ target: 'card', activation: { delay: 1000 } })!;
    manager.start('card', { x: 50, y: 50 }, 'pointer');
    expect(pending.state).toBe('ended');
    expect(context.drag?.state).toBe('dragging');
    expect(context.drag).not.toBe(pending);
  });
});

describe('sensors come and go', () => {
  /** A sensor that starts a drag of `card` as soon as it runs. */
  const eager = (log: string[]): Sensor =>
    defineSensor({
      setup(ctx) {
        log.push('setup');
        ctx.activate({ target: 'card' });
        return () => log.push('cleanup');
      },
    });

  it('`sensors` follows its list: a sensor that leaves it stops, cancelling its drag', async () => {
    const log: string[] = [];
    const sensor = eager(log);
    const sensors = shallowRef<Sensor[]>([probe]);
    mount(() => h(Card, { cardId: 'card' }), () => ({ sensors: sensors.value }));
    await nextTick();
    sensors.value = [probe, sensor];
    await nextTick();
    expect(log).toEqual(['setup']);
    // A new list with the same sensors keeps them running.
    sensors.value = [sensor, probe];
    await nextTick();
    expect(log).toEqual(['setup']);
    const drag: SensorDrag = context.drag!;
    expect(drag.state).toBe('dragging');
    sensors.value = [probe];
    await nextTick();
    expect(log).toEqual(['setup', 'cleanup']);
    expect(drag.state).toBe('ended');
    expect(manager.status.value).not.toBe('dragging');
  });

  it('useSensor runs a sensor for the lifetime of a component', async () => {
    const log: string[] = [];
    const sensor = eager(log);
    const shown = shallowRef(false);
    const User = defineComponent({
      setup() {
        useSensor(sensor);
        return () => null;
      },
    });
    mount(() => [h(Card, { cardId: 'card' }), shown.value && h(User)]);
    await nextTick();
    shown.value = true;
    await nextTick();
    const drag = context.drag!;
    expect(drag.state).toBe('dragging');
    shown.value = false;
    await nextTick();
    expect(log).toEqual(['setup', 'cleanup']);
    expect(drag.state).toBe('ended');
  });

  it('`sensors` replaces the defaults: without the pointer sensor a press does nothing', async () => {
    const container = mount(() => h(Card, { cardId: 'card' }), { sensors: [keyboardSensor] });
    await nextTick();
    card(container, 'card').dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, composed: true, isPrimary: true, button: 0, pointerType: 'mouse' }),
    );
    expect(manager.status.value).toBe('idle');
  });

  it('the built-in sensors are exported to be combined with others', async () => {
    const container = mount(() => h(Card, { cardId: 'card' }), { sensors: [pointerSensor, probe] });
    await nextTick();
    card(container, 'card').dispatchEvent(
      new PointerEvent('pointerdown', { bubbles: true, composed: true, isPrimary: true, button: 0, pointerType: 'mouse' }),
    );
    expect(manager.status.value).toBe('activating');
    expect(context.drag?.state).toBe('pending');
    context.cancel();
  });

  it('a built-in sensor can be wrapped: here the pointer drags only with Alt held', async () => {
    const altPointer = defineSensor({
      name: 'alt-pointer',
      // Object.create keeps the context's live getters (`status`, `drag`, `props`).
      setup: (ctx) =>
        pointerSensor.setup(
          Object.create(ctx, {
            activate: { value: (activation: SensorActivation) => ((activation.event as PointerEvent | undefined)?.altKey ? ctx.activate(activation) : null) },
          }),
        ),
    });
    const container = mount(() => h(Card, { cardId: 'card' }), { sensors: [altPointer, probe] });
    await nextTick();
    const press = (altKey: boolean) =>
      card(container, 'card').dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, composed: true, isPrimary: true, button: 0, pointerType: 'mouse', altKey }),
      );
    press(false);
    expect(manager.status.value).toBe('idle');
    press(true);
    expect(manager.status.value).toBe('activating');
    document.dispatchEvent(new PointerEvent('pointerup', { pointerId: 0, bubbles: true }));
    expect(manager.status.value).toBe('idle');
  });

  it('a hidden tab cancels the drag', async () => {
    mount(() => h(Card, { cardId: 'card' }));
    await nextTick();
    const drag = context.activate({ target: 'card' })!;
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    document.dispatchEvent(new Event('visibilitychange'));
    expect(drag.state).toBe('ended');
  });
});

describe('a drop onBeforeDrop is still deciding', () => {
  afterEach(() => {
    mounted.splice(0).forEach((unmount) => unmount());
    vi.restoreAllMocks();
  });

  it('holds the provider; in development the first drag or cancel asked meanwhile says why', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    let dnd!: DnDState;
    let answer!: (result: BeforeDropResult) => void;
    const Decider = defineComponent({
      setup() {
        dnd = useDnD();
        useDnDMonitor({ onBeforeDrop: () => new Promise<BeforeDropResult>((resolve) => (answer = resolve)) });
        return () => null;
      },
    });
    const container = mount(() => [h(Decider), h(Card, { cardId: 'a' }), h(Card, { cardId: 'b' })]);
    await nextTick();

    void context.activate({ target: card(container, 'a') })!.drop();
    await nextTick();
    expect(manager.status.value).toBe('dropping');
    // Nothing gets it going, neither a new drag nor a cancel. The first says why.
    expect(context.activate({ target: card(container, 'b') })).toBeNull();
    context.cancel();
    dnd.cancel();
    expect(manager.active.value?.id).toBe('a');
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]![0]).toContain('onBeforeDrop');

    // Once it answers, the provider is free again; the next drop it decides says so again.
    answer('reject');
    await settle();
    void context.activate({ target: card(container, 'b') })!.drop();
    await nextTick();
    dnd.cancel();
    expect(warn).toHaveBeenCalledTimes(2);
    answer('reject');
    await settle();
  });
});
