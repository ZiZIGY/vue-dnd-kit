<script setup lang="ts">
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import type { DeckCard } from '~/data/deck';

  /**
   * A card of the deck. Its angle and size follow its place, so the deck fans out around
   * the middle; `rotate` and `scale` transition on their own, while the library slides the
   * cards along with `translate`.
   */
  const props = defineProps<{ card: DeckCard; count: number }>();
  const el = useTemplateRef<HTMLElement>('el');
  const { index, isPlaceholder } = makeSortableItem(el, { item: () => props.card });

  const offset = computed(() => index.value - (props.count - 1) / 2);
  const style = computed(() => ({
    rotate: `y ${offset.value * -12}deg`,
    scale: String(1 - Math.abs(offset.value) * 0.05),
    zIndex: String(20 - Math.round(Math.abs(offset.value) * 2)),
  }));
</script>

<template>
  <div
    ref="el"
    class="deck-item relative -mx-3 h-[220px] w-[150px] shrink-0 cursor-grab select-none rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-(--ui-primary) focus-visible:ring-offset-4 focus-visible:ring-offset-(--ui-bg) lg:-mx-2 lg:h-[260px] lg:w-[180px]"
    :style="style"
  >
    <HomeDeckFace
      :card="card"
      :class="isPlaceholder ? 'opacity-25' : ''"
    />
  </div>
</template>

<style scoped>
  .deck-item {
    transition:
      rotate 0.55s var(--ease-out-expo),
      scale 0.55s var(--ease-out-expo);
  }
</style>
