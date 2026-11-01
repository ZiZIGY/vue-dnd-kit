<script setup lang="ts">
import { computed, inject, onBeforeUnmount, useTemplateRef, watch } from 'vue';
import FileIcon from './FileIcon.vue';
import Glyph, { type GlyphName } from './Glyph.vue';
import { DRIVE } from './drive';
import type { FolderEntry } from './files';
import { useFolderDrop } from './useFolderDrop';

/**
 * A place in the sidebar: a folder of the tree, a favorite, the Trash. A click opens it,
 * a drop puts files in it. A folder of the tree with subfolders has a disclosure arrow
 * (`expandable`), and opens by itself when a drag rests on it: spring-loaded, as in Finder.
 */
const props = defineProps<{
  folder: FolderEntry;
  depth?: number;
  expandable?: boolean;
  expanded?: boolean;
  glyph?: GlyphName;
  count?: number;
}>();
const emit = defineEmits<{ toggle: [] }>();
const drive = inject(DRIVE)!;

const el = useTemplateRef<HTMLElement>('el');
const { isOver, isTarget, isRefused, isUploadTarget, gulps } = useFolderDrop(el, () => props.folder);
const isCurrent = computed(() => drive.currentId.value === props.folder.id);

// A drag that rests on a closed folder for a moment opens it, so its subfolders can take the drop.
const SPRING = 700;
let timer: ReturnType<typeof setTimeout> | undefined;
const springing = computed(() => isOver.value && props.expandable && !props.expanded);
watch(springing, (now) => {
  clearTimeout(timer);
  if (now) timer = setTimeout(() => emit('toggle'), SPRING);
});
onBeforeUnmount(() => clearTimeout(timer));

// The tree's keys: right opens a folder, left closes it.
const onArrow = (open: boolean) => {
  if (props.expandable && props.expanded !== open) emit('toggle');
};
</script>

<template>
  <button
    ref="el"
    type="button"
    class="row"
    :class="{ current: isCurrent, target: isTarget || isUploadTarget, refused: isRefused, springing }"
    :data-id="folder.id"
    :style="{ paddingLeft: `${8 + (depth ?? 0) * 14}px` }"
    :aria-current="isCurrent ? 'page' : undefined"
    :aria-expanded="expandable ? expanded : undefined"
    :title="folder.name"
    @click="drive.open(folder)"
    @keydown.right="onArrow(true)"
    @keydown.left="onArrow(false)"
  >
    <span v-if="depth !== undefined" class="disclosure" :class="{ expanded }" aria-hidden="true" @click.stop="emit('toggle')">
      <Glyph v-if="expandable" name="forward" />
    </span>
    <span class="icon">
      <Glyph v-if="glyph" :name="glyph" class="glyph" :class="{ gulp: gulps }" :key="gulps" />
      <FileIcon v-else :entry="folder" :open="isTarget || isUploadTarget" :gulps="gulps" />
    </span>
    <span class="name">{{ folder.name }}</span>
    <span v-if="count" class="count">{{ count }}</span>
  </button>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  height: 30px;
  padding-right: 10px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font: inherit;
  font-size: 13px;
  text-align: left;
  cursor: default;
  -webkit-tap-highlight-color: transparent;
  transition:
    background-color 0.15s,
    box-shadow 0.15s;
}

.row:hover {
  background: color-mix(in srgb, currentColor 6%, transparent);
}

.row:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: -2px;
}

.row.current {
  background: color-mix(in srgb, currentColor 10%, transparent);
  font-weight: 600;
}

/* Takes what is held over it. */
.row.target {
  background: color-mix(in srgb, #42b883 24%, transparent);
  box-shadow: inset 0 0 0 1.5px #42b883;
}

/* Refuses it: the overlay says why. */
.row.refused {
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, #e5484d 60%, transparent);
}

.disclosure {
  display: grid;
  flex: none;
  place-items: center;
  width: 14px;
  height: 14px;
  font-size: 11px;
  opacity: 0.5;
  transition: rotate 0.15s;
}

.disclosure.expanded {
  rotate: 90deg;
}

/* About to spring open: the arrow nudges. */
.springing .disclosure {
  animation: nudge 0.35s ease-in-out 2;
  opacity: 1;
}

@keyframes nudge {
  50% {
    translate: 3px 0;
  }
}

.icon {
  display: grid;
  flex: none;
  place-items: center;
  width: 20px;
  height: 20px;
}

.glyph {
  font-size: 17px;
  opacity: 0.75;
}

.glyph.gulp {
  animation: gulp 0.42s cubic-bezier(0.3, 1.6, 0.5, 1);
}

@keyframes gulp {
  40% {
    scale: 1.3;
  }
}

.name {
  overflow: hidden;
  flex: 1;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.count {
  font: 10.5px/1 ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}

/* A favorite being sorted: its slot. */
.row[data-dnd-placeholder] {
  opacity: 1;
  background: color-mix(in srgb, currentColor 5%, transparent);
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, currentColor 20%, transparent);
}

.row[data-dnd-placeholder] > * {
  opacity: 0.3;
}

/* Its copy in the overlay. */
[data-dnd-overlay] .row {
  background: Canvas;
  box-shadow: 0 8px 20px -8px rgb(0 0 0 / 0.45);
}

@media (prefers-reduced-motion: reduce) {
  .disclosure {
    transition: none;
  }

  .springing .disclosure,
  .glyph.gulp {
    animation: none;
  }
}
</style>
