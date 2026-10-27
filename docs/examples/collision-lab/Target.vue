<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeDroppable, type Key } from '@vue-dnd-kit/core';

const props = defineProps<{ id: string; ranked: Key[] }>();
const el = useTemplateRef<HTMLElement>('el');
const { isOver } = makeDroppable(el, { id: () => props.id });

// 1 for the best candidate of this frame, 0 when the function left this target out.
const rank = computed(() => props.ranked.indexOf(props.id) + 1);
</script>

<template>
  <div ref="el" class="target" :class="{ over: isOver, ranked: rank > 0 }">
    <span class="name">{{ id }}</span>
    <span v-if="rank" class="rank">#{{ rank }}</span>
    <slot />
  </div>
</template>

<style scoped>
.target {
  position: absolute;
  box-sizing: border-box;
  padding: 6px 8px;
  border: 1.5px dashed color-mix(in srgb, currentColor 28%, transparent);
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 4%, Canvas);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  transition:
    border-color 0.15s,
    background 0.15s;
}

.target.over {
  border-style: solid;
  border-color: #42b883;
  background: color-mix(in srgb, #42b883 16%, Canvas);
}

.name {
  opacity: 0.7;
}

.rank {
  position: absolute;
  top: -8px;
  right: -6px;
  padding: 3px 5px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 18%, Canvas);
  font-size: 10px;
  font-weight: 600;
}

.over > .rank {
  background: #42b883;
  color: #fff;
}
</style>
