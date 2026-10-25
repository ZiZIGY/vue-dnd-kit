<script setup lang="ts">
  import { onMounted, useTemplateRef } from 'vue';

  defineProps<{ title: string; message: string; confirmLabel: string }>();
  const emit = defineEmits<{ answer: [ok: boolean] }>();
  const accept = useTemplateRef<HTMLButtonElement>('accept');

  // The drop is pending while the dialog is open: Escape answers "no".
  onMounted(() => accept.value?.focus({ preventScroll: true }));
</script>

<template>
  <div
    class="tb-backdrop"
    @pointerdown.self="emit('answer', false)"
  >
    <div
      class="tb-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tb-dialog-title"
      data-testid="confirm"
      @keydown.esc.prevent="emit('answer', false)"
    >
      <h3 id="tb-dialog-title">{{ title }}</h3>
      <p>{{ message }}</p>
      <footer>
        <button
          type="button"
          class="tb-secondary"
          data-testid="confirm-cancel"
          @click="emit('answer', false)"
        >
          Cancel
        </button>
        <button
          ref="accept"
          type="button"
          class="tb-primary"
          data-testid="confirm-accept"
          @click="emit('answer', true)"
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
    background: rgb(15 23 42 / 0.35);
  }

  .tb-dialog {
    width: 340px;
    padding: 20px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 24px 48px rgb(15 23 42 / 0.25);
  }

  h3 {
    margin: 0 0 8px;
    font-size: 16px;
  }

  p {
    margin: 0 0 20px;
    color: #475569;
  }

  footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  button {
    padding: 8px 14px;
    border-radius: 6px;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }

  .tb-secondary {
    border: 1px solid #cbd5e1;
    background: #fff;
    color: #334155;
  }

  .tb-primary {
    border: 1px solid #16a34a;
    background: #16a34a;
    color: #fff;
  }
</style>
