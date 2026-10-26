<script setup lang="ts">
  import type { OverlayProps } from '@vue-dnd-kit/core';
  import type { DeckCard } from '~/data/deck';

  /** The card in hand: flat, lifted and slightly turned, whatever angle it had in the deck. */
  const props = defineProps<OverlayProps>();
  const card = computed(() => props.items[0]?.item as DeckCard | undefined);
</script>

<template>
  <div
    v-if="card"
    class="size-full -rotate-3 scale-[1.06]"
  >
    <HomeDeckFace
      :card="card"
      lifted
    />
  </div>
</template>
