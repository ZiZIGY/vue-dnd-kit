<script setup lang="ts">
import { computed, inject, nextTick, ref, useTemplateRef, watch } from 'vue';
import { makeSortableTree, type Key } from '@vue-dnd-kit/core';
import LayerRow from './LayerRow.vue';
import type { Layer } from './design';
import { EDITOR } from './editor';
import { overlaps } from './geometry';

const editor = inject(EDITOR)!;

// Rows have keys of their own: the layers' ids belong to their draggables on the canvas.
const rowKey = (layer: Layer) => `row:${layer.id}`;
const layerOf = (key: Key) => editor.find(String(key).slice('row:'.length)) ?? null;

const collapsed = ref(new Set<Key>());
const toggle = (key: Key) => (collapsed.value.has(key) ? collapsed.value.delete(key) : collapsed.value.add(key));

const tree = useTemplateRef<HTMLElement>('tree');
// The panel is the design itself, as a tree. Its order is the stacking order (the top row
// is in front), and a layer dropped onto a frame's row, or under it, moves into the frame.
const { items } = makeSortableTree(tree, {
  items: editor.layers,
  getKey: rowKey,
  // Frames take layers; frames themselves stay on the canvas.
  canNest: (layer, parent) => parent.kind === 'frame' && layer.kind !== 'frame',
  maxDepth: 1,
  indentation: 14,
  collapsed,
  // Changes made elsewhere (the canvas, undo) slide the rows too.
  animate: true,
  autoScroll: true,
  onDrop: ({ items: moved, from, to }) => {
    if (from.parentKey === to.parentKey && from.index === to.index) return;
    editor.record();
    // A layer that changes frames stays where it is on the canvas: its position counts from
    // its frame's corner, so it takes the difference. Moved into a frame that doesn't cover
    // it, it would be clipped out of sight: it goes to the frame's middle instead. `onDrop`
    // runs before the tree is written, so `boxOf` still knows the frame it comes from.
    const frame = to.parentKey === null ? null : layerOf(to.parentKey);
    for (const layer of moved) {
      if (editor.parentOf(layer.id) === frame) continue;
      const box = editor.boxOf(layer);
      const into = frame ? editor.boxOf(frame) : { x: 0, y: 0, width: 0, height: 0 };
      const middle = frame && !overlaps(box, into);
      layer.x = Math.round(middle ? (into.width - box.width) / 2 : box.x - into.x);
      layer.y = Math.round(middle ? (into.height - box.height) / 2 : box.y - into.y);
    }
  },
});

// A layer selected on the canvas may be out of sight here: its row scrolls into the panel
// (the panel only, not the page around the editor).
watch(
  () => editor.selected.value[0]?.id,
  async (id) => {
    await nextTick();
    const list = tree.value;
    const row = id ? list?.querySelector<HTMLElement>(`[data-id="${id}"]`) : null;
    if (!list || !row) return;
    if (row.offsetTop < list.scrollTop) list.scrollTop = row.offsetTop - 6;
    else if (row.offsetTop + row.offsetHeight > list.scrollTop + list.clientHeight) {
      list.scrollTop = row.offsetTop + row.offsetHeight - list.clientHeight + 6;
    }
  },
);

const count = computed(() => editor.layers.value.reduce((sum, layer) => sum + 1 + (layer.children?.length ?? 0), 0));
</script>

<template>
  <section class="layers" aria-label="Layers">
    <header class="head">
      <h3>Layers</h3>
      <span class="count">{{ count }}</span>
    </header>
    <ul ref="tree" class="tree">
      <LayerRow v-for="node in items" :key="node.key" :node="node" @toggle="toggle(node.key)" />
    </ul>
  </section>
</template>

<style scoped>
.layers {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 0 12px;
  flex: none;
}

h3 {
  margin: 0;
  font-size: 11px;
  font-weight: 600;
}

.count {
  padding: 1px 6px;
  border-radius: 99px;
  background: var(--dc-hover);
  color: var(--dc-muted);
  font-size: 10px;
  font-variant-numeric: tabular-nums;
}

.tree {
  position: relative;
  flex: 1;
  min-height: 0;
  margin: 0;
  padding: 0 6px 8px;
  overflow: auto;
  list-style: none;
}

/* Where the panel shares a column with the properties, its tab names it. */
@container editor (max-width: 959px) {
  .head {
    display: none;
  }

  .tree {
    padding-top: 6px;
  }
}
</style>
