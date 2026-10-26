/**
 * Instrumentation for e2e/animation-libs.spec.ts, kept out of the recipes: how many
 * animations each hook started (it returned something; with reduced motion the move and
 * drop hooks return nothing, entrances and exits only fade).
 */

import type {
  DropAnimationContext,
  EnterAnimationContext,
  LayoutAnimationContext,
  LeaveAnimationContext,
} from '@vue-dnd-kit/core';

type Result = Animation | Promise<unknown> | void;

/** What `gsap.ts` and `motion.ts` export: props for `DnDProvider`. */
export interface Recipe {
  animation: (context: LayoutAnimationContext) => Result;
  dropAnimation: (context: DropAnimationContext) => Result;
  animate: {
    move: (context: LayoutAnimationContext) => Result;
    enter: (context: EnterAnimationContext) => Result;
    leave: (context: LeaveAnimationContext) => Result;
  };
}

/** Animations started: moves while dragging (`drag`) and after data changes (`move`), entrances, exits, drops. */
export interface HookCounts {
  drag: number;
  move: number;
  enter: number;
  leave: number;
  drop: number;
}

export const emptyCounts = (): HookCounts => ({ drag: 0, move: 0, enter: 0, leave: 0, drop: 0 });

const counting =
  <C>(hook: (context: C) => Result, count: (context: C) => void) =>
  (context: C): Result => {
    const result = hook(context);
    if (result) count(context);
    return result;
  };

/** `recipe` with every hook counted into `counts`. */
export const counted = (recipe: Recipe, counts: HookCounts): Recipe => {
  const move = counting(recipe.animation, ({ reason }) => counts[reason === 'drag' ? 'drag' : 'move']++);
  return {
    animation: move,
    dropAnimation: counting(recipe.dropAnimation, () => counts.drop++),
    animate: {
      move,
      enter: counting(recipe.animate.enter, () => counts.enter++),
      leave: counting(recipe.animate.leave, () => counts.leave++),
    },
  };
};
