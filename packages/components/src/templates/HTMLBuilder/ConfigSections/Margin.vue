<script setup lang="ts">
  import { useHTMLBuilderStore } from '../utils';

  const builderStore = useHTMLBuilderStore();
</script>

<template>
  <fieldset>
    <legend>Margin</legend>

    <input
      v-if="builderStore.activeElement.value?.style?.marginTop !== undefined"
      @input="
            (event: Event) => {
              builderStore.activeElement.value!.style!.marginTop =
                (event.target as HTMLInputElement).value + 'px';
            }
          "
      type="range"
      min="0"
      max="100"
      step="1"
    />
    <input
      v-if="builderStore.activeElement.value?.style?.marginRight !== undefined"
      @input="
            (event: Event) => {
              builderStore.activeElement.value!.style!.marginRight =
                (event.target as HTMLInputElement).value + 'px';
            }
          "
      type="range"
      min="0"
      max="100"
      step="1"
    />
    <input
      v-if="builderStore.activeElement.value?.style?.marginBottom !== undefined"
      @input="
            (event: Event) => {
              builderStore.activeElement.value!.style!.marginBottom =
                (event.target as HTMLInputElement).value + 'px';
            }
          "
      type="range"
      min="0"
      max="100"
      step="1"
    />
    <input
      v-if="builderStore.activeElement.value?.style?.marginLeft !== undefined"
      @input="
            (event: Event) => {
              builderStore.activeElement.value!.style!.marginLeft =
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
