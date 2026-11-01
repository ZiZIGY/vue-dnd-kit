<script setup lang="ts">
import { inject, useTemplateRef } from 'vue';
import Glyph from './Glyph.vue';
import { DRIVE } from './drive';
import type { FolderEntry } from './files';
import { useFolderDrop } from './useFolderDrop';

/** A folder of the path: a click goes up to it, a drop moves files up into it. */
const props = defineProps<{ folder: FolderEntry; first: boolean; last: boolean }>();
const drive = inject(DRIVE)!;

const el = useTemplateRef<HTMLElement>('el');
const { isTarget, isUploadTarget } = useFolderDrop(el, () => props.folder);
</script>

<template>
  <Glyph v-if="!first" name="forward" class="chevron" />
  <button
    ref="el"
    type="button"
    class="crumb"
    :class="{ last, target: isTarget || isUploadTarget }"
    :data-id="folder.id"
    :aria-current="last ? 'page' : undefined"
    @click="drive.open(folder)"
  >
    {{ folder.name }}
  </button>
</template>

<style scoped>
.chevron {
  font-size: 12px;
  opacity: 0.35;
}

/* The folders above the open one give way first. */
.crumb {
  overflow: hidden;
  flex: 0 4 auto;
  min-width: 2.8em;
  max-width: 180px;
  padding: 4px 7px;
  border: 0;
  border-radius: 7px;
  background: none;
  color: inherit;
  font: inherit;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.6;
  cursor: default;
  transition:
    background-color 0.15s,
    box-shadow 0.15s;
}

.crumb:hover {
  background: color-mix(in srgb, currentColor 7%, transparent);
  opacity: 1;
}

.crumb:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.crumb.last {
  flex-shrink: 1;
  min-width: 0;
  font-weight: 650;
  opacity: 1;
}

.crumb.target {
  background: color-mix(in srgb, #42b883 24%, transparent);
  box-shadow: inset 0 0 0 1.5px #42b883;
  opacity: 1;
}

/* A phone shows the open folder only: the sidebar's tree has the others. */
@container window (max-width: 640px) {
  .crumb:not(.last),
  .chevron {
    display: none;
  }
}
</style>
