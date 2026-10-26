<script setup lang="ts">
  /** A live example in the docs (`::example{name="…"}`): the demo, then its files. */
  const props = withDefaults(defineProps<{ name: string; height?: string; title?: string }>(), {
    height: '18rem',
    title: undefined,
  });
  const { Demo, files } = await useExample(props.name);
</script>

<template>
  <div class="not-prose my-8 overflow-hidden rounded-(--ui-radius) ring-1 ring-default">
    <ExampleStage
      :demo="Demo"
      :min-height="height"
    />
    <ExampleCode
      v-if="files?.length"
      :files="files"
      :name="name"
      :title="title"
      class="border-t border-default"
    />
  </div>
</template>
