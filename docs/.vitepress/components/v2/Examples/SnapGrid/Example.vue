<script setup lang="ts">
  import { ref } from 'vue';
  import { DnDProvider, DragPreview } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import GridCanvas from './GridCanvas.vue';
  import SnapChip from './SnapChip.vue';

  const activeTab = ref<'uniform' | 'per-axis'>('uniform');
</script>

<template>
  <ExampleContainer>
    <div class="tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'uniform' }"
        @click="activeTab = 'uniform'"
      >
        Uniform grid
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'per-axis' }"
        @click="activeTab = 'per-axis'"
      >
        Per-axis grid
      </button>
    </div>

    <div
      v-if="activeTab === 'uniform'"
      class="demo"
    >
      <p class="hint"><code>:grid="40"</code> — snaps 40 × 40 px</p>
      <DnDProvider>
        <template #preview>
          <DragPreview :grid="40" />
        </template>
        <GridCanvas
          :step-x="40"
          :step-y="40"
        >
          <SnapChip 
            :style="{
              height: '40px',
              width: '80px'
          }">
            Drag
          </SnapChip>
        </GridCanvas>
      </DnDProvider>
    </div>

    <div
      v-else
      class="demo"
    >
      <p class="hint"><code>:grid="{ x: 80, y: 40 }"</code> — 80 px horizontal, 40 px vertical</p>
      <DnDProvider>
        <template #preview>
          <DragPreview :grid="{ x: 80, y: 40 }" />
        </template>
        <GridCanvas
          :step-x="80"
          :step-y="40"
        >
          <SnapChip 
            :style="{
              height: '40px',
              width: '80px'
          }">
            Drag
          </SnapChip>
        </GridCanvas>
      </DnDProvider>
    </div>
  </ExampleContainer>
</template>

<style scoped>
  .tabs {
    display: flex;
    gap: 0.375rem;
    margin-bottom: 1.25rem;
  }

  .tab-btn {
    padding: 0.375rem 0.875rem;
    border-radius: 6px;
    border: 1px solid rgba(148, 163, 184, 0.25);
    background: rgba(148, 163, 184, 0.08);
    color: var(--vp-c-text-2);
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }

  .tab-btn:hover {
    background: rgba(148, 163, 184, 0.15);
    color: var(--vp-c-text-1);
  }

  .tab-btn.active {
    background: rgba(62, 175, 124, 0.15);
    border-color: var(--vp-c-brand-1);
    color: var(--vp-c-brand-1);
  }

  .hint {
    font-size: 0.8rem;
    color: var(--vp-c-text-2);
    margin-bottom: 1rem;
  }
</style>
