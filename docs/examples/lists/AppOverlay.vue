<script setup lang="ts">
import { computed } from 'vue';
import type { DnDStatus, DragItem } from '@vue-dnd-kit/core';
import AppIcon from './AppIcon.vue';

// The app in hand: only its icon, lifted; the name stays behind.
// The overlay's props it needs (see `OverlayProps`): the dragged items and the status.
const props = defineProps<{ items: DragItem[]; status: DnDStatus }>();
const app = computed(() => props.items[0]?.item as { id: string } | undefined);
</script>

<template>
  <div class="overlay">
    <AppIcon v-if="app" :id="app.id" :lifted="status === 'dragging'" />
  </div>
</template>

<style scoped>
.overlay {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
