<script setup lang="ts">
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import type { ExampleFile } from '#examples';

  /** A file tab: its icon and name; click to open, drag to move. */
  const props = defineProps<{ file: ExampleFile; active: boolean }>();
  const emit = defineEmits<{ select: [] }>();

  const el = useTemplateRef<HTMLElement>('el');
  makeSortableItem(el, { id: () => props.file.name, item: () => props.file });

  const ICONS: Record<string, string> = {
    vue: 'i-vscode-icons-file-type-vue',
    ts: 'i-vscode-icons-file-type-typescript-official',
    css: 'i-vscode-icons-file-type-css',
    json: 'i-vscode-icons-file-type-json',
  };
</script>

<template>
  <button
    ref="el"
    role="tab"
    type="button"
    :aria-selected="active"
    :data-name="file.name"
    class="flex h-11 shrink-0 cursor-pointer items-center gap-2 border-e border-default px-4 font-mono text-[12px] transition-colors"
    :class="active ? 'bg-default text-highlighted' : 'bg-(--code-bg) text-dimmed hover:text-highlighted'"
    @click="emit('select')"
  >
    <UIcon
      :name="ICONS[file.lang] ?? 'i-vscode-icons-default-file'"
      class="size-4 shrink-0"
      :class="active ? '' : 'opacity-60 grayscale'"
    />
    {{ file.name }}
  </button>
</template>
