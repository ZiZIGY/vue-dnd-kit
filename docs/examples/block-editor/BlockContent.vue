<script setup lang="ts">
import Editable from './Editable.vue';
import type { Block } from './blocks';

/** What a block shows, by its kind. `open`: a toggle shows the blocks inside it. */
defineProps<{ block: Block; open: boolean }>();
const emit = defineEmits<{ toggle: [] }>();
</script>

<template>
  <Editable v-if="block.kind === 'heading'" v-model="block.text" tag="h3" placeholder="Heading" />
  <Editable v-else-if="block.kind === 'text'" v-model="block.text" placeholder="Type something…" />
  <Editable v-else-if="block.kind === 'quote'" v-model="block.text" tag="blockquote" placeholder="Quote" />
  <div v-else-if="block.kind === 'todo'" class="todo" :class="{ done: block.done }">
    <input v-model="block.done" type="checkbox" aria-label="Done" />
    <Editable v-model="block.text" placeholder="To-do" />
  </div>
  <div v-else-if="block.kind === 'toggle'" class="toggle">
    <button type="button" class="chevron" :aria-expanded="open" :aria-label="open ? 'Collapse' : 'Expand'" @click="emit('toggle')">
      <svg viewBox="0 0 16 16" aria-hidden="true"><path d="m6 4 4 4-4 4" /></svg>
    </button>
    <Editable v-model="block.text" placeholder="Toggle" />
    <p v-if="open && !block.children?.length" class="empty">Empty toggle. Drop blocks inside.</p>
  </div>
  <div v-else-if="block.kind === 'image'" class="picture" role="img" aria-label="Hills at sunrise">
    <svg viewBox="0 0 160 30" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <circle cx="117" cy="11" r="4.5" fill="rgb(255 255 255 / 0.75)" />
      <path d="M0 30V19l24-8 21 6 29-11 35 10 24-6 27 8v12z" fill="rgb(0 0 0 / 0.16)" />
      <path d="M0 30v-6l35-6 29 5 40-8 29 6 27-3v12z" fill="rgb(0 0 0 / 0.2)" />
    </svg>
  </div>
  <hr v-else />
</template>

<style scoped>
p,
h3,
blockquote {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
}

h3 {
  padding-top: 10px;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
  letter-spacing: -0.01em;
}

blockquote {
  padding-left: 14px;
  border-left: 3px solid currentColor;
}

.todo,
.toggle {
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr);
  align-items: start;
  column-gap: 4px;
}

input[type='checkbox'] {
  width: 15px;
  height: 15px;
  margin: 5px 0 0 2px;
  accent-color: #42b883;
  cursor: pointer;
}

.done .editable {
  text-decoration: line-through;
  opacity: 0.5;
}

.chevron {
  display: grid;
  place-items: center;
  width: 22px;
  height: 24px;
  padding: 0;
  border: 0;
  border-radius: 5px;
  background: none;
  color: inherit;
  cursor: pointer;
}

.chevron:hover {
  background: color-mix(in srgb, currentColor 8%, transparent);
}

.chevron svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  transition: rotate 0.15s;
}

.chevron[aria-expanded='true'] svg {
  rotate: 90deg;
}

.toggle > .editable {
  font-weight: 600;
}

.empty {
  grid-column: 2;
  margin: 0;
  font-size: 13px;
  opacity: 0.45;
}

.picture {
  overflow: hidden;
  height: 84px;
  margin: 4px 0;
  border-radius: 8px;
  background: linear-gradient(160deg, #6ee7b7, #0e7490);
}

.picture svg {
  display: block;
  width: 100%;
  height: 100%;
}

hr {
  margin: 12px 0;
  border: 0;
  border-top: 1px solid color-mix(in srgb, currentColor 16%, transparent);
}
</style>
