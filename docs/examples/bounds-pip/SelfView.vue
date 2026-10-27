<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDraggable, type Modifier } from '@vue-dnd-kit/core';

const props = defineProps<{ x: number; y: number; modifiers: Modifier[] }>();
const el = useTemplateRef<HTMLElement>('el');
// Read when a drag starts. `restrictToParent` keeps it inside its parent: the screen.
const { isDragging } = makeDraggable(el, { id: 'self-view', modifiers: () => props.modifiers });
</script>

<template>
  <div ref="el" class="self" :class="{ dragging: isDragging }" :style="{ left: `${x}px`, top: `${y}px` }" aria-label="Your camera">
    <span class="avatar">You</span>
    <span class="mic" aria-hidden="true" />
  </div>
</template>

<style scoped>
.self {
  position: absolute;
  display: grid;
  place-items: center;
  width: 120px;
  height: 80px;
  border-radius: 12px;
  background: linear-gradient(160deg, #6d5bd0, #2b2a52);
  box-shadow:
    inset 0 0 0 1px rgb(255 255 255 / 0.15),
    0 10px 24px -10px rgb(0 0 0 / 0.7);
  color: #fff;
  cursor: grab;
  user-select: none;
}

.self:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.self.dragging {
  opacity: 0.25;
}

.avatar {
  font-size: 13px;
  font-weight: 600;
}

.mic {
  position: absolute;
  right: 8px;
  bottom: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #42b883;
}
</style>
