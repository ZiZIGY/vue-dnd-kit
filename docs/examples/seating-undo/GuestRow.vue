<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import type { Guest } from './store';

const props = defineProps<{ guest: Guest }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.guest });
</script>

<template>
  <li ref="el" class="guest">
    <span class="avatar">{{ guest.name[0] }}</span>
    <span>{{ guest.name }}</span>
  </li>
</template>

<style scoped>
.guest {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 34px;
  padding: 0 10px 0 5px;
  border-radius: 99px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 11%, transparent);
  font-size: 13px;
  font-weight: 500;
  cursor: grab;
  user-select: none;
}

.guest:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.guest[data-dnd-placeholder] {
  opacity: 1;
  background: transparent;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 22%, transparent);
}

.guest[data-dnd-placeholder] > * {
  visibility: hidden;
}

.avatar {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: color-mix(in srgb, #42b883 22%, transparent);
  color: #42b883;
  font-size: 11px;
  font-weight: 700;
}
</style>
