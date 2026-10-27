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
  <!-- Its own top rule: a docs page ends without one. Over a section's rule, it lies on it. -->
  <footer class="-mt-px border-t border-default">
    <SiteSection tag="div">
      <DecorCross at="top-left" />
      <DecorCross at="top-right" />
      <div class="grid grid-cols-2 gap-x-10 gap-y-8 px-(--gutter) py-10 sm:grid-cols-3 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
        <div class="col-span-2 sm:col-span-3 lg:col-span-1">
          <SiteLogo />
          <p class="mt-3 max-w-xs text-[13px] leading-relaxed text-muted">{{ t('footer.about') }}</p>
          <SiteCopyCommand
            command="npm i @vue-dnd-kit/core"
            class="mt-5 h-10! text-[12px]!"
          />
        </div>
        <nav
          v-for="column in columns"
          :key="column.title"
          :aria-label="column.title"
        >
          <h3 class="text-[13px] font-medium text-highlighted">{{ column.title }}</h3>
          <ul class="mt-3 space-y-2">
            <li
              v-for="link in column.links"
              :key="link.label"
            >
              <NuxtLink
                :to="link.to"
                :target="link.to.startsWith('http') ? '_blank' : undefined"
                class="text-[13px] text-muted transition-colors hover:text-highlighted"
                >{{ link.label }}</NuxtLink
              >
            </li>
          </ul>
        </nav>
      </div>
    </SiteSection>
    <SiteSection
      tag="div"
      :rule="false"
    >
      <div class="flex flex-col gap-1 px-(--gutter) py-4 text-xs text-dimmed sm:flex-row sm:justify-between">
        <span>© {{ year }} ZiZIGY · {{ t('footer.rights') }}</span>
        <span>{{ t('footer.aiNote') }}</span>
      </div>
    </SiteSection>
  </footer>
</template>
