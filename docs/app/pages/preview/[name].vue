<script setup lang="ts">
  /**
   * Development only: one live example on its own, at `/preview/<name>`, for building an
   * example before a page shows it. The static site has no such page.
   */
  if (!import.meta.dev) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });

  const route = useRoute();
  const name = computed(() => String(route.params.name));
</script>

<template>
  <div class="mx-auto max-w-4xl px-(--gutter) py-12">
    <Example
      :key="name"
      :name="name"
      height="34rem"
    />
  </div>
</template>
