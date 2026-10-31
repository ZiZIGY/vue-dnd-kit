<script setup lang="ts">
  import { inject, useTemplateRef } from 'vue';
  import { FILE_MANAGER } from './fs';
  import { useFolderDrop } from './useFolderDrop';

  /** A breadcrumb: opens the folder on click, takes files and folders on drop. */
  const props = defineProps<{ folderId: string; name: string }>();
  const fm = inject(FILE_MANAGER)!;
  const el = useTemplateRef<HTMLElement>('el');
  const { isOver, isAccepting } = useFolderDrop(el, () => props.folderId, 'crumb');
</script>

<template>
  <button
    ref="el"
    type="button"
    class="fm-crumb"
    :class="{ accepting: isAccepting, target: isOver && isAccepting }"
    :data-testid="`crumb-${folderId}`"
    :data-target="(isOver && isAccepting) || undefined"
    @click="fm.open(folderId)"
  >
    {{ name }}
  </button>
</template>

<style scoped>
  .fm-crumb {
    padding: 4px 8px;
    border: 0;
    border-radius: var(--ui-radius);
    background: none;
    color: var(--ui-primary);
    font: inherit;
    cursor: pointer;
  }

  .fm-crumb:hover {
    background: var(--ui-bg-elevated);
  }

  .accepting {
    box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--ui-primary) 45%, transparent);
  }

  .target {
    background: var(--ui-primary);
    color: var(--ui-on-primary);
    box-shadow: none;
  }
</style>
