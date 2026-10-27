<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ person: { id: string; name: string; hue: number } }>();
const el = useTemplateRef<HTMLElement>('el');
// With `placeholder: 'indicator'`, nothing moves while you drag: `indicator.side` is
// `'swap'` on the person the drop exchanges with.
const { indicator } = makeSortableItem(el, { item: () => props.person });
</script>

<template>
  <li ref="el" class="person" :class="{ target: indicator?.side === 'swap' }">
    <span class="avatar" :style="{ background: `hsl(${person.hue} 60% 45%)` }">{{ person.name[0] }}</span>
    <span class="name">{{ person.name }}</span>
    <span v-if="indicator?.side === 'swap'" class="badge" aria-hidden="true">⇄</span>
  </li>
</template>

<style scoped>
.person {
  position: relative;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 10px 0 6px;
  border-radius: 9px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 11%, transparent);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.person:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* Live swap: the slot the dragged person takes. Indicator mode: the person staying put. */
.person[data-dnd-placeholder] {
  opacity: 1;
  background: transparent;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 22%, transparent);
}

.person[data-dnd-placeholder] > * {
  opacity: 0.3;
}

/* The person a drop would exchange with. The ring shows around the dragged copy on top. */
.person.target {
  outline: 2px solid #42b883;
  outline-offset: 3px;
  background: color-mix(in srgb, #42b883 12%, Canvas);
}

/* The dragged copy lets the mark under it show through. */
[data-dnd-overlay] .person {
  opacity: 0.85;
}

.avatar {
  display: grid;
  flex: none;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
}

.name {
  flex: 1;
  font-weight: 500;
}

.badge {
  color: #42b883;
  font-weight: 700;
}
</style>
