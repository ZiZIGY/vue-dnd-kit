<script setup lang="ts">
  /**
   * The mini-map: a live card per list, tree and drop target of the page (and one for the
   * plain draggables outside them), in page order. Clicking an item chooses it (for the
   * joystick, the details, a highlight on the page); a double click scrolls the page to it.
   */
  import { computed } from 'vue';
  import type { Key, NodeRef } from '../../src/protocol';
  import { frame, select, send, store } from '../lib/connection';
  import ZoneCard from './ZoneCard.vue';

  const zones = computed(() => {
    const zones = frame.value?.zones ?? [];
    // Reading order: top to bottom, then left to right.
    return [...zones].sort((a, b) => a.rect.y - b.rect.y || a.rect.x - b.rect.x);
  });

  const chosen = (provider: string): Key | null => {
    const node = store.selected;
    return node?.provider === provider && node.kind === 'draggable' ? node.id : null;
  };

  const node = (provider: string, id: Key): NodeRef => ({ provider, kind: 'draggable', id });
</script>

<template>
  <div class="map" data-testid="mini-map">
    <p v-if="!frame" class="empty">Waiting for the page…</p>
    <p v-else-if="!zones.length" class="empty">No list, tree or drop target on the page.</p>
    <div v-else class="grid">
      <ZoneCard
        v-for="zone in zones"
        :key="`${zone.provider}/${zone.kind}/${String(zone.id)}`"
        :zone="zone"
        :frame="frame!"
        :chosen="chosen(zone.provider)"
        @pick="(id) => select(node(zone.provider, id))"
        @open="(id) => send({ type: 'reveal', node: node(zone.provider, id) })"
      />
    </div>
  </div>
</template>

<style scoped>
  .map {
    height: 100%;
    overflow: auto;
    padding: 8px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    gap: 8px;
    align-items: start;
  }
</style>
