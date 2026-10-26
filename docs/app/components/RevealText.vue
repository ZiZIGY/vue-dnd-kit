<script setup lang="ts">
  /**
   * Words slide out of their own slits, one after another. `\n` breaks the line on wide
   * screens. Languages without spaces reveal as whole lines.
   */
  const props = withDefaults(
    defineProps<{ text: string; tag?: string; delay?: number; stagger?: number; duration?: number }>(),
    { tag: 'span', delay: 0, stagger: 0.045, duration: 0.9 },
  );

  const lines = computed(() => {
    let index = 0;
    return props.text.split('\n').map((line) => line.split(/\s+/).filter(Boolean).map((word) => ({ word, index: index++ })));
  });
</script>

<template>
  <component
    :is="tag"
    v-reveal:text
    :style="{ '--rt-delay': `${delay}s`, '--rt-stagger': `${stagger}s`, '--rt-duration': `${duration}s` }"
  >
    <template
      v-for="(line, lineIndex) in lines"
      :key="lineIndex"
    >
      <br
        v-if="lineIndex"
        class="max-sm:hidden"
      />
      <template
        v-for="{ word, index } in line"
        :key="index"
      >
        <span class="rt-clip"
          ><span
            class="rt-word"
            :style="{ '--i': index }"
            >{{ word }}</span
          ></span
        >{{ ' ' }}
      </template>
    </template>
  </component>
</template>
