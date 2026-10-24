<script setup lang="ts">
  import { useDnD } from '@vue-dnd-kit/core';
  import ScrollList from '../components/ScrollList.vue';

  const { isAutoScrolling } = useDnD();
</script>

<template>
  <section>
    <h2>Auto-scroll</h2>
    <p>
      Auto-scrolling: <output data-testid="autoscrolling">{{ isAutoScrolling }}</output>
    </p>
    <div class="board">
      <div>
        <h3>300px scroller</h3>
        <ScrollList
          id="scroll"
          prefix="s"
          :count="60"
          scroller
        />
      </div>
      <div>
        <h3>Scroller, autoScroll: false</h3>
        <ScrollList
          id="noscroll"
          prefix="n"
          :count="20"
          scroller
          :auto-scroll="false"
        />
      </div>
      <div>
        <h3>Page (window scroll)</h3>
        <ScrollList
          id="page"
          prefix="p"
          :count="40"
        />
      </div>
    </div>
  </section>
</template>
