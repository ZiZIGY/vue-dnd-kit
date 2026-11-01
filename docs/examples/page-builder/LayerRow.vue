<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeSortableItem, useDnD, type FlatNode } from '@vue-dnd-kit/core';
import Icon from './Icon.vue';
import { useBuilder } from './builder';
import { BLOCKS, SECTIONS, excerpt, isColumn, isSection, levelOf, type LayerNode } from './page';

const props = defineProps<{ node: FlatNode<LayerNode> }>();
const emit = defineEmits<{ toggle: [] }>();
const builder = useBuilder();
const { selected, hovered } = builder;

/** Px per level: the tree's `indentation`. */
const INDENT = 14;

const item = computed(() => props.node.item);
const row = computed(() => {
  const node = item.value;
  if (isSection(node)) return { icon: SECTIONS[node.kind].icon, name: SECTIONS[node.kind].name, detail: '' };
  if (isColumn(node)) return { icon: 'column' as const, name: `Column ${props.node.index + 1}`, detail: '' };
  return { icon: BLOCKS[node.kind].icon, name: BLOCKS[node.kind].name, detail: excerpt(node) };
});
// A column row selects its section: columns are the sections' frame, not things to pick.
const target = computed(() => (isColumn(item.value) ? builder.find(item.value.id)?.section.id : item.value.id) ?? null);

const el = useTemplateRef<HTMLElement>('el');
// Columns take blocks, but stay where they are.
const { indicator } = makeSortableItem(el, {
  id: () => props.node.key,
  disabled: () => isColumn(item.value),
});

// The line starts at the depth the drop lands at; red where the row can't go (a block between sections).
const { active } = useDnD();
const line = computed(() => {
  const at = indicator.value;
  if (!at || at.side === 'inside') return null;
  const dragged = active.value?.items[0]?.item as LayerNode | undefined;
  const depth = at.depth ?? 0;
  return {
    side: at.side,
    left: `${(depth - props.node.depth) * INDENT + 8}px`,
    refused: !!dragged && levelOf(dragged) !== depth,
  };
});
const into = computed(() => indicator.value?.side === 'inside');
</script>

<template>
  <div
    ref="el"
    class="layer"
    :class="{ selected: selected === target && !isColumn(item), section: node.depth === 0, column: isColumn(item), into }"
    :style="{ marginLeft: `${node.depth * INDENT}px` }"
    :data-layer="item.id"
    :aria-label="[row.name, row.detail].filter(Boolean).join(': ')"
    @click="builder.select(target)"
    @keydown.enter.self.prevent="builder.select(target)"
    @pointerenter="hovered = item.id"
    @pointerleave="hovered = null"
  >
    <button
      v-if="node.hasChildren"
      type="button"
      class="toggle"
      :aria-label="`${node.collapsed ? 'Open' : 'Close'} ${row.name}`"
      :aria-expanded="!node.collapsed"
      @click.stop="emit('toggle')"
    >
      <Icon name="chevron" />
    </button>
    <span v-else class="toggle" />
    <Icon :name="row.icon" class="kind" />
    <span class="name">{{ row.name }}</span>
    <span v-if="row.detail" class="detail">{{ row.detail }}</span>
    <span v-if="line" class="line" :class="[line.side, { refused: line.refused }]" :style="{ left: line.left }" />
  </div>
</template>

<style scoped>
.layer {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding-right: 8px;
  border-radius: 7px;
  font-size: 12px;
  white-space: nowrap;
  cursor: grab;
}

.layer:hover {
  background: color-mix(in srgb, currentColor 6%, transparent);
}

.layer.selected {
  background: color-mix(in srgb, #42b883 16%, transparent);
}

.layer:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.layer.section {
  font-weight: 600;
}

.layer.column {
  opacity: 0.6;
  cursor: default;
}

/* A block over the middle of a column: it goes in. */
.layer.into {
  background: color-mix(in srgb, #42b883 14%, transparent);
  box-shadow: inset 0 0 0 1.5px #42b883;
}

/* The row in hand waits, faded, where it was; dropped, its new place waits for the overlay. */
.layer[data-dnd-placeholder] {
  opacity: 0;
}

html[data-dnd-dragging] .layer[data-dnd-placeholder] {
  opacity: 0.35;
}

/* The copy in hand: no indentation (the box is placed where the row lands), and a little
   see-through, so the line under it shows. */
[data-dnd-overlay] .layer {
  margin-left: 0;
  background: Canvas;
  opacity: 0.88;
  box-shadow:
    0 0 0 1px color-mix(in srgb, currentColor 12%, transparent),
    0 12px 24px -12px rgb(0 0 0 / 0.5);
}

.toggle {
  display: grid;
  flex: none;
  place-items: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  border-radius: 5px;
  background: none;
  color: inherit;
  font-size: 12px;
  opacity: 0.6;
  cursor: pointer;
}

button.toggle:hover {
  background: color-mix(in srgb, currentColor 10%, transparent);
  opacity: 1;
}

.toggle svg {
  transition: rotate 0.15s;
}

.toggle[aria-expanded='true'] svg {
  rotate: 90deg;
}

.kind {
  font-size: 14px;
  opacity: 0.6;
}

.name {
  flex: none;
}

.detail {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.45;
}

.line {
  position: absolute;
  right: 4px;
  height: 2px;
  border-radius: 2px;
  background: #42b883;
  pointer-events: none;
}

/* A dot at its start, like the tree's guides. */
.line::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -4px;
  width: 6px;
  height: 6px;
  border: 2px solid currentColor;
  border-radius: 50%;
  color: #42b883;
  background: Canvas;
}

.line.before {
  top: -1.5px;
}

.line.after {
  bottom: -1.5px;
}

.line.refused,
.line.refused::before {
  background: #f43f5e;
  color: #f43f5e;
}

.line.refused::before {
  background: Canvas;
}

@media (prefers-reduced-motion: reduce) {
  .toggle svg {
    transition: none;
  }
}
</style>
