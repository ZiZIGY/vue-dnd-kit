<script setup lang="ts">
import { ref } from 'vue';
import { DnDProvider } from '@vue-dnd-kit/core';
import Shortcuts from './Shortcuts.vue';

const attributes = ref(true);
</script>

<template>
  <DnDProvider>
    <div class="demo">
      <label class="switch">
        <input v-model="attributes" type="checkbox" />
        attributes: {{ attributes }}
      </label>
      <Shortcuts :attributes="attributes" />
    </div>
  </DnDProvider>
</template>

<style scoped>
.demo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.switch {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 9px;
  background: color-mix(in srgb, currentColor 7%, transparent);
  font: 12px/1.2 ui-monospace, Menlo, Consolas, monospace;
  cursor: pointer;
}

.switch:has(input:focus-visible) {
  outline: 2px solid #42b883;
}

.switch input {
  accent-color: #42b883;
}
</style>
