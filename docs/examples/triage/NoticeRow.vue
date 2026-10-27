<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';
import { KINDS, type Notice } from './notices';

const props = defineProps<{ notice: Notice }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.notice });
</script>

<template>
  <li ref="el" class="notice" :style="{ '--kind': KINDS[notice.kind].color }">
    <span class="kind" aria-hidden="true">
      <svg viewBox="0 0 24 24"><path :d="KINDS[notice.kind].icon" /></svg>
    </span>
    <span class="text">
      <strong>{{ notice.title }}</strong>
      <small>{{ notice.repo }} · {{ notice.time }}</small>
    </span>
  </li>
</template>

<style scoped>
.notice {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 10%, transparent),
    0 2px 4px -2px rgb(0 0 0 / 0.25);
  cursor: grab;
  user-select: none;
}

.notice:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* The slot the dragged notice will land in. */
.notice[data-dnd-placeholder] {
  opacity: 1;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 22%, transparent);
  background: transparent;
}

.notice[data-dnd-placeholder] > * {
  visibility: hidden;
}

.kind {
  display: grid;
  flex: none;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: color-mix(in srgb, var(--kind) 16%, transparent);
}

svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: var(--kind);
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

strong {
  overflow: hidden;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
}

small {
  font: 11px/1.2 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}
</style>
