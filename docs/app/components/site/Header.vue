<script setup lang="ts">
  import type { NavigationMenuItem } from '@nuxt/ui';

  const { t } = useI18n();
  const localePath = useLocalePath();
  const route = useRoute();

  const items = computed<NavigationMenuItem[]>(() => [
    {
      label: t('nav.docs'),
      to: localePath('/docs/getting-started/introduction'),
      active: route.path.includes('/docs/') && !route.path.includes('/docs/examples'),
    },
  ]);
</script>

<template>
  <UHeader
    :to="localePath('/')"
    :ui="{
      root: 'bg-default/80 backdrop-blur-md border-b border-default h-(--ui-header-height) sticky top-0 z-50 [view-transition-name:site-header]',
      container: 'px-6 lg:px-12',
      center: 'hidden lg:flex',
      body: 'p-6',
    }"
  >
    <template #title>
      <SiteLogo :aria-label="t('nav.home')" />
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
      :ui="{ link: 'text-sm font-normal before:rounded-none', linkLabel: 'tracking-tight' }"
    />

    <template #right>
      <UContentSearchButton
        :label="t('search.button')"
        :collapsed="false"
        variant="outline"
        color="neutral"
        size="sm"
        class="hidden w-44 justify-start font-mono text-xs text-muted sm:inline-flex"
        :kbds="['meta', 'k']"
      />
      <UContentSearchButton
        class="sm:hidden"
        color="neutral"
        variant="ghost"
        :label="''"
      />
      <SiteVersionSelect class="hidden md:inline-flex" />
      <SiteLocaleSelect />
      <SiteThemeToggle />
      <UButton
        color="neutral"
        variant="ghost"
        square
        icon="i-simple-icons-github"
        to="https://github.com/ZiZIGY/vue-dnd-kit"
        target="_blank"
        :aria-label="t('nav.github')"
        class="hidden sm:inline-flex"
      />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />
      <USeparator class="my-6" />
      <div class="flex flex-wrap items-center gap-3">
        <SiteVersionSelect />
        <UButton
          color="neutral"
          variant="outline"
          icon="i-simple-icons-github"
          to="https://github.com/ZiZIGY/vue-dnd-kit"
          target="_blank"
          :label="t('nav.github')"
        />
      </div>
    </template>
  </UHeader>
</template>
