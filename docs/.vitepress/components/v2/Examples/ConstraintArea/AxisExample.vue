<script setup lang="ts">
  import { DnDProvider } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import ConstraintBox from './ConstraintBox.vue';
  import DragChip from './DragChip.vue';
</script>

<template>
  <ExampleContainer>
    <div class="axis-layout">
      <DnDProvider>
        <ConstraintBox
          axis="x"
          label="axis: x"
          class="axis-box axis-box--h"
        >
          <DragChip>Horizontal only</DragChip>
        </ConstraintBox>
      </DnDProvider>

      <DnDProvider>
        <ConstraintBox
          axis="y"
          label="axis: y"
          class="axis-box axis-box--v"
        >
          <DragChip>Vertical only</DragChip>
        </ConstraintBox>
      </DnDProvider>
    </div>
  </ExampleContainer>
</template>

<style scoped>
  .axis-layout {
    display: flex;
    gap: 1rem;
  }

  .axis-box--h {
    flex: 1;
    min-height: 120px;
  }

  .axis-box--v {
    width: 180px;
    min-height: 200px;
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
