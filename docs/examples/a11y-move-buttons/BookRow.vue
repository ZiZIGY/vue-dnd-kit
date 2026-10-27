<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{
  book: { id: string; title: string; author: string };
  index: number;
  count: number;
  /** Take the focus: the row before it was just marked as read. */
  focused: boolean;
}>();
const emit = defineEmits<{ move: [to: number]; finish: [] }>();

const el = useTemplateRef<HTMLElement>('el');
// The grip drags (pointer and keyboard); the buttons move without dragging.
makeSortableItem(el, { item: () => props.book, handle: '.grip' });

const up = useTemplateRef<HTMLButtonElement>('up');
const down = useTemplateRef<HTMLButtonElement>('down');
const done = useTemplateRef<HTMLButtonElement>('done');

const move = async (direction: 'up' | 'down') => {
  emit('move', direction === 'up' ? props.index - 1 : props.index + 1);
  await nextTick();
  // Moving the row in the DOM loses the focus: put it back on the same button, or on
  // the other one when this one is now disabled (the top or the bottom of the list).
  const same = direction === 'up' ? up.value : down.value;
  const other = direction === 'up' ? down.value : up.value;
  (same?.disabled ? other : same)?.focus();
};

watch(
  () => props.focused,
  (value) => value && done.value?.focus(),
  { flush: 'post' },
);
</script>

<template>
  <li ref="el" class="book">
    <button type="button" class="grip" :aria-label="`Drag ${book.title}`">
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5h.01M10 3.5h.01M6 8h.01M10 8h.01M6 12.5h.01M10 12.5h.01" /></svg>
    </button>
    <span class="text">
      <span class="title">{{ book.title }}</span>
      <span class="author">{{ book.author }}</span>
    </span>
    <span class="actions">
      <button ref="up" type="button" :disabled="index === 0" :aria-label="`Move ${book.title} up`" @click="move('up')">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 10 4-4 4 4" /></svg>
      </button>
      <button
        ref="down"
        type="button"
        :disabled="index === count - 1"
        :aria-label="`Move ${book.title} down`"
        @click="move('down')"
      >
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
      </button>
      <button ref="done" type="button" class="done" :aria-label="`Mark ${book.title} as read`" @click="emit('finish')">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3.5 8.5 3 3 6-7" /></svg>
      </button>
    </span>
  </li>
</template>

<style scoped>
.book {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 8px 7px 4px;
  border-radius: 10px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
}

.book[data-dnd-placeholder] {
  opacity: 1;
  background: transparent;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #42b883 70%, transparent);
}

/* `opacity`, not `visibility: hidden`: a hidden grip would lose the keyboard focus. */
.book[data-dnd-placeholder] > * {
  opacity: 0;
}

.text {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

.title {
  font-size: 13px;
  font-weight: 600;
}

.author {
  overflow: hidden;
  font-size: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.55;
}

.actions {
  display: flex;
  gap: 2px;
}

button {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 0;
  border-radius: 7px;
  background: none;
  color: inherit;
  cursor: pointer;
}

button:hover:not(:disabled) {
  background: color-mix(in srgb, currentColor 10%, transparent);
}

button:disabled {
  cursor: default;
  opacity: 0.25;
}

button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.grip {
  width: 24px;
  cursor: grab;
}

.done:hover {
  color: #42b883;
}

svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.grip svg {
  stroke-width: 2.6;
  opacity: 0.5;
}
</style>
