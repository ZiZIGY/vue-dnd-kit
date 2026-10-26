<script setup lang="ts">
  /** What the overlay shows during a drag, copied from the page and scaled to fit (never enlarged). */
  import { computed, onBeforeUnmount, onMounted, useTemplateRef, watch } from 'vue';
  import { preview } from '../utils/connection';
  import { createRoot, fromHtml, release } from '../utils/shadow';

  const props = withDefaults(defineProps<{ width?: number; height?: number }>(), { width: 260, height: 160 });

  const host = useTemplateRef<HTMLElement>('host');
  let root: ShadowRoot | null = null;

  const scale = computed(() => {
    const size = preview.value?.size;
    return size ? Math.min(1, props.width / Math.max(size.w, 1), props.height / Math.max(size.h, 1)) : 1;
  });

  const render = () => {
    if (!root) return;
    for (const child of [...root.children]) if (child.localName !== 'style') child.remove();
    const element = preview.value && fromHtml(preview.value.html);
    if (element) root.appendChild(element);
  };

  onMounted(() => {
    root = createRoot(host.value!);
    render();
  });
  onBeforeUnmount(() => root && release(root));
  watch(() => preview.value?.html, render, { flush: 'post' });
</script>

<template>
  <div class="preview" data-testid="drag-preview">
    <div v-show="preview" class="frame" :style="{ width: `${(preview?.size.w ?? 0) * scale}px`, height: `${(preview?.size.h ?? 0) * scale}px` }">
      <div
        ref="host"
        class="host"
        :style="{ width: `${preview?.size.w ?? 0}px`, height: `${preview?.size.h ?? 0}px`, transform: `scale(${scale})` }"
      />
    </div>
    <p v-if="!preview" class="mute">The overlay shows here during a drag.</p>
  </div>
</template>

<style scoped>
  .preview {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 60px;
    padding: 8px;
    border: 1px dashed var(--border);
    border-radius: var(--radius);
    background:
      repeating-conic-gradient(var(--bg-soft) 0 25%, var(--bg) 0 50%) 0 0 / 12px 12px;
  }

  .frame {
    position: relative;
    overflow: hidden;
  }

  .host {
    position: absolute;
    left: 0;
    top: 0;
    transform-origin: 0 0;
  }

  p {
    margin: 0;
    text-align: center;
  }
</style>
