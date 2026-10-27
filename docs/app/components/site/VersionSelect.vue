<script setup lang="ts">
  import type { DropdownMenuItem } from '@nuxt/ui';

  /** v3 is the site; v2 and v1 live under /legacy, in English. */
  const route = useRoute();
  const { t } = useI18n();
  const localePath = useLocalePath();

  const current = computed(() => {
    const match = route.path.match(/\/legacy\/(v\d)/);
    return match ? match[1]! : 'v3';
  });

  const items = computed<DropdownMenuItem[]>(() => [
    { label: t('version.current'), to: localePath('/docs/getting-started/introduction'), active: current.value === 'v3' },
    // English only: Nuxt UI's links would add the current language.
    { label: t('version.v2'), to: '/legacy/v2/guide/introduction', locale: false, active: current.value === 'v2' },
    { label: t('version.v1'), to: '/legacy/v1/guide/introduction', locale: false, active: current.value === 'v1' },
  ]);
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'end' }"
  >
    <UButton
      color="neutral"
      variant="outline"
      size="sm"
      trailing-icon="i-lucide-chevron-down"
      :aria-label="t('version.label')"
      class="font-mono text-xs tracking-[0.1em]"
      :label="current"
    />
  </UDropdownMenu>
</template>
