<script setup lang="ts">
  import { watch, toRef } from 'vue';
  import { useVirtualList } from '@vueuse/core';
  import { makeDroppable, makeAutoScroll } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import PerfItem from './PerfItem.vue';
  import type { PerfItemData } from './PerfItem.vue';

  const props = defineProps<{
    items: PerfItemData[];
    onDrop: (e: IDragEvent) => void;
  }>();

  const emit = defineEmits<{ 'update:rendered': [n: number] }>();

  const ITEM_HEIGHT = 44;
  const OVERSCAN = 5;

  const { list, containerProps, wrapperProps } = useVirtualList(toRef(props, 'items'), {
    itemHeight: ITEM_HEIGHT,
    overscan: OVERSCAN,
  });

  watch(
    () => list.value.length,
    (n) => emit('update:rendered', n),
    { immediate: true }
  );

  makeDroppable(
    containerProps.ref as any,
    { events: { onDrop: (e) => props.onDrop(e) } },
    () => props.items
  );
  makeAutoScroll(containerProps.ref as any, { threshold: 60, speed: 1.5 });
</script>

<template>
  <div
    v-bind="containerProps"
    class="virtual-list"
  >
    <div v-bind="wrapperProps">
      <div
        v-for="{ data, index } in list"
        :key="data.id"
        :style="{ height: ITEM_HEIGHT + 'px', display: 'flex', alignItems: 'center' }"
      >
        <PerfItem
          :index="index"
          :items="props.items"
          :item="data"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
  .virtual-list {
    height: 380px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: var(--vp-c-brand-1) transparent;
    padding: 0 2px;
  }

</style>
