<script setup lang="ts">
  import { ref } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import Zone from './Zone.vue';
  import DraggableItem from './DraggableItem.vue';

  type ZoneId = 'a' | 'b';

  interface Item {
    id: string;
    label: string;
  }

  const items: Item[] = [
    { id: '1', label: 'Task Alpha' },
    { id: '2', label: 'Task Beta' },
    { id: '3', label: 'Task Gamma' },
  ];

  const itemZone = ref<Record<string, ZoneId>>(
    Object.fromEntries(items.map((i) => [i.id, 'a']))
  );

  function itemsIn(zone: ZoneId) {
    return items.filter((i) => itemZone.value[i.id] === zone);
  }

  function handleDrop(zone: ZoneId, e: IDragEvent) {
    const id = e.draggedItems[0]?.data as string | undefined;
    if (id) itemZone.value[id] = zone;
  }
</script>

<template>
  <ExampleContainer>
    <DnDProvider>
      <div class="hint">
        <span class="hint-key">Tab</span> to focus ·
        <span class="hint-key">Space / Enter</span> to drag/drop ·
        <span class="hint-key">Arrows</span> to move ·
        <span class="hint-key">Esc</span> to cancel
      </div>
      <div class="layout">
        <Zone
          label="Zone A"
          @drop="handleDrop('a', $event)"
        >
          <TransitionGroup name="item">
            <DraggableItem
              v-for="item in itemsIn('a')"
              :key="item.id"
              :id="item.id"
              :label="item.label"
            />
          </TransitionGroup>
        </Zone>

        <Zone
          label="Zone B"
          @drop="handleDrop('b', $event)"
        >
          <TransitionGroup name="item">
            <DraggableItem
              v-for="item in itemsIn('b')"
              :key="item.id"
              :id="item.id"
              :label="item.label"
            />
          </TransitionGroup>
        </Zone>
      </div>
    </DnDProvider>
  </ExampleContainer>
</template>

<style scoped>
  .hint {
    font-size: 0.75rem;
    color: var(--vp-c-text-2);
    margin-bottom: 0.875rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.5rem;
    align-items: center;
  }

  .hint-key {
    font-family: monospace;
    font-size: 0.7rem;
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
    background: rgba(148, 163, 184, 0.12);
    border: 1px solid rgba(148, 163, 184, 0.25);
    color: var(--vp-c-text-1);
  }

  .layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }

  .item-move {
    transition: transform 0.25s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .item-enter-active,
  .item-leave-active {
    transition: all 0.22s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .item-enter-from,
  .item-leave-to {
    opacity: 0;
    transform: scale(0.92) translateY(-4px);
  }
</style>
