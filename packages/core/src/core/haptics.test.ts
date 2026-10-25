import { createApp, defineComponent, h, nextTick, useTemplateRef } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DnDProviderProps, HapticsOptions, SensorContext } from '../types';
import { DnDProvider } from './DnDProvider';
import { useManager } from './context';
import type { DnDManager } from './manager';
import { makeDraggable } from './makeDraggable';
import { makeDroppable } from './makeDroppable';
import { defineSensor } from './sensors/host';
import { resolveHaptic } from './haptics';

describe('resolveHaptic', () => {
  it('by default only the start of a touch drag vibrates, for 10ms', () => {
    expect(resolveHaptic(undefined, 'start')).toBe(10);
    expect(resolveHaptic(true, 'start')).toBe(10);
    for (const event of ['enter', 'drop', 'refuse'] as const) expect(resolveHaptic(undefined, event)).toBeNull();
  });

  it('an object adds the others and keeps the start unless turned off', () => {
    const options: HapticsOptions = { enter: true, drop: 15, refuse: true };
    expect(resolveHaptic(options, 'start')).toBe(10);
    expect(resolveHaptic(options, 'enter')).toBe(10);
    expect(resolveHaptic(options, 'drop')).toBe(15);
    expect(resolveHaptic(options, 'refuse')).toEqual([20, 40, 20]);
    expect(resolveHaptic({ start: false }, 'start')).toBeNull();
    expect(resolveHaptic({ start: 0 }, 'start')).toBeNull();
    expect(resolveHaptic({ start: [] }, 'start')).toBeNull();
    expect(resolveHaptic({ start: [5, 10, 5] }, 'start')).toEqual([5, 10, 5]);
  });

  it('false turns everything off', () => {
    for (const event of ['start', 'enter', 'drop', 'refuse'] as const) expect(resolveHaptic(false, event)).toBeNull();
  });
});

describe('haptics of a drag', () => {
  let manager: DnDManager;
  let context: SensorContext;
  let vibrate: ReturnType<typeof vi.fn>;
  let active = true;
  const unmounts: Array<() => void> = [];

  const probe = defineSensor({
    setup: (ctx) => {
      context = ctx;
    },
  });

  const Scene = defineComponent({
    setup() {
      manager = useManager();
      makeDraggable(useTemplateRef<HTMLElement>('card'), { id: 'card' });
      makeDroppable(useTemplateRef<HTMLElement>('zone'), { id: 'zone' });
      return () => [h('div', { ref: 'card', 'data-card': '' }, 'card'), h('div', { ref: 'zone', 'data-zone': '' }, 'zone')];
    },
  });

  const mount = async (props: Partial<DnDProviderProps> = {}) => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const app = createApp({
      setup: () => () => h(DnDProvider, { dropAnimation: false, sensors: [probe], ...props }, { default: () => h(Scene) }),
    });
    app.mount(container);
    unmounts.push(() => {
      app.unmount();
      container.remove();
    });
    await nextTick();
    return container;
  };

  const press = (pointerType: string) => new PointerEvent('pointerdown', { pointerType });
  const settle = () => vi.waitFor(() => expect(manager.status.value).toBe('idle'));

  beforeEach(() => {
    active = true;
    vibrate = vi.fn(() => true);
    Object.defineProperty(navigator, 'vibrate', { value: vibrate, configurable: true, writable: true });
    Object.defineProperty(navigator, 'userActivation', {
      configurable: true,
      get: () => ({ hasBeenActive: active, isActive: active }),
    });
  });

  afterEach(() => {
    unmounts.splice(0).forEach((unmount) => unmount());
    delete (navigator as { vibrate?: unknown }).vibrate;
    delete (navigator as { userActivation?: unknown }).userActivation;
    vi.restoreAllMocks();
  });

  it('a touch drag vibrates when it starts; mouse and keyboard drags never do', async () => {
    await mount();
    const touch = context.activate({ target: 'card', event: press('touch') })!;
    expect(vibrate).toHaveBeenCalledExactlyOnceWith(10);
    touch.cancel();
    await settle();
    context.activate({ target: 'card', event: press('mouse') })!.cancel();
    await settle();
    context.activate({ target: 'card', type: 'keyboard' })!.cancel();
    expect(vibrate).toHaveBeenCalledTimes(1);
  });

  it('after a long press: when the activation ends, not when it begins', async () => {
    await mount();
    const drag = context.activate({ target: 'card', event: press('touch'), activation: { delay: 20 } })!;
    expect(vibrate).not.toHaveBeenCalled();
    await vi.waitFor(() => expect(drag.state).toBe('dragging'));
    expect(vibrate).toHaveBeenCalledExactlyOnceWith(10);
  });

  it('entering an accepting target, the drop and a refused drop, when asked for', async () => {
    const container = await mount({ haptics: { start: false, enter: 12, drop: 15, refuse: [5, 5] } });
    const zone = container.querySelector('[data-zone]');
    const hit = vi.spyOn(document, 'elementFromPoint').mockReturnValue(null);
    const drag = context.activate({ target: 'card', event: press('touch') })!;
    expect(vibrate).not.toHaveBeenCalled();
    hit.mockReturnValue(zone);
    drag.move({ x: 10, y: 10 });
    manager.flushFrame();
    expect(manager.over.value?.id).toBe('zone');
    expect(vibrate).toHaveBeenLastCalledWith(12);
    expect(await drag.drop()).toBe(true);
    expect(vibrate).toHaveBeenLastCalledWith(15);
    await settle();

    manager.addMonitor({ onBeforeDrop: () => false });
    const refused = context.activate({ target: 'card', event: press('touch') })!;
    expect(await refused.drop()).toBe(false);
    expect(vibrate).toHaveBeenLastCalledWith([5, 5]);
    expect(vibrate).toHaveBeenCalledTimes(3);
  });

  it('`haptics: false` turns them off; nothing is tried before the user interacted', async () => {
    await mount({ haptics: false });
    context.activate({ target: 'card', event: press('touch') })!.cancel();
    expect(vibrate).not.toHaveBeenCalled();
    unmounts.splice(0).forEach((unmount) => unmount());

    active = false;
    await mount();
    context.activate({ target: 'card', event: press('touch') })!.cancel();
    expect(vibrate).not.toHaveBeenCalled();
  });

  it('a browser without navigator.vibrate (iOS Safari) does nothing', async () => {
    delete (navigator as { vibrate?: unknown }).vibrate;
    expect('vibrate' in navigator).toBe(false);
    await mount();
    const drag = context.activate({ target: 'card', event: press('touch') })!;
    expect(drag.state).toBe('dragging');
  });
});
