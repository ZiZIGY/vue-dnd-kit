<script setup lang="ts">
import { inject, nextTick, ref, useTemplateRef } from 'vue';
import Icon from './Icon.vue';
import { BOARD, type Column } from './store';

// Quick add at the bottom of a column: type a title, Enter adds it, Escape closes.
const props = defineProps<{ column: Column; full: boolean }>();
const emit = defineEmits<{ added: [] }>();
const board = inject(BOARD)!;

const writing = ref(false);
const title = ref('');
const field = useTemplateRef<HTMLTextAreaElement>('field');
const button = useTemplateRef<HTMLButtonElement>('button');

const open = async () => {
  writing.value = true;
  await nextTick();
  field.value?.focus();
};
const close = async () => {
  writing.value = false;
  title.value = '';
  await nextTick();
  button.value?.focus();
};

// It stays open for the next card, until the column reaches its limit.
const submit = () => {
  const text = title.value.trim();
  if (!text) return;
  board.add(props.column, text);
  title.value = '';
  emit('added');
  if (props.column.limit && props.column.cards.length >= props.column.limit) void close();
};
</script>

<template>
  <form v-if="writing" class="composer" @submit.prevent="submit" @keydown.esc.prevent="close">
    <textarea
      ref="field"
      v-model="title"
      rows="2"
      placeholder="What needs doing?"
      :aria-label="`New card in ${column.title}`"
      @keydown.enter.exact.prevent="submit"
    />
    <div class="actions">
      <button type="submit" class="primary" :disabled="!title.trim()">Add card</button>
      <button type="button" class="ghost" aria-label="Close" @click="close"><Icon name="close" /></button>
      <span class="keys"><kbd>↵</kbd> add · <kbd>esc</kbd> close</span>
    </div>
  </form>
  <button v-else ref="button" type="button" class="add" :disabled="full" @click="open">
    <Icon :name="full ? 'limit' : 'plus'" />
    {{ full ? 'At its limit' : 'Add card' }}
  </button>
</template>

<style scoped>
.add {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 8px 8px;
  padding: 8px;
  border: 0;
  border-radius: 9px;
  background: none;
  color: inherit;
  font: 500 12px/1 system-ui, sans-serif;
  opacity: 0.6;
  cursor: pointer;
  transition:
    background-color 0.15s,
    opacity 0.15s;
}

.add:hover:not(:disabled) {
  background: color-mix(in srgb, currentColor 7%, transparent);
  opacity: 1;
}

.add:disabled {
  opacity: 0.35;
  cursor: default;
}

.add:focus-visible,
button:focus-visible,
textarea:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 1px;
}

.composer {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin: 0 10px 10px;
}

textarea {
  display: block;
  padding: 9px 11px;
  border: 0;
  border-radius: 10px;
  background: light-dark(#fff, #1c1c20);
  box-shadow:
    0 0 0 1px light-dark(rgb(15 15 20 / 0.12), rgb(255 255 255 / 0.1)),
    0 6px 14px -8px rgb(0 0 0 / 0.35);
  color: inherit;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.4;
  resize: none;
}

.actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.actions button {
  display: inline-grid;
  place-items: center;
  height: 28px;
  padding: 0 10px;
  border: 0;
  border-radius: 7px;
  font: 600 12px/1 system-ui, sans-serif;
  cursor: pointer;
}

.primary {
  background: #42b883;
  color: #fff;
}

.primary:disabled {
  opacity: 0.5;
  cursor: default;
}

.ghost {
  width: 28px;
  padding: 0;
  background: none;
  color: inherit;
  font-size: 15px;
  opacity: 0.6;
}

.ghost:hover {
  background: color-mix(in srgb, currentColor 8%, transparent);
  opacity: 1;
}

.keys {
  margin-left: auto;
  font-size: 11px;
  opacity: 0.45;
  white-space: nowrap;
}

kbd {
  font: inherit;
}
</style>
