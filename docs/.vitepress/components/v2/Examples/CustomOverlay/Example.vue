<script setup lang="ts">
  import { ref } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import Zone from './Zone.vue';
  import DraggableTask from './DraggableTask.vue';
  import DraggableNote from './DraggableNote.vue';

  type ZoneId = 'source' | 'done';

  interface Task {
    id: string;
    label: string;
    priority: 'high' | 'medium' | 'low';
    type: 'task';
  }

  interface Note {
    id: string;
    text: string;
    color: 'amber' | 'rose' | 'teal';
    type: 'note';
  }

  type AnyItem = Task | Note;

  const items: AnyItem[] = [
    { id: 't1', type: 'task', label: 'Fix login bug', priority: 'high' },
    { id: 't2', type: 'task', label: 'Write tests', priority: 'medium' },
    { id: 'n1', type: 'note', text: 'Remember to update docs', color: 'amber' },
    { id: 'n2', type: 'note', text: 'Ask design review', color: 'rose' },
    { id: 'n3', type: 'task', label: 'Deploy to staging', priority: 'low' },
    { id: 'n4', type: 'note', text: 'Ping the team!', color: 'teal' },
  ];

  const itemZone = ref<Record<string, ZoneId>>(
    Object.fromEntries(items.map((i) => [i.id, 'source']))
  );

  function itemsIn(zone: ZoneId) {
    return items.filter((i) => itemZone.value[i.id] === zone);
  }

  function handleDrop(zone: ZoneId, e: IDragEvent) {
    const id = (e.draggedItems[0]?.data as { id: string } | null)?.id;
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
            <span class="col-label">Backlog</span>
            <button
              class="reset-btn"
              @click="reset"
            >Reset</button>
          </div>
          <div class="item-list">
            <template
              v-for="item in itemsIn('source')"
              :key="item.id"
            >
              <DraggableTask
                v-if="item.type === 'task'"
                :id="item.id"
                :label="(item as any).label"
                :priority="(item as any).priority"
              />
              <DraggableNote
                v-else
                :id="item.id"
                :text="(item as any).text"
                :color="(item as any).color"
              />
            </template>
          </div>
        </div>

        <Zone
          label="Done"
          @drop="handleDrop('done', $event)"
        >
          <template
            v-for="item in itemsIn('done')"
            :key="item.id"
          >
            <DraggableTask
              v-if="item.type === 'task'"
              :id="item.id"
              :label="(item as any).label"
              :priority="(item as any).priority"
            />
            <DraggableNote
              v-else
              :id="item.id"
              :text="(item as any).text"
              :color="(item as any).color"
            />
          </template>
        </Zone>
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

  @media (max-width: 500px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }

  .col {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
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
</style>
