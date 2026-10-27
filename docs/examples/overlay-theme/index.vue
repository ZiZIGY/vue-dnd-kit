<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import NoteBoard from './NoteBoard.vue';

const slowSave = ref(false);
</script>

<template>
  <DnDProvider>
    <div class="desk">
      <!-- `<html data-dnd-dragging="pointer | keyboard">` for the whole drag: the bar reads it in CSS. -->
      <p class="bar">
        <span class="idle">Drag a note to reorder</span>
        <span class="pointer">Release to drop · Esc cancels</span>
        <span class="keyboard">Arrows move · Space drops · Esc cancels</span>
      </p>
      <NoteBoard :slow-save="slowSave" />
      <label class="switch">
        <input v-model="slowSave" type="checkbox" />
        Save on drop (1 s)
      </label>
    </div>
  </DnDProvider>
</template>

<style scoped>
.desk {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.bar {
  margin: 0;
  padding: 7px 14px;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 7%, transparent);
  font: 12px/1 ui-monospace, Menlo, Consolas, monospace;
  transition:
    background 0.2s,
    color 0.2s;
}

.bar .pointer,
.bar .keyboard,
html[data-dnd-dragging] .bar .idle {
  display: none;
}

html[data-dnd-dragging] .bar {
  background: #42b883;
  color: #fff;
}

html[data-dnd-dragging='pointer'] .bar .pointer,
html[data-dnd-dragging='keyboard'] .bar .keyboard {
  display: inline;
}

.switch {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  cursor: pointer;
}

.switch input {
  accent-color: #42b883;
}
</style>
