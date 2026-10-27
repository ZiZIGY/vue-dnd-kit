<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ ticket: { id: string; title: string; tag: string; approved: boolean } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.ticket });
</script>

<template>
  <li ref="el" class="ticket">
    <span class="title">{{ ticket.title }}</span>
    <span class="meta">
      <span class="tag">{{ ticket.tag }}</span>
      <span class="review" :class="{ approved: ticket.approved }">
        {{ ticket.approved ? 'Approved' : 'In review' }}
      </span>
    </span>
  </li>
</template>

<style scoped>
.ticket {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 10px;
  background: Canvas;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 9%, transparent),
    0 2px 4px -2px rgb(0 0 0 / 0.25);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.ticket:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

/* The slot the ticket will land in. */
.ticket[data-dnd-placeholder] {
  opacity: 1;
}

.ticket[data-dnd-placeholder]::after {
  content: '';
  position: absolute;
  inset: 0;
  border: 1.5px dashed color-mix(in srgb, currentColor 30%, transparent);
  border-radius: inherit;
  background: color-mix(in srgb, currentColor 3%, Canvas);
}

.title {
  font-weight: 500;
  line-height: 1.3;
}

.meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}

.tag {
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}

.review {
  margin-left: auto;
  padding: 2px 6px;
  border-radius: 6px;
  background: color-mix(in srgb, #f59e0b 16%, transparent);
  color: #f59e0b;
  font-weight: 600;
}

.review.approved {
  background: color-mix(in srgb, #42b883 16%, transparent);
  color: #42b883;
}
</style>
