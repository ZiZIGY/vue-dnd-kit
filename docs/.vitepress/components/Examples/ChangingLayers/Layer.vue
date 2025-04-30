<script setup lang="ts">
  const props = defineProps<{
    id: string;
  }>();
</script>

<template>
  <div>
    <img
      src="https://raw.githubusercontent.com/ZiZiGY/vue-dnd-kit/master/public/logo.svg"
      alt="logo"
    />
    {{ props.id }}
  </div>
</template>
