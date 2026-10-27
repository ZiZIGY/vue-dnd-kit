<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { makeDroppable, useDnD, type Key } from '@vue-dnd-kit/core';
import WasteItem from './WasteItem.vue';
import type { Bin, Waste } from './waste';

const props = defineProps<{ bin: Bin; items: Waste[]; tray?: boolean }>();
const emit = defineEmits<{ drop: [id: Key] }>();

const el = useTemplateRef<HTMLElement>('el');
const { isOver, isAccepting } = makeDroppable(el, {
  id: props.bin.id,
  accept: props.bin.accept,
  // A plain drop target moves nothing itself: the drop is yours to apply.
  onDrop: (event) => emit('drop', event.active.id),
});

// `isOver` is true over a bin that refuses the drag too: that is a refusal to show.
const { active } = useDnD();
const state = computed(() => {
  if (!active.value) return null;
  if (isOver.value) return isAccepting.value ? 'over' : 'refused';
  return isAccepting.value ? 'accepting' : 'idle';
});
</script>

<template>
  <section ref="el" class="bin" :class="[state, { tray }]" :style="{ '--bin': bin.color }">
    <header>
      <svg v-if="!tray" class="icon" viewBox="0 0 24 24" aria-hidden="true">
        <g class="lid"><path d="M4 7h16M10 7V5h4v2" /></g>
        <path d="M6 9.5h12l-1.2 10.5H7.2zM10 12.5v5M14 12.5v5" />
      </svg>
      <strong>{{ bin.name }}</strong>
      <span class="status">
        <template v-if="state === 'over'">✓</template>
        <template v-else-if="state === 'refused'">✕</template>
        <template v-else>{{ items.length }}</template>
      </span>
    </header>
    <code v-if="!tray">accept: {{ bin.rule }}</code>
    <div class="items">
      <WasteItem v-for="waste in items" :key="waste.id" :waste="waste" :small="!tray" />
    </div>
  </section>
</template>

<style scoped>
.bin {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  min-height: 150px;
  padding: 12px;
  border: 1.5px solid color-mix(in srgb, currentColor 12%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  transition:
    border-color 0.2s,
    background 0.2s,
    opacity 0.2s;
}

.bin.tray {
  min-height: 0;
  border-style: dashed;
}

/* A drag is on, and this bin takes it. */
.bin.accepting {
  border-style: dashed;
  border-color: color-mix(in srgb, var(--bin) 70%, transparent);
}

.bin.over {
  border-color: var(--bin);
  background: color-mix(in srgb, var(--bin) 14%, Canvas);
}

/* Over it, but it refuses this item. */
.bin.refused {
  border-color: #f43f5e;
  background: color-mix(in srgb, #f43f5e 8%, Canvas);
  animation: shake 0.3s;
}

/* A drag is on, and this bin can't take it. */
.bin.idle {
  opacity: 0.45;
}

header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.icon {
  flex: none;
  width: 20px;
  height: 20px;
  fill: none;
  stroke: var(--bin);
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.lid {
  transform-origin: 4px 7px;
  transition: transform 0.2s;
}

.over .lid {
  transform: translateY(-1px) rotate(-24deg);
}

.status {
  box-sizing: border-box;
  min-width: 22px;
  margin-left: auto;
  padding: 3px 6px;
  text-align: center;
  border-radius: 99px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  white-space: nowrap;
}

.over .status {
  background: var(--bin);
  color: Canvas;
}

.refused .status {
  background: #f43f5e;
  color: #fff;
}

code {
  font: 10.5px/1.4 ui-monospace, Menlo, Consolas, monospace;
  overflow-wrap: anywhere;
  opacity: 0.6;
}

.items {
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  gap: 6px;
}

.tray .items {
  gap: 8px;
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
  .bin,
  .lid {
    transition: none;
  }

  .bin.refused {
    animation: none;
  }
}
</style>
