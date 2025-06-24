<script setup lang="ts">
  import { CSSProperties } from 'vue';
  import { useHTMLBuilderStore } from '../utils';

  const builderStore = useHTMLBuilderStore();
</script>

<template>
  <fieldset>
    <legend>Display</legend>

    <div class="form-group">
      <label>Display</label>
      <select
        v-if="builderStore.activeElement.value?.style?.display !== undefined"
        @change="
          (event: Event) => {
            builderStore.activeElement.value!.style!.display =
              (event.target as HTMLSelectElement).value as CSSProperties['display'];
          }
        "
      >
        <option value="block">Block</option>
        <option value="inline">Inline</option>
        <option value="inline-block">Inline Block</option>
        <option value="flex">Flex</option>
        <option value="grid">Grid</option>
        <option value="none">None</option>
      </select>
    </div>

    <template
      v-if="builderStore.activeElement.value?.style?.display === 'flex'"
    >
      <div class="form-group">
        <label>Flex Direction</label>
        <select
          v-if="
            builderStore.activeElement.value?.style?.flexDirection !== undefined
          "
          @change="
            (event: Event) => {
              builderStore.activeElement.value!.style!.flexDirection =
                (event.target as HTMLSelectElement).value as CSSProperties['flexDirection'];
            }
          "
        >
          <option value="row">Row</option>
          <option value="column">Column</option>
          <option value="row-reverse">Row Reverse</option>
          <option value="column-reverse">Column Reverse</option>
        </select>
      </div>

      <div class="form-group">
        <label>Justify Content</label>
        <select
          v-if="
            builderStore.activeElement.value?.style?.justifyContent !==
            undefined
          "
          @change="
            (event: Event) => {
              builderStore.activeElement.value!.style!.justifyContent =
                (event.target as HTMLSelectElement).value as CSSProperties['justifyContent'];
            }
          "
        >
          <option value="flex-start">Start</option>
          <option value="flex-end">End</option>
          <option value="center">Center</option>
          <option value="space-between">Space Between</option>
          <option value="space-around">Space Around</option>
          <option value="space-evenly">Space Evenly</option>
        </select>
      </div>

      <div class="form-group">
        <label>Align Items</label>
        <select
          v-if="
            builderStore.activeElement.value?.style?.alignItems !== undefined
          "
          @change="
            (event: Event) => {
              builderStore.activeElement.value!.style!.alignItems =
                (event.target as HTMLSelectElement).value as CSSProperties['alignItems'];
            }
          "
        >
          <option value="stretch">Stretch</option>
          <option value="flex-start">Start</option>
          <option value="flex-end">End</option>
          <option value="center">Center</option>
          <option value="baseline">Baseline</option>
        </select>
      </div>

      <div class="form-group">
        <label>Flex Wrap</label>
        <select
          v-if="builderStore.activeElement.value?.style?.flexWrap !== undefined"
          @change="
            (event: Event) => {
              builderStore.activeElement.value!.style!.flexWrap =
                (event.target as HTMLSelectElement).value as CSSProperties['flexWrap'];
            }
          "
        >
          <option value="nowrap">No Wrap</option>
          <option value="wrap">Wrap</option>
          <option value="wrap-reverse">Wrap Reverse</option>
        </select>
      </div>
    </template>

    <div class="form-group">
      <label>Position</label>
      <select
        v-if="builderStore.activeElement.value?.style?.position !== undefined"
        @change="
          (event: Event) => {
            builderStore.activeElement.value!.style!.position =
              (event.target as HTMLSelectElement).value as CSSProperties['position'];
          }
        "
      >
        <option value="static">Static</option>
        <option value="relative">Relative</option>
        <option value="absolute">Absolute</option>
        <option value="fixed">Fixed</option>
        <option value="sticky">Sticky</option>
      </select>
    </div>
  </fieldset>
</template>
