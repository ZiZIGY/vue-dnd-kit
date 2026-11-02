---
title: "Animations"
description: "Items slide while you sort, the drop lands on its slot, and data changes can animate too. Tune each one, animate the overlay, the slot and the lists with CSS, or bring motion or GSAP."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/guides/animations"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Three things animate on their own: the items sliding while you sort, the overlay landing on
drop, and, when you turn it on, the changes of your data that no drag made. Each one takes
the same values, on the provider or closer to what it animates:

<table>
<thead>
  <tr>
    <th>
      Option
    </th>
    
    <th>
      Where
    </th>
    
    <th>
      Default
    </th>
    
    <th>
      What it animates
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        animation
      </code>
    </td>
    
    <td>
      provider, list, tree
    </td>
    
    <td>
      on, 200 ms
    </td>
    
    <td>
      Items sliding to their new places while you sort, on drop and on cancel.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dropAnimation
      </code>
    </td>
    
    <td>
      provider, draggable, item, list, tree (<code>
        overDropAnimation
      </code>
      
       on a drop target)
    </td>
    
    <td>
      on, 250 ms
    </td>
    
    <td>
      The overlay landing on its slot, or flying back on cancel.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        animateChanges
      </code>
    </td>
    
    <td>
      provider, list, tree
    </td>
    
    <td>
      <strong>
        off
      </strong>
    </td>
    
    <td>
      Changes of your data that no drag made: items added, removed, moved or filtered, tree rows shown or hidden.
    </td>
  </tr>
</tbody>
</table>

Each takes `true` (the default timing), `false` (off), `{ duration, easing }`, or a function
that animates it yourself:

```vue
<DnDProvider
  :animation="{ duration: 180, easing: 'cubic-bezier(.2, .8, .2, 1)' }"
  :drop-animation="{ duration: 300 }"
  animate-changes
>
```

