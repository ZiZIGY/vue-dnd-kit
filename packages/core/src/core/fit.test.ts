import { createApp, defineComponent, h, nextTick, useTemplateRef } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Modifier } from '../types';
import { createRect, getCenter, getFraction } from '../animation/layout';
import { DnDProvider } from './DnDProvider';
import { useDnDContext } from './context';
import type { DnDManager } from './manager';
import { makeDraggable } from './makeDraggable';
import { snapCenterToCursor, snapToGrid } from './modifiers';

// A 300×60 card at (100, 50), grabbed at 90% of its width and 30% of its height.
const grab = { x: 370, y: 68 };
// Layout size of the card. A free draggable lands on itself: this is the slot size.
let slot = { width: 300, height: 60 };

let manager: DnDManager;
let unmount: (() => void) | null = null;

const mountCard = (options: { modifiers?: Modifier[]; overlay?: boolean } = {}) => {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const Card = defineComponent({
    setup() {
      manager = useDnDContext();
      makeDraggable(useTemplateRef<HTMLElement>('el'), { id: 'card', overlay: options.overlay });
      return () => h('div', { ref: 'el', 'data-card': '' }, 'card');
    },
  });
  const app = createApp({
    setup: () => () =>
      h(DnDProvider, { dropAnimation: false, modifiers: options.modifiers }, { default: () => h(Card) }),
  });
  app.mount(container);
  const card = container.querySelector<HTMLElement>('[data-card]')!;
  card.getBoundingClientRect = () =>
    ({ left: 100, top: 50, width: 300, height: 60, right: 400, bottom: 110, x: 100, y: 50 }) as DOMRect;
  Object.defineProperty(card, 'offsetWidth', { get: () => slot.width });
  Object.defineProperty(card, 'offsetHeight', { get: () => slot.height });
  unmount = () => {
    app.unmount();
    container.remove();
  };
};

const overlayStyle = () => document.querySelector<HTMLElement>('[data-dnd-overlay]')!.style;

/** The overlay box as collision, modifiers and the overlay place it. */
const box = () => manager.getOverlayRect(manager.active.value!, manager.transform.value);

/** Starts the drag at `grab`, then gives the slot `size`: the next frame starts the resize. */
const startAndResize = async (size: typeof slot) => {
  expect(manager.start('card', grab, 'pointer')).toBe(true);
  await nextTick();
  slot = size;
  manager.move(grab);
};

const end = async () => {
  manager.cancel();
  vi.advanceTimersByTime(16);
  await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
};

describe('overlay box resizes around the grab point (overlayFit: slot)', () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] });
    slot = { width: 300, height: 60 };
  });

  afterEach(() => {
    unmount?.();
    unmount = null;
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('glides to the slot size, keeping the pointer at the same fraction of the box', async () => {
    mountCard();
    await startAndResize({ width: 170, height: 40 });
    const widths: number[] = [];
    for (let frame = 0; frame < 12; frame++) {
      vi.advanceTimersByTime(16);
      widths.push(box().width);
      expect(getFraction(box(), grab).x).toBeCloseTo(0.9, 6);
      expect(getFraction(box(), grab).y).toBeCloseTo(0.3, 6);
    }
    expect(widths.some((width) => width < 300 && width > 170)).toBe(true);
    expect(box()).toEqual(createRect(217, 56, 170, 40));
    // The drag offset is still the pointer's: integrations derive the origin from it.
    expect(manager.transform.value).toEqual({ x: 0, y: 0 });
    expect(manager.pointer.value).toEqual(grab);
    await nextTick();
    const style = overlayStyle();
    expect([style.width, style.height, style.transform]).toEqual(['170px', '40px', 'translate3d(217px, 56px, 0)']);
    await end();
  });

  it('resizes at once with reduced motion', async () => {
    vi.stubGlobal('matchMedia', () => ({ matches: true }));
    mountCard();
    await startAndResize({ width: 170, height: 40 });
    vi.advanceTimersByTime(16);
    expect(box()).toEqual(createRect(217, 56, 170, 40));
    await end();
  });

  it('snapCenterToCursor: the box stays centered on the pointer, the drag point stays put', async () => {
    mountCard({ modifiers: [snapCenterToCursor] });
    await startAndResize({ width: 170, height: 40 });
    const point = manager.pointer.value;
    for (let frame = 0; frame < 12; frame++) {
      vi.advanceTimersByTime(16);
      expect(getCenter(box())).toEqual(grab);
    }
    expect(box().width).toBe(170);
    expect(manager.pointer.value).toEqual(point);
    await end();
  });

  it('smooth snapping: the resize shift sits in `translate`, and folds into `transform` on drop', async () => {
    mountCard({ modifiers: [snapToGrid({ x: 1, y: 1, smooth: true })] });
    await startAndResize({ width: 170, height: 40 });
    vi.advanceTimersByTime(200);
    await nextTick();
    const style = overlayStyle();
    expect([style.transform, style.translate]).toEqual(['translate3d(100px, 50px, 0)', '117px 6px']);
    expect(style.transition).toContain('transform');
    // The drop animation starts from the overlay's rect and animates `transform` only.
    manager.cancel();
    await nextTick();
    expect(manager.status.value).toBe('dropping');
    expect([style.transform, style.translate, style.transition]).toEqual(['translate3d(217px, 56px, 0)', '', '']);
    vi.advanceTimersByTime(16);
    await vi.waitFor(() => expect(manager.status.value).toBe('idle'));
  });

  it('without an overlay the element moves itself and keeps its size', async () => {
    mountCard({ overlay: false });
    await startAndResize({ width: 170, height: 40 });
    vi.advanceTimersByTime(200);
    expect(box()).toEqual(createRect(100, 50, 300, 60));
    await end();
  });
});
