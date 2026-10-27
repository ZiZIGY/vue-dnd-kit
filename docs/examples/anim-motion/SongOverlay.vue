<script setup lang="ts">
import { computed, watch } from 'vue';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity } from 'motion-v';
import { useDnD, type DnDStatus, type DragItem } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; status: DnDStatus }>();
const song = computed(() => props.items[0]?.item as { title: string; artist: string; length: string; hue: number });

// The overlay lives under the provider, so it can read the drag: the pointer's speed
// swings the card like something held by its top edge. Still, it hangs straight.
const { pointer } = useDnD();
const x = useMotionValue(pointer.value?.x ?? 0);
watch(
  () => pointer.value?.x,
  (value) => value !== undefined && x.set(value),
);
const swing = useSpring(useTransform(useVelocity(x), [-1500, 0, 1500], [-12, 0, 12]), { stiffness: 350, damping: 18 });
const calm = useReducedMotion();
</script>

<template>
  <motion.div
    class="song-overlay"
    :style="{ '--hue': song.hue, rotate: calm ? 0 : swing }"
    :initial="{ scale: 1 }"
    :animate="{ scale: status === 'dropping' || calm ? 1 : 1.06 }"
    :transition="{ type: 'spring', stiffness: 500, damping: 22 }"
  >
    <span class="cover" />
    <span class="text">
      <strong>{{ song.title }}</strong>
      <small>{{ song.artist }}</small>
    </span>
    <span class="length">{{ song.length }}</span>
  </motion.div>
</template>

<style scoped>
.song-overlay {
  display: flex;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 8px 12px 8px 8px;
  border-radius: 12px;
  background: Canvas;
  box-shadow:
    0 0 0 1.5px #42b883,
    0 20px 36px -14px rgb(0 0 0 / 0.6);
  transform-origin: 50% 0;
}

.cover {
  flex: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: linear-gradient(135deg, hsl(var(--hue) 75% 62%), hsl(calc(var(--hue) + 50) 70% 38%));
}

.text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

strong {
  font-size: 13px;
  font-weight: 600;
}

small {
  font-size: 11px;
  opacity: 0.6;
}

.length {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}
</style>
