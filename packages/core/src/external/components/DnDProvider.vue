<script setup lang="ts">
  import { computed, provide, useTemplateRef } from 'vue';

  import type { IDnDProviderProps } from '../types/provider';
  import { injectionKey } from '../../internal/utils/namespaces';
  import { useDnDProviderState } from '../../internal/composables/useDnDProviderState';
  import { useDnDProviderEvents } from '../../internal/composables/useDnDProviderEvents';

  import DefaultOverlay from './DefaultOverlay.vue';

  const props = defineProps<IDnDProviderProps>();
  const overlayRef = useTemplateRef<HTMLElement>('overlayRef');
  const provider = useDnDProviderState(overlayRef, props);
  useDnDProviderEvents(provider);

  const overlay = computed(
    () => provider.overlay.render.value ?? DefaultOverlay
  );

  provide(injectionKey, provider);
</script>

<template>
  <slot />

  <Teleport :to="provider.overlay.to.value || 'body'">
    <div
      ref="overlayRef"
      class="dnd-kit-overlay-container"
    >
      <slot
        name="overlay"
        :overlay
      >
        <component :is="overlay" />
      </slot>
    </div>
  </Teleport>
</template>

<style>
  .dnd-kit-overlay-container {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    cursor: grabbing;
    z-index: 9999;
  }
</style>
