<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeDraggable } from '@vue-dnd-kit/core';

const props = defineProps<{ title: string; code: string; handle?: boolean; self?: boolean; disabled?: boolean }>();

const el = useTemplateRef<HTMLElement>('el');
const grip = useTemplateRef<HTMLElement>('grip');
const { isDragging, transform } = makeDraggable(el, {
  // Only the grip starts a drag: the rest of the card stays clickable and selectable.
  handle: () => (props.handle ? grip.value : undefined),
  // No overlay: the card itself moves, by the `transform` below.
  overlay: !props.self,
  disabled: () => !!props.disabled,
});
const style = computed(() => (transform.value ? { transform: `translate(${transform.value.x}px, ${transform.value.y}px)` } : undefined));
</script>

<template>
  <div ref="el" class="card" :class="{ dragging: isDragging, handled: handle, self, disabled }" :style="style">
    <span v-if="handle" ref="grip" class="grip" aria-label="Drag">⋮⋮</span>
    <strong>{{ title }}</strong>
    <code>{{ code }}</code>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border-radius: 12px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 10%, transparent),
    0 4px 10px -6px rgb(0 0 0 / 0.35);
  font-size: 14px;
  cursor: grab;
  user-select: none;
  touch-action: none;
}

.card:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* With an overlay, the card stays as the slot it will go back to. */
.card.dragging:not(.self) {
  opacity: 0.35;
}

/* Without one, the card is what moves. Back home, it eases in. */
.card.self {
  transition: transform 0.25s ease;
}

.card.self.dragging {
  z-index: 1;
  transition: none;
  box-shadow:
    0 0 0 1px #42b883,
    0 18px 32px -14px rgb(0 0 0 / 0.5);
}

.card.handled {
  padding-left: 40px;
  cursor: default;
}

.card.disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.grip {
  position: absolute;
  top: 50%;
  left: 12px;
  translate: 0 -50%;
  padding: 4px 2px;
  border-radius: 4px;
  font-size: 13px;
  letter-spacing: -2px;
  opacity: 0.5;
  cursor: grab;
}

.grip:hover {
  background: color-mix(in srgb, currentColor 8%, transparent);
  opacity: 1;
}

code {
  font: 11px/1.4 ui-monospace, Menlo, Consolas, monospace;
  color: #42b883;
}
</style>
