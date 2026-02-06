<script setup lang="ts">
  import { ref } from 'vue';

  import DnDProvider from './external/components/DnDProvider.vue';
  import Draggable from './internal/components/Draggable.vue';
  import SelectionArea from './internal/components/SelectionArea.vue';
  import AxisBox from './internal/components/AxisBox.vue';

  const test = ref([1, 2, 3, 4, 5, 6, 7]);
</script>

<template>
  <DnDProvider>
    <!-- Drag Handle Example -->
    <div class="example-section">
      <h3>Drag Handle (только за 🔥)</h3>
      <SelectionArea>
        <Draggable 
          :index="200" 
          drag-handle=".handle"
          class="card"
        >
          <div class="handle">🔥 Drag Handle</div>
          <div class="content">Можно драгать только за эмодзи выше</div>
        </Draggable>
      </SelectionArea>
    </div>

    <!-- Distance Activation Example -->
    <div class="example-section">
      <h3>Distance Activation (сдвинь на 30px) - с индикатором</h3>
      <SelectionArea>
        <Draggable 
          :index="201"
          :activation="{ distance: 30 }"
          :show-progress="true"
          class="card"
        >
          Сдвинь меня на 30px чтобы начать драг
        </Draggable>
      </SelectionArea>
    </div>

    <!-- Delay Activation Example -->
    <div class="example-section">
      <h3>Delay Activation (держи 0.5s) - с индикатором</h3>
      <SelectionArea>
        <Draggable 
          :index="202"
          :activation="{ delay: 0.5 }"
          :show-progress="true"
          class="card"
        >
          Держи меня 0.5 секунды чтобы начать драг
        </Draggable>
      </SelectionArea>
    </div>

    <!-- Combined Activation (both distance AND delay must be met) -->
    <div class="example-section">
      <h3>Combined (сдвинь 20px + держи 0.3s) - с индикатором</h3>
      <SelectionArea>
        <Draggable 
          :index="203"
          :activation="{ distance: 20, delay: 0.3 }"
          :show-progress="true"
          class="card"
        >
          Сначала сдвинь на 20px, потом держи 0.3s
        </Draggable>
      </SelectionArea>
    </div>

    <!-- Groups Example (Ctrl+Click - выделяются только board) -->
    <div class="example-section">
      <h3>Groups (только board выделяется, Ctrl+Click)</h3>
      <SelectionArea :groups="['board']">
        <Draggable :index="300" :groups="['board']" class="card">
          🎯 board карточка
        </Draggable>
        <Draggable :index="301" :groups="['board']" class="card">
          🎯 board карточка
        </Draggable>
        <Draggable :index="302" :groups="['sidebar']" class="card">
          📌 sidebar (не выделится)
        </Draggable>
        <Draggable :index="303" :groups="['sidebar']" class="card">
          📌 sidebar (не выделится)
        </Draggable>
      </SelectionArea>
    </div>

    <!-- Пример с BoundingBox - только по X -->
    <AxisBox axis="x" class="bounding-box-example horizontal">
      <h3>Только по X</h3>
      <SelectionArea>
        <Draggable :index="100">
          Горизонтальный драг
        </Draggable>
      </SelectionArea>
    </AxisBox>

    <!-- Пример с BoundingBox - только по Y -->
    <AxisBox axis="y" class="bounding-box-example vertical">
      <h3>Только по Y</h3>
      <SelectionArea>
        <Draggable :index="101">
          Вертикальный драг
        </Draggable>
      </SelectionArea>
    </AxisBox>


    <AxisBox axis="both" :restrict-to-area="true" class="bounding-box-example both">
      <h3>Оба направления (ограничен контейнером)</h3>
      <SelectionArea>
        <Draggable
          v-for="(value, index) in test"
          :key="value"
          :index="value"
        >
          Драггабл - value: {{ value }}: index: {{ index }}
          <button @click="test.splice(index, 1)">Удалить</button>
        </Draggable>
      </SelectionArea>
    </AxisBox>

    <button @click="test.push(test.length)">Добавить</button>
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
