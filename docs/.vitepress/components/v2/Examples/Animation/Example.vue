<script setup lang="ts">
  import { ref } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import AnimatedPreview from './AnimatedPreview.vue';
  import SortableZone from './SortableZone.vue';

  interface Card {
    id: number;
    label: string;
    emoji: string;
    color: string;
  }

  const items = ref<Card[]>([
    { id: 1, label: 'Spring physics', emoji: '🌊', color: '#6366f1' },
    { id: 2, label: 'Smooth drag', emoji: '🚀', color: '#ec4899' },
    { id: 3, label: 'Pop-in effect', emoji: '💫', color: '#14b8a6' },
    { id: 4, label: 'Motion library', emoji: '🎯', color: '#f59e0b' },
    { id: 5, label: 'Reorder me', emoji: '✨', color: '#8b5cf6' },
  ]);

  function onDrop(e: IDragEvent) {
    const r = e.helpers.suggestSort('vertical');
    if (r) items.value = r.targetItems as Card[];
  }
</script>

<template>
  <ExampleContainer>
    <DnDProvider>
      <template #preview>
        <AnimatedPreview />
      </template>

      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-1">
          <h3 class="text-base font-semibold">Animated drag preview</h3>
          <p class="text-xs sm:text-sm text-(--vp-c-text-2)">
            Drag cards to reorder. The preview pops in with a spring animation via
            <b>motion-v</b>.
          </p>
        </div>

        <SortableZone
          :items="items"
          @drop="onDrop"
        />
      </div>
    </DnDProvider>
  </ExampleContainer>
</template>
