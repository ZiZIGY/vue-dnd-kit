<script setup lang="ts">
import { provide } from 'vue';
import { DnDProvider, type Active, type AnnouncedPosition, type Announcements } from '@vue-dnd-kit/core';
import Builder from './Builder.vue';
import { BUILDER, LAYERS, PAGE, createBuilder } from './builder';
import { BLOCKS, SECTIONS, excerpt, isColumn, isSection, type ChipData, type LayerNode } from './page';

// Provided above the provider: the overlays it renders copy the page's look from it.
const builder = createBuilder();
provide(BUILDER, builder);

/** What a drag carries, in words: "the Hero section", "a new Pricing section", "the heading “…”". */
const what = (active: Active) => {
  const node = active.items[0]?.item as LayerNode | undefined;
  // A chip of the palette: a plain draggable, with no list item.
  if (!node) return `a new ${BLOCKS[(active.data as ChipData).kind].name.toLowerCase()}`;
  if (isSection(node)) return `${builder.find(node.id) ? 'the' : 'a new'} ${SECTIONS[node.kind].name} section`;
  if (isColumn(node)) return 'the column';
  return `the ${BLOCKS[node.kind].name.toLowerCase()} “${excerpt(node)}”`;
};

/** Where a position of a list is, in words. */
const where = ({ list, index, length }: AnnouncedPosition) => {
  const place = `${index + 1} of ${length}`;
  if (list === PAGE) return `position ${place} on the page`;
  if (list === LAYERS) return `row ${place} of the layers`;
  const at = builder.find(String(list));
  if (!at?.column) return `position ${place}`;
  return `position ${place} in column ${at.section.columns.indexOf(at.column) + 1} of ${SECTIONS[at.section.kind].name}`;
};

const announcements: Partial<Announcements> = {
  onDragStart: ({ active }) => `Picked up ${what(active)}.`,
  onDragOver: ({ active }, { position }) => (position ? `${what(active)}, ${where(position)}` : undefined),
  onDragEnd: ({ active, dropped }, { position }) => (dropped && position ? `Dropped ${what(active)} at ${where(position)}.` : undefined),
  onDragCancel: ({ active }) => `Cancelled. Nothing changed for ${what(active)}.`,
};

// Space picks up and drops. Enter is left to the editor: it edits a text, adds a template.
const keyboard = { keys: { start: ['Space'], drop: ['Space', 'Enter'], cancel: ['Escape'] } };
const instructions =
  'Space picks up; the arrow keys move; Space drops; Escape cancels. Enter edits the focused text, or adds the focused template.';
</script>

<template>
  <DnDProvider :announcements="announcements" :keyboard="keyboard" :screen-reader-instructions="instructions">
    <Builder />
  </DnDProvider>
</template>
