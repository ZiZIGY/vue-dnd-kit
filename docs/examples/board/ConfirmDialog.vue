<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import type { Answer, Task } from './types';

defineProps<{ cards: Task[] }>();
const emit = defineEmits<{ answer: [answer: Answer] }>();

const dialog = useTemplateRef<HTMLDialogElement>('dialog');
// A modal dialog sits on top of everything, the overlay waiting where it was let go too.
onMounted(() => dialog.value?.showModal());

const reply = (answer: Answer) => {
  dialog.value?.close();
  emit('answer', answer);
};
</script>

<template>
  <!-- Escape (the dialog's `cancel` event) answers like Cancel. -->
  <dialog ref="dialog" class="confirm" @cancel.prevent="reply('reject')">
    <p class="question">{{ cards.length > 1 ? `Move ${cards.length} cards to Done?` : 'Move to Done?' }}</p>
    <ul class="subjects">
      <li v-for="card in cards" :key="card.id">{{ card.title }}</li>
    </ul>
    <div class="actions">
      <button type="button" @click="reply('reject')">Cancel</button>
      <button type="button" @click="reply('continue')">Keep dragging</button>
      <button type="button" class="primary" autofocus @click="reply('accept')">Move</button>
    </div>
  </dialog>
</template>

<style scoped>
.confirm {
  /* A modal dialog centers itself with auto margins: keep them if a CSS reset zeroes margins. */
  margin: auto;
  width: min(340px, calc(100vw - 32px));
  padding: 20px;
  border: 1px solid color-mix(in srgb, currentColor 14%, transparent);
  border-radius: 14px;
  background: Canvas;
  color: CanvasText;
  box-shadow: 0 24px 48px -16px rgb(0 0 0 / 0.5);
}

.confirm::backdrop {
  background: rgb(0 0 0 / 0.4);
}

.question {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
}

.subjects {
  margin: 6px 0 18px;
  padding: 0;
  font-size: 13px;
  list-style: none;
  opacity: 0.7;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

button {
  padding: 7px 12px;
  border: 0;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  color: inherit;
  font: 600 12px/1.2 system-ui, sans-serif;
  cursor: pointer;
}

button.primary {
  background: #42b883;
  color: #fff;
}

button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}
</style>
