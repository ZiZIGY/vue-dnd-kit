<script setup lang="ts">
  import { Draggable } from '@vue-dnd-kit/components';
</script>

<template>
  <div>
    <Draggable
      v-slot="{ handleDragStart, handleToggleSelect, isSelected }"
      tag="div"
      v-for="i in 10"
      :key="i"
      class="draggable"
      prevent-root-drag
    >
      {{ i }}
      <input
        type="checkbox"
        @change="handleToggleSelect"
        :checked="isSelected"
      />
      <button
        @pointerdown.self="handleDragStart"
        @keydown.space.self="handleDragStart"
      >
        ||
      </button>
    </Draggable>
  </div>
</template>

<style scoped>
  .draggable {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
  }
  pre {
    position: fixed;
    top: 0;
    left: 0;
    height: 100svh;
    overflow: scroll;
    width: 300px;
    text-align: left;
  }
</style>
