<script setup lang="ts">
  import { ref } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import Zone from './Zone.vue';
  import Pool from './Pool.vue';
  import DraggableItem from './DraggableItem.vue';

  interface Task {
    id: string;
    label: string;
    group: string;
    color: 'blue' | 'purple';
  }

  const initialTasks: Task[] = [
    { id: 'fe-1', group: 'frontend', label: 'Fix button styles', color: 'blue' },
    { id: 'fe-2', group: 'frontend', label: 'Update icons', color: 'blue' },
    { id: 'fe-3', group: 'frontend', label: 'Add animations', color: 'blue' },
    { id: 'be-1', group: 'backend', label: 'Fix auth bug', color: 'purple' },
    { id: 'be-2', group: 'backend', label: 'Add rate limit', color: 'purple' },
    { id: 'be-3', group: 'backend', label: 'DB migration', color: 'purple' },
  ];

  const poolTasks = ref<Task[]>([...initialTasks]);
  const strictTasks = ref<Task[]>([]);
  const partialTasks = ref<Task[]>([]);
  const validateTasks = ref<Task[]>([]);

  type ZoneKey = 'strict' | 'partial' | 'validate';
  const zoneMap = { strict: strictTasks, partial: partialTasks, validate: validateTasks };
  const allRefs = [poolTasks, strictTasks, partialTasks, validateTasks];

  function handleDrop(zone: ZoneKey, e: IDragEvent) {
    if (!e.draggedItems.length) return;
    const sourceItems = e.draggedItems[0].items as Task[];
    const sourceRef = allRefs.find((r) => r.value === sourceItems);
    const targetRef = zoneMap[zone];
    if (!sourceRef || sourceRef === targetRef) return;
    const dropped = e.draggedItems.map((d) => d.item as Task);
    const droppedSet = new Set(dropped);
    sourceRef.value = sourceRef.value.filter((t) => !droppedSet.has(t));
    targetRef.value = [...targetRef.value, ...dropped];
  }

  function reset() {
    poolTasks.value = [...initialTasks];
    strictTasks.value = [];
    partialTasks.value = [];
    validateTasks.value = [];
  }
</script>

<template>
  <ExampleContainer>
    <DnDProvider>
      <div class="hint">
        Checkboxes or <kbd>Ctrl</kbd>+drag to multi-select · drag the <strong>⠿</strong> handle
      </div>

      <div class="layout">
        <!-- Source pool with selectionArea -->
        <div class="pool-col">
          <div class="col-header">
            <span class="col-label">Tasks</span>
            <button
              class="reset-btn"
              @click="reset"
            >Reset</button>
          </div>
          <Pool :tasks="poolTasks" />
        </div>

        <!-- Drop zones -->
        <div class="zones">
          <span class="col-label">Zones</span>

          <!-- every (strict) -->
          <Zone
            label="Strict"
            :groups="['frontend']"
            group-match="every"
            @drop="handleDrop('strict', $event)"
          >
            <DraggableItem
              v-for="(task, i) in strictTasks"
              :key="task.id"
              :id="task.id"
              :index="i"
              :items="strictTasks"
              :group="task.group"
              :label="task.label"
              :color="task.color"
            />
          </Zone>

          <!-- some (silent filter) -->
          <Zone
            label="Partial (silent)"
            :groups="['frontend']"
            group-match="some"
            @drop="handleDrop('partial', $event)"
          >
            <DraggableItem
              v-for="(task, i) in partialTasks"
              :key="task.id"
              :id="task.id"
              :index="i"
              :items="partialTasks"
              :group="task.group"
              :label="task.label"
              :color="task.color"
            />
          </Zone>

          <!-- some + onValidate -->
          <Zone
            label="Partial (with validate)"
            :groups="['frontend']"
            group-match="some"
            :with-validate="true"
            @drop="handleDrop('validate', $event)"
          >
            <DraggableItem
              v-for="(task, i) in validateTasks"
              :key="task.id"
              :id="task.id"
              :index="i"
              :items="validateTasks"
              :group="task.group"
              :label="task.label"
              :color="task.color"
            />
          </Zone>
        </div>
      </div>
    </DnDProvider>
  </ExampleContainer>
</template>

<style scoped>
  .hint {
    font-size: 0.72rem;
    color: var(--vp-c-text-3);
    margin-bottom: 0.875rem;
  }

  kbd {
    display: inline-flex;
    align-items: center;
    padding: 0.08rem 0.3rem;
    border-radius: 3px;
    font-size: 0.7rem;
    font-family: var(--vp-font-family-mono);
    background: rgba(255, 255, 255, 0.07);
    border: 1px solid rgba(255, 255, 255, 0.14);
    color: var(--vp-c-text-1);
  }

  .layout {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  @media (max-width: 580px) {
    .layout { grid-template-columns: 1fr; }
  }

  .pool-col {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .col-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }

  .col-label {
    font-size: 0.75rem;
    color: var(--vp-c-text-2);
    text-transform: uppercase;
    letter-spacing: 0.06em;
    font-weight: 600;
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
  .reset-btn:hover { background: rgba(148, 163, 184, 0.16); color: var(--vp-c-text-1); }

  .zones {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
  }
</style>
