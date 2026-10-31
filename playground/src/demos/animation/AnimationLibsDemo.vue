<script setup lang="ts">
  import { reactive, shallowRef } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import LibList from './LibList.vue';
  import { gsapAnimations } from './gsap';
  import { motionAnimations } from './motion';
  import { counted, emptyCounts, type HookCounts } from './counts';

  /** Off: the lists' data changes don't animate (`animate: false`); drags still do. */
  const changes = shallowRef(true);

  const libs = [
    { name: 'gsap', title: 'GSAP', recipe: gsapAnimations },
    { name: 'motion', title: 'motion-v', recipe: motionAnimations },
  ].map((lib) => {
    const counts = reactive(emptyCounts());
    return { ...lib, counts, hooks: counted(lib.recipe, counts) };
  });
  const kinds: Array<Exclude<keyof HookCounts, 'left'>> = ['drag', 'drop', 'move', 'enter', 'leave'];
</script>

<template>
  <section>
    <h2>Animation libraries</h2>
    <p class="hint">
      Recipes, not dependencies: the same list animated by GSAP and by motion through the library's hooks. The
      provider gets <code>animation</code> (items moving while dragging), <code>dropAnimation</code> (the overlay
      landing) and <code>animate</code> (data changes: moves, items entering and leaving). See
      <code>gsap.ts</code> and <code>motion.ts</code> next to this demo.
    </p>
    <label>
      <input
        v-model="changes"
        type="checkbox"
        data-testid="animate-changes"
      />
      Animate data changes (<code>animate</code>)
    </label>
    <div class="board libs">
      <div
        v-for="lib in libs"
        :key="lib.name"
      >
        <h3>{{ lib.title }}</h3>
        <DnDProvider
          v-bind="lib.hooks"
          :animate="changes ? lib.hooks.animate : false"
        >
          <LibList :lib="lib.name" />
        </DnDProvider>
        <p class="counts">
          <span
            v-for="kind in kinds"
            :key="kind"
          >
            {{ kind }} <output :data-testid="`${lib.name}-${kind}`">{{ lib.counts[kind] }}</output>
          </span>
          <span v-if="lib.counts.left">
            left <output :data-testid="`${lib.name}-left`">{{ lib.counts.left }}</output>
          </span>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .libs {
    margin-top: 12px;
    gap: 40px;
  }

  .counts {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: #6b7280;
  }
</style>
