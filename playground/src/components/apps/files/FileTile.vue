<script setup lang="ts">
  import { computed, inject, useTemplateRef } from 'vue';
  import { makeSortableItem, useDnD } from '@vue-dnd-kit/core';
  import { FILE_MANAGER, extension, formatSize, type Entry } from './fs';
  import { useFolderDrop } from './useFolderDrop';

  const props = defineProps<{ entry: Entry }>();
  const fm = inject(FILE_MANAGER)!;
  const el = useTemplateRef<HTMLElement>('el');
  const { selected } = makeSortableItem(el, { id: () => props.entry.id, type: props.entry.kind, data: () => props.entry });
  const { selection } = useDnD();

  // A folder tile is a drop target too, like Finder's: dropped on its middle, files and
  // folders go inside; near its edges the grid sorts (the library tells them apart).
  const folder = props.entry.kind === 'folder';
  const { isOver, isAccepting } = folder ? useFolderDrop(el, () => props.entry.id, 'tile', fm) : { isOver: null, isAccepting: null };

  // Click selects this entry only; Ctrl/Cmd+click adds or removes it; a folder opens on double-click.
  const onClick = (event: MouseEvent) => {
    if (event.ctrlKey || event.metaKey) selected.value = !selected.value;
    else selection.set([props.entry.id]);
  };
  const onOpen = () => {
    if (folder) fm.open(props.entry.id);
  };

  const ext = computed(() => (props.entry.kind === 'file' ? extension(props.entry.name) : ''));
  const kind = computed(() => {
    if (folder) return 'folder';
    if (['jpg', 'png', 'svg'].includes(ext.value)) return 'image';
    if (['xlsx'].includes(ext.value)) return 'sheet';
    if (['zip'].includes(ext.value)) return 'archive';
    if (['html', 'css'].includes(ext.value)) return 'code';
    return 'doc';
  });
  const detail = computed(() =>
    props.entry.kind === 'file' ? formatSize(props.entry.size) : `${props.entry.children.length} items`,
  );
</script>

<template>
  <li
    ref="el"
    class="fm-file"
    :class="{ selected, accepting: isAccepting, target: isOver && isAccepting }"
    :data-id="entry.id"
    :data-kind="entry.kind"
    :data-selected="selected || undefined"
    :data-target="(isOver && isAccepting) || undefined"
    :aria-label="entry.name"
    @click="onClick"
    @dblclick="onOpen"
  >
    <span
      class="fm-icon"
      :class="kind"
      >{{ ext }}</span
    >
    <span class="fm-file-name">{{ entry.name }}</span>
    <span class="fm-size">{{ detail }}</span>
  </li>
</template>

<style scoped>
  .fm-file {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    width: 96px;
    height: 104px;
    padding: 10px 6px 6px;
    border-radius: var(--ui-radius);
    background: var(--ui-surface);
    box-shadow: inset 0 0 0 1px var(--ui-border-accented);
    cursor: default;
    user-select: none;
  }

  .fm-file:focus-visible {
    outline: 2px solid var(--ui-focus);
  }

  .fm-file.selected {
    background: var(--ui-selection-soft);
    box-shadow: inset 0 0 0 2px var(--ui-selection);
  }

  .fm-file.accepting {
    box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--ui-primary) 45%, transparent);
  }

  .fm-file.target {
    background: var(--ui-primary);
    color: var(--ui-on-primary);
    box-shadow: none;
  }

  .fm-file.target .fm-size {
    color: color-mix(in srgb, var(--ui-on-primary) 75%, transparent);
  }

  .fm-file[data-dnd-placeholder] {
    opacity: 0.35;
  }

  .fm-icon {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: 36px;
    height: 44px;
    padding-bottom: 4px;
    border-radius: 2px 10px 2px 2px;
    background: #71717a;
    color: #fff;
    font-family: var(--font-mono);
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
  }

  /* File kinds keep their hues: they read on both themes. */
  .fm-icon.folder {
    width: 44px;
    height: 34px;
    margin: 6px 0 4px;
    border-radius: 2px 4px 4px 4px;
    background: #f59e0b;
    box-shadow: inset 0 7px 0 #fbbf24;
  }

  .fm-icon.image {
    background: #0ea5e9;
  }

  .fm-icon.sheet {
    background: #16a34a;
  }

  .fm-icon.archive {
    background: #a16207;
  }

  .fm-icon.code {
    background: #7c3aed;
  }

  .fm-icon.doc {
    background: #2563eb;
  }

  .fm-file-name {
    max-width: 100%;
    overflow: hidden;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .fm-size {
    color: var(--ui-text-dimmed);
    font-size: 11px;
  }
</style>
