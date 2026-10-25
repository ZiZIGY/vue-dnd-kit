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
    background: #fff;
    border: 1px solid #2563eb;
    border-radius: 10px;
    box-shadow: 0 12px 28px -6px rgb(30 64 175 / 0.4);
    font: 14px/1.4 system-ui, sans-serif;
    color: #1e293b;
  }

  .fb-ghost.copy {
    border-color: #16a34a;
    box-shadow: 0 12px 28px -6px rgb(22 101 52 / 0.4);
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
    border-radius: 999px;
    background: #dbeafe;
    color: #1d4ed8;
    font-size: 11px;
    font-style: normal;
    white-space: nowrap;
  }

  .copy em {
    background: #dcfce7;
    color: #15803d;
  }
</style>
