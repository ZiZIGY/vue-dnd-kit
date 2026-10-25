import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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
    flip([entry(item.node, [0, 60, 100, 40])], true);
    expect(item.node.animate).toHaveBeenCalledWith(
      [{ translate: '0px -40px' }, { translate: '0px 0px' }],
      expect.objectContaining({ duration: 200 }),
    );
  });

  it('lets an animation heading to the same layout rect run on', () => {
    const item = element([0, 100, 100, 40]);
    flip([entry(item.node, [0, 60, 100, 40])], true);
    // Another change elsewhere: this element's layout target is unchanged.
    flip([entry(item.node, [0, 80, 100, 40])], true);
    expect(item.node.animate).toHaveBeenCalledTimes(1);
    expect(item.animations[0]!.cancel).not.toHaveBeenCalled();
  });

  it('restarts from the current position when the target moved', () => {
    const item = element([0, 100, 100, 40]);
    flip([entry(item.node, [0, 60, 100, 40])], true);
    item.move([0, 140, 100, 40]);
    flip([entry(item.node, [0, 80, 100, 40])], true);
    expect(item.animations[0]!.cancel).toHaveBeenCalled();
    expect(item.node.animate).toHaveBeenLastCalledWith(
      [{ translate: '0px -60px' }, { translate: '0px 0px' }],
      expect.anything(),
    );
  });

  it('stops running animations when animations are turned off', () => {
    const item = element([0, 100, 100, 40]);
    flip([entry(item.node, [0, 60, 100, 40])], true);
    flip([entry(item.node, [0, 100, 100, 40])], false);
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

    flip([entry(a.node, [0, 0, 100, 40]), entry(b.node, [0, 50, 100, 40])], true);
    expect(getAnimations).toHaveBeenCalledTimes(1);
    expect(a.node.getAnimations).not.toHaveBeenCalled();
    expect(transitions[0]!.cancel).toHaveBeenCalled();
    expect(transitions[1]!.cancel).not.toHaveBeenCalled();
  });
});
