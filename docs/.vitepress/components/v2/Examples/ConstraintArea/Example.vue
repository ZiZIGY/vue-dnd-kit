<script setup lang="ts">
  import { ref } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import ConstraintBox from './ConstraintBox.vue';
  import DragChip from './DragChip.vue';

  const activeTab = ref<'bounds' | 'axis'>('bounds');
</script>

<template>
  <ExampleContainer>
    <div class="tabs">
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'bounds' }"
        @click="activeTab = 'bounds'"
      >
        Restrict to area
      </button>
      <button
        class="tab-btn"
        :class="{ active: activeTab === 'axis' }"
        @click="activeTab = 'axis'"
      >
        Axis lock
      </button>
    </div>

    <div
      v-show="activeTab === 'bounds'"
      class="demo-section"
    >
      <DnDProvider>
        <ConstraintBox
          :restrict-to-area="true"
          label="Constraint area — drag stays inside"
          class="bounds-box"
        >
          <DragChip>Drag me</DragChip>
        </ConstraintBox>
      </DnDProvider>
    </div>

    <div
      v-show="activeTab === 'axis'"
      class="demo-section axis-layout"
    >
      <DnDProvider>
        <ConstraintBox
          axis="x"
          label="axis: 'x' — horizontal only"
          class="axis-box axis-box--h"
        >
          <DragChip>→ Horizontal</DragChip>
        </ConstraintBox>
      </DnDProvider>

      <DnDProvider>
        <ConstraintBox
          axis="y"
          label="axis: 'y' — vertical only"
          class="axis-box axis-box--v"
        >
          <DragChip>↕ Vertical</DragChip>
        </ConstraintBox>
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

  .demo-section {
    min-height: 180px;
  }

  .bounds-box {
    min-height: 180px;
  }

  .axis-layout {
    display: flex;
    gap: 1rem;
  }

  .axis-box--h {
    flex: 1;
    min-height: 100px;
  }

  .axis-box--v {
    width: 160px;
    min-height: 180px;
  }

  @media (max-width: 480px) {
    .axis-layout {
      flex-direction: column;
    }

    .axis-box--v {
      width: 100%;
      min-height: 120px;
    }
  }
</style>
