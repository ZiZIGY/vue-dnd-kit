<script setup lang="ts">
const props = defineProps<{ taskId: string }>();
makeSortableItem(useTemplateRef<HTMLElement>('item'), { id: () => props.taskId });
</script>

<template>
  <li
    ref="item"
    :data-id="taskId"
  >
    {{ taskId }}
  </li>
</template>
