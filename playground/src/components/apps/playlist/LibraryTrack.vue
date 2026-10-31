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
    border-radius: var(--ui-radius);
    color: var(--ui-text);
    cursor: grab;
    user-select: none;
  }

  .pl-track:hover {
    background: var(--ui-bg-elevated);
  }

  .pl-track:focus-visible {
    outline: 2px solid var(--ui-focus);
  }

  /* The row has no background of its own: the copy in the overlay gets one. */
  [data-dnd-overlay] .pl-track {
    background: var(--ui-bg-elevated);
    box-shadow:
      inset 0 0 0 1px var(--ui-border-accented),
      var(--ui-shadow-overlay);
  }

  .pl-track.dragging {
    opacity: 0.5;
  }

  .pl-dot {
    width: 12px;
    height: 12px;
    border-radius: var(--ui-radius-sm);
  }

  .pl-track-title {
    color: var(--ui-text-highlighted);
    font-weight: 600;
  }

  .pl-track-artist,
  .pl-time {
    color: var(--ui-text-muted);
  }

  .pl-time {
    font-family: var(--font-mono);
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
    border-radius: var(--ui-radius-sm);
    background: var(--ui-primary-soft);
    color: var(--ui-primary);
    font-family: var(--font-mono);
    font-size: 11px;
  }

  .pl-add {
    width: 26px;
    height: 26px;
    /* The browser's padding: the page's plain-button padding (style.css) makes up for a thinner border. */
    padding: 1px 6px;
    border: 1px solid var(--ui-border-accented);
    border-radius: var(--ui-radius-sm);
    background: var(--ui-bg);
    color: var(--ui-text);
    font-size: 16px;
    line-height: 1;
    cursor: pointer;
  }

  .pl-add:hover {
    border-color: var(--ui-primary);
    color: var(--ui-primary);
  }
</style>
