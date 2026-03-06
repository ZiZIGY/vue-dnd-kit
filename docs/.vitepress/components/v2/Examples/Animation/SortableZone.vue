<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import AnimatedCard from './AnimatedCard.vue';

  interface Card {
    id: number;
    label: string;
    emoji: string;
    color: string;
  }

  const props = defineProps<{ items: Card[] }>();
  const emit = defineEmits<{ drop: [e: IDragEvent] }>();

  const zoneRef = useTemplateRef<HTMLElement>('zoneRef');

  makeDroppable(
    zoneRef,
    {
      events: {
        onDrop(e: IDragEvent) {
          emit('drop', e);
        },
      },
    },
    () => props.items
  );
</script>

<template>
  <div
    ref="zoneRef"
    class="zone"
  >
    <TransitionGroup name="list">
      <AnimatedCard
        v-for="(card, index) in items"
        :key="card.id"
        :card="card"
        :index="index"
        :items="items"
      />
    </TransitionGroup>
  </div>
</template>

<style scoped>
  .zone {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
    border-radius: 0.875rem;
    border: 1px dashed var(--vp-c-divider);
    min-height: 80px;
  }

  .list-move {
    transition: transform 0.28s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .list-enter-active,
  .list-leave-active {
    transition: opacity 0.2s ease, transform 0.28s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(-12px);
  }

  .list-leave-active {
    position: absolute;
    width: 100%;
    pointer-events: none;
  }
</style>
