<script setup lang="ts">
import { provide } from 'vue';
import { DnDProvider, type Active, type Announcements } from '@vue-dnd-kit/core';
import Builder from './Builder.vue';
import { FORM, KINDS, TRASH, createForm, type Field, type Row } from './form';

// One form for the whole builder: its lists, its panels and the announcements read it.
const form = createForm();
provide(FORM, form);

// Space picks a field up and drops it; Enter is left to open a field's settings.
const KEYBOARD = { keys: { start: ['Space'], drop: ['Space'] } };

// Screen readers hear what moves and where it would go, in words: "Email: row 2, column 1 of 2".
const nameOf = ({ items: [first] }: Active) => {
  const item = first?.item as Field | Row | undefined;
  if (!item) return 'Item';
  if ('fields' in item) return `Row ${form.state.rows.findIndex((row) => row.id === item.id) + 1}`;
  return first!.type.includes('new-field') ? `New ${KINDS[item.kind].name.toLowerCase()} field` : item.label || 'Untitled field';
};
const announcements: Partial<Announcements> = {
  onDragStart: ({ active }) => `${nameOf(active)} picked up. Arrows move it, Space drops it, Escape cancels.`,
  onDragOver: ({ active }, { position }) => (position ? `${nameOf(active)}: ${form.describe(position)}.` : undefined),
  onDragEnd: ({ active, over }) => (over?.id === TRASH ? `${nameOf(active)} deleted.` : `${nameOf(active)} dropped.`),
  onDragCancel: ({ active }) => `${nameOf(active)} put back.`,
};
</script>

<template>
  <DnDProvider :keyboard="KEYBOARD" :announcements="announcements">
    <Builder />
  </DnDProvider>
</template>
