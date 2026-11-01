<script setup lang="ts">
import { computed } from 'vue';
import { DragPreview, type Active, type DnDStatus, type DragItem, type DropDestination } from '@vue-dnd-kit/core';
import BlockView from './BlockView.vue';
import { useBuilder } from './builder';
import { BLOCKS, SECTIONS, TONES, typeScale, type Block, type ChipData } from './page';

/**
 * The overlay of blocks: one of the page's, or a chip of the palette. Over a column, the
 * real block in the colors of the section it would go into. The box takes the size of the
 * block's slot there (`overlayFit: 'slot'`), and the block lays out in it as it will on drop.
 */
const props = defineProps<{ active: Active; items: DragItem[]; status: DnDStatus; to: DropDestination | null }>();
const { find, pageWidth } = useBuilder();

// A block of the page, or what a chip makes (`createItem` makes the same).
const block = computed<Block>(
  () => (props.items[0]!.item as Block | undefined) ?? { ...BLOCKS[(props.active.data as ChipData).kind].spec, id: 'new' },
);

// The column it would go into (`to.list` is the column's id): its section's tone.
const look = computed(() => {
  const at = props.to && find(String(props.to.list));
  return at ? { ...TONES[SECTIONS[at.section.kind].tone], ...typeScale(pageWidth.value) } : null;
});
</script>

<template>
  <!-- Away from the columns, a chip stays a chip: the library's copy of it. -->
  <DragPreview v-if="!look" :id="active.id" :style="{ width: '100%', height: '100%' }" />
  <div v-else class="block-ghost" :class="{ landing: status === 'dropping' }" :style="look">
    <BlockView :block="block" />
  </div>
</template>

<style scoped>
.block-ghost {
  position: relative;
  isolation: isolate;
  width: 100%;
  height: 100%;
  color: var(--ink);
  font: 400 var(--t-md) / 1.55 ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
}

/* A piece of the section's background around it, lifted: it reads over anything. */
.block-ghost::before {
  content: '';
  position: absolute;
  inset: -10px;
  z-index: -1;
  border-radius: 12px;
  background: var(--surface);
  box-shadow:
    0 0 0 1px rgb(15 23 42 / 0.08),
    0 20px 40px -16px rgb(0 0 0 / 0.5);
}

/* Landing in its slot: just the block. */
.block-ghost.landing::before {
  opacity: 0;
}

@media (prefers-reduced-motion: no-preference) {
  .block-ghost::before {
    transition: opacity 0.2s;
  }
}
</style>
