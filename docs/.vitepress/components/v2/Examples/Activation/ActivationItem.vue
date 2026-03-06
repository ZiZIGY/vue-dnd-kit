<script setup lang="ts">
  import { computed, useTemplateRef } from 'vue';
  import { makeDraggable, useDnDProvider } from '@vue-dnd-kit/core';
  import type { IDragActivationOptions } from '@vue-dnd-kit/core';

  const props = defineProps<{
    label: string;
    description: string;
    activation?: IDragActivationOptions;
  }>();

  const itemRef = useTemplateRef<HTMLElement>('itemRef');
  const provider = useDnDProvider();

  const { isDragging } = makeDraggable(itemRef, {
    activation: props.activation,
  });

  const isActivating = computed(() => {
    if (provider.state.value !== 'activating') return false;
    return provider.entities.initiatingDraggable === itemRef.value;
  });

  const delayProgress = computed(() => provider.delay.progress ?? 0);
  const distProgress = computed(() => provider.distanceProgress.value ?? 0);

  const hasDelay = computed(() => props.activation?.delay !== undefined);
  const hasDistance = computed(() => props.activation?.distance !== undefined);

  const progressValue = computed(() => {
    if (!isActivating.value) return 0;
    if (hasDelay.value) return delayProgress.value;
    if (hasDistance.value) return distProgress.value;
    return 0;
  });
</script>

<template>
  <div
    class="item-wrapper"
    :class="{ 'is-activating': isActivating }"
  >
    <div
      ref="itemRef"
      class="activation-item"
      :class="{ 'is-dragging': isDragging }"
    >
      <span class="item-label">{{ label }}</span>
    </div>

    <div
      v-if="hasDelay || hasDistance"
      class="progress-bar"
      :class="{ visible: isActivating }"
    >
      <div
        class="progress-fill"
        :style="{ width: progressValue * 100 + '%' }"
      />
    </div>

    <span class="item-desc">{{ description }}</span>
  </div>
</template>

<style scoped>
  .item-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
  }

  .activation-item {
    padding: 0.625rem 1.25rem;
    border-radius: 8px;
    background-color: var(--vp-c-brand-1);
    color: var(--vp-c-bg);
    font-weight: 500;
    font-size: 0.875rem;
    cursor: grab;
    user-select: none;
    touch-action: none;
    text-align: center;
    transition: opacity 0.15s;
  }

  .activation-item:active {
    cursor: grabbing;
  }

  .activation-item.is-dragging {
    opacity: 0.3;
  }

  .item-wrapper.is-activating .activation-item {
    opacity: 0.7;
  }

  .progress-bar {
    height: 4px;
    border-radius: 2px;
    background: rgba(62, 175, 124, 0.2);
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.1s;
  }

  .progress-bar.visible {
    opacity: 1;
  }

  .progress-fill {
    height: 100%;
    background: var(--vp-c-brand-1);
    border-radius: 2px;
    transition: width 0.05s linear;
  }

  .item-desc {
    font-size: 0.7rem;
    color: var(--vp-c-text-3);
    text-align: center;
  }
</style>
