import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { LayoutAnimation, LayoutAnimationContext } from '../types';
import { createRect, flip, getFraction, resizeAround, type FlipEntry } from './layout';

describe('resizing around a point', () => {
  // A 300×60 card grabbed near its right edge.
  const card = createRect(100, 50, 300, 60);
  const grab = { x: 370, y: 68 };

  it('gives the fractions of a point in a rect', () => {
    expect(getFraction(card, grab)).toEqual({ x: 0.9, y: 0.3 });
    expect(getFraction(card, { x: 100, y: 110 })).toEqual({ x: 0, y: 1 });
    // Outside the rect, and an empty rect.
    expect(getFraction(card, { x: 40, y: 50 })).toEqual({ x: -0.2, y: 0 });
    expect(getFraction(createRect(10, 10, 0, 0), grab)).toEqual({ x: 0, y: 0 });
  });

  it('keeps the point at the same fraction of the resized rect', () => {
    const fraction = getFraction(card, grab);
    for (const size of [{ width: 170, height: 40 }, { width: 420, height: 90 }]) {
      const resized = resizeAround(card, size, fraction);
      expect(resized.width).toBe(size.width);
      expect(resized.height).toBe(size.height);
      expect(getFraction(resized, grab).x).toBeCloseTo(0.9, 10);
      expect(getFraction(resized, grab).y).toBeCloseTo(0.3, 10);
    }
  });

  it('leaves a rect of the same size in place', () => {
    expect(resizeAround(card, card, { x: 0.9, y: 0.3 })).toEqual(card);
  });
});

type Box = [left: number, top: number, width: number, height: number];

const fakeAnimation = () => {
  const animation = {
    playState: 'running' as AnimationPlayState,
    cancel: vi.fn(() => {
      animation.playState = 'idle';
    }),
    addEventListener: vi.fn(),
  };
  return animation;
};

/** An element with a mocked layout box and a stubbed `animate()`. */
const element = (rect: Box) => {
  const node = document.createElement('div');
  document.body.appendChild(node);
  let current = rect;
  node.getBoundingClientRect = () => {
    const [left, top, width, height] = current;
    return { left, top, width, height, right: left + width, bottom: top + height, x: left, y: top } as DOMRect;
  };
  const animations: ReturnType<typeof fakeAnimation>[] = [];
  node.animate = vi.fn(() => {
    const animation = fakeAnimation();
    animations.push(animation);
    return animation as unknown as Animation;
  });
  node.getAnimations = vi.fn(() => []);
  return {
    node,
    animations,
    move(next: Box) {
      current = next;
    },
  };
};

const entry = (node: HTMLElement, [left, top, width, height]: Box): FlipEntry => ({
  key: 'a',
  element: node,
  first: createRect(left, top, width, height),
});

/** One batch: the entries of a single list. */
const run = (entries: FlipEntry[], option: LayoutAnimation) => flip([{ entries, option }]);

