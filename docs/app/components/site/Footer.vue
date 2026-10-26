<script setup lang="ts">
  import type { ContentNavigationItem } from '@nuxt/content';

  const { t, locale } = useI18n();
  const year = new Date().getFullYear();
  const navigation = inject<Ref<ContentNavigationItem[] | null>>('navigation');

  const GITHUB = 'https://github.com/ZiZIGY/vue-dnd-kit';
  const npm = (name: string) => `https://www.npmjs.com/package/@vue-dnd-kit/${name}`;

  // The first section of the docs, under its titles in the current language.
  const docsLinks = computed(() =>
    (docsNavigation(navigation?.value, localePrefix(locale.value))[0]?.children ?? []).map((item) => ({
      label: item.title,
      to: item.path,
    })),
  );

  const columns = computed(() => [
    { title: t('footer.docs'), links: docsLinks.value },
    {
      title: t('footer.ecosystem'),
      links: ['core', 'actions', 'devtools', 'nuxt'].map((name) => ({ label: `@vue-dnd-kit/${name}`, to: npm(name) })),
    },
    {
      title: t('footer.community'),
      links: [
        { label: 'GitHub', to: GITHUB },
        { label: t('footer.issues'), to: `${GITHUB}/issues` },
        { label: t('footer.changelog'), to: `${GITHUB}/releases` },
      ],
    },
  ]);
</script>

<template>
  <footer class="border-t border-default">
    <div class="mx-auto grid max-w-(--ui-container) gap-12 px-5 py-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:px-8">
      <div>
        <SiteLogo />
        <p class="mt-5 max-w-xs text-sm leading-relaxed text-muted">{{ t('footer.about') }}</p>
      </div>
      <nav
        v-for="column in columns"
        :key="column.title"
        :aria-label="column.title"
      >
        <h3 class="label text-[11px] text-highlighted">{{ column.title }}</h3>
        <ul class="mt-5 space-y-3">
          <li
            v-for="link in column.links"
            :key="link.label"
          >
            <NuxtLink
              :to="link.to"
              :target="link.to.startsWith('http') ? '_blank' : undefined"
              class="text-sm text-muted transition-colors hover:text-highlighted"
              >{{ link.label }}</NuxtLink
            >
          </li>
        </ul>
      </nav>
    </div>
    <div class="mx-auto flex max-w-(--ui-container) flex-col gap-2 px-5 pb-10 text-xs text-dimmed sm:flex-row sm:justify-between lg:px-8">
      <span class="font-mono">© {{ year }} ZiZIGY · {{ t('footer.rights') }}</span>
      <span>{{ t('footer.aiNote') }}</span>
    </div>
  </footer>
</template>
