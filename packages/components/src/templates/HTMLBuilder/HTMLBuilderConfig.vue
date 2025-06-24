<script setup lang="ts">
  import Padding from './ConfigSections/Padding.vue';
  import Margin from './ConfigSections/Margin.vue';
  import Border from './ConfigSections/Border.vue';
  import Display from './ConfigSections/Display.vue';
  import Background from './ConfigSections/Background.vue';
  import Dimensions from './ConfigSections/Dimensions.vue';
</script>

<template>
  <div class="html-builder-config-container">
    <div class="html-builder-config-sections">
      <div class="html-builder-config-section">
        <Padding />
      </div>
      <div class="html-builder-config-section">
        <Margin />
      </div>
      <div class="html-builder-config-section">
        <Border />
      </div>
      <div class="html-builder-config-section">
        <Display />
      </div>
      <div class="html-builder-config-section">
        <Background />
      </div>
      <div class="html-builder-config-section">
        <Dimensions />
      </div>
    </div>
  </div>
</template>
