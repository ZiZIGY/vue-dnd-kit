<script setup lang="ts">
  import { computed, inject, useTemplateRef } from 'vue';
  import { makeDroppable, useDnD } from '@vue-dnd-kit/core';
  import QueueList from './QueueList.vue';
  import LibraryTrack from './LibraryTrack.vue';
  import { LIBRARY, LIBRARY_ZONE, PLAYER, formatDuration } from './player';

  const player = inject(PLAYER)!;
  const { active } = useDnD();

  // Dropping a queued track back on the library takes it out of the queue.
  const library = useTemplateRef<HTMLElement>('library');
  const { isOver, isAccepting } = makeDroppable(library, {
    id: LIBRARY_ZONE,
    accept: 'queue',
    onDrop: (event) => event.source?.remove(),
  });

  const nowPlaying = computed(() => (player.queue.value[0] ? player.trackOf(player.queue.value[0]) : null));
  const total = computed(() =>
    formatDuration(player.queue.value.reduce((sum, entry) => sum + player.trackOf(entry).duration, 0)),
  );
  const draggingQueued = computed(() => !!active.value && isAccepting.value);
  const skip = () => player.queue.value.shift();
</script>

<template>
  <div class="pl">
    <header class="pl-now">
      <div
        class="pl-art"
        :style="{ background: nowPlaying?.color ?? 'var(--ui-bg-accented)' }"
      />
      <div class="pl-now-text">
        <small>Now playing</small>
        <strong data-testid="now-playing">{{ nowPlaying ? nowPlaying.title : 'Nothing queued' }}</strong>
        <span>{{ nowPlaying?.artist }}</span>
      </div>
      <div class="pl-progress"><i /></div>
      <button
        type="button"
        class="pl-skip"
        data-testid="skip"
        :disabled="!nowPlaying"
        @click="skip"
      >
        Skip ⏭
      </button>
    </header>

    <div class="pl-section">
      <h3>
        Up next <small>{{ player.queue.value.length }} tracks · {{ total }}</small>
      </h3>
      <QueueList />
    </div>

    <div class="pl-columns">
      <div class="pl-section">
        <h3>
          Library
          <small v-if="draggingQueued">Drop here to remove from the queue</small>
        </h3>
        <ul
          ref="library"
          class="pl-library"
          :class="{ removing: draggingQueued, over: isOver && isAccepting }"
          data-testid="library"
          :data-over="(isOver && isAccepting) || undefined"
        >
          <LibraryTrack
            v-for="track in LIBRARY"
            :key="track.id"
            :track="track"
          />
        </ul>
      </div>
      <div class="pl-section pl-log">
        <h3>Screen reader</h3>
        <ol
          data-testid="announcements"
          aria-hidden="true"
        >
          <li
            v-for="entry in player.log.value"
            :key="entry.id"
            :data-kind="entry.kind"
          >
            {{ entry.text }}
          </li>
        </ol>
      </div>
    </div>
    <pre data-testid="queue-state">{{ player.queue.value.map((entry) => entry.trackId).join(',') }}</pre>
  </div>
</template>

<style scoped>
  .pl {
    width: 1000px;
    padding: 16px;
    border-radius: var(--ui-radius-lg);
    background: var(--ui-surface);
    box-shadow:
      inset 0 0 0 1px var(--ui-border-accented),
      var(--ui-shadow-sm);
    color: var(--ui-text);
  }

  .pl-now {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }

  .pl-art {
    width: 56px;
    height: 56px;
    border-radius: var(--ui-radius);
    box-shadow: var(--ui-shadow-overlay);
  }

  .pl-now-text {
    display: flex;
    flex-direction: column;
    width: 220px;
  }

  .pl-now-text strong {
    color: var(--ui-text-highlighted);
  }

  .pl-now-text small,
  .pl-now-text span {
    color: var(--ui-text-muted);
  }

  .pl-progress {
    flex: 1;
    height: 4px;
    overflow: hidden;
    border-radius: 2px;
    background: var(--ui-bg-accented);
  }

  .pl-progress i {
    display: block;
    width: 38%;
    height: 100%;
    background: var(--ui-primary);
  }

  .pl-skip {
    padding: 6px 14px;
    border: 1px solid var(--ui-border-accented);
    border-radius: var(--ui-radius-sm);
    background: none;
    color: var(--ui-text);
    font: inherit;
    cursor: pointer;
  }

  .pl-skip:hover:not(:disabled) {
    background: var(--ui-bg-elevated);
  }

  .pl-skip:disabled {
    color: var(--ui-text-dimmed);
    cursor: default;
  }

  .pl-section h3 {
    display: flex;
    align-items: baseline;
    gap: 10px;
    margin: 0 0 8px;
    font-size: 14px;
  }

  .pl-section h3 small {
    color: var(--ui-text-muted);
    font-family: var(--font-mono);
    font-weight: 400;
  }

  .pl-columns {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 16px;
    margin-top: 16px;
  }

  .pl-library {
    margin: 0;
    padding: 4px;
    list-style: none;
    border-radius: var(--ui-radius-lg);
    background: var(--ui-bg-muted);
    box-shadow: inset 0 0 0 1px var(--ui-border);
    transition: background 120ms;
  }

  .pl-library.removing {
    box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--ui-danger) 50%, transparent);
  }

  .pl-library.over {
    background: var(--ui-danger-soft);
  }

  .pl-log ol {
    height: 330px;
    margin: 0;
    padding: 8px 8px 8px 28px;
    overflow: auto;
    border-radius: var(--ui-radius-lg);
    background: var(--ui-bg-muted);
    box-shadow: inset 0 0 0 1px var(--ui-border);
    color: var(--ui-text-muted);
    font-size: 12px;
  }

  .pl-log li + li {
    margin-top: 6px;
  }

  .pl-log li[data-kind='onDragCancel'] {
    color: var(--ui-danger);
  }

  .pl-log li[data-kind='onDragEnd'] {
    color: var(--ui-primary);
  }

  pre {
    margin: 12px 0 0;
    color: var(--ui-text-muted);
  }
</style>
