<script setup lang="ts">
import { computed, watch } from 'vue';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity } from 'motion-v';
import { useDnD, type DnDStatus, type DragItem } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; status: DnDStatus }>();
const flag = computed(() => props.items[0]?.item as { letter: string; hue: number });

// The overlay lives under the provider, so it can read the drag: the pointer's speed
// swings the flag, held by its top edge. Still, it hangs straight.
const { pointer } = useDnD();
const x = useMotionValue(pointer.value?.x ?? 0);
watch(
  () => pointer.value?.x,
  (value) => value !== undefined && x.set(value),
);
const swing = useSpring(useTransform(useVelocity(x), [-1500, 0, 1500], [-25, 0, 25]), { stiffness: 300, damping: 14 });
const calm = useReducedMotion();
</script>

<template>
  <motion.div
    class="flag-overlay"
    :style="{ '--hue': flag.hue, rotate: calm ? 0 : swing }"
    :initial="{ scale: 1 }"
    :animate="{ scale: status === 'dropping' || calm ? 1 : 1.1 }"
    :transition="{ type: 'spring', stiffness: 500, damping: 22 }"
  >
    <span class="cloth">{{ flag.letter }}</span>
  </motion.div>
</template>

<style scoped>
.flag-overlay {
  width: 100%;
  height: 100%;
  transform-origin: 50% 0;
  filter: drop-shadow(0 12px 10px rgb(0 0 0 / 0.35));
}

.cloth {
  display: grid;
  justify-items: center;
  height: 100%;
  padding-top: 12px;
  box-sizing: border-box;
  clip-path: polygon(0 0, 100% 0, 100% 62%, 50% 100%, 0 62%);
  background: hsl(var(--hue) 70% 52%);
  color: #fff;
  font: 800 18px/1 system-ui, sans-serif;
}
</style>
