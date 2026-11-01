<script setup lang="ts">
import { ref } from 'vue';

// A colour: the swatch opens the system picker, the hex can be typed.
const props = defineProps<{ name: string; value: string }>();
const emit = defineEmits<{ change: [value: string] }>();

const draft = ref<string | null>(null);

const commit = () => {
  if (draft.value === null) return;
  const hex = /^#?([0-9a-f]{6})$/i.exec(draft.value.trim())?.[1];
  draft.value = null;
  if (hex && `#${hex.toLowerCase()}` !== props.value) emit('change', `#${hex.toLowerCase()}`);
};

const cancel = (event: KeyboardEvent) => {
  draft.value = null;
  (event.target as HTMLInputElement).blur();
};
</script>

<template>
  <div class="color">
    <input
      type="color"
      class="swatch"
      :value="value"
      :aria-label="`${name}, picker`"
      @input="emit('change', ($event.target as HTMLInputElement).value)"
    />
    <input
      class="hex"
      :value="draft ?? value.slice(1).toUpperCase()"
      :aria-label="`${name}, hex`"
      maxlength="7"
      spellcheck="false"
      @focus="($event.target as HTMLInputElement).select()"
      @input="draft = ($event.target as HTMLInputElement).value"
      @keydown.enter="commit"
      @keydown.esc.stop.prevent="cancel"
      @blur="commit"
    />
  </div>
</template>

<style scoped>
.color {
  display: flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 6px;
  border: 1px solid transparent;
  border-radius: 6px;
  background: var(--dc-field);
  transition: border-color 0.12s;
}

.color:hover {
  border-color: var(--dc-line);
}

.color:focus-within {
  border-color: #0d99ff;
}

.swatch {
  flex: none;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  border-radius: 4px;
  background: none;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.12);
  cursor: pointer;
  appearance: none;
}

.swatch::-webkit-color-swatch-wrapper {
  padding: 0;
}

.swatch::-webkit-color-swatch {
  border: 0;
  border-radius: 4px;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.12);
}

.swatch::-moz-color-swatch {
  border: 0;
  border-radius: 4px;
}

.swatch:focus-visible {
  outline: 2px solid #0d99ff;
  outline-offset: 1px;
}

.hex {
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0;
  border: 0;
  outline: none;
  background: none;
  color: inherit;
  font: 12px/1 ui-monospace, Menlo, Consolas, monospace;
  text-transform: uppercase;
}

@media (prefers-reduced-motion: reduce) {
  .color {
    transition: none;
  }
}
</style>
