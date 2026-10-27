<script setup lang="ts" generic="T extends string">
import { useId } from 'vue';

const model = defineModel<T>({ required: true });
defineProps<{ name: string; options: T[] }>();
const id = useId();
</script>

<template>
  <code :id="id" class="name">{{ name }}</code>
  <div class="options" role="radiogroup" :aria-labelledby="id">
    <label v-for="option in options" :key="option" :class="{ on: model === option }">
      <input v-model="model" type="radio" :value="option" />
      {{ option }}
    </label>
  </div>
</template>

<style scoped>
.name {
  font: 12px/1 ui-monospace, Menlo, Consolas, monospace;
  color: #42b883;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 2px;
  justify-self: start;
  padding: 3px;
  border-radius: 9px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

label {
  padding: 4px 9px;
  border-radius: 6px;
  font: 12px/1.3 ui-monospace, Menlo, Consolas, monospace;
  cursor: pointer;
}

label.on {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.25);
  font-weight: 600;
}

label:has(input:focus-visible) {
  outline: 2px solid #42b883;
}

input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
</style>
