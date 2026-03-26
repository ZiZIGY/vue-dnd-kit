<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable, makeAutoScroll } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import PerfItem from './PerfItem.vue';
  import type { PerfItemData } from './PerfItem.vue';

  const props = defineProps<{
    items: PerfItemData[];
    onDrop: (e: IDragEvent) => void;
  }>();

  const ITEM_HEIGHT = 44;

  const el = useTemplateRef<HTMLElement>('el');

  makeDroppable(el, { events: { onDrop: (e) => props.onDrop(e) } }, () => props.items);
  makeAutoScroll(el, { threshold: 60, speed: 1.5 });
</script>

<template>
  <div
    ref="el"
    class="raw-list"
  >
    <TransitionGroup name="raw">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        :style="{ height: ITEM_HEIGHT + 'px', display: 'flex', alignItems: 'center' }"
      >
        <PerfItem
          :index="index"
          :items="items"
          :item="item"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
  .raw-list {
    height: 380px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--vp-c-brand-1) transparent;
    padding: 0 2px;
  }

  .raw-move {
    transition: transform 0.22s cubic-bezier(0.165, 0.84, 0.44, 1);
  }
  .raw-enter-active,
  .raw-leave-active {
    transition:
      opacity 0.18s ease,
      transform 0.18s ease;
  }
  .raw-enter-from,
  .raw-leave-to {
    opacity: 0;
    transform: scaleY(0.85);
  }
  .raw-leave-active {
    position: absolute;
    width: 100%;
    pointer-events: none;
  }
</style>
