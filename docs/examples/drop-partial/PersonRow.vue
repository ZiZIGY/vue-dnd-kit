<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import type { Person } from './server';

const props = defineProps<{ person: Person }>();
const el = useTemplateRef<HTMLElement>('el');
// `selected` is the provider's selection for this row: drag a selected row, and every
// selected row comes along.
const { selected } = makeSortableItem(el, { item: () => props.person });
</script>

<template>
  <li ref="el" class="person" :class="{ selected }">
    <input v-model="selected" type="checkbox" :aria-label="`Select ${person.name}`" />
    <span class="avatar" :style="{ '--hue': person.hue }" aria-hidden="true">{{ person.name[0] }}</span>
    <span class="name">{{ person.name }}</span>
  </li>
</template>

<style scoped>
.person {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 7px 10px;
  border-radius: 99px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 11%, transparent);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.person.selected {
  background: color-mix(in srgb, #42b883 12%, Canvas);
  box-shadow: 0 0 0 1.5px #42b883;
}

.person[data-dnd-placeholder] {
  opacity: 1;
  background: none;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 22%, transparent);
}

.person[data-dnd-placeholder] > * {
  visibility: hidden;
}

input {
  margin: 0;
  accent-color: #42b883;
  cursor: pointer;
}

.avatar {
  display: grid;
  flex: none;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: hsl(var(--hue) 60% 55%);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
}

.name {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
