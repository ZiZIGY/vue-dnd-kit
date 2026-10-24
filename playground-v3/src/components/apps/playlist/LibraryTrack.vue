<script setup lang="ts">
  import { computed, inject, useTemplateRef } from 'vue';
  import { makeDraggable } from '@vue-dnd-kit/core';
  import { PLAYER, TRACK_TYPE, formatDuration, type Track } from './player';

  const props = defineProps<{ track: Track }>();
  const player = inject(PLAYER)!;
  const el = useTemplateRef<HTMLElement>('el');

  // A plain draggable: the queue's createItem turns it into a queue entry.
  const { isDragging } = makeDraggable(el, {
    id: () => `lib-${props.track.id}`,
    type: TRACK_TYPE,
    data: () => props.track,
  });

  const queued = computed(() => player.queue.value.filter((entry) => entry.trackId === props.track.id).length);
</script>

<template>
  <li
    ref="el"
    class="pl-track"
    :class="{ dragging: isDragging }"
    :data-id="`lib-${track.id}`"
    :aria-label="`${track.title} by ${track.artist}`"
  >
    <span
      class="pl-dot"
      :style="{ background: track.color }"
    />
    <span class="pl-track-title">{{ track.title }}</span>
    <span class="pl-track-artist">{{ track.artist }}</span>
    <span class="pl-queued"><template v-if="queued">queued{{ queued > 1 ? ` ×${queued}` : '' }}</template></span>
    <span class="pl-time">{{ formatDuration(track.duration) }}</span>
    <button
      type="button"
      class="pl-add"
      :aria-label="`Add ${track.title} to the end of the queue`"
      :data-testid="`add-${track.id}`"
      @click="player.add(track.id)"
    >
      +
    </button>
  </li>
</template>

<style scoped>
  .pl-track {
    display: grid;
    grid-template-columns: 12px 1.2fr 1fr 72px 44px 28px;
    align-items: center;
    gap: 12px;
    padding: 8px 10px;
    border-radius: 8px;
    color: #e2e8f0;
    cursor: grab;
    user-select: none;
  }

  .pl-track:hover {
    background: rgb(255 255 255 / 0.05);
  }

  .pl-track:focus-visible {
    outline: 2px solid #a78bfa;
  }

  .pl-track.dragging {
    opacity: 0.5;
  }

  .pl-dot {
    width: 12px;
    height: 12px;
    border-radius: 3px;
  }

  .pl-track-title {
    font-weight: 600;
  }

  .pl-track-artist,
  .pl-time {
    color: #94a3b8;
  }

  .pl-time {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .pl-queued:empty {
    visibility: hidden;
  }

  .pl-queued {
    justify-self: start;
    padding: 0 6px;
    border-radius: 999px;
    background: rgb(167 139 250 / 0.2);
    color: #c4b5fd;
    font-size: 11px;
  }

  .pl-add {
    width: 26px;
    height: 26px;
    border: 1px solid #475569;
    border-radius: 50%;
    background: none;
    color: #e2e8f0;
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
  }

  .pl-add:hover {
    border-color: #a78bfa;
    color: #c4b5fd;
  }
</style>
