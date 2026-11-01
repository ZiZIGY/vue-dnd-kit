<script setup lang="ts" generic="T">
// One option's values, as buttons: the pressed one is the value in effect.
defineProps<{ name: string; options: { label: string; value: T }[] }>();
const model = defineModel<T>({ required: true });
</script>

<template>
  <code class="name">{{ name }}</code>
  <div class="options" role="group" :aria-label="name">
    <button
      v-for="option in options"
      :key="option.label"
      type="button"
      :aria-pressed="model === option.value"
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.name {
  align-self: center;
  font: 600 12px/1 ui-monospace, Menlo, Consolas, monospace;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  padding: 3px;
  border-radius: 10px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

button {
  padding: 6px 8px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font: 12px/1.2 ui-monospace, Menlo, Consolas, monospace;
  cursor: pointer;
}

button[aria-pressed='true'] {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
}

button:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 2px;
}
</style>
