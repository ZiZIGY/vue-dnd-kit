<script setup lang="ts">
  import { computed, inject, useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import { PLAYER, formatDuration, type QueueEntry } from './player';

  const props = defineProps<{ entry: QueueEntry; index: number }>();
  const player = inject(PLAYER)!;
  const el = useTemplateRef<HTMLElement>('el');
  const { isPlaceholder } = makeSortableItem(el, { id: () => props.entry.id, data: () => props.entry });

  const track = computed(() => player.trackOf(props.entry));
  const playing = computed(() => props.index === 0);

  // Delete or Backspace on a focused entry takes it out of the queue.
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key !== 'Delete' && event.key !== 'Backspace') return;
    event.preventDefault();
    const next = (el.value?.nextElementSibling ?? el.value?.previousElementSibling) as HTMLElement | null;
    player.remove(props.entry.id);
    next?.focus();
  };
</script>

<template>
  <li
    ref="el"
    class="pl-entry"
    :class="{ playing, placeholder: isPlaceholder }"
    :data-id="entry.id"
    :data-track="entry.trackId"
    :aria-label="`${track.title} by ${track.artist}${playing ? ', now playing' : ''}`"
    @keydown="onKeydown"
  >
    <span
      class="pl-cover"
      :style="{ background: track.color }"
    >
      <span
        v-if="playing"
        class="pl-bars"
        aria-hidden="true"
        ><i /><i /><i
      /></span>
      <b v-else>{{ index + 1 }}</b>
    </span>
    <span class="pl-entry-text">
      <strong>{{ track.title }}</strong>
      <small>{{ track.artist }} · {{ formatDuration(track.duration) }}</small>
    </span>
    <button
      type="button"
      class="pl-remove"
      tabindex="-1"
      :aria-label="`Remove ${track.title} from the queue`"
      :data-testid="`remove-${entry.id}`"
      @click="player.remove(entry.id)"
    >
      ×
    </button>
  </li>
</template>

<style scoped>
  .pl-entry {
    position: relative;
    display: flex;
    flex: none;
    align-items: center;
    gap: 10px;
    width: 172px;
    padding: 8px;
    border-radius: 10px;
    background: #1e293b;
    color: #e2e8f0;
    cursor: grab;
    user-select: none;
  }

  .pl-entry:focus-visible {
    outline: 2px solid #a78bfa;
    outline-offset: 2px;
  }

  .pl-entry.playing {
    background: #312e81;
  }

  /* The slot keeps its size; only a dashed frame is left. */
  .pl-entry.placeholder {
    opacity: 1;
    background: transparent;
    box-shadow: inset 0 0 0 2px rgb(167 139 250 / 0.6);
  }

  .pl-entry.placeholder > * {
    visibility: hidden;
  }

  .pl-cover {
    display: flex;
    flex: none;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 6px;
    color: rgb(255 255 255 / 0.85);
  }

  .pl-bars {
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 16px;
  }

  .pl-bars i {
    width: 3px;
    height: 100%;
    background: #fff;
    animation: pl-bounce 900ms ease-in-out infinite;
  }

  .pl-bars i:nth-child(2) {
    animation-delay: -300ms;
  }

  .pl-bars i:nth-child(3) {
    animation-delay: -600ms;
  }

  @keyframes pl-bounce {
    0%,
    100% {
      transform: scaleY(0.3);
    }

    50% {
      transform: scaleY(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pl-bars i {
      animation: none;
    }
  }

  .pl-entry-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .pl-entry-text strong,
  .pl-entry-text small {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pl-entry-text small {
    color: #94a3b8;
  }

  .pl-remove {
    position: absolute;
    top: 2px;
    right: 4px;
    padding: 0 4px;
    border: 0;
    background: none;
    color: #64748b;
    font-size: 14px;
    cursor: pointer;
  }

  .pl-remove:hover {
    color: #f87171;
  }
</style>
