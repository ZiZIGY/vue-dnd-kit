<script setup lang="ts">
  import type { FieldKind } from './form';

  defineProps<{ kind: FieldKind }>();

  const GLYPHS: Record<FieldKind, string> = {
    text: 'Aa',
    email: '@',
    number: '#',
    textarea: '¶',
    select: '▾',
    checkbox: '✓',
    date: '31',
    section: '▤',
  };
</script>

<template>
  <span
    class="fb-icon"
    :class="kind"
    aria-hidden="true"
    >{{ GLYPHS[kind] }}</span
  >
</template>

<style scoped>
  .fb-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    border-radius: var(--ui-radius-sm);
    background: var(--ui-bg-elevated);
    box-shadow: inset 0 0 0 1px var(--ui-border);
    color: var(--ui-text-muted);
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 700;
  }

  .fb-icon.section {
    background: color-mix(in srgb, var(--ui-warning) 18%, var(--ui-bg));
    box-shadow: none;
    color: var(--ui-warning);
  }
</style>
