<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import { useDnD } from '@vue-dnd-kit/core';
import Icon from './Icon.vue';
import type { Answer, Card } from './store';

defineProps<{ cards: Card[] }>();
const emit = defineEmits<{ answer: [answer: Answer] }>();

// While the drop waits, `useDnD()` keeps the drag as it was at release. Keep dragging is
// offered to a pointer that let go; the Status buttons play keyboard drags, with no hand to
// carry on with.
const { active } = useDnD();
const byHand = active.value?.sensor === 'pointer';

const dialog = useTemplateRef<HTMLDialogElement>('dialog');
// A modal dialog sits on top of everything, the overlay waiting where it was let go too.
onMounted(() => dialog.value?.showModal());

const reply = (answer: Answer) => {
  dialog.value?.close();
  emit('answer', answer);
};
</script>

<template>
  <!-- Escape answers like Cancel; handled here, it doesn't also leave the expanded frame. -->
  <dialog ref="dialog" class="confirm" @keydown.esc.prevent="reply('reject')" @cancel.prevent="reply('reject')">
    <span class="badge"><Icon name="check" /></span>
    <p class="question">{{ cards.length > 1 ? `Complete ${cards.length} cards?` : 'Complete this card?' }}</p>
    <p class="note">Cards in Done count as shipped in this sprint.</p>
    <ul class="subjects">
      <li v-for="card in cards" :key="card.id">
        <span class="id">{{ card.id }}</span>
        {{ card.title }}
      </li>
    </ul>
    <div class="actions">
      <button type="button" @click="reply('reject')">Cancel</button>
      <button v-if="byHand" type="button" @click="reply('continue')">Keep dragging</button>
      <button type="button" class="primary" autofocus @click="reply('accept')">Move to Done</button>
    </div>
  </dialog>
</template>

<style scoped>
.confirm {
  /* A modal dialog centers itself with auto margins: keep them if a CSS reset zeroes margins. */
  margin: auto;
  width: min(380px, calc(100vw - 32px));
  padding: 22px;
  box-sizing: border-box;
  border: 0;
  border-radius: 16px;
  background: light-dark(#fff, #18181b);
  box-shadow:
    0 0 0 1px light-dark(rgb(15 15 20 / 0.08), rgb(255 255 255 / 0.08)),
    0 30px 60px -20px rgb(0 0 0 / 0.6);
  color: CanvasText;
}

.confirm::backdrop {
  background: rgb(10 10 12 / 0.35);
  backdrop-filter: blur(2px);
}

.badge {
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  margin-bottom: 14px;
  border-radius: 10px;
  background: color-mix(in srgb, #42b883 16%, transparent);
  color: #42b883;
  font-size: 20px;
}

.question {
  margin: 0;
  font-size: 16px;
  font-weight: 650;
  letter-spacing: -0.01em;
}

.note {
  margin: 4px 0 14px;
  font-size: 13px;
  line-height: 1.5;
  opacity: 0.6;
}

.subjects {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 140px;
  margin: 0 0 20px;
  padding: 10px 12px;
  overflow-y: auto;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 5%, transparent);
  font-size: 13px;
  font-weight: 500;
  list-style: none;
}

.id {
  margin-right: 6px;
  font: 500 11px/1 'Geist Mono', ui-monospace, Menlo, Consolas, monospace;
  opacity: 0.5;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

button {
  height: 32px;
  padding: 0 12px;
  border: 0;
  border-radius: 8px;
  background: color-mix(in srgb, currentColor 8%, transparent);
  color: inherit;
  font: 600 12px/1 system-ui, sans-serif;
  cursor: pointer;
}

button:hover {
  background: color-mix(in srgb, currentColor 13%, transparent);
}

button.primary {
  background: #42b883;
  color: #fff;
}

button.primary:hover {
  background: #3aa776;
}

button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}

@media (prefers-reduced-motion: no-preference) {
  .confirm[open] {
    animation: appear 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
}

@keyframes appear {
  from {
    opacity: 0;
    scale: 0.96;
  }
}
</style>
