<script setup lang="ts">
  import { onMounted, useTemplateRef } from 'vue';
  import type { ConfirmAnswer } from './board';

  defineProps<{ title: string; message: string; confirmLabel: string }>();
  const emit = defineEmits<{ answer: [answer: ConfirmAnswer] }>();
  const accept = useTemplateRef<HTMLButtonElement>('accept');

  // The drop is pending while the dialog is open: Escape answers "no".
  onMounted(() => accept.value?.focus({ preventScroll: true }));
</script>

<template>
  <div
    class="tb-backdrop"
    @pointerdown.self="emit('answer', 'reject')"
  >
    <div
      class="tb-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tb-dialog-title"
      data-testid="confirm"
      @keydown.esc.prevent="emit('answer', 'reject')"
    >
      <h3 id="tb-dialog-title">{{ title }}</h3>
      <p>{{ message }}</p>
      <footer>
        <button
          type="button"
          class="tb-secondary"
          data-testid="confirm-cancel"
          @click="emit('answer', 'reject')"
        >
          Cancel
        </button>
        <!-- No drop, and the drag goes on: the card follows the pointer to another column. -->
        <button
          type="button"
          class="tb-secondary"
          data-testid="confirm-continue"
          @click="emit('answer', 'continue')"
        >
          Keep dragging
        </button>
        <button
          ref="accept"
          type="button"
          class="tb-primary"
          data-testid="confirm-accept"
          @click="emit('answer', 'accept')"
        >
          {{ confirmLabel }}
        </button>
      </footer>
    </div>
  </div>
</template>

<style scoped>
  .tb-backdrop {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--ui-backdrop);
  }

  .tb-dialog {
    width: 340px;
    padding: 20px;
    background: var(--ui-bg);
    border-radius: var(--ui-radius-lg);
    box-shadow:
      0 0 0 1px var(--ui-border-accented),
      var(--ui-shadow-overlay);
  }

  h3 {
    margin: 0 0 8px;
    font-size: 16px;
  }

  p {
    margin: 0 0 20px;
    color: var(--ui-text-muted);
  }

  footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
  }

  button {
    padding: 8px 14px;
    border-radius: var(--ui-radius-sm);
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  .tb-secondary {
    border: 1px solid var(--ui-border-accented);
    background: var(--ui-bg);
    color: var(--ui-text);
  }

  .tb-secondary:hover {
    background: var(--ui-bg-elevated);
  }

  .tb-primary {
    border: 1px solid var(--ui-primary);
    background: var(--ui-primary);
    color: var(--ui-on-primary);
  }
</style>
