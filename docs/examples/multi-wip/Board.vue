<script setup lang="ts">
import { ref } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';
import WipColumn from './WipColumn.vue';
import { COLUMNS } from './board';

const columns = ref(COLUMNS.map((column) => ({ ...column, cards: [...column.cards] })));
const { selection } = useDnD();
const notice = ref('');
</script>

<template>
  <div class="board-wrap">
    <p class="bar">
      <span>{{ selection.ids.size ? `${selection.ids.size} selected` : 'Tick a few cards, then drag one' }}</span>
      <!-- Keyed: a new notice slides in. -->
      <span v-if="notice" :key="notice" class="notice" role="status">{{ notice }}</span>
    </p>
    <div class="board">
      <WipColumn v-for="column in columns" :key="column.id" :column="column" @notice="(text) => (notice = text)" />
    </div>
  </div>
</template>

<style scoped>
.board-wrap {
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  font-size: 13px;
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  height: 28px;
  margin: 0 0 10px;
  font-size: 12px;
  opacity: 0.85;
}

.notice {
  padding: 4px 9px;
  border-radius: 6px;
  background: color-mix(in srgb, #f59e0b 22%, transparent);
  color: #f59e0b;
  font-weight: 600;
  animation: notice 0.3s ease-out;
}

@keyframes notice {
  from {
    opacity: 0;
    translate: 0 4px;
  }
}

.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

@media (max-width: 560px) {
  .board {
    grid-template-columns: 1fr;
  }
}
</style>
