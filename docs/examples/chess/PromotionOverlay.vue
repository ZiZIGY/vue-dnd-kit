<script setup lang="ts">
import { computed, inject } from 'vue';
import type { Active, DnDStatus } from '@vue-dnd-kit/core';
import PieceArt from './PieceArt.vue';
import { NAMES, type Piece } from './chess';
import { GAME } from './game';

// The overlay of a last-rank square: it takes the place of the pawn in hand (the drag's own
// overlay is its default slot, left out here) and shows the piece the pawn becomes. It
// stays while the drop waits for the picker and while it lands.
const props = defineProps<{ active: Active; status: DnDStatus }>();
const game = inject(GAME)!;
const pawn = computed(() => props.active.data as Piece);
// A queen unless told otherwise: then the piece pointed at in the picker, or picked.
const kind = computed(() => (props.status === 'dragging' ? (game.planned.value?.promotion ?? 'Q') : game.choice.value));
</script>

<template>
  <div class="promotion" :class="status">
    <!-- Keyed: each new piece pops in. -->
    <PieceArt :key="kind" :kind="kind" :color="pawn.color" />
    <span v-if="status === 'dragging'" class="tag">Becomes a {{ NAMES[kind] }}</span>
  </div>
</template>

<style scoped>
.promotion {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 4%;
  box-sizing: border-box;
}

/* A golden halo: something is about to happen. */
.promotion::before {
  content: '';
  position: absolute;
  inset: -10%;
  border-radius: 50%;
  background: radial-gradient(circle, rgb(255 214 10 / 0.75), rgb(255 214 10 / 0) 70%);
  animation: glow 1.2s ease-in-out infinite alternate;
}

.promotion :deep(.art) {
  position: relative;
  scale: 1.18;
  filter: drop-shadow(0 12px 9px rgb(0 0 0 / 0.38));
  animation: pop 0.25s cubic-bezier(0.3, 1.6, 0.6, 1);
  transition:
    scale 0.2s,
    filter 0.2s;
}

/* Set down as it lands. */
.promotion.dropping :deep(.art) {
  scale: 1;
  filter: drop-shadow(0 1.5px 1px rgb(0 0 0 / 0.3));
}

.tag {
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  translate: -50% 0;
  padding: 4px 8px;
  border-radius: 99px;
  background: #b38600;
  color: #fff;
  font: 600 11px/1 system-ui, sans-serif;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.3);
}

@keyframes pop {
  from {
    scale: 0.5;
  }
}

@keyframes glow {
  from {
    opacity: 0.55;
  }
}
</style>
