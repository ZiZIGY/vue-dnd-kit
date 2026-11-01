<script setup lang="ts">
import { provide } from 'vue';
import { DnDProvider, type Active, type AnnouncementContext, type Announcements } from '@vue-dnd-kit/core';
import Workspace from './Workspace.vue';
import { KINDS, describe, type BlockKind } from './blocks';
import { EDITOR, createEditor } from './editor';

// Provided above the provider: the overlay it renders reads the document too.
const editor = createEditor();
provide(EDITOR, editor);

// Screen readers hear blocks by their kind and text, not by their ids.
const name = (active: Active, { count, copy }: AnnouncementContext) => {
  const block = editor.get(String(active.id));
  const kind = (active.data as { kind?: BlockKind } | undefined)?.kind;
  const what = block ? describe(block) : `a new ${KINDS[kind ?? 'text'].name.toLowerCase()}`;
  return `${copy ? 'a copy of ' : ''}${what}${count > 1 ? ` and ${count - 1} more` : ''}`;
};
const row = ({ position }: AnnouncementContext) => (position ? `row ${position.index + 1} of ${position.length}` : '');

const announcements: Partial<Announcements> = {
  onDragStart: ({ active }, context) =>
    `Picked up ${name(active, context)}. Up and down move it, left and right change its level.`,
  onDragOver: (_event, context) => row(context) || 'Outside the page: dropping cancels.',
  onDragEnd: ({ active }, context) => `Dropped ${name(active, context)}${context.position ? `, ${row(context)}` : ''}.`,
  onDragCancel: ({ active }, context) => `Cancelled: ${name(active, context)} stays where it was.`,
};
</script>

<template>
  <DnDProvider
    :announcements="announcements"
    screen-reader-instructions="Space picks a block up, the arrow keys move it and left or right change its level, Space drops it and Escape cancels. Enter opens the block's menu."
  >
    <Workspace />
  </DnDProvider>
</template>
