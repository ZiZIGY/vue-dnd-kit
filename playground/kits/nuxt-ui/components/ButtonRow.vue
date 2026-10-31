<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import UButton from '@nuxt/ui/components/Button.vue';
  import type { KitTask } from '../../shared/data';

  const props = defineProps<{ task: KitTask }>();
  const emit = defineEmits<{ open: [id: string] }>();
  // The draggable is a <button>: a click opens it, a drag moves it.
  const button = useTemplateRef('button');
  makeSortableItem(button, { id: () => props.task.id });
</script>

<template>
  <UButton
    ref="button"
    :data-id="task.id"
    :label="task.title"
    icon="i-lucide-file"
    color="neutral"
    variant="outline"
    block
    class="justify-start"
    @click="emit('open', task.id)"
  />
</template>
