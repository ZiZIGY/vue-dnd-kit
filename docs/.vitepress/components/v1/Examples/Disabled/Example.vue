<script setup lang="ts">
  import { useDroppable } from '@vue-dnd-kit/core';
  import { useDraggable } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import { shallowRef } from 'vue';

  const draggableDisabled = shallowRef(false);
  const droppableDisabled = shallowRef(false);

  const { elementRef, handleDragStart } = useDraggable({
    disabled: draggableDisabled,
  });

  const { elementRef: droppableElementRef } = useDroppable({
    disabled: droppableDisabled,
    events: {
      onDrop: () => alert('Item dropped!'),
    },
  });
</script>

<template>
  <ExampleContainer>
    <div class="controls">
      <label class="control-checkbox">
        <input
          type="checkbox"
          v-model="draggableDisabled"
        />
        <span>Disable draggable element</span>
      </label>
      <label class="control-checkbox">
        <input
          type="checkbox"
          v-model="droppableDisabled"
        />
        <span>Disable drop zone</span>
      </label>
    </div>

    <div class="drag-drop-container">
      <div
        ref="elementRef"
        @pointerdown="handleDragStart"
        class="draggable-item"
        :class="{ disabled: draggableDisabled }"
      >
        Drag me to the zone
        <div class="status-badge">
          {{ draggableDisabled ? 'Disabled' : 'Active' }}
        </div>
      </div>

      <div
        ref="droppableElementRef"
        class="droppable-zone"
        :class="{ disabled: droppableDisabled }"
      >
        Drop zone
        <div class="status-badge">
          {{ droppableDisabled ? 'Disabled' : 'Active' }}
        </div>
      </div>
    </div>
  </ExampleContainer>
</template>

<style scoped>
  .controls {
    display: flex;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .control-checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    user-select: none;
  }

  .control-checkbox input[type='checkbox'] {
    width: 1rem;
    height: 1rem;
  }

  .drag-drop-container {
    display: flex;
    justify-content: center;
    gap: 2rem;
  }

  .draggable-item {
    padding: 2rem;
    background-color: #4ade80;
    color: white;
    border-radius: 8px;
    cursor: grab;
    user-select: none;
    transition: all 0.2s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    width: 200px;
    height: 120px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .draggable-item:active {
    cursor: grabbing;
    transform: scale(1.02);
  }

  .draggable-item.disabled {
    background-color: #86efac;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .droppable-zone {
    padding: 2rem;
    background-color: white;
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    width: 200px;
    color: #4b5563;
    height: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
    transition: all 0.2s ease;
  }

  .droppable-zone.disabled {
    background-color: #f3f4f6;
    border-color: #9ca3af;
    cursor: not-allowed;
    opacity: 0.7;
  }

  .status-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    background-color: rgba(255, 255, 255, 0.2);
  }

  .droppable-zone .status-badge {
    background-color: rgba(0, 0, 0, 0.05);
    color: #4b5563;
  }
</style>
