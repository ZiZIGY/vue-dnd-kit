<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { useHTMLBuilderStore } from '../utils';

  const builderStore = useHTMLBuilderStore();

  const widthValue = ref<number>(0);
  const widthUnit = ref<string>('px');
  const heightValue = ref<number>(0);
  const heightUnit = ref<string>('px');

  const minWidthValue = ref<number>(0);
  const minWidthUnit = ref<string>('px');
  const minHeightValue = ref<number>(0);
  const minHeightUnit = ref<string>('px');

  const maxWidthValue = ref<number>(0);
  const maxWidthUnit = ref<string>('px');
  const maxHeightValue = ref<number>(0);
  const maxHeightUnit = ref<string>('px');

  watch(
    () => builderStore.activeElement.value,
    (newElement) => {
      if (newElement?.style?.width) {
        const width = newElement.style.width.toString();
        const numValue = parseFloat(width);
        const unit = width.replace(/[\d.]/g, '');

        widthValue.value = isNaN(numValue) ? 0 : numValue;
        widthUnit.value = unit || 'px';
      }

      if (newElement?.style?.height) {
        const height = newElement.style.height.toString();
        const numValue = parseFloat(height);
        const unit = height.replace(/[\d.]/g, '');

        heightValue.value = isNaN(numValue) ? 0 : numValue;
        heightUnit.value = unit || 'px';
      }

      if (newElement?.style?.minWidth) {
        const minWidth = newElement.style.minWidth.toString();
        const numValue = parseFloat(minWidth);
        const unit = minWidth.replace(/[\d.]/g, '');

        minWidthValue.value = isNaN(numValue) ? 0 : numValue;
        minWidthUnit.value = unit || 'px';
      }

      if (newElement?.style?.minHeight) {
        const minHeight = newElement.style.minHeight.toString();
        const numValue = parseFloat(minHeight);
        const unit = minHeight.replace(/[\d.]/g, '');

        minHeightValue.value = isNaN(numValue) ? 0 : numValue;
        minHeightUnit.value = unit || 'px';
      }

      if (newElement?.style?.maxWidth) {
        const maxWidth = newElement.style.maxWidth.toString();
        const numValue = parseFloat(maxWidth);
        const unit = maxWidth.replace(/[\d.]/g, '');

        maxWidthValue.value = isNaN(numValue) ? 0 : numValue;
        maxWidthUnit.value = unit || 'px';
      }

      if (newElement?.style?.maxHeight) {
        const maxHeight = newElement.style.maxHeight.toString();
        const numValue = parseFloat(maxHeight);
        const unit = maxHeight.replace(/[\d.]/g, '');

        maxHeightValue.value = isNaN(numValue) ? 0 : numValue;
        maxHeightUnit.value = unit || 'px';
      }
    },
    { immediate: true }
  );

  function updateWidth() {
    if (builderStore.activeElement.value?.style) {
      builderStore.activeElement.value.style.width = `${widthValue.value}${widthUnit.value}`;
    }
  }

  function updateHeight() {
    if (builderStore.activeElement.value?.style) {
      builderStore.activeElement.value.style.height = `${heightValue.value}${heightUnit.value}`;
    }
  }

  function updateMinWidth() {
    if (builderStore.activeElement.value?.style) {
      builderStore.activeElement.value.style.minWidth = `${minWidthValue.value}${minWidthUnit.value}`;
    }
  }

  function updateMinHeight() {
    if (builderStore.activeElement.value?.style) {
      builderStore.activeElement.value.style.minHeight = `${minHeightValue.value}${minHeightUnit.value}`;
    }
  }

  function updateMaxWidth() {
    if (builderStore.activeElement.value?.style) {
      builderStore.activeElement.value.style.maxWidth = `${maxWidthValue.value}${maxWidthUnit.value}`;
    }
  }

  function updateMaxHeight() {
    if (builderStore.activeElement.value?.style) {
      builderStore.activeElement.value.style.maxHeight = `${maxHeightValue.value}${maxHeightUnit.value}`;
    }
  }
</script>

