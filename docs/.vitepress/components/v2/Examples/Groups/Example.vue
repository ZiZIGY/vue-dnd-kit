<script setup lang="ts">
  import { ref } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import Zone from './Zone.vue';
  import DraggableItem from './DraggableItem.vue';

  type ZoneId = 'source' | 'inbox' | 'dev' | 'design';

  interface Task {
    id: string;
    label: string;
    group?: string;
    color: 'blue' | 'purple' | 'neutral';
  }

  const tasks: Task[] = [
    { id: 'dev-1', group: 'dev', label: 'Fix auth bug', color: 'blue' },
    { id: 'dev-2', group: 'dev', label: 'Review PR', color: 'blue' },
    { id: 'design-1', group: 'design', label: 'Update icons', color: 'purple' },
    { id: 'global-1', label: 'Write release notes', color: 'neutral' },
  ];

  const taskZone = ref<Record<string, ZoneId>>(
    Object.fromEntries(tasks.map((t) => [t.id, 'source']))
  );

  function tasksIn(zone: ZoneId) {
    return tasks.filter((t) => taskZone.value[t.id] === zone);
  }

  function handleDrop(zoneId: ZoneId, e: IDragEvent) {
    const id = e.draggedItems[0]?.data as string | undefined;
    if (id) taskZone.value[id] = zoneId;
  }

  function reset() {
    tasks.forEach((t) => (taskZone.value[t.id] = 'source'));
  }
</script>

<template>
  <ExampleContainer>
    <DnDProvider>
      <div class="layout">
        <!-- Source column -->
        <div class="source-col">
          <div class="source-header">
            <p class="section-label">Tasks</p>
            <button
              class="reset-btn"
              @click="reset"
            >
              Reset
            </button>
          </div>
          <div class="source-zone">
            <TransitionGroup name="item">
              <DraggableItem
                v-for="task in tasksIn('source')"
                :key="task.id"
                :id="task.id"
                :group="task.group"
                :label="task.label"
                :color="task.color"
              />
            </TransitionGroup>
            <span
              v-if="tasksIn('source').length === 0"
              class="empty"
            >All tasks assigned</span>
          </div>
        </div>

        <!-- Drop zones -->
        <div class="zones">
          <p class="section-label">Queues</p>

          <Zone
            label="Inbox"
            @drop="handleDrop('inbox', $event)"
          >
            <TransitionGroup name="item">
              <DraggableItem
                v-for="task in tasksIn('inbox')"
                :key="task.id"
                :id="task.id"
                :group="task.group"
                :label="task.label"
                :color="task.color"
              />
            </TransitionGroup>
          </Zone>

          <Zone
            label="Dev queue"
            :groups="['dev']"
            @drop="handleDrop('dev', $event)"
          >
            <TransitionGroup name="item">
              <DraggableItem
                v-for="task in tasksIn('dev')"
                :key="task.id"
                :id="task.id"
                :group="task.group"
                :label="task.label"
                :color="task.color"
              />
            </TransitionGroup>
          </Zone>

          <Zone
            label="Design queue"
            :groups="['design']"
            @drop="handleDrop('design', $event)"
          >
            <TransitionGroup name="item">
              <DraggableItem
                v-for="task in tasksIn('design')"
                :key="task.id"
                :id="task.id"
                :group="task.group"
                :label="task.label"
                :color="task.color"
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
    grid-template-columns: auto 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  @media (max-width: 560px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }

  .source-col {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .source-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .reset-btn {
    font-size: 0.65rem;
    padding: 0.15rem 0.5rem;
    border-radius: 4px;
    border: 1px solid rgba(148, 163, 184, 0.3);
    background: rgba(148, 163, 184, 0.08);
    color: var(--vp-c-text-2);
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  .reset-btn:hover {
    background: rgba(148, 163, 184, 0.16);
    color: var(--vp-c-text-1);
  }

  .source-zone {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    min-height: 2rem;
  }

  .zones {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }

  .section-label {
    font-size: 0.75rem;
    color: var(--vp-c-text-2);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 0.25rem;
  }

  .empty {
    font-size: 0.75rem;
    color: var(--vp-c-text-3);
    font-style: italic;
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
    transform: scale(0.92) translateY(-6px);
  }
</style>
