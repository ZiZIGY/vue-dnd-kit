<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';
import TimelineClip from './TimelineClip.vue';

type Clip = { id: string; name: string; track: string; start: number; length: number; hue: number };
const props = defineProps<{ id: string; clips: Clip[]; locked: boolean }>();

const lane = useTemplateRef<HTMLElement>('lane');
const { isOver } = makeDroppable(lane, { id: props.id });
</script>

<template>
  <div class="track">
    <span class="name">{{ id }}</span>
    <div ref="lane" class="lane" :class="{ over: isOver }">
      <TimelineClip v-for="clip in clips" :key="clip.id" :clip="clip" :locked="locked" />
    </div>
  </div>
</template>

<style scoped>
.track {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}

.name {
  flex: none;
  width: 56px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
  opacity: 0.6;
}

.lane {
  position: relative;
  flex: none;
  width: calc(var(--second) * var(--seconds));
  height: 44px;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 5%, transparent);
  transition: background-color 0.15s;
}

.lane.over {
  background: color-mix(in srgb, #42b883 12%, transparent);
}
</style>
