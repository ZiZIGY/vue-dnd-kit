<script setup lang="ts">
import { onMounted, useTemplateRef, watch } from 'vue';

/**
 * Plain editable text, no rich-text engine. Typing goes from the DOM into the model, and
 * the model is written back only when something else changed it (undo, a merge), so the
 * caret stays where it is while you type.
 */
const text = defineModel<string>({ required: true });
defineProps<{ tag?: string; placeholder: string }>();

const el = useTemplateRef<HTMLElement>('el');
const write = (value: string) => {
  if (el.value && el.value.textContent !== value) el.value.textContent = value;
};
onMounted(() => write(text.value));
watch(text, write);
</script>

<template>
  <component
    :is="tag ?? 'div'"
    ref="el"
    class="editable"
    contenteditable="plaintext-only"
    spellcheck="false"
    :data-placeholder="placeholder"
    :data-empty="!text || undefined"
    @input="text = ($event.target as HTMLElement).textContent ?? ''"
  />
</template>

<style scoped>
.editable {
  position: relative;
  min-width: 0;
  margin: 0;
  outline: none;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  cursor: text;
}

/* Laid over the empty field, so the caret stays at its start. */
.editable[data-empty]::before {
  content: attr(data-placeholder);
  position: absolute;
  inset: 0 0 auto;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.32;
  pointer-events: none;
}
</style>
