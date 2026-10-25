<script setup lang="ts">
  import { ref, shallowRef, useTemplateRef } from 'vue';
  import { makeSortableList } from '@vue-dnd-kit/core';
  import UModal from '@nuxt/ui/components/Modal.vue';
  import UButton from '@nuxt/ui/components/Button.vue';
  import ButtonRow from './ButtonRow.vue';
  import { createFiles, ids } from '../../shared/data';

  const open = shallowRef(false);
  const tasks = ref(createFiles());
  const opened = shallowRef('');
  const list = useTemplateRef<HTMLElement>('list');
  const { items } = makeSortableList(list, { id: 'modal', items: tasks });
</script>

<template>
  <section>
    <h2 class="mb-2 font-semibold text-highlighted">In a modal (focus trap, UButton items)</h2>
    <!-- The modal teleports to <body>; the provider is still its ancestor in the component tree. -->
    <UModal
      v-model:open="open"
      title="Reorder files"
      description="A sortable list inside a Reka UI dialog."
    >
      <UButton
        label="Open modal"
        color="neutral"
        variant="subtle"
        data-testid="open-modal"
      />
      <template #body>
        <div
          ref="list"
          class="flex flex-col gap-2"
          data-testid="modal-list"
        >
          <ButtonRow
            v-for="task in items"
            :key="task.id"
            :task="task"
            @open="opened = $event"
          />
        </div>
      </template>
    </UModal>
    <pre
      class="mt-2 text-xs text-muted"
      data-testid="modal-state"
      >{{ ids(tasks) }}{{ opened ? ` opened:${opened}` : '' }}</pre
    >
  </section>
</template>
