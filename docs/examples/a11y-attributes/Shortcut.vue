<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{
  shortcut: { id: string; title: string; kind: 'link' | 'button' | 'plain' | 'handle'; href?: string };
  attributes: boolean;
}>();
const emit = defineEmits<{ run: [] }>();

const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, {
  item: () => props.shortcut,
  // With a handle, the handle gets the attributes and starts keyboard drags.
  handle: () => (props.shortcut.kind === 'handle' ? '.grip' : undefined),
  // `false` removes every attribute the library set.
  attributes: () => props.attributes,
  // Enter follows a link: only Space picks the link up.
  canDrag: (event) => !(props.shortcut.kind === 'link' && 'key' in event && event.key === 'Enter'),
});
</script>

<template>
  <!-- Your own `role` and `aria-roledescription` win: this stays a link to screen readers. -->
  <a
    v-if="shortcut.kind === 'link'"
    ref="el"
    class="shortcut"
    :href="shortcut.href"
    target="_blank"
    rel="noopener"
    role="link"
    aria-roledescription="draggable link"
  >
    <span class="tag">a</span><span class="title">{{ shortcut.title }}</span>
  </a>
  <button v-else-if="shortcut.kind === 'button'" ref="el" type="button" class="shortcut" @click="emit('run')">
    <span class="tag">button</span><span class="title">{{ shortcut.title }}</span>
  </button>
  <div v-else ref="el" class="shortcut">
    <span class="tag">div</span><span class="title">{{ shortcut.title }}</span>
    <button v-if="shortcut.kind === 'handle'" type="button" class="grip" :aria-label="`Drag ${shortcut.title}`">
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5h.01M10 3.5h.01M6 8h.01M10 8h.01M6 12.5h.01M10 12.5h.01" /></svg>
    </button>
  </div>
</template>

<style scoped>
.shortcut {
  display: flex;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  width: 100%;
  min-height: 42px;
  padding: 8px 10px;
  border: 0;
  border-radius: 10px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 12%, transparent);
  color: inherit;
  font: 500 13px/1.2 system-ui, sans-serif;
  text-align: left;
  text-decoration: none;
  cursor: grab;
  user-select: none;
}

.shortcut:has(.grip) {
  cursor: default;
}

.shortcut:focus-visible,
.grip:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.shortcut[data-dnd-placeholder] {
  opacity: 1;
  background: transparent;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 25%, transparent);
}

/* `opacity`, not `visibility: hidden`: a hidden grip would lose the keyboard focus. */
.shortcut[data-dnd-placeholder] > * {
  opacity: 0;
}

.tag {
  min-width: 44px;
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  color: #42b883;
}

.tag::before {
  content: '<';
}

.tag::after {
  content: '>';
}

.grip {
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  margin-left: auto;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  color: inherit;
  cursor: grab;
}

.grip svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.6;
  stroke-linecap: round;
  opacity: 0.6;
}
</style>
