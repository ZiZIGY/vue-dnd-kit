<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue';
  import { useVirtualList } from '@vueuse/core';
  import {
    makeDraggable,
    makeDroppable,
  } from '../../../packages/core/src/external/index';
  import type { IDragEvent } from '../../../packages/core/src/external/types';

  interface Item {
    id: string;
    label: string;
    color: string;
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#14b8a6'];

  function makeItems(count: number): Item[] {
    return Array.from({ length: count }, (_, i) => ({
      id: `item-${i}`,
      label: `Item ${i + 1}`,
      color: COLORS[i % COLORS.length],
    }));
  }

  const items = ref<Item[]>(makeItems(200));

  // ── Virtual list ──────────────────────────────────────────────────────────────
  const ITEM_HEIGHT = 48;

  const { list, containerProps, wrapperProps } = useVirtualList(items, {
    itemHeight: ITEM_HEIGHT,
    overscan: 3,
  });

  // ── Drop zone on the virtual scroll container ─────────────────────────────────
  makeDroppable(
    containerProps.ref as any,
    {
      groups: ['virt'],
      events: {
        onDrop(e: IDragEvent) {
          const r = e.helpers.suggestSort('vertical');
          if (r) items.value = r.sourceItems as Item[];
        },
      },
    },
    () => items.value,
  );
</script>

<template>
  <div>
    <p class="hint">
      200 items, virtualised — only ~15 DOM nodes rendered at a time.<br />
      Drag an item, <strong>scroll away</strong> so it unmounts, then scroll back —
      it stays faded (still dragging), is not a hover target, and <strong>drop still fires</strong>.
      <br />
      Key: <code>makeDraggable(el, {{ '{' }} id: item.id {{ '}' }}, ...)</code>
    </p>

    <!-- Virtual scroll container -->
    <div
      v-bind="containerProps"
      class="virt-container"
    >
      <div v-bind="wrapperProps">
        <div
          v-for="{ index, data: item } in list"
          :key="item.id"
          class="virt-row"
        >
          <VirtItem
            :item="item"
            :index="index"
            :items="items"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<!-- VirtItem as local component (script block for defineOptions) -->
<script lang="ts">
  import { defineComponent, shallowRef, h } from 'vue';
  import { makeDraggable as mkDrag } from '../../../packages/core/src/external/index';

  interface Item {
    id: string;
    label: string;
    color: string;
  }

  const VirtItem = defineComponent({
    name: 'VirtItem',
    props: {
      item: { type: Object as () => Item, required: true },
      index: { type: Number, required: true },
      items: { type: Array as () => Item[], required: true },
    },
    setup(props) {
      const el = shallowRef<HTMLElement | null>(null);

      const { isDragging, isDragOver } = mkDrag(
        el,
        // ← stable id from data: survives unmount/remount during virtual scroll
        { groups: ['virt'], id: props.item.id },
        () => [props.index, props.items],
      );

      return () =>
        h(
          'div',
          {
            ref: el,
            class: 'virt-item',
            style: {
              '--color': props.item.color,
              opacity: isDragging.value ? '0.3' : '1',
              outline: isDragOver.value?.top
                ? '2px solid #fff'
                : isDragOver.value?.bottom
                  ? '2px solid #fff'
                  : 'none',
              outlineOffset: isDragOver.value?.top ? '-2px' : '2px',
            },
          },
          [
            h('span', { class: 'virt-handle' }, '⠿'),
            h('span', { class: 'virt-index' }, `#${props.index + 1}`),
            props.item.label,
          ],
        );
    },
  });

  export default { components: { VirtItem } };
</script>

<style scoped>
  .virt-container {
    height: 400px;
    overflow-y: auto;
    border: 1px solid #d1d5db;
    border-radius: 10px;
    background: #f9fafb;
  }

  .virt-row {
    padding: 2px 6px;
  }

  .virt-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 14px;
    height: 44px;
    background: var(--color);
    color: #fff;
    border-radius: 8px;
    cursor: grab;
    user-select: none;
    transition: opacity 0.15s;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .virt-item:active {
    cursor: grabbing;
  }

  .virt-handle {
    opacity: 0.6;
    font-size: 1rem;
  }

  .virt-index {
    opacity: 0.55;
    font-size: 0.75rem;
    font-weight: 400;
    min-width: 28px;
  }
</style>
