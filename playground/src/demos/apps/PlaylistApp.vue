<script setup lang="ts">
  import { provide } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import PlaylistView from '../../components/apps/playlist/PlaylistView.vue';
  import { PLAYER, createPlayer } from '../../components/apps/playlist/player';

  // The announcements name tracks and queue positions; they are also shown in a log.
  const player = createPlayer();
  provide(PLAYER, player);
</script>

<template>
  <section>
    <h2 class="pl-heading">Playlist</h2>
    <p class="pl-hint">
      Everything works from the keyboard: Tab to a track, Space to pick it up, arrows to move (Up from the library
      enters the queue), Space to drop, Escape to cancel. Delete removes a queued track.
    </p>
    <DnDProvider :announcements="player.announcements">
      <PlaylistView />
    </DnDProvider>
  </section>
</template>

<style scoped>
  .pl-heading {
    margin: 0 0 4px;
  }

  .pl-hint {
    max-width: 760px;
    margin: 0 0 12px;
    color: #475569;
  }
</style>