<template>
  <fieldset>
    <legend>Dimensions</legend>

    <!-- Ширина -->
    <div class="form-group">
      <label>Width</label>
      <div class="dimension-control">
        <input
          v-if="builderStore.activeElement.value?.style?.width !== undefined"
          type="number"
          min="0"
          max="1000"
          v-model="widthValue"
          @input="updateWidth"
        />
        <select
          v-if="builderStore.activeElement.value?.style?.width !== undefined"
          v-model="widthUnit"
          @change="updateWidth"
        >
          <option value="px">px</option>
          <option value="%">%</option>
          <option value="em">em</option>
          <option value="rem">rem</option>
          <option value="vw">vw</option>
          <option value="vh">vh</option>
          <option value="auto">auto</option>
        </select>
      </div>
    </div>

    <!-- Высота -->
    <div class="form-group">
      <label>Height</label>
      <div class="dimension-control">
        <input
          v-if="builderStore.activeElement.value?.style?.height !== undefined"
          type="number"
          min="0"
          max="1000"
          v-model="heightValue"
          @input="updateHeight"
        />
        <select
          v-if="builderStore.activeElement.value?.style?.height !== undefined"
          v-model="heightUnit"
          @change="updateHeight"
        >
          <option value="px">px</option>
          <option value="%">%</option>
          <option value="em">em</option>
          <option value="rem">rem</option>
          <option value="vw">vw</option>
          <option value="vh">vh</option>
          <option value="auto">auto</option>
        </select>
      </div>
    </div>

    <!-- Мин/макс размеры -->
    <div class="form-group">
      <label>Min Width</label>
      <div class="dimension-control">
        <input
          v-if="builderStore.activeElement.value?.style?.minWidth !== undefined"
          type="number"
          min="0"
          max="1000"
          v-model="minWidthValue"
          @input="updateMinWidth"
        />
        <select
          v-if="builderStore.activeElement.value?.style?.minWidth !== undefined"
          v-model="minWidthUnit"
          @change="updateMinWidth"
        >
          <option value="px">px</option>
          <option value="%">%</option>
          <option value="em">em</option>
          <option value="rem">rem</option>
          <option value="vw">vw</option>
          <option value="vh">vh</option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label>Min Height</label>
      <div class="dimension-control">
        <input
          v-if="
            builderStore.activeElement.value?.style?.minHeight !== undefined
          "
          type="number"
          min="0"
          max="1000"
          v-model="minHeightValue"
          @input="updateMinHeight"
        />
        <select
          v-if="
            builderStore.activeElement.value?.style?.minHeight !== undefined
          "
          v-model="minHeightUnit"
          @change="updateMinHeight"
        >
          <option value="px">px</option>
          <option value="%">%</option>
          <option value="em">em</option>
          <option value="rem">rem</option>
          <option value="vw">vw</option>
          <option value="vh">vh</option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label>Max Width</label>
      <div class="dimension-control">
        <input
          v-if="builderStore.activeElement.value?.style?.maxWidth !== undefined"
          type="number"
          min="0"
          max="1000"
          v-model="maxWidthValue"
          @input="updateMaxWidth"
        />
        <select
          v-if="builderStore.activeElement.value?.style?.maxWidth !== undefined"
          v-model="maxWidthUnit"
          @change="updateMaxWidth"
        >
          <option value="px">px</option>
          <option value="%">%</option>
          <option value="em">em</option>
          <option value="rem">rem</option>
          <option value="vw">vw</option>
          <option value="vh">vh</option>
          <option value="none">none</option>
        </select>
      </div>
    </div>

    <div class="form-group">
      <label>Max Height</label>
      <div class="dimension-control">
        <input
          v-if="
            builderStore.activeElement.value?.style?.maxHeight !== undefined
          "
          type="number"
          min="0"
          max="1000"
          v-model="maxHeightValue"
          @input="updateMaxHeight"
        />
        <select
          v-if="
            builderStore.activeElement.value?.style?.maxHeight !== undefined
          "
          v-model="maxHeightUnit"
          @change="updateMaxHeight"
        >
          <option value="px">px</option>
          <option value="%">%</option>
          <option value="em">em</option>
          <option value="rem">rem</option>
          <option value="vw">vw</option>
          <option value="vh">vh</option>
          <option value="none">none</option>
        </select>
      </div>
    </div>
  </fieldset>
</template>

<style scoped>
  .dimension-control {
    display: flex;
    align-items: center;
    gap: 5px;
  }
</style>
