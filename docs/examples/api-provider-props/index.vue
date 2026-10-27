<script setup lang="ts">
import { computed, ref } from 'vue';
import { DnDProvider, closestCenter, pointerFirst, pointerWithin, type DropAnimation } from '@vue-dnd-kit/core';
import PropRow from './PropRow.vue';
import DensityList from './DensityList.vue';

const COLLISIONS = { pointerFirst, pointerWithin, closestCenter };
const DROPS: Record<string, DropAnimation> = {
  true: true,
  false: false,
  '{ duration: 900 }': { duration: 900, easing: 'cubic-bezier(.2, .8, .2, 1)' },
};

const collision = ref<keyof typeof COLLISIONS>('pointerFirst');
const overlayFit = ref<'slot' | 'source'>('slot');
const animation = ref<'true' | 'false'>('true');
const dropAnimation = ref('true');

// The provider reads its props when it needs them: a change applies to the next drag.
const props = computed(() => ({
  collision: COLLISIONS[collision.value],
  overlayFit: overlayFit.value,
  animation: animation.value === 'true',
  dropAnimation: DROPS[dropAnimation.value],
}));

const compact = ref([
  { id: 'copy', title: 'Write copy' },
  { id: 'login', title: 'Fix login' },
]);
const roomy = ref([
  { id: 'sprint', title: 'Plan the sprint' },
  { id: 'review', title: 'Review the PR' },
]);
</script>

<template>
  <DnDProvider v-bind="props">
    <div class="demo">
      <div class="props" role="group" aria-label="DnDProvider props">
        <PropRow v-model="collision" name=":collision" :options="Object.keys(COLLISIONS) as (keyof typeof COLLISIONS)[]" />
        <PropRow v-model="overlayFit" name="overlay-fit" :options="['slot', 'source']" />
        <PropRow v-model="animation" name=":animation" :options="['true', 'false']" />
        <PropRow v-model="dropAnimation" name=":drop-animation" :options="Object.keys(DROPS)" />
      </div>
      <div class="lists">
        <DensityList v-model="compact" title="Compact" compact />
        <DensityList v-model="roomy" title="Roomy" />
      </div>
    </div>
  </DnDProvider>
</template>

<style scoped>
/* Room for every row in one list: the lists grow downward and nothing moves under the pointer. */
.demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  min-height: 430px;
}

.props {
  display: grid;
  grid-template-columns: auto auto;
  align-items: center;
  gap: 6px 14px;
  max-width: 100%;
  padding: 12px 14px;
  border: 1px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

.lists {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  gap: 14px;
}

@media (max-width: 480px) {
  .props {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
