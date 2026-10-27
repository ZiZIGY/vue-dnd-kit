<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem, useDnD } from '@vue-dnd-kit/core';

const props = defineProps<{ post: { id: string; title: string; cover: number | null } }>();
const el = useTemplateRef<HTMLElement>('el');
const { selected } = makeSortableItem(el, { item: () => props.post });
const { selection } = useDnD();

// A click selects this post alone; Ctrl/Cmd-click adds or removes it.
const onClick = (event: MouseEvent) => {
  if (event.ctrlKey || event.metaKey) selected.value = !selected.value;
  else selection.set([props.post.id]);
};
</script>

<template>
  <li ref="el" class="post" :class="{ selected }" @click="onClick">
    <span
      class="cover"
      :class="{ missing: post.cover === null }"
      :style="post.cover !== null ? { '--hue': post.cover } : undefined"
    />
    <span class="title">{{ post.title }}</span>
  </li>
</template>

<style scoped>
.post {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px;
  border-radius: 10px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 9%, transparent);
  font-size: 13px;
  cursor: grab;
  user-select: none;
}

.post:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.post.selected {
  background: color-mix(in srgb, #42b883 12%, Canvas);
  box-shadow: 0 0 0 1.5px #42b883;
}

.post[data-dnd-placeholder] {
  opacity: 1;
  background: none;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 22%, transparent);
}

.post[data-dnd-placeholder] > * {
  visibility: hidden;
}

.cover {
  flex: none;
  width: 40px;
  height: 30px;
  border-radius: 6px;
  background: linear-gradient(150deg, hsl(var(--hue) 75% 65%), hsl(calc(var(--hue) + 40) 65% 38%));
}

.cover.missing {
  background: none;
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #f59e0b 70%, transparent);
}

.title {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
