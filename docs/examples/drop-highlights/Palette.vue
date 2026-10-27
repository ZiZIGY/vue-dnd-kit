<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeDroppable, useDnD } from '@vue-dnd-kit/core';

const props = defineProps<{ tone: 'warm' | 'cool' | 'neutral' }>();
const colors = ref<string[]>([]);

const el = useTemplateRef<HTMLElement>('el');
const { isOver, isAccepting } = makeDroppable(el, {
  accept: props.tone,
  onDrop: (e) => colors.value.push((e.active.data as { color: string }).color),
});

// Four looks: takes it, takes it and is under the pointer, refuses it, refuses it under the pointer.
const { active } = useDnD();
const state = computed(() => {
  if (!active.value) return '';
  if (isOver.value) return isAccepting.value ? 'over' : 'refused';
  return isAccepting.value ? 'accepting' : 'refusing';
});
const MESSAGES: Record<string, string> = {
  accepting: 'Drop here',
  over: 'Release to add',
  refusing: `${props.tone} only`,
  refused: `Not a ${props.tone} colour`,
};
</script>

<template>
  <section ref="el" class="palette" :class="state">
    <h4>{{ tone }}</h4>
    <div class="colors">
      <span v-for="(color, index) in colors" :key="index" class="dot" :style="{ background: color }" />
    </div>
    <p class="message">{{ MESSAGES[state] ?? `${colors.length} colours` }}</p>
  </section>
</template>

<style scoped>
.palette {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  max-width: 180px;
  height: 150px;
  box-sizing: border-box;
  padding: 12px;
  border: 1.5px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  transition:
    border-color 0.2s,
    background 0.2s,
    opacity 0.2s,
    scale 0.2s;
}

/* Takes it: an invitation. */
.palette.accepting {
  border-style: dashed;
  border-color: #42b883;
}

/* Takes it, and the pointer is on it: the drop goes here. */
.palette.over {
  border-color: #42b883;
  background: color-mix(in srgb, #42b883 14%, Canvas);
  scale: 1.03;
}

/* Refuses it: out of the way. */
.palette.refusing {
  opacity: 0.45;
  background: repeating-linear-gradient(-45deg, color-mix(in srgb, currentColor 6%, transparent) 0 6px, transparent 6px 12px);
}

/* Refuses it, under the pointer: a drop here would be cancelled. */
.palette.refused {
  border-color: #f43f5e;
  background: color-mix(in srgb, #f43f5e 9%, Canvas);
  animation: shake 0.3s;
}

h4 {
  margin: 0;
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.colors {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 4px;
}

.dot {
  width: 16px;
  height: 16px;
  border-radius: 5px;
}

.message {
  margin: 0;
  font-size: 12px;
  opacity: 0.6;
}

.over .message,
.accepting .message {
  color: #42b883;
  opacity: 1;
}

.refused .message {
  color: #f43f5e;
  opacity: 1;
}

@keyframes shake {
  25% {
    translate: -4px 0;
  }
  75% {
    translate: 4px 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .palette {
    transition: none;
  }

  .palette.refused {
    animation: none;
  }
}
</style>
