<script setup lang="ts">
import type { DnDStatus } from '@vue-dnd-kit/core';

// Around the pile (its slot) over a column with a limit: whether every card fits.
defineProps<{ count: number; room: number; limit: number; status: DnDStatus }>();
</script>

<template>
  <div class="fit">
    <slot />
    <span v-if="status === 'dragging'" class="badge" :class="{ partial: room < count }">
      {{ room >= count ? `Fits · WIP ${limit}` : `Only ${room} of ${count} fit · WIP ${limit}` }}
    </span>
  </div>
</template>

<style scoped>
.fit {
  position: relative;
  width: 100%;
  height: 100%;
}

.badge {
  position: absolute;
  top: calc(100% + 16px);
  left: 0;
  padding: 5px 9px;
  border-radius: 7px;
  background: #42b883;
  color: #04130c;
  font: 600 12px/1 system-ui, sans-serif;
  white-space: nowrap;
}

.badge.partial {
  background: #f59e0b;
}
</style>
