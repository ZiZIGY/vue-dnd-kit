<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable, makeSortableItem, type DnDEvent } from '@vue-dnd-kit/core';
  import type { Entry } from '../types';

  const props = defineProps<{ entry: Entry }>();
  const emit = defineEmits<{ into: [event: DnDEvent] }>();
  const el = useTemplateRef<HTMLElement>('el');

  const isGroup = !!props.entry.children;
  const { selected } = makeSortableItem(el, { id: () => props.entry.id, type: isGroup ? 'group' : 'task' });

  // A group is also a drop target: tasks dropped on its middle go into it. No other
  // option is needed; its edges still sort, and it refuses groups (they sort over it).
  const { isOver, isAccepting } = isGroup
    ? makeDroppable(el, {
        id: () => `into:${props.entry.id}`,
        accept: ({ types }) => !props.entry.locked && !types.includes('group'),
        // A full group refuses the drop when it happens: the items fly back.
        onBeforeDrop: (event) => props.entry.children!.length + event.active.ids.length <= (props.entry.limit ?? Infinity),
        onDrop: (event) => emit('into', event),
      })
    : { isOver: null, isAccepting: null };

  const onClick = (event: MouseEvent) => {
    if (event.ctrlKey || event.metaKey) selected.value = !selected.value;
  };
</script>

<template>
  <li
    ref="el"
    class="row entry"
    :class="{ group: isGroup, locked: entry.locked, selected }"
    :data-id="entry.id"
    :data-selected="selected || undefined"
    :data-accepting="isAccepting || undefined"
    :data-target="(isOver && isAccepting) || undefined"
    @click="onClick"
  >
    {{ entry.title }}
    <span
      v-if="entry.children"
      class="count"
      >{{ entry.children.length }}</span
    >
  </li>
</template>

<style scoped>
  .entry.group {
    background: var(--ui-warning-soft);
    border-color: color-mix(in srgb, var(--ui-warning) 70%, var(--ui-bg));
  }

  .entry.locked {
    background: var(--ui-bg-muted);
    border-color: var(--ui-border-strong);
    border-style: dashed;
    color: var(--ui-text-muted);
  }

  .entry.selected {
    outline: 2px solid var(--ui-selection);
  }

  .entry[data-accepting] {
    box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--ui-primary) 55%, transparent);
  }

  .entry[data-target] {
    background: var(--ui-primary);
    border-color: var(--ui-primary);
    color: var(--ui-on-primary);
  }

  .count {
    float: right;
    padding: 0 6px;
    border-radius: var(--ui-radius-sm);
    background: color-mix(in srgb, currentColor 12%, transparent);
    font-family: var(--font-mono);
    font-size: 12px;
  }
</style>
