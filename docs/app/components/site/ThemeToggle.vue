<script setup lang="ts">
  const colorMode = useColorMode();
  const { t } = useI18n();
</script>

<template>
  <ClientOnly>
    <UButton
      color="neutral"
      variant="ghost"
      square
      :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
      :aria-label="t('theme.toggle')"
      @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
    />
    <template #fallback>
      <span class="size-9" />
    </template>
  </ClientOnly>
</template>
