<script setup lang="ts">
  import { useTemplateRef } from 'vue';
  import { makeConstraintArea } from '@vue-dnd-kit/core';
  import type { TDragAxis } from '@vue-dnd-kit/core';

  const props = defineProps<{
    axis?: TDragAxis;
    restrictToArea?: boolean;
    label?: string;
  }>();

  const boxRef = useTemplateRef<HTMLElement>('boxRef');

  makeConstraintArea(boxRef, {
    axis: props.axis,
    restrictToArea: props.restrictToArea,
  });
</script>

<template>
  <div
    ref="boxRef"
    class="constraint-box"
  >
    <span
      v-if="label"
      class="box-label"
    >{{ label }}</span>
    <div class="box-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
  .constraint-box {
    position: relative;
    border: 2px dashed var(--vp-c-brand-1);
    border-radius: 10px;
    background: rgba(62, 175, 124, 0.06);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .box-label {
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: var(--vp-c-brand-1);
    opacity: 0.8;
  }

  .box-content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;
  }
</style>
