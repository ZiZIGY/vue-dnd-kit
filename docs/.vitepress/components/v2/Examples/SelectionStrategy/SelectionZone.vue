<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable, makeSelectionArea } from '@vue-dnd-kit/core';
  import type { IDragEvent, TSelectableAreaStrategy } from '@vue-dnd-kit/core';
  import SelectionItem from './SelectionItem.vue';

  interface Item { id: number; label: string }

  const props = defineProps<{
    strategy: TSelectableAreaStrategy;
    label: string;
  }>();

  const items = defineModel<Item[]>({ required: true });

  const el = useTemplateRef<HTMLElement>('el');

  const { isSelecting, style: selectionStyle } = makeSelectionArea(el, {
    strategy: props.strategy,
    modifier: { keys: ['ControlLeft', 'ControlRight'], method: 'some' },
  });

  makeDroppable(
    el,
    {
      events: {
        onDrop(e: IDragEvent) {
          const r = e.helpers.suggestSort('vertical');
          if (!r) return;
          items.value = r.targetItems as Item[];
          if (!r.sameList) {
            const src = e.draggedItems[0].items as Item[];
            src.splice(0, src.length, ...(r.sourceItems as Item[]));
          }
        },
      },
    },
    () => items.value
  );
</script>

<template>
  <div class="zone-wrap">
    <div class="zone-header">
      <span class="zone-title">{{ label }}</span>
      <code class="zone-badge">strategy: "{{ strategy }}"</code>
    </div>

    <div ref="el" class="zone">
      <div
        v-if="isSelecting"
        class="sel-rect"
        :style="selectionStyle"
      />
      <SelectionItem
        v-for="(item, i) in items"
        :key="item.id"
        :item="item"
        :index="i"
        :items="items"
      />
    </div>
  </div>
</template>

<style scoped>
  .zone-wrap {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .zone-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .zone-title {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }

  .zone-badge {
    font-size: 0.75rem;
    padding: 0.15rem 0.4rem;
    border-radius: 4px;
    background: var(--vp-c-bg-soft);
    border: 1px solid var(--vp-c-divider);
    color: var(--vp-c-brand-1);
  }

  .zone {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 0.75rem;
    border: 2px dashed rgba(62, 175, 124, 0.25);
    border-radius: 10px;
    background: rgba(62, 175, 124, 0.02);
    min-height: 80px;
  }

  .sel-rect {
    border: 1.5px solid var(--vp-c-brand-1);
    background: rgba(62, 175, 124, 0.1);
    border-radius: 4px;
    z-index: 10;
    pointer-events: none;
  }
</style>
