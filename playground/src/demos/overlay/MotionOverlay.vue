<script setup lang="ts">
  import { computed } from 'vue';
  import { motion } from 'motion-v';
  import type { OverlayProps } from '@vue-dnd-kit/core';
  import { ICONS, cardOf } from './gallery';

  // Recipe: motion-v inside an overlay component. The library only renders the component;
  // springs and gestures are motion's.
  const props = defineProps<OverlayProps>();
  const card = computed(() => cardOf(props.items[0]));

  const resting = { scale: 1, rotate: 0, y: 0 };
  // Picked up: a spring "lift". While dropping it settles back, in step with the drop animation.
  const lifted = { scale: 1.06, rotate: -2.5, y: -4 };
  const target = computed(() => (props.status === 'dropping' ? resting : lifted));
</script>

<template>
  <motion.div
    class="motion-overlay"
    data-overlay-kind="motion"
    :data-status="status"
    :initial="resting"
    :animate="target"
    :transition="{ type: 'spring', stiffness: 520, damping: 16, mass: 0.8 }"
  >
    <span class="icon">{{ card ? ICONS[card.kind] : '' }}</span>
    <strong>{{ card?.title }}</strong>
  </motion.div>
</template>

<style scoped>
  .motion-overlay {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 100%;
    padding: 0 12px;
    box-sizing: border-box;
    background: #fff;
    border: 1px solid #a78bfa;
    border-radius: 10px;
    box-shadow: 0 18px 30px -12px rgb(76 29 149 / 0.45);
  }

  .icon {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    border-radius: 6px;
    background: #8b5cf6;
    color: #fff;
  }
</style>
