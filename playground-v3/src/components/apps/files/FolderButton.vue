<script setup lang="ts">
  import { inject, useTemplateRef } from 'vue';
  import { FILE_MANAGER } from './fs';
  import { useFolderDrop } from './useFolderDrop';

  /** A breadcrumb or a sub-folder tile: opens the folder on click, takes files on drop. */
  const props = defineProps<{ folderId: string; name: string; variant: 'crumb' | 'tile' }>();
  const fm = inject(FILE_MANAGER)!;
  const el = useTemplateRef<HTMLElement>('el');
  const { isOver, isAccepting } = useFolderDrop(el, () => props.folderId, props.variant);
</script>

<template>
  <button
    ref="el"
    type="button"
    :class="[`fm-${variant}`, { accepting: isAccepting, target: isOver && isAccepting }]"
    :data-testid="`${variant}-${folderId}`"
    :data-target="(isOver && isAccepting) || undefined"
    @click="fm.open(folderId)"
  >
    <span
      v-if="variant === 'tile'"
      class="fm-tile-icon"
      aria-hidden="true"
    />
    <span>{{ name }}</span>
  </button>
</template>

<style scoped>
  button {
    border: 0;
    font: inherit;
    cursor: pointer;
  }

  .fm-crumb {
    padding: 4px 8px;
    border-radius: 6px;
    background: none;
    color: #1d4ed8;
  }

  .fm-crumb:hover {
    background: #e0e7ff;
  }

  .fm-tile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 96px;
    height: 84px;
    border-radius: 10px;
    background: #fff;
    color: #334155;
    box-shadow: inset 0 0 0 1px #e2e8f0;
  }

  .fm-tile:hover {
    box-shadow: inset 0 0 0 1px #94a3b8;
  }

  .fm-tile-icon {
    width: 40px;
    height: 30px;
    border-radius: 3px 5px 5px 5px;
    background: #f59e0b;
    box-shadow: inset 0 6px 0 #fbbf24;
  }

  .accepting {
    box-shadow: inset 0 0 0 2px #93c5fd;
  }

  .target {
    background: #2563eb;
    color: #fff;
    box-shadow: none;
  }
</style>
