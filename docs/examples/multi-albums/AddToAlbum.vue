<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, Over } from '@vue-dnd-kit/core';

// The albums' overlay: the photos' own stack (its slot), and under it what the drop does.
const props = defineProps<{ items: DragItem[]; over: Over | null }>();
const album = computed(() => props.over?.data as { name: string } | undefined);
const what = computed(() => (props.items.length === 1 ? 'photo' : `${props.items.length} photos`));
</script>

<template>
  <div class="add">
    <slot />
    <span v-if="album" class="pill">+ Add {{ what }} to <strong>{{ album.name }}</strong></span>
  </div>
</template>

<style scoped>
.add {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Under the stack, so it never hides the album. */
.pill {
  position: absolute;
  z-index: 5;
  top: calc(100% + 10px);
  left: 50%;
  translate: -50% 0;
  padding: 6px 11px;
  border-radius: 99px;
  background: #42b883;
  color: #04130c;
  font: 600 12px/1 system-ui, sans-serif;
  white-space: nowrap;
  box-shadow: 0 8px 20px -10px rgb(0 0 0 / 0.6);
}
</style>
