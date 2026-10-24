<script setup lang="ts">
import type { Task } from '~/types';

const props = defineProps<{ task: Task }>();
const el = useTemplateRef<HTMLElement>('el');
// Auto-imported by the module.
const { selected } = makeSortableItem(el, { id: () => props.task.id });
</script>

<template>
  <li
    ref="el"
    class="task"
    :class="{ selected }"
    :data-id="task.id"
  >
    {{ task.title }}
  </li>
</template>
