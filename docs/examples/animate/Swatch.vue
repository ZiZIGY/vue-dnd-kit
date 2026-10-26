<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ swatch: { id: number; hex: string } }>();
const emit = defineEmits<{ remove: [] }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.swatch });
</script>

<template>
  <div ref="el" class="swatch" :style="{ '--color': swatch.hex }">
    <span class="chip" />
    <code>{{ swatch.hex }}</code>
    <!-- A button inside an item doesn't start a drag: it just works. -->
    <button type="button" class="remove" aria-label="Remove" @click="emit('remove')">×</button>
  </div>
</template>

<style scoped>
.swatch {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 16px;
  background: color-mix(in srgb, var(--color) 14%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color) 30%, transparent);
  cursor: grab;
  user-select: none;
}

.swatch:focus-visible {
  outline: 2px solid var(--color);
  outline-offset: 2px;
}

/* The overlay is a copy of the tile: lifted while it travels, flat again as it lands. */
[data-dnd-overlay='dragging'] .swatch {
  box-shadow:
    inset 0 0 0 1px color-mix(in srgb, var(--color) 30%, transparent),
    0 14px 28px -10px rgb(0 0 0 / 0.5);
}

.chip {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color);
}

code {
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.7;
}

.remove {
  position: absolute;
  top: 4px;
  right: 4px;
  display: grid;
  place-items: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: none;
  color: inherit;
  font: 14px/1 system-ui, sans-serif;
  cursor: pointer;
  opacity: 0.45;
}

.remove:hover,
.remove:focus-visible {
  background: color-mix(in srgb, currentColor 10%, transparent);
  opacity: 1;
}

.remove:focus-visible {
  outline: 2px solid var(--color);
}
</style>
