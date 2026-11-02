<script setup lang="ts">
  import type { NuxtError } from '#app';

  /** Every error renders here, in the site: a missing page gets the 404, the rest a short notice. */
  const props = defineProps<{ error: NuxtError }>();
  const { t } = useI18n();
  const localePath = useLocalePath();
  const missing = computed(() => props.error.statusCode === 404);

  useSeoMeta({
    title: () => (missing.value ? t('notFound.title') : String(props.error.statusCode)),
    robots: 'noindex',
  });
</script>

<template>
  <SiteShell>
    <NotFoundPage v-if="missing" />
    <SiteSection v-else>
      <div class="px-(--gutter) py-20 lg:py-28">
        <p class="label text-[11px] text-(--ui-primary)">Error {{ error.statusCode }}</p>
        <h1 class="heading mt-6 max-w-3xl text-4xl sm:text-5xl">{{ error.statusMessage || error.message }}</h1>
        <UButton
          size="xl"
          class="mt-10"
          trailing-icon="i-lucide-chevron-right"
          :to="localePath('/')"
          :label="t('notFound.home')"
        />
      </div>
    </SiteSection>
  </SiteShell>
</template>
