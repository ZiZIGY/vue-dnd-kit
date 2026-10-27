<script setup lang="ts" generic="T extends string">
const model = defineModel<T>({ required: true });
defineProps<{ name: string; options: T[] }>();
</script>

<template>
  <fieldset class="segmented">
    <legend>{{ name }}</legend>
    <div class="options">
      <label v-for="option in options" :key="option" :class="{ on: model === option }">
        <input v-model="model" type="radio" :value="option" />
        {{ option }}
      </label>
    </div>
  </fieldset>
</template>

<style scoped>
.segmented {
  margin: 0;
  padding: 0;
  border: 0;
}

legend {
  margin-bottom: 6px;
  font: 10px/1 ui-monospace, Menlo, Consolas, monospace;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  opacity: 0.55;
}

.options {
  display: inline-flex;
  padding: 3px;
  border-radius: 9px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

label {
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 12px;
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
