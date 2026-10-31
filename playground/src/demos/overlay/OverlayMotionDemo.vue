<script setup lang="ts">
  import { reactive, shallowRef } from 'vue';
  import { animate } from 'motion-v';
  import { DnDProvider, type DropAnimation } from '@vue-dnd-kit/core';
  import CardList from './CardList.vue';
  import MotionOverlay from './MotionOverlay.vue';
  import { cards, describeColumns } from './gallery';

  const todo = reactive({ id: 'motion-todo', title: 'To do', cards: cards('t', ['task', 'note', 'photo', 'link']) });
  const doing = reactive({ id: 'motion-doing', title: 'Doing', cards: cards('g', ['task', 'note']) });

  /** Finished drop animations, for the e2e check that the hook ran. */
  const drops = shallowRef(0);

  const lerp = (from: number, to: number, progress: number) => from + (to - from) * progress;

  /**
   * Recipe: a custom `dropAnimation` with motion's `animate`. The library calls it with
   * the overlay box and its rects and ends the drag when the returned promise settles.
   * A spring progress drives the box position and size (never `scale`: the content
   * re-lays out at the slot size). Custom hooks skip the built-in reduced-motion check.
   */
  const springDrop: DropAnimation = async ({ overlay, from, to }) => {
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (to) {
        await animate(0, 1, {
          type: 'spring',
          duration: 0.45,
          bounce: 0.3,
          onUpdate: (progress) => {
            overlay.style.transform = `translate3d(${lerp(from.left, to.left, progress)}px, ${lerp(from.top, to.top, progress)}px, 0)`;
            overlay.style.width = `${lerp(from.width, to.width, progress)}px`;
            overlay.style.height = `${lerp(from.height, to.height, progress)}px`;
          },
        });
      } else {
        // Nowhere to land (the slot is scrolled away or gone): fade out.
        await animate(overlay, { opacity: 0 }, { duration: 0.18 });
      }
    }
    drops.value++;
  };
</script>

<template>
  <DnDProvider :drop-animation="springDrop">
    <p class="lead">
      A recipe, not a dependency: the overlay component lifts with a <code>motion-v</code> spring, and the provider's
      <code>dropAnimation</code> is a function that lands the overlay with motion's <code>animate</code> and returns a
      promise.
    </p>
    <div class="layout">
      <CardList
        :column="todo"
        :options="{ group: 'motion', overlay: MotionOverlay }"
      />
      <CardList
        :column="doing"
        :options="{ group: 'motion', overlay: MotionOverlay }"
      />
    </div>
    <p>
      Drop animations: <output data-testid="motion-drops">{{ drops }}</output>
    </p>
    <pre data-testid="state">{{ describeColumns([todo, doing]) }}</pre>
  </DnDProvider>
</template>

<style scoped>
  .lead {
    max-width: 760px;
  }

  .layout {
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }
</style>
