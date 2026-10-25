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
    border-radius: 6px;
    background: #e0e7ff;
    color: #4338ca;
    font-size: 12px;
    font-weight: 700;
  }

  .fb-icon.section {
    background: #fef3c7;
    color: #b45309;
  }
</style>