describe('flip', () => {
  beforeEach(() => {
    // The stubbed animations don't move anything: no translate to subtract.
    vi.stubGlobal('getComputedStyle', () => ({ translate: 'none' }));
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.unstubAllGlobals();
  });

  it('animates from the captured rect to the new layout', () => {
    const item = element([0, 100, 100, 40]);
    run([entry(item.node, [0, 60, 100, 40])], true);
    expect(item.node.animate).toHaveBeenCalledWith(
      [{ translate: '0px -40px' }, { translate: '0px 0px' }],
      expect.objectContaining({ duration: 200 }),
    );
  });

  it('lets an animation heading to the same layout rect run on', () => {
    const item = element([0, 100, 100, 40]);
    run([entry(item.node, [0, 60, 100, 40])], true);
    // Another change elsewhere: this element's layout target is unchanged.
    run([entry(item.node, [0, 80, 100, 40])], true);
    expect(item.node.animate).toHaveBeenCalledTimes(1);
    expect(item.animations[0]!.cancel).not.toHaveBeenCalled();
  });

  it('restarts from the current position when the target moved', () => {
    const item = element([0, 100, 100, 40]);
    run([entry(item.node, [0, 60, 100, 40])], true);
    item.move([0, 140, 100, 40]);
    run([entry(item.node, [0, 80, 100, 40])], true);
    expect(item.animations[0]!.cancel).toHaveBeenCalled();
    expect(item.node.animate).toHaveBeenLastCalledWith(
      [{ translate: '0px -60px' }, { translate: '0px 0px' }],
      expect.anything(),
    );
  });

  it('an element sliding in from another list ignores the pointer until it lands', () => {
    const item = element([300, 100, 100, 40]);
    run([{ ...entry(item.node, [0, 100, 100, 40]), crossing: true }], true);
    expect(item.node.style.pointerEvents).toBe('none');
    // Restarted on the way by a change in its new list: still crossing.
    item.move([300, 140, 100, 40]);
    run([entry(item.node, [150, 110, 100, 40])], true);
    expect(item.animations[0]!.cancel).toHaveBeenCalled();
    expect(item.node.style.pointerEvents).toBe('none');
    const [, land] = item.animations[1]!.addEventListener.mock.calls.find(([type]) => type === 'finish')!;
    (land as () => void)();
    expect(item.node.style.pointerEvents).toBe('');
    // Stopped before landing, it gives the pointer back too.
    run([{ ...entry(item.node, [0, 140, 100, 40]), crossing: true }], true);
    expect(item.node.style.pointerEvents).toBe('none');
    run([entry(item.node, [0, 140, 100, 40])], false);
    expect(item.node.style.pointerEvents).toBe('');
  });

  it('with reduced motion the default animation is skipped; a custom function runs and is told so', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }));
    const plain = element([0, 100, 100, 40]);
    run([entry(plain.node, [0, 60, 100, 40])], true);
    expect(plain.node.animate).not.toHaveBeenCalled();
    const contexts: LayoutAnimationContext[] = [];
    const custom = element([0, 100, 100, 40]);
    run([entry(custom.node, [0, 60, 100, 40])], (context) => void contexts.push(context));
    expect(contexts).toEqual([expect.objectContaining({ reducedMotion: true })]);
  });

  it('stops running animations when animations are turned off', () => {
    const item = element([0, 100, 100, 40]);
    run([entry(item.node, [0, 60, 100, 40])], true);
    run([entry(item.node, [0, 100, 100, 40])], false);
    expect(item.animations[0]!.cancel).toHaveBeenCalled();
  });

  it('cancels CSS transform transitions with one getAnimations() per root', () => {
    class FakeTransition {
      transitionProperty = 'transform';
      cancel = vi.fn();
      constructor(public effect: { target: Element }) {}
    }
    vi.stubGlobal('CSSTransition', FakeTransition);
    const a = element([0, 0, 100, 40]);
    const b = element([0, 50, 100, 40]);
    const other = element([0, 100, 100, 40]);
    const transitions = [a.node, other.node].map((target) => new FakeTransition({ target }));
    const getAnimations = vi.fn(() => transitions as unknown as Animation[]);
    document.getAnimations = getAnimations;

    run([entry(a.node, [0, 0, 100, 40]), entry(b.node, [0, 50, 100, 40])], true);
    expect(getAnimations).toHaveBeenCalledTimes(1);
    expect(a.node.getAnimations).not.toHaveBeenCalled();
    expect(transitions[0]!.cancel).toHaveBeenCalled();
    expect(transitions[1]!.cancel).not.toHaveBeenCalled();
  });

  it('runs the batches of several lists with their own options, reading every layout before the first animation', () => {
    const getAnimations = vi.fn(() => []);
    document.getAnimations = getAnimations;
    vi.stubGlobal('CSSTransition', class {});
    const a = element([0, 100, 100, 40]);
    const b = element([300, 100, 100, 40]);
    const reads: string[] = [];
    for (const [name, item] of [['a', a], ['b', b]] as const) {
      const measure = item.node.getBoundingClientRect;
      item.node.getBoundingClientRect = () => (reads.push(`read ${name}`), measure());
      const animate = item.node.animate;
      item.node.animate = vi.fn((...args: Parameters<Element['animate']>) => (reads.push(`animate ${name}`), animate(...args)));
    }
    flip([
      { entries: [entry(a.node, [0, 60, 100, 40])], option: { duration: 100 } },
      { entries: [entry(b.node, [300, 60, 100, 40])], option: { duration: 300 } },
    ]);
    expect(getAnimations).toHaveBeenCalledTimes(1);
    expect(reads).toEqual(['read a', 'read b', 'animate a', 'animate b']);
    expect(a.node.animate).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ duration: 100 }));
    expect(b.node.animate).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ duration: 300 }));
  });

  it("a custom function gets the reason and a signal; what it returns is kept until it ends, or aborted", async () => {
    const item = element([0, 100, 100, 40]);
    // motion's `animate()` controls, returned as they are: `cancel()` and a `finished` promise, but no events.
    let finish!: () => void;
    const controls = { cancel: vi.fn(), stop: vi.fn(), finished: new Promise<void>((resolve) => (finish = resolve)) };
    const contexts: LayoutAnimationContext[] = [];
    const custom = (context: LayoutAnimationContext) => {
      contexts.push(context);
      return controls as unknown as Animation;
    };
    flip([{ entries: [entry(item.node, [0, 60, 100, 40])], option: custom }], 'change');
    expect(contexts[0]).toMatchObject({ key: 'a', from: { top: 60 }, to: { top: 100 }, reason: 'change' });
    // Interrupted while it runs: aborted before the layout is read again.
    flip([{ entries: [entry(item.node, [0, 80, 100, 40])], option: custom }]);
    expect(contexts[0]!.signal.aborted).toBe(true);
    expect(contexts[1]).toMatchObject({ from: { top: 80 }, reason: 'drag' });
    // Ended on its own: nothing left to stop.
    finish();
    await controls.finished;
    await Promise.resolve();
    flip([{ entries: [entry(item.node, [0, 100, 100, 40])], option: custom }]);
    expect(contexts[1]!.signal.aborted).toBe(false);
    expect(controls.cancel).not.toHaveBeenCalled();
  });

  it('a custom function returning an Animation has it cancelled when interrupted', () => {
    const item = element([0, 100, 100, 40]);
    const signals: AbortSignal[] = [];
    const custom = ({ element: node, signal }: LayoutAnimationContext) => {
      signals.push(signal);
      return node.animate([{ opacity: 0.5 }, { opacity: 1 }], 100);
    };
    run([entry(item.node, [0, 60, 100, 40])], custom);
    run([entry(item.node, [0, 80, 100, 40])], custom);
    expect(item.animations[0]!.cancel).toHaveBeenCalled();
    expect(signals[0]!.aborted).toBe(true);
  });
});
