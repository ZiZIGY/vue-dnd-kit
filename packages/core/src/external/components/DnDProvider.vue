<script setup lang="ts">
  import { onBeforeUnmount, onMounted, provide, useTemplateRef } from 'vue';

  import { injectionKey } from '../../internal/utils/namespaces';
  import { useDnDProviderState } from '../../internal/composables/useDnDProviderState';
  
  import { handleModifierEvents } from '../../internal/logic/events/modifier';
  import { handleScrollEvent } from '../../internal/logic/events/scroll';
  import { createPointerHandlers } from '../../internal/logic/events/pointer';
  
  import DefaultOverlay from './DefaultOverlay.vue';
  
  const overlayRef = useTemplateRef<HTMLElement>('overlayRef');
  const provider = useDnDProviderState(overlayRef);
  const pointerHandlers = createPointerHandlers(provider);

  onMounted(() => {
    document.addEventListener('pointerdown', pointerHandlers.pointerDown);
    document.addEventListener('keydown', handleModifierEvents.keyDown(provider));
    document.addEventListener('keyup', handleModifierEvents.keyUp(provider));
    document.addEventListener('blur', handleModifierEvents.clear(provider));
    document.addEventListener('scroll', handleScrollEvent(provider), true);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', pointerHandlers.pointerDown);
    document.removeEventListener('pointerup', pointerHandlers.pointerUp);
    document.removeEventListener('pointermove', pointerHandlers.pointerMove);
    
    document.removeEventListener('keydown', handleModifierEvents.keyDown(provider));
    document.removeEventListener('keyup', handleModifierEvents.keyUp(provider));
    document.removeEventListener('blur', handleModifierEvents.clear(provider));
    document.removeEventListener('scroll', handleScrollEvent(provider), true);

    pointerHandlers.cleanup();
  });

  provide(injectionKey, provider);
</script>

<template>
  <slot />

  <div
    ref="overlayRef"
    class="dnd-kit-overlay-container"
  >
    <slot name="overlay">
      <component :is="DefaultOverlay" />
    </slot>
  </div>

  <pre>{{ provider.entities }}</pre>
</template>

<style>
  pre {
    position: fixed;
    width: 300px;
    height: 100svh;
    overflow: scroll;
    text-align: left;
    top: 0;
    left: 0;
  }
  .dnd-kit-overlay-container {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    cursor: grabbing;
  }
</style>
