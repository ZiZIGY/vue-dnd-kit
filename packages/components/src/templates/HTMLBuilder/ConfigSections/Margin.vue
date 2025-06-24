<script setup lang="ts">
  import { useHTMLBuilderStore } from '../utils';

  const builderStore = useHTMLBuilderStore();
</script>

<template>
  <fieldset>
    <legend>Margin</legend>

    <div class="form-group">
      <label>Top</label>
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
        :value="parseInt(builderStore.activeElement.value?.style?.marginTop as string) || 0"
      />
    </div>

    <div class="form-group">
      <label>Right</label>
      <input
        v-if="
          builderStore.activeElement.value?.style?.marginRight !== undefined
        "
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
        :value="parseInt(builderStore.activeElement.value?.style?.marginRight as string) || 0"
      />
    </div>

    <div class="form-group">
      <label>Bottom</label>
      <input
        v-if="
          builderStore.activeElement.value?.style?.marginBottom !== undefined
        "
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
        :value="parseInt(builderStore.activeElement.value?.style?.marginBottom as string) || 0"
      />
    </div>

    <div class="form-group">
      <label>Left</label>
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
        :value="parseInt(builderStore.activeElement.value?.style?.marginLeft as string) || 0"
      />
    </div>
  </fieldset>
</template>
