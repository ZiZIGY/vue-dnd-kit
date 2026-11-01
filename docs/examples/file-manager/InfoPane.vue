<script setup lang="ts">
import { computed, inject } from 'vue';
import FileIcon from './FileIcon.vue';
import Glyph from './Glyph.vue';
import { DRIVE } from './drive';
import { KINDS, formatDate, formatSize, isFolder, items, kindOf, sizeOf } from './files';

/** What is selected, or the open folder: a big preview and its details. */
const drive = inject(DRIVE)!;

const picked = computed(() => (drive.selected.value.length ? drive.selected.value : [drive.current.value]));
const one = computed(() => (picked.value.length === 1 ? picked.value[0]! : null));

const details = computed(() => {
  const entry = one.value;
  if (!entry) {
    const kinds = [...new Set(picked.value.map((item) => KINDS[kindOf(item)].label))];
    return [
      ['Kinds', kinds.join(', ')],
      ['Size', formatSize(picked.value.reduce((sum, item) => sum + sizeOf(item), 0))],
    ];
  }
  // The folders it is in: the open folder's path (without the folder itself, when nothing is selected).
  const parents = entry.id === drive.current.value.id ? drive.path.value.slice(0, -1) : drive.path.value;
  return [
    ['Kind', KINDS[kindOf(entry)].label],
    ['Size', isFolder(entry) ? `${items(entry.children.length)}, ${formatSize(sizeOf(entry))}` : formatSize(entry.size)],
    // In the Trash, where Put Back takes it.
    entry.origin !== undefined
      ? ['Deleted from', drive.find(entry.origin)?.name ?? 'My Drive']
      : ['Where', parents.map((step) => step.name).join(' › ') || '—'],
    ['Modified', formatDate(entry.modified)],
  ];
});
</script>

<template>
  <aside class="info" aria-label="Info">
    <button type="button" class="close" aria-label="Close info" @click="drive.info.value = false"><Glyph name="close" /></button>

    <div class="preview" :class="{ several: !one }">
      <span v-for="(entry, index) in picked.slice(0, 3)" :key="entry.id" class="art" :style="{ '--i': index }">
        <FileIcon :entry="entry" />
      </span>
    </div>

    <h3 class="name">{{ one ? one.name : items(picked.length) }}</h3>
    <p class="summary">
      {{ one ? KINDS[kindOf(one)].label : 'Selected' }} · {{ formatSize(picked.reduce((sum, item) => sum + sizeOf(item), 0)) }}
    </p>

    <dl class="details">
      <template v-for="[term, value] in details" :key="term">
        <dt>{{ term }}</dt>
        <dd>{{ value }}</dd>
      </template>
    </dl>
  </aside>
</template>

<style scoped>
.info {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  padding: 22px 18px;
  text-align: center;
}

.close {
  position: absolute;
  top: 8px;
  right: 8px;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font-size: 15px;
  opacity: 0.55;
  cursor: pointer;
}

.close:hover {
  background: color-mix(in srgb, currentColor 8%, transparent);
  opacity: 1;
}

.close:focus-visible {
  outline: 2px solid #42b883;
}

.preview {
  position: relative;
  display: grid;
  place-items: center;
  width: 128px;
  height: 128px;
  margin: 8px 0 14px;
}

.art {
  grid-area: 1 / 1;
  width: 112px;
  height: 112px;
}

/* Several: their icons fanned out. */
.several .art {
  width: 92px;
  height: 92px;
  rotate: calc((var(--i) - 1) * 9deg);
  translate: calc((var(--i) - 1) * 14px) 0;
}

.several .art:first-child {
  z-index: 1;
  rotate: 0deg;
  translate: 0 0;
}

.name {
  max-width: 100%;
  margin: 0;
  font-size: 15px;
  font-weight: 650;
  line-height: 1.3;
  overflow-wrap: anywhere;
}

.summary {
  margin: 4px 0 18px;
  font-size: 12px;
  opacity: 0.55;
}

.details {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 8px 12px;
  width: 100%;
  margin: 0;
  padding-top: 14px;
  border-top: 1px solid color-mix(in srgb, currentColor 10%, transparent);
  font-size: 12px;
  text-align: left;
}

dt {
  opacity: 0.5;
}

dd {
  margin: 0;
  text-align: right;
  overflow-wrap: anywhere;
}
</style>