A list's or tree's own `animation` and `animateChanges` win over the provider's; for
`dropAnimation`, see [per item and per target](#per-item-and-per-target). The rest of the
motion is yours: the overlay, the slot and the lists are elements with
[data attributes and refs](https://zizigy.github.io/docs/guides/styling), and CSS or an animation library moves them.

## Sorting

While you drag, the list's draft reorders and the items slide to their new places. The hand
below takes both options on its list: pick an `animation` and sort the cards, pick a
`dropAnimation` and let one go.

<example height="24rem" hint="Pick the timings, sort the cards, let one go off the table" name="anim-sort">



</example>

```ts [Hand.vue]
const springy: LayoutAnimation = ({ element, from, to, reducedMotion }) => {
  if (reducedMotion) return;
  return element.animate(
    [{ translate: `${from.left - to.left}px ${from.top - to.top}px` }, { translate: '0 0' }],
    { duration: 500, easing: 'cubic-bezier(.34, 1.56, .64, 1)' },
  );
};

const animation = shallowRef<LayoutAnimation>(true); // true, { duration: 600 }, springy or false
const dropAnimation = shallowRef<DropAnimation>(true); // true, { duration: 700 }, toss or false

const { items } = makeSortableList(table, {
  items: cards,
  strategy: 'horizontal',
  dropOutside: 'cancel', // let go off the table: the card flies back
  animation,
  dropAnimation,
});
```

It is FLIP on the CSS `translate` property, through the Web Animations API. `translate`
composes with any `transform` of yours, so a virtual list's row positioning stays intact.
When an item moves again before its animation ends, the next one starts from where it is
shown. The same animation moves the items on drop and on cancel.

The list's `animation` takes a value or a ref, read for every move: a ref switches it, as
above. A function there is an animation, not a getter.

<warning>

Don't wrap sortable items in `<TransitionGroup>`: every move would animate twice. For changes no
drag made, turn on [`animateChanges`](#data-changes-animatechanges).

</warning>

## The drop

On drop, the overlay flies from where you let go to the item's slot; on cancel, back to where
the item started. In the hand above, pick a `dropAnimation`, then drag a card off the table
and let go: the drop is cancelled, and it flies back. `toss` is a function of its own:

```ts [Hand.vue]
/** The overlay arcs to its slot, as if tossed. */
const toss: DropAnimation = ({ overlay, from, to, reducedMotion }) => {
  if (reducedMotion) return;
  // No visible slot to land on: fade out where it is.
  if (!to) return overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
  const place = (x: number, y: number) => `translate3d(${x}px, ${y}px, 0)`;
  const rise = Math.min(120, Math.hypot(to.left - from.left, to.top - from.top) / 2);
  return overlay.animate(
    [
      { transform: place(from.left, from.top), width: `${from.width}px`, height: `${from.height}px` },
      { transform: place((from.left + to.left) / 2, Math.min(from.top, to.top) - rise), offset: 0.45 },
      { transform: place(to.left, to.top), width: `${to.width}px`, height: `${to.height}px` },
    ],
    { duration: 550, easing: 'ease-in-out', fill: 'forwards' },
  );
};
```

The hand gives it to its list. On the provider, it lands every drag:

```vue
<DnDProvider :drop-animation="toss">
```

- The box lands with its position (`transform`) and its size (`width`, `height`): the
content re-lays out at the slot's size, never scaled.
- When the item has no visible slot after the drop (scrolled away, or dropped into a folder
or a trash zone), `to` is `null`. The default then fades the overlay out, shrinking it into
the zone it was dropped on (`into`), or in place.
- In a multi-drag, the clones of the other items land on their own slots by themselves, with
the default timing when `dropAnimation` is a function. Into a zone, they go in one after
another, and the box after them (see [the files and folders](https://zizigy.github.io/docs/guides/multi-drag#into-a-folder)).
- `dropAnimation` is read at every drop: a ref switches it for the next one, as in the hand,
and so does a provider prop bound to a ref.
- Scrolling while it lands doesn't send it astray. The box is `position: fixed`, so it
follows what it lands on (the slot, the zone, else the target it was dropped on) by its
CSS `translate`, on top of the `transform` the animation moves. Animate `transform` in
your own, as above, not `translate`.
- The next drag doesn't wait: each drop lands in a box of its own while new drags run. A
press on a landing box catches it in flight, and the drag goes on from where it is.
`onDragSettle` tells when a drag's overlay is home: the trash below shuts its lid then.

The overlay also takes the size of the slot it will land in while you drag
(`overlayFit: 'slot'`, the default), so a drop rarely needs a resize. See
[the overlay](https://zizigy.github.io/docs/guides/overlay#size-overlayfit).

### Per item and per target

The provider's `dropAnimation` is the default. A draggable, a sortable item or a list (for
its items) can bring their own, and a drop target can have the last word on what lands in
it: `makeDroppable(el, { overDropAnimation })`, a list's or tree's `overDropAnimation`. For each
drop, the first one that is set:

1. The target's (none on a cancel).
2. The dragged item's own.
3. Its list's.
4. The provider's.

Below, the cart, the vase and the shelf each set one. The shelf lands its products with a
bounce, the vase has a slow landing of its own, and the cart takes what is dropped on it into
its icon: the product stays on its shelf, so its slot there is no place to land. Under the
shelf, the one each drag lands with lights up.

<example height="24rem" hint="Sort the mug, then the vase; then drop either into the cart" name="anim-cart">



</example>

```ts [Shop.vue]
// 3. The list's, for its items without one of their own.
makeSortableList(shelf, {
  items: products,
  strategy: 'horizontal',
  dropAnimation: { duration: 450, easing: 'cubic-bezier(.34, 1.56, .64, 1)' },
});
```

```ts [Product.vue]
// 2. The item's own: it wins over its list's.
makeSortableItem(el, {
  item: () => props.product,
  dropAnimation: props.product.fragile ? { duration: 1100, easing: 'ease-in-out' } : undefined,
});
```

```ts [Cart.vue]
// 1. The target's: it wins over both.
const intoCart: DropAnimation = ({ overlay, from, reducedMotion }) => {
  const end = icon.value?.getBoundingClientRect();
  if (!end || reducedMotion) return;
  // Into the icon, shrinking: the box scales around its top left corner.
  const scale = end.height / from.height;
  const animation = overlay.animate(
    [
      { transform: `translate3d(${from.left}px, ${from.top}px, 0)` },
      {
        transform: `translate3d(${end.left + (end.width - from.width * scale) / 2}px, ${end.top}px, 0) scale(${scale})`,
        opacity: 0,
      },
    ],
    { duration: 450, easing: 'cubic-bezier(.55, 0, .75, .2)', fill: 'forwards' },
  );
  animation.finished.then(() => landed.value++, () => {}); // the icon bounces
  return animation;
};

makeDroppable(el, { id: 'cart', overDropAnimation: intoCart, onDrop: … });
```

`false` counts as set: a target with `overDropAnimation: false` keeps the overlay where it was
dropped. The function gets the target as `over`, so one function can treat targets apart.

### The content's own landing

The drop also waits for the animations inside the overlay that are running when it starts:
CSS animations and transitions an overlay component starts on `status: 'dropping'`. Over
the trash, a photo crumples up; dropped, it is thrown into the bin, and the drop ends when
it is in:

<example height="27rem" hint="Drag a photo into the trash; Undo brings it back" name="anim-trash">



</example>

```ts [TrashBin.vue]
makeDroppable(el, {
  id: 'trash',
  // The overlay reads it as `over.data`: it aims the photo at the bin's mouth.
  data: () => ({ bin: bin.value }),
  overOverlay: Crumple,
  // The box stays where it was let go: its content does the landing.
  overDropAnimation: false,
  onDrop: (event) => emit('drop', event), // the gallery calls `event.source?.remove()`
});

// Its landing is over: the photo is in, the lid shuts.
useDnDMonitor({
  onDragSettle: (event) => {
    if ('dropped' in event && event.over?.id === 'trash') shut.value++;
  },
});
```

```vue [Crumple.vue]
<template>
  <div class="crumple">
    <!-- `fall` is set at the drop: `--dx` and `--dy`, from the photo to the bin in `over.data`. -->
    <div class="paper" :class="{ falling: fall }" :style="fall">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.paper { clip-path: polygon(…); rotate: -8deg; scale: 0.7; }
.paper.falling { animation: fall 0.55s forwards; }
@keyframes fall {
  to { translate: var(--dx) var(--dy); rotate: -120deg; scale: 0.12; opacity: 0; }
}
</style>
```

Finished animations and endless loops don't count, and the drop waits two seconds at most.

## Data changes: `animateChanges`

Drag a tile, then shuffle, add and remove some. The drag animates by default; the buttons'
changes animate because the grid turns on `animateChanges`.

<example height="22.75rem" hint="Drag, shuffle, add, remove" name="animate">



</example>

```ts
makeSortableList(listRef, { items: swatches, animateChanges: true });
```

Off by default, `animateChanges` animates what changes your array without a drag: a sort, a shuffle, a
move between lists of one group, an item added, removed or filtered out. In a tree it also covers
the rows a node shows or hides as it expands and collapses. `<DnDProvider animate-changes>` turns it on for
every list and tree.

Its parts can be tuned one by one:

```ts
animateChanges: { duration: 250, move: true, enter: true, leave: { duration: 150 } },
```

<table>
<thead>
  <tr>
    <th>
      Part
    </th>
    
    <th>
      By default
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        move
      </code>
    </td>
    
    <td>
      Items that changed places slide, as with <code>
        animation
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        enter
      </code>
    </td>
    
    <td>
      Items that appeared fade in where they are.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        leave
      </code>
    </td>
    
    <td>
      A copy of the item that left fades out where it was, shrinking a little. It is marked <code>
        data-dnd-leaving
      </code>
      
       and removed when it's done.
    </td>
  </tr>
</tbody>
</table>

`duration` and `easing` apply to every part; each part takes `true`, options, `false` or a
function. Only items near the visible area animate, so rows a virtual list hasn't mounted are
skipped. The option is read when `items` changes, so a ref can switch it, as the demo's toggle
does.

## The overlay: lift, tilt, settle

The overlay box says what it is doing: `data-dnd-overlay="dragging"` while it follows the
pointer, `"dropping"` while it lands. The library moves and sizes the box. Inside it,
`data-dnd-overlay-content` holds all the overlay shows, one clone or a whole stack, and is
yours to animate. Pick a candidate up: the overlay lifts and tilts; let go: it lies flat as
it lands.

<example height="24.5rem" hint="Pick a candidate up, drag it to Hired, let go" name="anim-container">



</example>

```vue [index.vue]
<template>
  <DnDProvider overlay-class="pipeline-hand">…</DnDProvider>
</template>

<!-- Not scoped: the overlay's content element is the library's, outside this component. -->
<style>
.pipeline-hand {
  transition:
    rotate 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
    scale 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

[data-dnd-overlay='dragging'] > .pipeline-hand {
  rotate: 3deg;
  scale: 1.05;
}

/* Where the lift starts: the box appears already `dragging`. */
@starting-style {
  [data-dnd-overlay='dragging'] > .pipeline-hand {
    rotate: 0deg;
    scale: 1;
  }
}
</style>
```

- `overlay-class` puts your classes on the overlay content of this provider: the drag's and
the ones still landing. Tailwind takes it too (`starting:` writes `@starting-style`).
- A transition needs a start, and the box appears already `dragging`: `@starting-style`
gives the lift its "before". When the box turns `dropping`, the transition runs back, and
the drop waits for it to end.
- The content itself animates the same way, in its own component: the
[board](https://zizigy.github.io/docs/examples/board)'s card in hand and its columns tilt as they are picked up
(`[data-dnd-overlay='dragging'] .column` with `@starting-style`). Keyframes work too: they
play from the start of the state.
- An **overlay component** gets `status` as a prop: its transitions can follow it. The note of
[the provider's slot demo](https://zizigy.github.io/docs/guides/overlay#the-providers-overlay-slot) straightens with
`transition: rotate 0.25s` when `status` turns `'dropping'`.
- Leave the box itself (`[data-dnd-overlay]`) alone: a transition on it would lag behind the
pointer, and the library writes its `transform` and size.

## The slot and the lists

The dragged element stays in its list as the **slot** it will land in, marked
`data-dnd-placeholder`. Its lists know about the drag too: `isAccepting` while a drag runs
that they take, `isOver` while it is over them. In the pipeline above, every lane gets ready
as you pick a candidate up, the one under the card lights up, its count bumps, and the slot
opens and breathes.

```vue [Lane.vue]
<script setup lang="ts">
const { items, isOver, isAccepting } = makeSortableList(list, {
  id: props.lane.id,
  items: toRef(props.lane, 'people'),
  group: 'pipeline',
  dropzone: zone,
});
</script>

<template>
  <section ref="zone" class="lane" :class="{ ready: isAccepting, over: isOver }">
    <h3>
      {{ lane.title }}
      <!-- A new element for every count: its animation plays on each change. -->
      <span :key="items.length" class="count">{{ items.length }}</span>
    </h3>
    <ul ref="list">…</ul>
  </section>
</template>

<style scoped>
.lane { transition: background-color 0.25s, box-shadow 0.25s; }
.lane.ready { box-shadow: inset 0 0 0 1px color-mix(in srgb, #42b883 35%, transparent); }
.lane.over { background: color-mix(in srgb, #42b883 8%, transparent); box-shadow: inset 0 0 0 1.5px #42b883; }
.count { animation: bump 0.3s ease-out; }
</style>
```

```css [Candidate.vue]
/* The slot opens where it appears, then breathes until the card lands. */
.candidate[data-dnd-placeholder] {
  animation: open 0.2s ease-out, breathe 1.2s ease-in-out 0.2s infinite;
}
```

- `items` is the draft: its `length` counts the card as soon as its slot enters the lane, so
the count changes while you drag.
- A slot that moves to another list is a new element there, so its keyframes play again.
- The lists themselves grow and shrink smoothly as a slot comes in and leaves, and so does
what is around them (`animateSize`, on by default; `false` lets them jump). Leave their
sizes to that: a list you resize while a drag runs moves the targets under the pointer.
Glows, outlines, colors and `scale` are safe.

## Your own animations

Each option also takes a function. It gets a context, starts the animation and returns its
`Animation`, a promise that settles when it ends, or nothing. The drag ends when the drop
animation does, and a leaving copy is removed when its animation does, but neither waits more
than a second past `options.duration` (250 ms for the drop, 200 ms for the others).

```ts
// animation, animateChanges.move: an item moved from `from` to `to`
({ key, element, from, to, options, reason, signal, reducedMotion }) => Animation | Promise | void
// dropAnimation: `to` is null when there is no visible slot; `into` is the zone it went into
({ overlay, from, to, into, reason, active, options, reducedMotion }) => …
// animateChanges.enter: the element is already in place
({ key, element, to, options, reducedMotion }) => …
// animateChanges.leave: `element` is a copy where the item was, removed when you finish
({ key, element, from, options, reducedMotion }) => …
```

`reason` says why: `'drag'` or `'change'` for a move, `'drop'` or `'cancel'` for the
overlay. `options` holds the timing of the option, so a function can follow the
`duration` you set next to it.

Three rules keep custom animations in step with the library:

- **Animate translate** from `from - to` to zero, not `transform`. It composes with transforms
that virtual lists or your CSS put on rows, and drags measure items without it.
- **Honor signal.** It aborts when the item moves again before the animation ends. Stop your
animation and clear its styles at once: the layout is measured right after. A returned
`Animation` is cancelled for you.
- **Land on a slot with position and size** (`width`, `height`), not `scale`: the overlay's
content re-lays out at the slot's size. Where there is no slot to land on, shrinking is
fine: the default scales the overlay down into the zone (`into`), and the cart above into
its icon.

### motion

The garland below runs on [motion](https://motion.dev/docs/vue): the flags and the drop
spring through the provider's functions, and the overlay component swings with the
pointer's speed.

<example height="17rem" hint="Drag a flag fast from side to side, then let go" name="anim-motion">



</example>

```vue [index.vue]
<script setup lang="ts">
import { animate } from 'motion-v';
import { DnDProvider, type DropAnimationContext, type LayoutAnimationContext } from '@vue-dnd-kit/core';

const spring = { type: 'spring', duration: 0.5, bounce: 0.3 } as const;

const move = ({ element, from, to, signal, reducedMotion }: LayoutAnimationContext) => {
  if (reducedMotion) return;
  const controls = animate(element, { translate: [`${from.left - to.left}px ${from.top - to.top}px`, '0px 0px'] }, spring);
  signal.addEventListener('abort', () => {
    controls.stop();
    element.style.translate = '';
  });
  return controls.finished;
};

const drop = ({ overlay, from, to, reducedMotion }: DropAnimationContext) => {
  if (reducedMotion) return;
  if (!to) return animate(overlay, { opacity: 0 }, { duration: 0.18 }).finished;
  return animate(
    overlay,
    { x: [from.left, to.left], y: [from.top, to.top], width: [from.width, to.width], height: [from.height, to.height] },
    spring,
  ).finished;
};
</script>

<template>
  <DnDProvider :animation="move" :drop-animation="drop">
    <Garland />
  </DnDProvider>
</template>
```

The overlay component renders under the provider, so `useDnD()` works in it. It follows the
pointer through a motion value:

```vue [FlagOverlay.vue]
<script setup lang="ts">
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity } from 'motion-v';
import { useDnD, type DnDStatus, type DragItem } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; status: DnDStatus }>();

const { pointer } = useDnD();
const x = useMotionValue(pointer.value?.x ?? 0);
watch(() => pointer.value?.x, (value) => value !== undefined && x.set(value));
const swing = useSpring(useTransform(useVelocity(x), [-1500, 0, 1500], [-25, 0, 25]), { stiffness: 300, damping: 14 });
const calm = useReducedMotion();
</script>

<template>
  <!-- Held by its top edge: `transform-origin: 50% 0` in its CSS. -->
  <motion.div
    class="flag-overlay"
    :style="{ rotate: calm ? 0 : swing }"
    :animate="{ scale: status === 'dropping' || calm ? 1 : 1.1 }"
  >
    …
  </motion.div>
</template>
```

### GSAP

```ts [gsap-animations.ts]
import gsap from 'gsap';
import type {
  DropAnimationContext,
  EnterAnimationContext,
  LayoutAnimationContext,
  LeaveAnimationContext,
  Rect,
} from '@vue-dnd-kit/core';

const move = ({ element, from, to, signal, reducedMotion }: LayoutAnimationContext) => {
  if (reducedMotion) return;
  const tween = gsap.fromTo(
    element,
    { translate: `${from.left - to.left}px ${from.top - to.top}px` },
    { translate: '0px 0px', duration: 0.4, ease: 'power3.out' },
  );
  signal.addEventListener('abort', () => tween.revert());
  return tween.then();
};

const box = (rect: Rect) => ({ x: rect.left, y: rect.top, width: rect.width, height: rect.height });

const drop = ({ overlay, from, to, reducedMotion }: DropAnimationContext) => {
  if (reducedMotion) return;
  if (!to) return gsap.to(overlay, { opacity: 0, duration: 0.2 }).then();
  return gsap.fromTo(overlay, box(from), { ...box(to), duration: 0.45, ease: 'back.out(1.2)' }).then();
};

const enter = ({ element, reducedMotion }: EnterAnimationContext) =>
  gsap.from(element, reducedMotion ? { opacity: 0, duration: 0.2 } : { opacity: 0, scale: 0.85, duration: 0.35 }).then();

const leave = ({ element, reducedMotion }: LeaveAnimationContext) =>
  gsap.to(element, reducedMotion ? { opacity: 0, duration: 0.2 } : { opacity: 0, scale: 0.85, duration: 0.25 }).then();

export const gsapAnimations = { animation: move, dropAnimation: drop, animateChanges: { move, enter, leave } };
```

```vue
<DnDProvider v-bind="gsapAnimations">
```

The full option types are in [Animations](https://zizigy.github.io/docs/api/animations).

## Reduced motion

With `prefers-reduced-motion: reduce`, the library's own animations don't run: items and the
overlay go straight to their places, and the overlay doesn't glide between slot sizes. Your
functions always run, with `reducedMotion: true`, so they decide: skip the motion, or keep a
short fade, as the recipes above do.

Your CSS is yours to guard. Put lifts, tilts and pulses in
`@media (prefers-reduced-motion: no-preference)`, as the demos on this page do, and keep
the color changes outside it: they tell where a drop goes.

## Layout changes the library didn't cause

When something else moves rows during a drag — a virtualizer re-measuring, an image loading —
call the list's `captureLayout()` right before the change renders. It measures the rows where they
are and animates them to their new places after the next render. Outside a drag it does nothing.
See [Virtual lists](https://zizigy.github.io/docs/guides/virtual-lists).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
