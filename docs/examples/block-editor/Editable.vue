<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';

/**
 * Plain editable text, no rich-text engine. The text goes from the DOM into the model
 * and never back (only once, on mount), so typing keeps the caret where it is.
 */
const text = defineModel<string>({ required: true });
defineProps<{ tag?: string; placeholder: string }>();

const el = useTemplateRef<HTMLElement>('el');
onMounted(() => (el.value!.textContent = text.value));
</script>

<template>
  <component
    :is="tag ?? 'p'"
    ref="el"
    class="editable"
    contenteditable="plaintext-only"
    :data-placeholder="placeholder"
    @input="text = ($event.target as HTMLElement).textContent ?? ''"
  />
</template>

<style scoped>
.editable {
  min-width: 0;
  outline: none;
  overflow-wrap: anywhere;
  cursor: text;
}

.editable:empty::before {
  content: attr(data-placeholder);
  opacity: 0.35;
}
</style>
