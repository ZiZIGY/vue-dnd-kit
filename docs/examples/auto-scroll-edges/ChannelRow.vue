<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ channel: { id: string; name: string; unread: number } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.channel });
</script>

<template>
  <li ref="el" class="channel">
    <span class="hash">#</span>
    <span class="name">{{ channel.name }}</span>
    <span v-if="channel.unread" class="unread">{{ channel.unread }}</span>
  </li>
</template>

<style scoped>
.channel {
  display: flex;
  flex: none;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 10px;
  border-radius: 7px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.channel:hover {
  background: color-mix(in srgb, currentColor 8%, Canvas);
}

.channel:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.channel[data-dnd-placeholder] {
  opacity: 1;
  background: color-mix(in srgb, #42b883 10%, Canvas);
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #42b883 60%, transparent);
}

.channel[data-dnd-placeholder] > * {
  visibility: hidden;
}

.hash {
  font-family: ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.45;
}

.name {
  flex: 1;
}

.unread {
  min-width: 18px;
  padding: 2px 5px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 12%, transparent);
  font: 600 10px/1.2 ui-monospace, Menlo, Consolas, monospace;
  text-align: center;
}
</style>
