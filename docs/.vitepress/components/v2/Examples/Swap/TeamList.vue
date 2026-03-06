<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeDroppable } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import PlayerCard from './PlayerCard.vue';
  import type { Player } from './PlayerCard.vue';

  const props = defineProps<{
    title: string;
    subtitle: string;
    items: Player[];
    color: string;
    onDrop?: (e: IDragEvent) => void;
  }>();

  const listRef = useTemplateRef<HTMLElement>('listRef');

  makeDroppable(
    listRef,
    {
      events: {
        onDrop(e) {
          props.onDrop?.(e);
        },
      },
    },
    () => props.items
  );
</script>

<template>
  <div class="team-list">
    <div
      class="team-header"
      :style="{ '--color': color }"
    >
      <div class="team-title">{{ title }}</div>
      <div class="team-meta">
        <span class="team-subtitle">{{ subtitle }}</span>
        <span class="team-count">{{ items.length }} members</span>
      </div>
    </div>

    <div
      ref="listRef"
      class="dropzone"
      :style="{ '--color': color }"
    >
      <PlayerCard
        v-for="(player, index) in items"
        :key="player.id"
        :index="index"
        :items="items"
        :player="player"
        :color="color"
      />

      <div
        v-if="items.length === 0"
        class="empty-hint"
      >
        Drop players here
      </div>
    </div>
  </div>
</template>

<style scoped>
  .team-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    flex: 1;
    min-width: 0;
    position: relative;
  }

  .team-header {
    padding: 10px 14px;
    border-radius: 8px;
    background: color-mix(in srgb, var(--color) 12%, transparent);
    border: 1px solid color-mix(in srgb, var(--color) 20%, transparent);
  }

  .team-title {
    font-weight: 700;
    font-size: 15px;
    color: var(--color);
  }

  .team-meta {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2px;
  }

  .team-subtitle {
    font-size: 11px;
    color: var(--vp-c-text-3);
  }

  .team-count {
    font-size: 11px;
    font-weight: 600;
    color: var(--color);
    opacity: 0.7;
  }

  .dropzone {
    flex: 1;
    min-height: 80px;
    padding: 10px;
    border-radius: 10px;
    border: 1px dashed color-mix(in srgb, var(--color) 30%, transparent);
    background: color-mix(in srgb, var(--color) 5%, transparent);
    transition: border-color 0.2s, background 0.2s;
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
  }

  .empty-hint {
    text-align: center;
    padding: 24px;
    color: var(--vp-c-text-3);
    font-size: 13px;
  }
</style>
