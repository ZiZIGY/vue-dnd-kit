/**
 * `animate` (rfcs/0001-v3.md §8): changes of a list's items that no drag made. Moves go
 * through the FLIP engine (`layout.ts`); this module resolves the option per kind of
 * change and plays the other two: items appearing, and items leaving. A leaving item is
 * gone from the DOM by the time it is animated, so a copy of it stands in its place.
 */

import type {
  AnimationOptions,
  AutoAnimation,
  EnterAnimationContext,
  Key,
  LayoutAnimation,
  LeaveAnimationContext,
  Rect,
} from '../types';
import { copyElement } from '../core/clone';
import {
  DEFAULT_LAYOUT_ANIMATION,
  STALL_MARGIN,
  canAnimate,
  getRect,
  prefersReducedMotion,
  resolveAnimation,
  settle,
} from './layout';

type Result = Animation | Promise<unknown> | void;
type Resolved<TContext> = NonNullable<
  ReturnType<typeof resolveAnimation<(context: TContext) => Result>>
>;

/** `animate` resolved per kind of change. */
export interface AutoAnimationParts {
  /** For `flip`: the move option and the timing it falls back to. */
  move: { option: LayoutAnimation; defaults: Required<AnimationOptions> };
  enter: Resolved<EnterAnimationContext> | null;
  leave: Resolved<LeaveAnimationContext> | null;
}

/** `duration` and `easing` given in `option`, leaving out the unset ones. */
const timing = ({ duration, easing }: AnimationOptions): AnimationOptions => ({
  ...(duration !== undefined && { duration }),
  ...(easing !== undefined && { easing }),
});

/**
 * `animate` per kind of change; `null` when it is off. Reduced motion turns it off
 * altogether, custom functions included: nothing is even measured then.
 */
export const resolveAutoAnimation = (option: AutoAnimation | undefined): AutoAnimationParts | null => {
  if (!option || prefersReducedMotion()) return null;
  const parts = option === true ? {} : option;
  const defaults = { ...DEFAULT_LAYOUT_ANIMATION, ...timing(parts) };
  const resolved: AutoAnimationParts = {
    move: { option: parts.move ?? true, defaults },
    enter: resolveAnimation(parts.enter, defaults),
    leave: resolveAnimation(parts.leave, defaults),
  };
  return resolved.move.option !== false || resolved.enter || resolved.leave ? resolved : null;
};

/** Plays the entrance of an item that appeared: by default a fade in, in its place. */
export const enter = (part: Resolved<EnterAnimationContext>, key: Key, element: HTMLElement, to: Rect): void => {
  const { custom, options } = part;
  if (custom) void custom({ key, element, to, options });
  else if (canAnimate(element)) element.animate([{ opacity: 0 }, { opacity: 1 }], options);
};

export interface Leaving {
  key: Key;
  /** The item's element, which Vue has just removed (detached, still whole). */
  element: HTMLElement;
  /** The parent it was in: the copy goes there, so the page's styles and clipping apply. */
  parent: Element;
  /** Where it was. */
  from: Rect;
}

/** Applied with `!important`: the copy keeps the item's look, but not its place in the flow. */
const GHOST_STYLE: Record<string, string> = {
  position: 'absolute',
  left: '0px',
  top: '0px',
  margin: '0px',
  'box-sizing': 'border-box',
  'pointer-events': 'none',
  transition: 'none',
  // A CSS entrance animation of the item would replay on the copy.
  animation: 'none',
};

/** A copy animating out: `remove` takes it away at once (the key came back), `ended` settles when it is gone. */
export interface Ghost {
  remove(): void;
  ended: Promise<void>;
}

/**
 * Plays the exit of items that left: a copy of each stands where it was (absolutely
 * positioned in its old parent) and is animated out, by default fading as it shrinks a
 * little, then removed. Table rows and SVG elements get no copy: they can't be taken out
 * of their layout.
 */
export const leave = (part: Resolved<LeaveAnimationContext>, items: Leaving[]): Map<Key, Ghost> => {
  const copies = new Map<Key, Ghost>();
  const ghosts = items.flatMap(({ key, element, parent, from }) => {
    if (!(element instanceof HTMLElement) || element.tagName === 'TR' || !parent.isConnected) return [];
    const ghost = copyElement(element);
    ghost.setAttribute('data-dnd-leaving', '');
    ghost.setAttribute('inert', '');
    const style: Record<string, string> = { ...GHOST_STYLE, width: `${from.width}px`, height: `${from.height}px` };
    for (const name in style) ghost.style.setProperty(name, style[name]!, 'important');
    parent.appendChild(ghost);
    return [{ key, ghost, from }];
  });
  // Every copy is in before the first read: one layout for all of them.
  const placed = ghosts.map(({ ghost }) => getRect(ghost));
  ghosts.forEach(({ key, ghost, from }, index) => {
    const at = placed[index]!;
    ghost.style.setProperty('left', `${from.left - at.left}px`, 'important');
    ghost.style.setProperty('top', `${from.top - at.top}px`, 'important');
    const { custom, options } = part;
    const result = custom
      ? custom({ key, element: ghost, from, options })
      : canAnimate(ghost)
        ? ghost.animate(
            [
              { opacity: 1, scale: '1' },
              { opacity: 0, scale: '0.96' },
            ],
            { ...options, fill: 'forwards' },
          )
        : undefined;
    const remove = () => ghost.remove();
    copies.set(key, { remove, ended: settle(result, options.duration + STALL_MARGIN).then(remove) });
  });
  return copies;
};
