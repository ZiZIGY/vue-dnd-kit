<script setup lang="ts">
  import Padding from './ConfigSections/Padding.vue';
  import Margin from './ConfigSections/Margin.vue';
  import Border from './ConfigSections/Border.vue';
  import { useHTMLBuilderStore } from './utils';

  const builderStore = useHTMLBuilderStore();
</script>

<template>
  <div class="html-builder-config-container">
    <div class="html-builder-config-header">
      <span class="html-builder-config-title">
        {{
          builderStore.activeElement.value
            ? 'Element Settings'
            : 'Select an element to configure'
        }}
      </span>
    </div>

    <div
      v-if="builderStore.activeElement.value"
      class="html-builder-config-sections"
    >
      <div class="html-builder-config-section">
        <Padding />
      </div>
      <div class="html-builder-config-section">
        <Margin />
      </div>
      <div class="html-builder-config-section">
        <Border />
      </div>
    </div>

    <div
      v-else
      class="html-builder-config-empty"
    >
      <div class="html-builder-config-placeholder">
        <span class="html-builder-config-empty-icon">⚙️</span>
        <span class="html-builder-config-empty-text"
          >Click on any element to modify its properties</span
        >
      </div>
    </div>
  </div>
</template>
