<script setup lang="ts">
import { computed, inject, nextTick, ref, useTemplateRef } from 'vue';
import { makeSortableItem, useDnD, type FlatNode } from '@vue-dnd-kit/core';
import Icon from './Icon.vue';
import type { Layer } from './design';
import { EDITOR } from './editor';

const props = defineProps<{ node: FlatNode<Layer> }>();
const emit = defineEmits<{ toggle: [] }>();
const editor = inject(EDITOR)!;
const { selection, status } = useDnD();

const el = useTemplateRef<HTMLElement>('el');
// Typed, so the canvas and its frames, which take layers and tools, refuse a row.
makeSortableItem(el, { id: () => props.node.key, type: 'row' });

const layer = computed(() => props.node.item);
// The selection is the canvas's: a row lights up with its layer, and faintly inside a
// selected frame, which its layers move with.
const selected = computed(() => selection.has(layer.value.id));
const inSelected = computed(() => {
  const frame = editor.parentOf(layer.value.id);
  return !selected.value && !!frame && selection.has(frame.id);
});

const pick = (event: MouseEvent) => editor.select(layer.value.id, event.shiftKey);
// Tabbing onto a row selects its layer; a click selects on its own (Shift adds).
const focus = () => {
  if (el.value?.matches(':focus-visible') && !selected.value && !layer.value.hidden) editor.select(layer.value.id);
};
// Hovering a row outlines its layer on the canvas.
const hover = (on: boolean) => {
  if (on && status.value === 'idle') editor.hovered.value = layer.value.id;
  else if (!on && editor.hovered.value === layer.value.id) editor.hovered.value = null;
};

// Double-click (or F2) renames. The field is an input: it never starts a drag.
const renaming = ref(false);
const field = useTemplateRef<HTMLInputElement>('field');
const rename = async () => {
  renaming.value = true;
  await nextTick();
  field.value?.select();
};
const finish = (save: boolean) => {
  if (!renaming.value) return;
  const name = field.value?.value.trim();
  renaming.value = false;
  if (save && name && name !== layer.value.name) editor.rename(layer.value, name);
};
</script>

<template>
  <li
    ref="el"
    class="row"
    :class="{ selected, 'in-selected': inSelected, lit: editor.hovered.value === layer.id, 'is-hidden': layer.hidden }"
    :style="{ marginInlineStart: `${node.depth * 14}px` }"
    :aria-label="`${layer.name}${selected ? ', selected' : ''}`"
    :data-id="layer.id"
    @click="pick"
    @focus="focus"
    @dblclick="rename"
    @keydown.f2.prevent="rename"
    @pointerenter="hover(true)"
    @pointerleave="hover(false)"
  >
    <button
      v-if="layer.kind === 'frame'"
      type="button"
      class="chevron"
      :class="{ open: !node.collapsed }"
      :aria-label="`${node.collapsed ? 'Expand' : 'Collapse'} ${layer.name}`"
      :aria-expanded="!node.collapsed"
      @click.stop="emit('toggle')"
    >
      <Icon name="chevron" />
    </button>
    <span v-else class="indent" />
    <Icon :name="layer.kind" class="kind" />
    <input
      v-if="renaming"
      ref="field"
      class="rename"
      :value="layer.name"
      aria-label="Layer name"
      @keydown.enter.prevent="finish(true)"
      @keydown.esc.stop.prevent="finish(false)"
      @blur="finish(true)"
      @click.stop
      @dblclick.stop
    />
    <span v-else class="name">{{ layer.name }}</span>
    <button
      type="button"
      class="eye"
      :aria-label="`${layer.hidden ? 'Show' : 'Hide'} ${layer.name}`"
      :aria-pressed="!!layer.hidden"
      @click.stop="editor.setHidden(layer, !layer.hidden)"
    >
      <Icon :name="layer.hidden ? 'hidden' : 'eye'" />
    </button>
  </li>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 28px;
  padding: 0 4px 0 2px;
  border-radius: 6px;
  /* Opaque: the overlay, a clone of the row, must not be see-through. */
  background: var(--dc-panel);
  font-size: 12px;
  cursor: default;
  user-select: none;
}

.row:hover,
.row.lit {
  background: color-mix(in srgb, currentColor 6%, var(--dc-panel));
}

.row.in-selected {
  background: color-mix(in srgb, #0d99ff 8%, var(--dc-panel));
}

.row.selected {
  background: color-mix(in srgb, #0d99ff 20%, var(--dc-panel));
}

.row:focus-visible {
  outline: 2px solid #0d99ff;
  outline-offset: -2px;
}

/* The slot the dragged row lands in. */
.row[data-dnd-placeholder] {
  opacity: 1;
  background: color-mix(in srgb, #0d99ff 10%, var(--dc-panel));
  box-shadow: inset 0 0 0 1px color-mix(in srgb, #0d99ff 70%, transparent);
}

.row[data-dnd-placeholder] > * {
  opacity: 0.4;
}

[data-dnd-overlay] .row {
  box-shadow:
    0 10px 24px -10px rgb(0 0 0 / 0.45),
    0 0 0 1px var(--dc-line);
}

.kind {
  width: 14px;
  height: 14px;
  color: var(--dc-muted);
}

.selected .kind {
  color: #0d99ff;
}

.name,
.rename {
  flex: 1;
  min-width: 0;
}

.name {
  overflow: hidden;
  padding-left: 2px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.rename {
  height: 22px;
  padding: 0 4px;
  border: 1px solid #0d99ff;
  border-radius: 4px;
  outline: none;
  background: Canvas;
  color: inherit;
  font: inherit;
}

.is-hidden .kind,
.is-hidden .name {
  opacity: 0.45;
}

.indent {
  flex: none;
  width: 18px;
}

.chevron,
.eye {
  display: grid;
  flex: none;
  place-items: center;
  width: 18px;
  height: 22px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: none;
  color: var(--dc-muted);
  cursor: pointer;
}

.chevron :deep(.icon) {
  width: 12px;
  height: 12px;
  transition: transform 0.15s;
}

.chevron.open :deep(.icon) {
  transform: rotate(90deg);
}

.eye {
  width: 24px;
  opacity: 0;
  transition: opacity 0.12s;
}

.eye :deep(.icon) {
  width: 14px;
  height: 14px;
}

/* The eye shows on hover, on focus, and always on a hidden layer. */
.row:hover .eye,
.eye:focus-visible,
.eye[aria-pressed='true'] {
  opacity: 1;
}

.chevron:hover,
.eye:hover {
  background: var(--dc-hover);
  color: inherit;
}

.chevron:focus-visible,
.eye:focus-visible {
  outline: 2px solid #0d99ff;
}

@media (hover: none) {
  .eye {
    opacity: 0.6;
  }
}

@media (prefers-reduced-motion: reduce) {
  .chevron :deep(.icon),
  .eye {
    transition: none;
  }
}
</style>
