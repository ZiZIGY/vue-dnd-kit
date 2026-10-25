<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import { VListItem } from 'vuetify/components';
  import type { KitTask } from '../../shared/data';
  import { mdiFileOutline } from '../icons';

  const props = defineProps<{ task: KitTask }>();
  const emit = defineEmits<{ open: [id: string] }>();
  // A clickable <v-list-item>: Vuetify turns Enter/Space on it into a click.
  const item = useTemplateRef('item');
  makeSortableItem(item, { id: () => props.task.id });
</script>

<template>
  <VListItem
    ref="item"
    :data-id="task.id"
    :title="task.title"
    :prepend-icon="mdiFileOutline"
    rounded
    @click="emit('open', task.id)"
  />
</template>
