<script setup lang="ts">
import { ref } from 'vue';

// A number field as in design tools: type a value, step it with the arrow keys (Shift: by
// 10), or drag its label sideways to scrub it.
const props = withDefaults(defineProps<{ label: string; name: string; value: number; min?: number }>(), {
  min: -Infinity,
});
const emit = defineEmits<{ change: [value: number] }>();

/** What is typed, until Enter or leaving the field applies it. */
const draft = ref<string | null>(null);

const set = (value: number) => {
  const next = Math.max(props.min, Math.round(value));
  if (next !== props.value) emit('change', next);
};

const commit = () => {
  if (draft.value === null) return;
  const typed = draft.value.trim();
  draft.value = null;
  if (typed !== '' && Number.isFinite(Number(typed))) set(Number(typed));
};

const step = (event: KeyboardEvent, direction: 1 | -1) => {
  event.preventDefault();
  draft.value = null;
  set(props.value + direction * (event.shiftKey ? 10 : 1));
};

const cancel = (event: KeyboardEvent) => {
  draft.value = null;
  (event.target as HTMLInputElement).blur();
};

// Scrubbing: the label captures the pointer, and each pixel sideways is one unit.
const scrub = (event: PointerEvent) => {
  if (event.button !== 0) return;
  event.preventDefault();
  const label = event.currentTarget as HTMLElement;
  label.setPointerCapture(event.pointerId);
  const start = props.value;
  const move = (next: PointerEvent) => set(start + (next.clientX - event.clientX) * (next.shiftKey ? 10 : 1));
  const end = () => {
    label.removeEventListener('pointermove', move);
    label.removeEventListener('pointerup', end);
    label.removeEventListener('pointercancel', end);
  };
  label.addEventListener('pointermove', move);
  label.addEventListener('pointerup', end);
  label.addEventListener('pointercancel', end);
};
</script>

<template>
  <div class="number">
    <span class="scrub" aria-hidden="true" :title="`Drag to change the ${name.toLowerCase()}`" @pointerdown="scrub">{{ label }}</span>
    <input
      :value="draft ?? value"
      inputmode="numeric"
      :aria-label="name"
      @focus="($event.target as HTMLInputElement).select()"
      @input="draft = ($event.target as HTMLInputElement).value"
      @keydown.enter="commit"
      @keydown.up="step($event, 1)"
      @keydown.down="step($event, -1)"
      @keydown.esc.stop.prevent="cancel"
      @blur="commit"
    />
  </div>
</template>

<style scoped>
.number {
  display: flex;
  align-items: center;
  min-width: 0;
  height: 28px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: var(--dc-field);
  transition:
    border-color 0.12s,
    background-color 0.12s;
}

.number:hover {
  border-color: var(--dc-line);
}

.number:focus-within {
  border-color: #0d99ff;
  background: Canvas;
}

.scrub {
  flex: none;
  min-width: 22px;
  padding: 0 2px 0 8px;
  color: var(--dc-muted);
  font-size: 11px;
  cursor: ew-resize;
  user-select: none;
  touch-action: none;
}

input {
  width: 100%;
  min-width: 0;
  height: 100%;
  padding: 0 6px 0 2px;
  border: 0;
  outline: none;
  background: none;
  color: inherit;
  font: inherit;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
}

@media (prefers-reduced-motion: reduce) {
  .number {
    transition: none;
  }
}
</style>
