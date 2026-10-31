<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { makeSelectionArea, type Key } from '@vue-dnd-kit/core';
  import AreaPanel from './AreaPanel.vue';
  import PlainCard from './PlainCard.vue';

  const ids = ['n1', 'n2', 'n3', 'n4'];
  // Its own selection Ref instead of the provider's.
  const selection = ref(new Set<Key>());
  const lastSelected = ref<Key[] | null>(null);

  // A component ref on purpose: the area resolves it to the root element.
  const panel = useTemplateRef<InstanceType<typeof AreaPanel>>('panel');
  const { isSelecting, style } = makeSelectionArea(panel, {
    selection,
    strategy: 'select',
    onSelected: (selected) => (lastSelected.value = selected),
  });

  const toggle = (id: Key) => {
    if (selection.value.has(id)) selection.value.delete(id);
    else selection.value.add(id);
  };
</script>

<template>
  <div class="nested">
    <AreaPanel
      ref="panel"
      class="nested-area"
      data-testid="inner-area"
    >
      <strong>Nested area</strong>
      <div class="nested-cards">
        <PlainCard
          v-for="id in ids"
          :id="id"
          :key="id"
          :selected="selection.has(id)"
          @toggle="toggle(id)"
        />
      </div>
      <div
        v-if="isSelecting"
        class="selection-band"
        data-testid="inner-band"
        :style="style"
      />
    </AreaPanel>
    <pre data-testid="inner-selected">{{ ids.filter((id) => selection.has(id)).join(',') }}</pre>
    <pre data-testid="inner-on-selected">{{ lastSelected ? [...lastSelected].sort().join(',') : '' }}</pre>
  </div>
</template>
