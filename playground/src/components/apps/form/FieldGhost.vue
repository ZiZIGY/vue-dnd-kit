<script setup lang="ts">
  import { computed } from 'vue';
  import type { DragItem, DragMode } from '@vue-dnd-kit/core';
  import FieldIcon from './FieldIcon.vue';
  import type { FormField } from './form';

  /** Overlay of the form builder: a compact chip that says what the drop will do. */
  const props = defineProps<{ items: DragItem[]; mode: DragMode; accepted: boolean }>();

  const field = computed(() => props.items[0]?.item as FormField | undefined);
  const fromPalette = computed(() => props.items[0]?.type.includes('palette') ?? false);
  const action = computed(() => {
    if (fromPalette.value) return 'New field';
    return props.mode === 'copy' ? 'Duplicate' : 'Move';
  });
</script>

<template>
  <div
    v-if="field"
    class="fb-ghost"
    :class="{ copy: mode === 'copy' && !fromPalette }"
    data-testid="form-ghost"
    :data-mode="mode"
  >
    <FieldIcon :kind="field.kind" />
    <span class="fb-ghost-label">{{ field.label }}</span>
    <em data-testid="ghost-action">{{ action }}</em>
  </div>
</template>

<style scoped>
  /* Fills the overlay box (the size of the dragged element) but reads as a chip. */
  .fb-ghost {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    height: 100%;
    max-height: 48px;
    padding: 8px 12px;
    background: var(--ui-surface);
    border: 1px solid var(--ui-border-strong);
    border-radius: var(--ui-radius);
    box-shadow: var(--ui-shadow-overlay);
    font: 14px/1.4 var(--font-sans);
    color: var(--ui-text-highlighted);
  }

  .fb-ghost.copy {
    border-color: var(--ui-primary);
  }

  .fb-ghost-label {
    flex: 1;
    overflow: hidden;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  em {
    padding: 1px 8px;
    border-radius: var(--ui-radius-sm);
    background: var(--ui-bg-elevated);
    color: var(--ui-text-muted);
    font-family: var(--font-mono);
    font-size: 11px;
    font-style: normal;
    white-space: nowrap;
  }

  .copy em {
    background: var(--ui-primary-soft);
    color: var(--ui-primary);
  }
</style>
