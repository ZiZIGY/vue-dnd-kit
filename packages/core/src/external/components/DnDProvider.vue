<script setup lang="ts">
  import { computed, provide, useTemplateRef } from 'vue';

  import type { IDnDProviderProps } from '../types/provider';
  import { injectionKey } from '../../internal/utils/namespaces';
  import { useDnDProviderState } from '../../internal/composables/useDnDProviderState';
  import { useDnDProviderEvents } from '../../internal/composables/useDnDProviderEvents';

  import DragPreview from './DragPreview.vue';

  const props = defineProps<IDnDProviderProps>();
  const previewRef = useTemplateRef<HTMLElement>('previewRef');
  const provider = useDnDProviderState(previewRef, props);
  useDnDProviderEvents(provider);

  const preview = computed(() => provider.preview.render.value ?? DragPreview);

  provide(injectionKey, provider);
</script>

<template>
  <slot />

  <Teleport :to="provider.preview.to.value || 'body'">
    <div
      ref="previewRef"
      class="dnd-kit-preview-container"
      v-bind="props"
    >
      <slot
        name="preview"
        :preview
      >
        <component :is="preview" />
      </slot>
    </div>
  </Teleport>
</template>

<style>
  .dnd-kit-preview-container {
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    cursor: grabbing;
    z-index: 9999;
  }
</style>
