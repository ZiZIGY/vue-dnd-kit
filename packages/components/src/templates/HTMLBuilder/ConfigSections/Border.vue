<script setup lang="ts">
  import { useHTMLBuilderStore } from '../utils';

  const builderStore = useHTMLBuilderStore();
</script>

<template>
  <fieldset>
    <legend>Border</legend>

    <div class="form-group">
      <label>Border Width</label>
      <input
        v-if="
          builderStore.activeElement.value?.style?.borderWidth !== undefined
        "
        @input="
          (event: Event) => {
            builderStore.activeElement.value!.style!.borderWidth =
              (event.target as HTMLInputElement).value + 'px';
          }
        "
        type="range"
        min="0"
        max="20"
        step="1"
        :value="parseInt(builderStore.activeElement.value?.style?.borderWidth as string) || 0"
      />
    </div>

    <!-- Цвет границы -->
    <div class="form-group">
      <label>Border Color</label>
      <input
        v-if="
          builderStore.activeElement.value?.style?.borderColor !== undefined
        "
        @input="
          (event: Event) => {
            builderStore.activeElement.value!.style!.borderColor =
              (event.target as HTMLInputElement).value;
          }
        "
        type="color"
        :value="
          builderStore.activeElement.value?.style?.borderColor || '#000000'
        "
      />
    </div>

    <!-- Стиль границы -->
    <div class="form-group">
      <label>Border Style</label>
      <select
        v-if="
          builderStore.activeElement.value?.style?.borderStyle !== undefined
        "
        @change="
          (event: Event) => {
            builderStore.activeElement.value!.style!.borderStyle =
              (event.target as HTMLSelectElement).value;
          }
        "
      >
        <option value="solid">Solid</option>
        <option value="dashed">Dashed</option>
        <option value="dotted">Dotted</option>
        <option value="double">Double</option>
        <option value="groove">Groove</option>
        <option value="ridge">Ridge</option>
        <option value="inset">Inset</option>
        <option value="outset">Outset</option>
        <option value="none">None</option>
      </select>
    </div>

    <div class="border-radius-section">
      <h4>Border Radius</h4>

      <!-- Верхний левый угол -->
      <div class="form-group">
        <label>Top Left</label>
        <input
          v-if="
            builderStore.activeElement.value?.style?.borderTopLeftRadius !==
            undefined
          "
          @input="
            (event: Event) => {
              builderStore.activeElement.value!.style!.borderTopLeftRadius =
                (event.target as HTMLInputElement).value + 'px';
            }
          "
          type="range"
          min="0"
          max="50"
          step="1"
          :value="parseInt(builderStore.activeElement.value?.style?.borderTopLeftRadius as string) || 0"
        />
      </div>

      <!-- Верхний правый угол -->
      <div class="form-group">
        <label>Top Right</label>
        <input
          v-if="
            builderStore.activeElement.value?.style?.borderTopRightRadius !==
            undefined
          "
          @input="
            (event: Event) => {
              builderStore.activeElement.value!.style!.borderTopRightRadius =
                (event.target as HTMLInputElement).value + 'px';
            }
          "
          type="range"
          min="0"
          max="50"
          step="1"
          :value="parseInt(builderStore.activeElement.value?.style?.borderTopRightRadius as string) || 0"
        />
      </div>

      <!-- Нижний правый угол -->
      <div class="form-group">
        <label>Bottom Right</label>
        <input
          v-if="
            builderStore.activeElement.value?.style?.borderBottomRightRadius !==
            undefined
          "
          @input="
            (event: Event) => {
              builderStore.activeElement.value!.style!.borderBottomRightRadius =
                (event.target as HTMLInputElement).value + 'px';
            }
          "
          type="range"
          min="0"
          max="50"
          step="1"
          :value="parseInt(builderStore.activeElement.value?.style?.borderBottomRightRadius as string) || 0"
        />
      </div>

      <!-- Нижний левый угол -->
      <div class="form-group">
        <label>Bottom Left</label>
        <input
          v-if="
            builderStore.activeElement.value?.style?.borderBottomLeftRadius !==
            undefined
          "
          @input="
            (event: Event) => {
              builderStore.activeElement.value!.style!.borderBottomLeftRadius =
                (event.target as HTMLInputElement).value + 'px';
            }
          "
          type="range"
          min="0"
          max="50"
          step="1"
          :value="parseInt(builderStore.activeElement.value?.style?.borderBottomLeftRadius as string) || 0"
        />
      </div>
    </div>
  </fieldset>
</template>
