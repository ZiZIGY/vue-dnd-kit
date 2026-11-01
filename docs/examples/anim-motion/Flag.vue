<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { makeSortableItem } from '@vue-dnd-kit/core';

const props = defineProps<{ flag: { id: string; letter: string; hue: number } }>();
const el = useTemplateRef<HTMLElement>('el');
makeSortableItem(el, { item: () => props.flag });
</script>

<template>
  <li ref="el" class="flag" :aria-label="flag.letter">
    <span class="cloth" :style="{ '--hue': flag.hue }">{{ flag.letter }}</span>
  </li>
</template>

<style scoped>
.flag {
  width: 46px;
  height: 64px;
  cursor: grab;
  user-select: none;
}

.flag:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

.cloth {
  display: grid;
  justify-items: center;
  height: 100%;
  padding-top: 12px;
  box-sizing: border-box;
  /* A pennant: cut to a point at the bottom. */
  clip-path: polygon(0 0, 100% 0, 100% 62%, 50% 100%, 0 62%);
  background: hsl(var(--hue) 70% 52%);
  color: #fff;
  font: 800 18px/1 system-ui, sans-serif;
}

/* Its place on the string, until it lands: a faint pennant, the letter in its color. */
.flag[data-dnd-placeholder] {
  opacity: 0.18;
}

.flag[data-dnd-placeholder] .cloth {
  background: currentColor;
  color: inherit;
}
</style>
