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
  <footer>
    <SiteSection tag="div">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))]">
        <div class="relative overflow-hidden px-(--gutter) py-12 max-lg:sm:col-span-2 lg:py-16">
          <div
            aria-hidden="true"
            class="dot-paper fade-right pointer-events-none absolute inset-0 opacity-50"
          />
          <SiteLogo class="relative" />
          <p class="relative mt-5 max-w-xs text-sm leading-relaxed text-muted">{{ t('footer.about') }}</p>
        </div>
        <nav
          v-for="column in columns"
          :key="column.title"
          :aria-label="column.title"
          class="border-default px-(--gutter) py-12 max-lg:border-t lg:border-s lg:py-16 sm:[&:nth-child(3)]:border-s"
        >
          <h3 class="label text-[11px] text-dimmed">{{ column.title }}</h3>
          <ul class="mt-6 space-y-3">
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
    </SiteSection>
    <SiteSection
      tag="div"
      :rule="false"
      frame-class="overflow-hidden"
    >
      <div class="flex flex-col gap-2 border-b border-dashed border-default px-(--gutter) py-5 text-xs text-dimmed sm:flex-row sm:justify-between">
        <span class="font-mono">© {{ year }} ZiZIGY · {{ t('footer.rights') }}</span>
        <span>{{ t('footer.aiNote') }}</span>
      </div>
      <!-- The name, larger than the page, cut by its bottom edge. -->
      <p
        aria-hidden="true"
        class="-mb-[0.22em] select-none whitespace-nowrap bg-linear-to-b from-(--ui-text-highlighted)/20 to-(--ui-text-highlighted)/0 bg-clip-text px-(--gutter) pt-4 text-center text-[clamp(3.5rem,15vw,16.5rem)] leading-none font-bold tracking-[-0.065em] text-transparent"
      >
        vue-dnd-kit
      </p>
    </SiteSection>
  </footer>
</template>
