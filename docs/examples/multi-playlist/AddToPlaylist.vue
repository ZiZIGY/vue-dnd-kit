<script setup lang="ts">
import { computed } from 'vue';
import type { DragItem, Over } from '@vue-dnd-kit/core';

// The playlists' overlay. It leaves its slot (the column of dragged rows) out: over a
// playlist the songs become one chip that says what the drop does.
const props = defineProps<{ items: DragItem[]; over: Over | null }>();
const playlist = computed(() => props.over?.data as { name: string; hue: number } | undefined);
const what = computed(() => (props.items.length === 1 ? '1 song' : `${props.items.length} songs`));
</script>

<template>
  <div class="chip-box">
    <span v-if="playlist" class="chip">
      <span class="cover" :style="{ '--hue': playlist.hue }" aria-hidden="true">♫</span>
      Add {{ what }} to <strong>{{ playlist.name }}</strong>
    </span>
  </div>
</template>

<style scoped>
/* The box keeps the row's size: the chip sits in its middle, by the pointer. */
.chip-box {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
}

.chip {
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
  width: max-content;
  max-width: 100%;
  height: 40px;
  overflow: hidden;
  padding: 0 12px 0 5px;
  border-radius: 7px;
  background: #42b883;
  color: #04130c;
  font-size: 13px;
  white-space: nowrap;
  box-shadow: 0 14px 28px -12px rgb(0 0 0 / 0.6);
}

.cover {
  display: grid;
  flex: none;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 5px;
  background: linear-gradient(135deg, hsl(var(--hue) 70% 55%), hsl(calc(var(--hue) + 60) 65% 30%));
  color: #fff;
}
</style>
