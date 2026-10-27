<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ token: { id: string; hold?: boolean } }>();
const el = useTemplateRef<HTMLElement>('el');
const { selected } = makeDraggable(el, {
  id: () => props.token.id,
  // A long press: `status` reads 'activating' while `activation.progress` fills.
  activation: () => (props.token.hold ? { mouse: { delay: 600 }, pen: { delay: 600 } } : undefined),
});
</script>

<template>
  <div ref="el" class="token" :class="{ picked: selected }" @click="selected = !selected">
    {{ token.id }}
    <small v-if="token.hold">hold</small>
  </div>
</template>

<style scoped>
.token {
  position: relative;
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 18%, transparent),
    0 3px 8px -4px rgb(0 0 0 / 0.5);
  font: 600 14px/1 ui-monospace, Menlo, Consolas, monospace;
  cursor: grab;
  user-select: none;
}

.token:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.token.picked {
  box-shadow:
    0 0 0 2px #42b883,
    0 3px 8px -4px rgb(0 0 0 / 0.5);
}

small {
  position: absolute;
  bottom: -14px;
  font: 9px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}
</style>
