# Animations

Three independent options. Each accepts `true` (default timing), `false` (off),
`{ duration, easing }`, or a function that animates it yourself.

| Option | Where | Default | Animates |
| --- | --- | --- | --- |
| `animation` | provider, list, tree | on, 200 ms | Items sliding to their new places while sorting, on drop and on cancel (FLIP on the CSS `translate` property, through the Web Animations API). |
| `dropAnimation` | provider, draggable, item, list; drop targets (`makeDroppable`, a list's or tree's `overDropAnimation`) | on, 250 ms | The overlay landing on its slot. With no visible slot, it fades out, or shrinks into the zone it was dropped on. Per drop: the target's, else the item's (its list's), else the provider's; `false` counts. The drop also waits (2 s at most) for finite CSS animations inside the overlay that run when it starts (a splash on `status: 'dropping'`). |
| `animate` | provider, list, tree | **off** | Changes of your data that no drag made: items added, removed, moved (sort, shuffle, a move between lists) or filtered, and tree rows shown or hidden by expanding and collapsing. |

```vue
<DnDProvider :animation="{ duration: 180, easing: 'cubic-bezier(.2,.8,.2,1)' }" :drop-animation="{ duration: 300 }" animate>
```

```ts
makeSortableList(listRef, {
  items,
  animate: { duration: 250, enter: true, leave: { duration: 150 }, move: true },
});
```

`animate` with parts: `{ duration, easing, move, enter, leave }`. Each part is `true`,
options, `false` or a function. The default `enter` fades in place. The default `leave`
fades a copy of the item out where it was, shrinking a little. Only items near the
visible area animate.

## Reduced motion

With `prefers-reduced-motion: reduce`, the library's own animations don't run. **Your
functions always run** and get `reducedMotion: true`, so they decide (skip, or keep a
fade).

## Custom functions

Each function gets a context and returns an `Animation`, a promise that settles when it
ends, or nothing.

```ts
// Layout (animation, animate.move)
({ key, element, from, to, options, reason: 'drag' | 'change', signal, reducedMotion }) => Animation | Promise | void
// Drop (dropAnimation)
({ overlay, from, to /* null: no visible slot */, into /* zone rect or null */, reason: 'drop' | 'cancel', active, over /* the target, null on cancel */, options, reducedMotion }) => …
// Enter (animate.enter): element is in place
({ key, element, to, options, reducedMotion }) => …
// Leave (animate.leave): element is a copy left where the item was; removed when you finish
({ key, element, from, options, reducedMotion }) => …
```

Rules for layout functions:
- **Animate `translate`** (from `from - to` to `0`), not `transform`. It composes with
  transforms that virtual lists or your CSS put on rows, and drags measure items without it.
- **Honor `signal`.** When the item moves again before the animation ends, the signal
  aborts. Stop your animation and clear its styles **at once**, because the layout is
  measured right after. A returned `Animation` is cancelled for you.
- On the overlay, animate position and size (`width`/`height`), never `scale`: the
  content re-lays out. Move it with **`transform`**, not `translate`: while it lands, the
  library keeps the box (`position: fixed`) on its slot by `translate` if the page scrolls.

### GSAP recipe

```ts
import gsap from 'gsap';
import type { DropAnimationContext, EnterAnimationContext, LayoutAnimationContext, LeaveAnimationContext, Rect } from '@vue-dnd-kit/core';

const move = ({ element, from, to, signal, reducedMotion }: LayoutAnimationContext) => {
  if (reducedMotion) return;
  const tween = gsap.fromTo(element,
    { translate: `${from.left - to.left}px ${from.top - to.top}px` },
    { translate: '0px 0px', duration: 0.4, ease: 'power3.out' });
  signal.addEventListener('abort', () => tween.revert());
  return tween.then();
};
const box = (r: Rect) => ({ x: r.left, y: r.top, width: r.width, height: r.height });
const drop = ({ overlay, from, to, reducedMotion }: DropAnimationContext) => {
  if (reducedMotion) return;
  if (!to) return gsap.to(overlay, { opacity: 0, duration: 0.2 }).then();
  return gsap.fromTo(overlay, box(from), { ...box(to), duration: 0.45, ease: 'back.out(1.2)' }).then();
};
const enter = ({ element, reducedMotion }: EnterAnimationContext) =>
  gsap.from(element, reducedMotion ? { opacity: 0, duration: 0.2 } : { opacity: 0, scale: 0.85, duration: 0.35 }).then();
const leave = ({ element, reducedMotion }: LeaveAnimationContext) =>
  gsap.to(element, reducedMotion ? { opacity: 0, duration: 0.2 } : { opacity: 0, scale: 0.85, duration: 0.25 }).then();

export const gsapAnimations = { animation: move, dropAnimation: drop, animate: { move, enter, leave } };
// <DnDProvider v-bind="gsapAnimations">
```

### motion (motion-v) recipe

```ts
import { animate } from 'motion-v';
const spring = { type: 'spring', duration: 0.45, bounce: 0.25 } as const;

const move = ({ element, from, to, signal, reducedMotion }: LayoutAnimationContext) => {
  if (reducedMotion) return;
  const controls = animate(element, { translate: [`${from.left - to.left}px ${from.top - to.top}px`, '0px 0px'] }, spring);
  signal.addEventListener('abort', () => { controls.stop(); element.style.translate = ''; });
  return controls.finished;
};
const drop = ({ overlay, from, to, reducedMotion }: DropAnimationContext) => {
  if (reducedMotion) return;
  if (!to) return animate(overlay, { opacity: 0 }, { duration: 0.18 }).finished;
  return animate(overlay,
    { x: [from.left, to.left], y: [from.top, to.top], width: [from.width, to.width], height: [from.height, to.height] },
    spring).finished;
};
```

## Layout changes the library didn't cause

When something else moves rows mid-drag (a virtualizer re-measuring, an image loading),
call the list's `captureLayout()` right before the change is rendered. It measures the
rows where they are, then animates them to their new places after the next render. It
does nothing while no drag is running. See [virtualization](virtualization.md).

## Don't

- Don't wrap sortable items in `<TransitionGroup>`: moves would be animated twice. Use `animate`.
- Don't animate `height`, `margin` or `padding` of rows inside a virtual list (ResizeObserver loops).
