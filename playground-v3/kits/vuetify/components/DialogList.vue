<script setup lang="ts">
  import { ref, shallowRef, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import { VBtn, VCard, VCardText, VCardTitle, VDialog, VList } from 'vuetify/components';
  import ClickableItem from './ClickableItem.vue';
  import { createFiles, ids } from '../../shared/data';

  const open = shallowRef(false);
  const tasks = ref(createFiles());
  const opened = shallowRef('');
  const list = useTemplateRef('list');
  const { items } = makeSortableList(list, { id: 'dialog', items: tasks });
</script>

<template>
  <section>
    <h2 class="text-subtitle-1 font-weight-bold mb-2">In a dialog (focus trap, clickable items)</h2>
    <!-- The dialog teleports out of the page; the provider is still its ancestor in the component tree. -->
    <VDialog
      v-model="open"
      width="360"
    >
      <template #activator="{ props: activator }">
        <VBtn
          v-bind="activator"
          variant="tonal"
          data-testid="open-modal"
          >Open dialog</VBtn
        >
      </template>
      <VCard>
        <VCardTitle>Reorder files</VCardTitle>
        <VCardText>
          <VList
            ref="list"
            data-testid="modal-list"
          >
            <ClickableItem
              v-for="task in items"
              :key="task.id"
              :task="task"
              @open="opened = $event"
            />
          </VList>
        </VCardText>
      </VCard>
    </VDialog>
    <pre
      class="text-caption mt-2 text-pre-wrap text-break"
      data-testid="modal-state"
      >{{ ids(tasks) }}{{ opened ? ` opened:${opened}` : '' }}</pre
    >
  </section>
</template>
