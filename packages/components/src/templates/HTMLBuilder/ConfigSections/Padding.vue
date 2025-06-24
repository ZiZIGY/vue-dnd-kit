<script setup lang="ts">
  import { useHTMLBuilderStore } from '../utils';

  const builderStore = useHTMLBuilderStore();
</script>

<template>
  <fieldset>
    <legend>Padding</legend>

    <div class="form-group">
      <label>Top</label>
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
        :value="parseInt(builderStore.activeElement.value?.style?.paddingTop as string) || 0"
      />
    </div>

    <div class="form-group">
      <label>Right</label>
      <input
        v-if="
          builderStore.activeElement.value?.style?.paddingRight !== undefined
        "
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
        :value="parseInt(builderStore.activeElement.value?.style?.paddingRight as string) || 0"
      />
    </div>

    <div class="form-group">
      <label>Bottom</label>
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
        :value="parseInt(builderStore.activeElement.value?.style?.paddingBottom as string) || 0"
      />
    </div>

    <div class="form-group">
      <label>Left</label>
      <input
        v-if="
          builderStore.activeElement.value?.style?.paddingLeft !== undefined
        "
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
        :value="parseInt(builderStore.activeElement.value?.style?.paddingLeft as string) || 0"
      />
    </div>
  </fieldset>
</template>
