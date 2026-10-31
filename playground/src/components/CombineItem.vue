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
    background: #fef3c7;
    border-color: #f59e0b;
  }

  .entry.locked {
    background: #f1f5f9;
    border-color: #94a3b8;
    border-style: dashed;
  }

  .entry.selected {
    outline: 2px solid #3b82f6;
  }

  .entry[data-accepting] {
    box-shadow: inset 0 0 0 1px #93c5fd;
  }

  .entry[data-target] {
    background: #2563eb;
    color: #fff;
  }

  .count {
    float: right;
    padding: 0 6px;
    border-radius: 999px;
    background: rgb(15 23 42 / 0.1);
    font-size: 12px;
  }
</style>
