<script setup lang="ts">
import { onMounted, useTemplateRef, watch } from 'vue';

/**
 * A text of the site, edited in place: plain `contenteditable`, no rich-text engine. While
 * it is edited, the DOM leads and the model follows, so the caret never jumps. The rest of
 * the time the DOM follows the model: undo, redo, a copy's text.
 */
const text = defineModel<string>({ required: true });
const props = defineProps<{ tag?: string; editing?: boolean }>();
const emit = defineEmits<{ finish: [] }>();

const el = useTemplateRef<HTMLElement>('el');
const show = () => {
  if (!props.editing && el.value && el.value.textContent !== text.value) el.value.textContent = text.value;
};
onMounted(show);
watch([text, () => props.editing], show, { flush: 'post' });
</script>

<template>
  <!-- Enter and Escape finish; Escape goes no further (no deselect, the docs' frame stays). -->
  <component
    :is="tag ?? 'span'"
    ref="el"
    class="editable"
    :contenteditable="editing ? 'plaintext-only' : undefined"
    spellcheck="false"
    @input="text = ($event.target as HTMLElement).textContent ?? ''"
    @keydown.enter.prevent="emit('finish')"
    @keydown.esc.stop.prevent="emit('finish')"
  />
</template>

<style scoped>
.editable {
  overflow-wrap: anywhere;
}

.editable[contenteditable] {
  outline: none;
  cursor: text;
}

/* The caret's line: a soft highlight of the text being edited. */
.editable[contenteditable]:focus {
  border-radius: 2px;
  background: rgb(66 184 131 / 0.14);
  box-shadow: 0 0 0 3px rgb(66 184 131 / 0.14);
}
</style>
