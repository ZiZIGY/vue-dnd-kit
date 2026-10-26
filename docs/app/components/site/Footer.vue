<script setup lang="ts">
  import type { ContentNavigationItem } from '@nuxt/content';

  const { t, locale } = useI18n();
  const year = new Date().getFullYear();
  const navigation = inject<Ref<ContentNavigationItem[] | null>>('navigation');

  const GITHUB = 'https://github.com/ZiZIGY/vue-dnd-kit';

  // The first section of the docs, under its titles in the current language.
  const docsLinks = computed(() =>
    (docsNavigation(navigation?.value, localePrefix(locale.value))[0]?.children ?? []).map((item) => ({
      label: item.title,
      to: item.path,
      external: false,
    })),
  );

  const columns = computed(() => [
    { title: t('footer.docs'), links: docsLinks.value },
    {
      title: t('footer.ecosystem'),
      links: [
        { label: '@vue-dnd-kit/core', to: 'https://www.npmjs.com/package/@vue-dnd-kit/core', external: true },
        { label: '@vue-dnd-kit/actions', to: 'https://www.npmjs.com/package/@vue-dnd-kit/actions', external: true },
        { label: '@vue-dnd-kit/devtools', to: 'https://www.npmjs.com/package/@vue-dnd-kit/devtools', external: true },
        { label: '@vue-dnd-kit/nuxt', to: 'https://www.npmjs.com/package/@vue-dnd-kit/nuxt', external: true },
      ],
    },
    {
      title: t('footer.community'),
      links: [
        { label: 'GitHub', to: GITHUB, external: true },
        { label: t('footer.issues'), to: `${GITHUB}/issues`, external: true },
        { label: t('footer.changelog'), to: `${GITHUB}/releases`, external: true },
      ],
    },
  ]);
</script>

<template>
  <footer class="relative">
    <DecorGridCross side="top-left" />
    <DecorGridCross side="top-right" />
    <div class="cells-dashed md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr]">
      <div class="relative bg-default p-8 lg:p-12">
        <DecorPattern
          variant="dots"
          fade="left"
          class="opacity-60"
        />
        <div class="relative">
          <SiteLogo />
          <p class="mt-5 max-w-xs text-sm leading-relaxed text-muted">{{ t('footer.about') }}</p>
        </div>
      </div>
      <nav
        v-for="column in columns"
        :key="column.title"
        :aria-label="column.title"
        class="bg-default p-8 lg:p-12"
      >
        <h3 class="font-mono text-xs uppercase tracking-[0.18em] text-dimmed">{{ column.title }}</h3>
        <ul class="mt-5 space-y-2.5">
          <li
            v-for="link in column.links"
            :key="link.label"
          >
            <NuxtLink
              :to="link.to"
              :target="link.external ? '_blank' : undefined"
              class="text-sm text-muted transition-colors hover:text-highlighted"
              >{{ link.label }}</NuxtLink
            >
          </li>
        </ul>
      </nav>
    </div>
    <div
      class="flex flex-col gap-2 border-t border-default px-6 py-5 font-mono text-xs text-dimmed sm:flex-row sm:items-center sm:justify-between lg:px-12"
    >
      <span>© {{ year }} ZiZIGY · {{ t('footer.rights') }}</span>
      <span>{{ t('footer.aiNote') }}</span>
    </div>
  </footer>
</template>
