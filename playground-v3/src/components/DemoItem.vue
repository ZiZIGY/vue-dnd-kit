<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import type { Task } from '../types';

  const props = withDefaults(defineProps<{ item: Task; tag?: string; selectable?: boolean }>(), {
    tag: 'li',
    selectable: false,
  });
  const el = useTemplateRef<HTMLElement>('el');
  const { indicator, selected, isPlaceholder } = makeSortableItem(el, {
    id: () => props.item.id,
    type: () => props.item.type,
  });

  // Ctrl/Cmd+click selects for multi-drag (rfcs/0001-v3.md §4.5: the recipe is the user's).
  const onClick = (event: MouseEvent) => {
    if (props.selectable && (event.ctrlKey || event.metaKey)) selected.value = !selected.value;
  };

  const style = computed(() =>
    props.item.span
      ? { gridColumn: `span ${props.item.span[0]}`, gridRow: `span ${props.item.span[1]}` }
      : undefined,
  );
</script>

<template>
  <component
    :is="tag"
    ref="el"
    class="row"
    :class="{ tall: item.tall, selected, placeholder: isPlaceholder }"
    :style="style"
    :data-id="item.id"
    :data-indicator="indicator ?? undefined"
    :data-selected="selected || undefined"
    @click="onClick"
  >
    <slot>{{ item.title }}</slot>
  </component>
</template>
