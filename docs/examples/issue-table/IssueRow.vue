<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

type Issue = { id: string; title: string; status: 'Todo' | 'In progress' | 'Done'; who: string; priority: 1 | 2 | 3 };
const props = defineProps<{ issue: Issue }>();

const el = useTemplateRef<HTMLElement>('el');
// `indicator` is set while the drop line is at this row: `side` says above or below it.
const { indicator } = makeSortableItem(el, { item: () => props.issue });
</script>

<template>
  <div ref="el" class="row" role="row" :class="indicator && `drop-${indicator.side}`">
    <span class="priority" :aria-label="`Priority ${issue.priority}`">
      <i v-for="bar in 3" :key="bar" :class="{ on: bar <= 4 - issue.priority }" />
    </span>
    <span class="key">{{ issue.id }}</span>
    <span class="title">{{ issue.title }}</span>
    <span class="status" :class="issue.status === 'In progress' ? 'doing' : issue.status.toLowerCase()">{{ issue.status }}</span>
    <span class="who">{{ issue.who }}</span>
  </div>
</template>

<style scoped>
.row {
  position: relative;
  display: grid;
  grid-template-columns: 18px 58px minmax(0, 1fr) 84px 24px;
  align-items: center;
  gap: 10px;
  height: 40px;
  padding: 0 12px;
  border-top: 1px solid color-mix(in srgb, currentColor 9%, transparent);
  /* The table's colour: the overlay, a copy of the row, isn't see-through. */
  background: color-mix(in srgb, currentColor 2%, Canvas);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.row:hover {
  background: color-mix(in srgb, currentColor 5%, Canvas);
}

.row:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

/* The dragged row stays where it is: the list doesn't move in indicator mode. */
.row[data-dnd-placeholder] {
  opacity: 0.35;
}

/* Its copy in the overlay lets the line under it show through. */
[data-dnd-overlay] .row {
  opacity: 0.85;
  box-shadow: 0 8px 20px -8px rgb(0 0 0 / 0.5);
}

/* The drop line, on the row's top or bottom edge. */
.row.drop-before::before,
.row.drop-after::before {
  content: '';
  position: absolute;
  z-index: 1;
  left: 6px;
  right: 6px;
  height: 2px;
  border-radius: 2px;
  background: #42b883;
  box-shadow: -4px 0 0 1px #42b883;
}

.row.drop-before::before {
  top: -1.5px;
}

.row.drop-after::before {
  bottom: -1.5px;
}

.priority {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 12px;
}

.priority i {
  width: 3px;
  border-radius: 1px;
  background: color-mix(in srgb, currentColor 20%, transparent);
}

.priority i:nth-child(1) {
  height: 5px;
}

.priority i:nth-child(2) {
  height: 8px;
}

.priority i:nth-child(3) {
  height: 12px;
}

.priority i.on {
  background: currentColor;
}

.key {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.55;
}

.title {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.status {
  justify-self: start;
  padding: 3px 8px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.status.todo {
  background: color-mix(in srgb, currentColor 9%, transparent);
}

.status.doing {
  background: color-mix(in srgb, #f59e0b 18%, transparent);
  color: #f59e0b;
}

.status.done {
  background: color-mix(in srgb, #42b883 18%, transparent);
  color: #42b883;
}

.who {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: color-mix(in srgb, currentColor 12%, transparent);
  font-size: 10px;
  font-weight: 700;
}
</style>
