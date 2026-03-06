<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { motion } from 'motion-v';
  import { makeDraggable } from '@vue-dnd-kit/core';

  export interface Player {
    id: number;
    name: string;
    role: string;
  }

  const props = defineProps<{
    index: number;
    items: Player[];
    player: Player;
    color: string;
  }>();

  const itemRef = useTemplateRef<HTMLElement>('itemRef');

  const { isDragging, isDragOver } = makeDraggable(itemRef, {}, () => [
    props.index,
    props.items,
  ]);

  const isHovered = computed(() => isDragOver.value !== undefined);

  const initials = computed(() =>
    props.player.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  );
</script>

<template>
  <motion.div
    ref="itemRef"
    class="player-card"
    :class="{
      'is-dragging': isDragging,
      'is-hovered': isHovered,
    }"
    :style="{ '--accent': color }"
    :initial="{ scale: 0.85, opacity: 0 }"
    :animate="{ scale: 1, opacity: 1 }"
    :transition="{ type: 'spring', stiffness: 320, damping: 28 }"
  >
    <div class="avatar">{{ initials }}</div>
    <div class="info">
      <span class="name">{{ player.name }}</span>
      <span class="role">{{ player.role }}</span>
    </div>
    <div
      v-if="isHovered"
      class="swap-badge"
    >
      ⇄
    </div>
  </motion.div>
</template>

<style scoped>
  .player-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--accent) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--accent) 25%, transparent);
    cursor: grab;
    user-select: none;
    touch-action: none;
    transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
  }

  .player-card:active {
    cursor: grabbing;
  }

  .is-dragging {
    opacity: 0.5 !important;
  }

  .is-hovered {
    background: color-mix(in srgb, var(--accent) 22%, transparent);
    border-color: color-mix(in srgb, var(--accent) 55%, transparent);
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 30%, transparent);
  }

  .avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: color-mix(in srgb, var(--accent) 55%, transparent);
    color: white;
    font-size: 13px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    letter-spacing: 0.5px;
  }

  .info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    gap: 1px;
  }

  .name {
    font-weight: 600;
    font-size: 14px;
    color: var(--vp-c-text-1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .role {
    font-size: 11px;
    color: var(--vp-c-text-3);
  }

  .swap-badge {
    font-size: 18px;
    color: var(--accent);
    flex-shrink: 0;
    line-height: 1;
  }
</style>
