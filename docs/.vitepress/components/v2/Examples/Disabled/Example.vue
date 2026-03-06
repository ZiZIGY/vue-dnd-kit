<script setup lang="ts">
  import { ref } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import Zone from './Zone.vue';
  import DraggableItem from './DraggableItem.vue';

  type ZoneId = 'source' | 'active' | 'locked';

  interface Item {
    id: string;
    label: string;
    disabled: boolean;
  }

  const items: Item[] = [
    { id: '1', label: 'Active task', disabled: false },
    { id: '2', label: 'Blocked task', disabled: true },
    { id: '3', label: 'Another task', disabled: false },
  ];

  const itemZone = ref<Record<string, ZoneId>>(
    Object.fromEntries(items.map((i) => [i.id, 'source']))
  );

  function itemsIn(zone: ZoneId) {
    return items.filter((i) => itemZone.value[i.id] === zone);
  }

  function handleDrop(zone: ZoneId, e: IDragEvent) {
    const id = e.draggedItems[0]?.data as string | undefined;
    if (id) itemZone.value[id] = zone;
  }

  function reset() {
    items.forEach((i) => (itemZone.value[i.id] = 'source'));
  }
</script>

<template>
  <ExampleContainer>
    <DnDProvider>
      <div class="layout">
        <div class="col">
          <div class="col-header">
            <span class="col-label">Items</span>
            <button
              class="reset-btn"
              @click="reset"
            >
              Reset
            </button>
          </div>
          <div class="item-list">
            <TransitionGroup name="item">
              <DraggableItem
                v-for="item in itemsIn('source')"
                :key="item.id"
                :id="item.id"
                :label="item.label"
                :disabled="item.disabled"
              />
            </TransitionGroup>
          </div>
        </div>

        <div class="col">
          <span class="col-label">Drop zones</span>
          <Zone
            label="Active zone"
            @drop="handleDrop('active', $event)"
          >
            <TransitionGroup name="item">
              <DraggableItem
                v-for="item in itemsIn('active')"
                :key="item.id"
                :id="item.id"
                :label="item.label"
                :disabled="item.disabled"
              />
            </TransitionGroup>
          </Zone>

          <Zone
            label="Locked zone"
            :disabled="true"
            @drop="handleDrop('locked', $event)"
          >
            <TransitionGroup name="item">
              <DraggableItem
                v-for="item in itemsIn('locked')"
                :key="item.id"
                :id="item.id"
                :label="item.label"
                :disabled="item.disabled"
              />
            </TransitionGroup>
          </Zone>
        </div>
      </div>
    </DnDProvider>
  </ExampleContainer>
</template>

<style scoped>
  .layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
    align-items: start;
  }

  @media (max-width: 520px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .col-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .col-label {
    font-size: 0.75rem;
    color: var(--vp-c-text-2);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 600;
  }

  .item-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-height: 2rem;
  }

  .reset-btn {
    font-size: 0.65rem;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    border: 1px solid rgba(148, 163, 184, 0.3);
    background: rgba(148, 163, 184, 0.08);
    color: var(--vp-c-text-2);
    cursor: pointer;
    transition: background 0.15s;
  }

  .reset-btn:hover {
    background: rgba(148, 163, 184, 0.16);
    color: var(--vp-c-text-1);
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
