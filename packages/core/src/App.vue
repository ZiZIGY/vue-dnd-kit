<script setup lang="ts">
  import { ref } from 'vue';

  import DnDProvider from './external/components/DnDProvider.vue';
  import Draggable from './internal/components/Draggable.vue';
  import AxisBox from './internal/components/AxisBox.vue';
import SelectionArea from './internal/components/SelectionArea.vue';

  const test = ref([1, 2, 3, 4, 5, 6, 7]);
</script>

<template>
  <DnDProvider>
    <SelectionArea>
      <AxisBox axis="y" restrict-to-area>
        <Draggable v-for="(key, index) in test" :key :index="index" :source="test">value - {{ key }}
            <AxisBox axis="y" restrict-to-area>
              <Draggable v-for="(key, index) in test" :key :index="index" :source="test">value - {{ key }}</Draggable>
            </AxisBox>
        </Draggable>
      </AxisBox>
    </SelectionArea>
  </DnDProvider>
</template>

<style>
  .dnd-provider {
    min-height: 100svh;
  }

  .example-section {
    margin: 20px;
    padding: 20px;
    border-radius: 8px;
  }

  .example-section h3 {
    margin: 0 0 15px 0;
    color: #333;
  }

  .card {
    padding: 15px;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    cursor: move;
    max-width: 400px;
  }

  .handle {
    padding: 10px;
    background: #ff6b6b;
    color: white;
    border-radius: 4px;
    margin-bottom: 10px;
    cursor: grab;
    text-align: center;
    font-weight: bold;
  }

  .content {
    color: #666;
  }
  
  .selection-area {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    padding: 20px;
  }
  
  .bounding-box-example {
    margin: 20px;
    padding: 10px;
    border: 2px dashed #666;
    border-radius: 8px;
  }
  
  .bounding-box-example.horizontal {
    width: 500px;
    height: 100px;
    border-color: #e74c3c;
  }
  
  .bounding-box-example.vertical {
    width: 200px;
    height: 300px;
    border-color: #3498db;
  }
  
  .bounding-box-example.both {
    width: 600px;
    height: 400px;
    border-color: #2ecc71;
  }
  
  .bounding-box-example h3 {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #666;
  }
</style>
