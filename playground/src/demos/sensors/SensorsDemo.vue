<script setup lang="ts">
  import { onMounted, reactive, useTemplateRef } from 'vue';
  import { DnDProvider, keyboardSensor, pointerSensor } from '@vue-dnd-kit/core';
  import DemoList from '../../components/DemoList.vue';
  import JoystickPad from './JoystickPad.vue';
  import { createJoystick } from './joystick';
  import { describeLists, makeTasks } from '../../data';

  // A custom sensor next to the built-in ones: the mouse, touch and the keyboard still work.
  const joystick = createJoystick();
  const sensors = [pointerSensor, keyboardSensor, joystick.sensor];
  const list = reactive({ id: 'joy', title: 'Joystick', tasks: makeTasks('j', 5) });

  const root = useTemplateRef<HTMLElement>('root');
  /** Puts the cursor back on the first item. */
  const aimFirst = () => {
    const first = root.value?.querySelector('[data-id]');
    if (first) joystick.aim(first);
  };
  onMounted(aimFirst);
</script>

<template>
  <div ref="root">
    <p>
      An on-screen joystick as a custom sensor (<code>defineSensor</code>): the arrows move the cursor, hold
      <b>A</b> to pick up the item under it, <b>A</b> again drops, <b>B</b> or Escape cancels. On a phone the
      drag vibrates when it starts, enters the list and drops (<code>haptics</code>).
    </p>
    <DnDProvider
      :sensors="sensors"
      :haptics="{ enter: true, drop: true, refuse: true }"
    >
      <div class="demo-row joystick-demo">
        <DemoList
          class="fixed-rows"
          :list="list"
        />
        <div>
          <JoystickPad :joystick="joystick" />
          <button
            data-testid="joystick-aim"
            @click="aimFirst"
          >
            Cursor to the first item
          </button>
        </div>
      </div>
    </DnDProvider>
    <pre data-testid="sensors-order">{{ describeLists([list]) }}</pre>
  </div>
</template>

<style scoped>
  .joystick-demo {
    align-items: flex-start;
    gap: 32px;
  }

  /* 40px rows, 8px apart: two presses of an arrow per row. */
  .fixed-rows {
    gap: 8px;
  }

  .fixed-rows :deep(.row) {
    height: 40px;
    padding: 0 12px;
    display: flex;
    align-items: center;
  }
</style>
