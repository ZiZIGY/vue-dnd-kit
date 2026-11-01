<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { makeDroppable } from '@vue-dnd-kit/core';

interface Attachment {
  id: number;
  name: string;
  size: number;
}

const files = ref<Attachment[]>([{ id: 0, name: 'brief.pdf', size: 182_000 }]);
/** What the last drop left out: extensions are only known at the drop. */
const skipped = ref(0);
let made = 0;

const add = (taken: File[], all = taken.length) => {
  files.value.push(...taken.map((file) => ({ id: ++made, name: file.name, size: file.size })));
  skipped.value = all - taken.length;
};

const el = useTemplateRef<HTMLElement>('el');
const { isOver, isAccepting } = makeDroppable(el, {
  external: { files: '.pdf, .md, .txt, image/*' },
  // `files` has those it takes; `fileTypes` counts everything that was dropped.
  onDrop: (e) => add([...e.external!.files], e.external!.fileTypes.length),
});

const pick = (event: Event) => {
  const input = event.target as HTMLInputElement;
  add([...(input.files ?? [])]);
  input.value = '';
};

const size = (bytes: number) => (bytes < 1_000_000 ? `${Math.round(bytes / 1000)} KB` : `${(bytes / 1_000_000).toFixed(1)} MB`);
</script>

<template>
  <section ref="el" class="zone" :class="{ taking: isOver && isAccepting, refusing: isOver && !isAccepting }">
    <h4>Attachments</h4>
    <ul>
      <li v-for="file in files" :key="file.id">
        <span class="ext">{{ file.name.split('.').pop() }}</span>
        <span class="name">{{ file.name }}</span>
        <span class="size">{{ size(file.size) }}</span>
        <button type="button" :aria-label="`Remove ${file.name}`" @click="files = files.filter((other) => other !== file)">×</button>
      </li>
    </ul>
    <p class="hint">
      <template v-if="isOver">Drop to attach</template>
      <template v-else-if="skipped">{{ skipped }} skipped: PDF, Markdown, text and images only</template>
      <template v-else>Drop PDF, Markdown, text or images</template>
    </p>
    <label class="browse">
      Browse…
      <input type="file" multiple accept=".pdf,.md,.txt,image/*" @change="pick" />
    </label>
  </section>
</template>

<style scoped>
.zone {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 300px;
  max-width: 100%;
  padding: 14px;
  border: 1.5px dashed color-mix(in srgb, currentColor 22%, transparent);
  border-radius: 14px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  transition:
    border-color 0.15s,
    background-color 0.15s;
}

.zone.taking {
  border-color: #42b883;
  background: color-mix(in srgb, #42b883 10%, Canvas);
}

.zone.refusing {
  border-color: #ef4444;
  background: color-mix(in srgb, #ef4444 8%, Canvas);
}

h4 {
  margin: 0 0 10px;
  font: 600 11px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  opacity: 0.55;
}

ul {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  max-height: 150px;
  margin: 0;
  padding: 0;
  overflow: auto;
  list-style: none;
}

li {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 32px;
  padding: 0 4px 0 8px;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 6%, Canvas);
  font-size: 12px;
}

.ext {
  flex: none;
  width: 34px;
  padding: 2px 0;
  border-radius: 4px;
  background: color-mix(in srgb, #42b883 18%, transparent);
  font: 600 9px/1.4 ui-monospace, Menlo, Consolas, monospace;
  text-align: center;
  text-transform: uppercase;
}

.name {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.size {
  font-variant-numeric: tabular-nums;
  opacity: 0.55;
}

li button {
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: inherit;
  font-size: 16px;
  cursor: pointer;
  opacity: 0.6;
}

li button:hover {
  background: color-mix(in srgb, currentColor 10%, transparent);
  opacity: 1;
}

.hint {
  margin: 10px 0;
  font-size: 12px;
  opacity: 0.7;
}

.browse {
  position: relative;
  align-self: flex-start;
  padding: 6px 12px;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 8%, Canvas);
  font-size: 12px;
  cursor: pointer;
}

.browse:focus-within {
  outline: 2px solid #42b883;
  outline-offset: 1px;
}

.browse input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
