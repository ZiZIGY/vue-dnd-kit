<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { makeSortableItem, useDnD } from '@vue-dnd-kit/core';
  import { extension, formatSize, type FileItem } from './fs';

  const props = defineProps<{ file: FileItem }>();
  const el = useTemplateRef<HTMLElement>('el');
  const { selected } = makeSortableItem(el, { id: () => props.file.id, type: 'file', data: () => props.file });
  const { selection } = useDnD();

  // Click selects this file only; Ctrl/Cmd+click adds or removes it.
  const onClick = (event: MouseEvent) => {
    if (event.ctrlKey || event.metaKey) selected.value = !selected.value;
    else selection.set([props.file.id]);
  };

  const ext = computed(() => extension(props.file.name));
  const kind = computed(() => {
    if (['jpg', 'png', 'svg'].includes(ext.value)) return 'image';
    if (['xlsx'].includes(ext.value)) return 'sheet';
    if (['zip'].includes(ext.value)) return 'archive';
    if (['html', 'css'].includes(ext.value)) return 'code';
    return 'doc';
  });
</script>

<template>
  <li
    ref="el"
    class="fm-file"
    :class="{ selected }"
    :data-id="file.id"
    :data-selected="selected || undefined"
    :aria-label="file.name"
    @click="onClick"
  >
    <span
      class="fm-icon"
      :class="kind"
      >{{ ext }}</span
    >
    <span class="fm-file-name">{{ file.name }}</span>
    <span class="fm-size">{{ formatSize(file.size) }}</span>
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
    border-radius: 10px;
    background: #fff;
    box-shadow: inset 0 0 0 1px #e2e8f0;
    cursor: default;
    user-select: none;
  }

  .fm-file:focus-visible {
    outline: 2px solid #2563eb;
  }

  .fm-file.selected {
    background: #dbeafe;
    box-shadow: inset 0 0 0 2px #3b82f6;
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
    border-radius: 4px 12px 4px 4px;
    background: #64748b;
    color: #fff;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
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
    color: #94a3b8;
    font-size: 11px;
  }
</style>
