<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, Over } from '@vue-dnd-kit/core';
import FolderIcon from './FolderIcon.vue';

// The folders' overlay: it replaces the messages' chip (its slot, left out) with what
// the drop will do.
const props = defineProps<{ items: DragItem[]; over: Over | null }>();
const folder = computed(() => props.over?.data as { name: string; icon: 'inbox' | 'archive' | 'later' | 'receipts' } | undefined);
const what = computed(() => (props.items.length > 1 ? `${props.items.length} messages` : 'message'));
</script>

<template>
  <div class="pill-box">
    <span v-if="folder" class="pill">
      <FolderIcon :icon="folder.icon" />
      Move {{ what }} to <strong>{{ folder.name }}</strong>
    </span>
  </div>
</template>

<style scoped>
.pill-box {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
}

.pill {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  border-radius: 99px;
  background: #42b883;
  color: #04130c;
  box-shadow: 0 14px 28px -12px rgb(0 0 0 / 0.55);
  font-size: 13px;
  white-space: nowrap;
}
</style>
