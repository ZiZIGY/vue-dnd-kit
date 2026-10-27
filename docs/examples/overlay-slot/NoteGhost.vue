<script setup lang="ts">
import { computed } from 'vue';
import type { DnDStatus, DragItem } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; status: DnDStatus }>();
const note = computed(() => props.items[0]?.item as { text: string });
</script>

<template>
  <!-- A note in hand: tilted while dragged, straight again as it lands ('dropping'). -->
  <div class="ghost" :class="status">
    <span class="kind">Note</span>
    <p>{{ note.text }}</p>
  </div>
</template>

<style scoped>
.ghost {
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 10px 12px;
  border-radius: 4px 4px 18px 4px;
  background: #fcd34d;
  box-shadow: 0 18px 30px -14px rgb(0 0 0 / 0.6);
  color: #3b2a05;
  rotate: -4deg;
  transition: rotate 0.25s;
}

.ghost.dropping {
  rotate: 0deg;
}

.kind {
  font: 700 10px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.6;
}

p {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.35;
}
</style>
