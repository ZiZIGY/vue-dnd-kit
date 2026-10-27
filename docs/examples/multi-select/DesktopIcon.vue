<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeDraggable, useDnD } from '@vue-dnd-kit/core';

const props = defineProps<{
  icon: { id: string; name: string; kind: string; x: number; y: number };
  offset: { x: number; y: number } | null;
}>();

const el = useTemplateRef<HTMLElement>('el');
const { isDragging, selected } = makeDraggable(el, { id: () => props.icon.id });
const { active, selection } = useDnD();

// The grabbed icon travels in the overlay; the others selected with it follow by the offset.
const grabbed = computed(() => active.value?.id === props.icon.id);
const follow = computed(() => {
  const { offset } = props;
  return isDragging.value && !grabbed.value && offset ? `${offset.x}px ${offset.y}px` : undefined;
});

const onClick = (event: MouseEvent) => {
  if (event.ctrlKey || event.metaKey) selected.value = !selected.value;
  else selection.set([props.icon.id]);
};

const COLORS: Record<string, string> = { jpg: '#42b883', txt: '#94a3b8', mp3: '#ec4899', pdf: '#ef4444' };
</script>

<template>
  <div
    ref="el"
    class="icon"
    :class="{ selected, grabbed }"
    :style="{ left: `${icon.x}px`, top: `${icon.y}px`, translate: follow }"
    @click="onClick"
  >
    <svg v-if="icon.kind === 'folder'" viewBox="0 0 40 32" aria-hidden="true">
      <path d="M2 6a3 3 0 0 1 3-3h9l4 4h17a3 3 0 0 1 3 3v17a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" fill="#3b82f6" />
      <path d="M2 11h36v16a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3z" fill="#60a5fa" />
    </svg>
    <span v-else class="file" :style="{ '--kind': COLORS[icon.kind] }">{{ icon.kind }}</span>
    <span class="name">{{ icon.name }}</span>
  </div>
</template>

<style scoped>
.icon {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  box-sizing: border-box;
  width: 76px;
  padding: 6px 4px;
  border-radius: 10px;
  cursor: grab;
}

.icon:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 1px;
}

.icon.selected {
  background: color-mix(in srgb, #42b883 18%, transparent);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, #42b883 60%, transparent);
}

/* Its copy is in the overlay: the icon itself waits, pale. */
.icon.grabbed {
  opacity: 0.3;
}

/* The copy in the overlay sits on no desktop: it gets a background of its own. */
[data-dnd-overlay] .icon {
  background: color-mix(in srgb, #42b883 18%, Canvas);
  box-shadow: 0 14px 26px -12px rgb(0 0 0 / 0.6);
}

svg {
  width: 40px;
  height: 32px;
}

.file {
  display: grid;
  place-items: end center;
  box-sizing: border-box;
  width: 28px;
  height: 34px;
  padding-bottom: 4px;
  border-radius: 3px 10px 3px 3px;
  background: #f1f5f9;
  box-shadow: inset 0 -12px 0 var(--kind);
  color: #fff;
  font: 700 7px/1 ui-monospace, Menlo, Consolas, monospace;
  text-transform: uppercase;
}

.name {
  max-width: 100%;
  overflow: hidden;
  font-size: 11px;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
