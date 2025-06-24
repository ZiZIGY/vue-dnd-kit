<script setup lang="ts">
  import { useHTMLBuilderStore } from '../utils';

  const builderStore = useHTMLBuilderStore();
</script>

<template>
  <fieldset>
    <legend>Padding</legend>
    <input
      v-if="builderStore.activeElement.value?.style?.paddingTop !== undefined"
      @input="
            (event: Event) => {
              builderStore.activeElement.value!.style!.paddingTop =
                (event.target as HTMLInputElement).value + 'px';
            }
          "
      type="range"
      min="0"
      max="100"
      step="1"
    />
    <input
      v-if="builderStore.activeElement.value?.style?.paddingRight !== undefined"
      @input="
            (event: Event) => {
              builderStore.activeElement.value!.style!.paddingRight =
                (event.target as HTMLInputElement).value + 'px';
            }
          "
      type="range"
      min="0"
      max="100"
      step="1"
    />
    <input
      v-if="
        builderStore.activeElement.value?.style?.paddingBottom !== undefined
      "
      @input="
            (event: Event) => {
              builderStore.activeElement.value!.style!.paddingBottom =
                (event.target as HTMLInputElement).value + 'px';
            }
          "
      type="range"
      min="0"
      max="100"
      step="1"
    />
    <input
      v-if="builderStore.activeElement.value?.style?.paddingLeft !== undefined"
      @input="
            (event: Event) => {
              builderStore.activeElement.value!.style!.paddingLeft =
                (event.target as HTMLInputElement).value + 'px';
            }
          "
      type="range"
      min="0"
      max="100"
      step="1"
    />
  </fieldset>
</template>

<style scoped>
  fieldset {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
</style>
