<script setup lang="ts">
import { computed, toRef, useTemplateRef } from 'vue';
import { makeSortableList, useDnD, type SortableGroupOptions } from '@vue-dnd-kit/core';
import FileItem from './FileItem.vue';

type File = { id: string; name: string; kind: 'image' | 'doc' };
const props = defineProps<{
  list: { id: string; title: string; code: string; refusal: string; group: SortableGroupOptions; sort?: boolean; files: File[] };
}>();

let copies = 0;
const el = useTemplateRef<HTMLElement>('el');
const { items, isOver, isAccepting } = makeSortableList(el, {
  id: props.list.id,
  items: toRef(props.list, 'files'),
  group: props.list.group,
  sort: props.list.sort,
  // Copies need a key of their own. Only the list that gives copies needs `clone`.
  clone: props.list.group.pull === 'clone' ? (file) => ({ ...file, id: `${file.id}-${++copies}` }) : undefined,
});

// While a drag runs, every list says whether it takes it.
const { active } = useDnD();
const verdict = computed(() => (active.value ? (isAccepting.value ? 'takes' : 'refuses') : null));
</script>

<template>
  <section class="list" :class="[verdict, { over: isOver }]">
    <header>
      <strong>{{ list.title }}</strong>
      <span v-if="verdict === 'takes'" class="verdict">✓ takes it</span>
      <span v-else-if="verdict === 'refuses'" class="verdict">✕ {{ list.refusal }}</span>
    </header>
    <code>{{ list.code }}</code>
    <ul ref="el" class="files">
      <FileItem v-for="file in items" :key="file.id" :file="file" />
    </ul>
  </section>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  padding: 10px;
  border: 1.5px solid color-mix(in srgb, currentColor 11%, transparent);
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  transition:
    border-color 0.2s,
    background 0.2s,
    opacity 0.2s;
}

.list.takes {
  border-style: dashed;
  border-color: color-mix(in srgb, #42b883 60%, transparent);
}

.list.takes.over {
  border-style: solid;
  border-color: #42b883;
  background: color-mix(in srgb, #42b883 8%, Canvas);
}

.list.refuses {
  opacity: 0.55;
}

/* Over a list that refuses: the drop would be cancelled. */
.list.refuses.over {
  border-color: #f43f5e;
  opacity: 1;
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  font-size: 13px;
}

.verdict {
  font: 11px/1 ui-monospace, Menlo, Consolas, monospace;
  white-space: nowrap;
  color: #42b883;
}

.refuses .verdict {
  color: #f43f5e;
}

code {
  font: 10.5px/1.45 ui-monospace, Menlo, Consolas, monospace;
  overflow-wrap: anywhere;
  opacity: 0.6;
}

.files {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 5px;
  min-height: 112px;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>
