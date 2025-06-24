<script setup lang="ts">
  import { CSSProperties } from 'vue';
  import { useHTMLBuilderStore } from '../utils';

  const builderStore = useHTMLBuilderStore();
</script>

<template>
  <fieldset>
    <legend>Background</legend>

    <!-- Цвет фона -->
    <div class="form-group">
      <label>Background Color</label>
      <input
        v-if="
          builderStore.activeElement.value?.style?.backgroundColor !== undefined
        "
        type="color"
        @input="
          (event: Event) => {
            builderStore.activeElement.value!.style!.backgroundColor =
              (event.target as HTMLInputElement).value;
          }
        "
        :value="
          builderStore.activeElement.value?.style?.backgroundColor || '#ffffff'
        "
      />
    </div>

    <!-- Фоновое изображение по URL -->
    <div class="form-group">
      <label>Background Image URL</label>
      <input
        v-if="
          builderStore.activeElement.value?.style?.backgroundImage !== undefined
        "
        type="text"
        placeholder="https://picsum.photos/200/300"
        @input="
          (event: Event) => {
            const url = (event.target as HTMLInputElement).value;
            builderStore.activeElement.value!.style!.backgroundImage = url
              ? `url(${url})`
              : '';
          }
        "
        :value="
          builderStore.activeElement.value?.style?.backgroundImage
            ? builderStore.activeElement.value.style.backgroundImage
                .replace('url(', '')
                .replace(')', '')
            : ''
        "
      />
    </div>

    <!-- Размер фонового изображения -->
    <div class="form-group">
      <label>Background Size</label>
      <select
        v-if="
          builderStore.activeElement.value?.style?.backgroundSize !== undefined
        "
        @change="
          (event: Event) => {
            builderStore.activeElement.value!.style!.backgroundSize = (
              event.target as HTMLSelectElement
            ).value as CSSProperties['backgroundSize'];
          }
        "
      >
        <option value="auto">Auto</option>
        <option value="cover">Cover</option>
        <option value="contain">Contain</option>
        <option value="100%">100%</option>
        <option value="100% 100%">100% 100%</option>
      </select>
    </div>

    <!-- Повтор фонового изображения -->
    <div class="form-group">
      <label>Background Repeat</label>
      <select
        v-if="
          builderStore.activeElement.value?.style?.backgroundRepeat !==
          undefined
        "
        @change="
          (event: Event) => {
            builderStore.activeElement.value!.style!.backgroundRepeat = (
              event.target as HTMLSelectElement
            ).value as CSSProperties['backgroundRepeat'];
          }
        "
      >
        <option value="repeat">Repeat</option>
        <option value="repeat-x">Repeat X</option>
        <option value="repeat-y">Repeat Y</option>
        <option value="no-repeat">No Repeat</option>
      </select>
    </div>

    <!-- Позиция фонового изображения -->
    <div class="form-group">
      <label>Background Position</label>
      <select
        v-if="
          builderStore.activeElement.value?.style?.backgroundPosition !==
          undefined
        "
        @change="
          (event: Event) => {
            builderStore.activeElement.value!.style!.backgroundPosition = (
              event.target as HTMLSelectElement
            ).value as CSSProperties['backgroundPosition'];
          }
        "
      >
        <option value="center">Center</option>
        <option value="top">Top</option>
        <option value="bottom">Bottom</option>
        <option value="left">Left</option>
        <option value="right">Right</option>
        <option value="top left">Top Left</option>
        <option value="top right">Top Right</option>
        <option value="bottom left">Bottom Left</option>
        <option value="bottom right">Bottom Right</option>
      </select>
    </div>
  </fieldset>
</template>
