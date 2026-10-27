<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ tab: { id: number; title: string; hue: number }; active: boolean }>();
defineEmits<{ select: []; close: [] }>();

const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.tab });
</script>

<template>
  <li ref="el" class="tab" :class="{ active }" role="tab" :aria-selected="active" @click="$emit('select')">
    <span class="favicon" :style="{ background: `hsl(${tab.hue} 65% 50%)` }" aria-hidden="true">{{ tab.title[0] }}</span>
    <span class="title">{{ tab.title }}</span>
    <button type="button" class="close" :aria-label="`Close ${tab.title}`" @click.stop="$emit('close')">
      <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 3l6 6M9 3L3 9" /></svg>
    </button>
  </li>
</template>

<style scoped>
.tab {
  position: relative;
  display: flex;
  flex: 1 1 0;
  align-items: center;
  gap: 7px;
  min-width: 0;
  max-width: 170px;
  height: 34px;
  padding: 0 4px 0 10px;
  border-radius: 9px 9px 0 0;
  /* Inactive tabs have the strip's colour: the overlay, a copy of the tab, isn't see-through. */
  background: color-mix(in srgb, currentColor 7%, Canvas);
  font-size: 12px;
  cursor: default;
  user-select: none;
}

.tab:hover {
  background: color-mix(in srgb, currentColor 11%, Canvas);
}

.tab.active {
  background: color-mix(in srgb, currentColor 2%, Canvas);
}

.tab:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

/* The slot the dragged tab will land in. */
.tab[data-dnd-placeholder] {
  opacity: 1;
  background: transparent;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 20%, transparent);
}

.tab[data-dnd-placeholder] > * {
  visibility: hidden;
}

.favicon {
  display: grid;
  flex: none;
  place-items: center;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
}

.title {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.7;
}

.active .title {
  opacity: 1;
}

.close {
  display: grid;
  flex: none;
  place-items: center;
  width: 20px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: 5px;
  background: none;
  color: inherit;
  opacity: 0.5;
  cursor: pointer;
}

.close:hover {
  background: color-mix(in srgb, currentColor 14%, transparent);
  opacity: 1;
}

.close svg {
  width: 10px;
  height: 10px;
  stroke: currentColor;
  stroke-width: 1.6;
  stroke-linecap: round;
}
</style>
