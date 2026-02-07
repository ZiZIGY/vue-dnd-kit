<script setup lang="ts">
  import {
    computed,
    onBeforeUnmount,
    onMounted,
    provide,
    useTemplateRef,
  } from 'vue';

  import { injectionKey } from '../../internal/utils/namespaces';
  import { useDnDProviderState } from '../../internal/composables/useDnDProviderState';

  import { handleModifierEvents } from '../../internal/logic/modifier';
  import { handleScrollEvent } from '../../internal/logic/scroll';
  import { createPointerHandlers } from '../../internal/logic/pointer';

  import DefaultOverlay from './DefaultOverlay.vue';

  const overlayRef = useTemplateRef<HTMLElement>('overlayRef');
  const provider = useDnDProviderState(overlayRef);
  const pointerHandlers = createPointerHandlers(provider);

  const overlay = computed(
    () => provider.overlay.render.value ?? DefaultOverlay
  );

  onMounted(() => {
    document.addEventListener('pointerdown', pointerHandlers.pointerDown);
    document.addEventListener(
      'keydown',
      handleModifierEvents.keyDown(provider)
    );
    document.addEventListener('keyup', handleModifierEvents.keyUp(provider));
    document.addEventListener('blur', handleModifierEvents.clear(provider));
    document.addEventListener('scroll', handleScrollEvent(provider), true);
  });

  onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', pointerHandlers.pointerDown);
    document.removeEventListener('pointerup', pointerHandlers.pointerUp);
    document.removeEventListener('pointermove', pointerHandlers.pointerMove);

    document.removeEventListener(
      'keydown',
      handleModifierEvents.keyDown(provider)
    );
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
    <slot
      name="overlay"
      :overlay
    >
      <component :is="overlay" />
    </slot>
  </div>

  <pre>
    {{ provider.hovered }}
  </pre>
</template>

<style>
  pre {
    position: fixed;
    top: 0;
    right: 0;
    height: 100svh;
    overflow: auto;
  }
  .dnd-kit-overlay-container {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    cursor: grabbing;
  }
</style>
