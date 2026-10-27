<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{
  hero: { id: string; name: string; role: string; level: number; hue: number };
  slotNumber: number;
}>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.hero });
</script>

<template>
  <li ref="el" class="hero" :style="{ '--hue': hero.hue }">
    <span class="number">{{ slotNumber }}</span>
    <span class="crest">{{ hero.role[0] }}</span>
    <span class="text">
      <strong>{{ hero.name }}</strong>
      <small>{{ hero.role }}</small>
    </span>
    <span class="level">Lv {{ hero.level }}</span>
  </li>
</template>

<style scoped>
.hero {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 10px;
  border-radius: 12px;
  background: Canvas;
  box-shadow: 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
  cursor: grab;
  user-select: none;
}

.hero:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.hero[data-dnd-placeholder] {
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 25%, transparent);
  background: none;
}

.hero[data-dnd-placeholder] > * {
  visibility: hidden;
}

[data-dnd-overlay] .hero {
  box-shadow:
    0 0 0 2px hsl(var(--hue) 70% 55%),
    0 16px 28px -14px rgb(0 0 0 / 0.55);
}

.number {
  width: 12px;
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.4;
}

.crest {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: linear-gradient(135deg, hsl(var(--hue) 75% 60%), hsl(var(--hue) 60% 40%));
  color: #fff;
  font-weight: 700;
}

.text {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
}

.text small {
  opacity: 0.55;
}

.level {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.6;
}
</style>
