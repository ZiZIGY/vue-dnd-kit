<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeSortableList, useDnD, type Key } from '@vue-dnd-kit/core';
import TrackRow from './TrackRow.vue';
import PlaylistLink from './PlaylistLink.vue';
import { PLAYLISTS, QUEUE } from './music';

const queue = ref(QUEUE.map((track) => ({ ...track })));
const playlists = ref(PLAYLISTS.map((playlist) => ({ ...playlist, tracks: [...playlist.tracks] })));
const playing = 't3';

const list = useTemplateRef<HTMLElement>('list');
// `multiple: 'group'` (the default): the picked tracks leave their places and move through
// the queue as one block, and the overlay shows them all.
const { items } = makeSortableList(list, { items: queue });

// Click, Ctrl/Cmd-click and Shift-click, as in a music app.
const { selection } = useDnD();
let anchor: string | null = null;
const pick = (id: string, event: MouseEvent) => {
  const ids = items.value.map((track) => track.id);
  if (event.shiftKey && anchor) {
    const [a, b] = [ids.indexOf(anchor), ids.indexOf(id)];
    selection.set(ids.slice(Math.min(a, b), Math.max(a, b) + 1));
    return;
  }
  if (event.ctrlKey || event.metaKey) selection.toggle(id);
  else selection.set([id]);
  anchor = id;
};

const notice = ref('');
const add = (playlistId: string, ids: Key[]) => {
  const playlist = playlists.value.find((entry) => entry.id === playlistId)!;
  const added = ids.map(String).filter((id) => !playlist.tracks.includes(id));
  playlist.tracks.push(...added);
  notice.value = added.length
    ? `Added ${added.length === 1 ? '1 song' : `${added.length} songs`} to ${playlist.name}`
    : `Already in ${playlist.name}`;
  selection.clear();
};
</script>

<template>
  <div class="player">
    <aside class="sidebar">
      <span class="caption">Your library</span>
      <PlaylistLink v-for="playlist in playlists" :key="playlist.id" :playlist="playlist" @add="(ids) => add(playlist.id, ids)" />
    </aside>
    <section class="queue">
      <header>
        <strong>Queue</strong>
        <span class="hint">{{ selection.ids.size ? `${selection.ids.size} selected` : 'Shift- or Ctrl-click to pick several' }}</span>
      </header>
      <ol ref="list" class="tracks">
        <TrackRow
          v-for="(track, index) in items"
          :key="track.id"
          :track="track"
          :number="index + 1"
          :playing="track.id === playing"
          @pick="(event) => pick(track.id, event)"
        />
      </ol>
      <!-- Keyed: a new notice slides in. -->
      <p v-if="notice" :key="notice" class="notice" role="status">{{ notice }}</p>
    </section>
  </div>
</template>

<style scoped>
.player {
  display: grid;
  grid-template-columns: 170px 1fr;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  font-size: 13px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 8px;
  border-right: 1px solid color-mix(in srgb, currentColor 8%, transparent);
}

.caption {
  margin: 0 6px 6px;
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}

.queue {
  position: relative;
  padding: 12px;
}

header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 0 6px 8px;
}

header strong {
  font-size: 16px;
}

.hint {
  font-size: 11px;
  opacity: 0.55;
}

.tracks {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.notice {
  position: absolute;
  bottom: 10px;
  left: 50%;
  margin: 0;
  padding: 7px 12px;
  border-radius: 8px;
  background: #42b883;
  color: #04130c;
  font-weight: 600;
  white-space: nowrap;
  translate: -50% 0;
  animation: notice 3s ease forwards;
  pointer-events: none;
}

@keyframes notice {
  0% {
    opacity: 0;
    translate: -50% 8px;
  }

  8%,
  85% {
    opacity: 1;
    translate: -50% 0;
  }

  100% {
    opacity: 0;
  }
}

@media (max-width: 560px) {
  .player {
    grid-template-columns: 1fr;
  }

  .sidebar {
    flex-direction: row;
    flex-wrap: wrap;
    border-right: 0;
    border-bottom: 1px solid color-mix(in srgb, currentColor 8%, transparent);
  }

  .caption {
    width: 100%;
  }
}
</style>
