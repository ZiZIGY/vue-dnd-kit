<script setup lang="ts">
  import * as uiLocales from '@nuxt/ui/locale';
  import { LOCALES, docsCollection } from '~~/i18n/locales';

  const { locale, t } = useI18n();
  const i18nHead = useLocaleHead({ seo: true });

  const uiLocale = computed(() => {
    const entry = LOCALES.find((item) => item.code === locale.value);
    return (uiLocales as Record<string, (typeof uiLocales)['en']>)[entry?.ui ?? 'en'] ?? uiLocales.en;
  });

  useHead(() => ({
    htmlAttrs: i18nHead.value.htmlAttrs,
    link: i18nHead.value.link,
    meta: i18nHead.value.meta,
    script: [
      {
        // Before the first paint: hide what reveals (unless motion is reduced), and show it
        // again if the app never starts. Without JS nothing is hidden.
        key: 'reveal-guard',
        innerHTML:
          "(function(){var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('reveal-ready');setTimeout(function(){if(!window.__revealOn)d.classList.remove('reveal-ready')},3000)})()",
      },
    ],
  }));

  useSeoMeta({
    titleTemplate: (title) => (title ? `${title} · Vue DnD Kit` : 'Vue DnD Kit'),
  });

  // The docs of the current language, on top of the English source: the sidebar and the
  // search list every page, translated or not (untranslated ones open in English).
  const collection = computed(() => docsCollection(locale.value) as 'docs_en');
  const prefix = computed(() => localePrefix(locale.value));
  const { data: sourceNavigation } = await useAsyncData('navigation-en', () => queryCollectionNavigation('docs_en'));
  const { data: localeNavigation } = await useAsyncData(
    () => `navigation-${locale.value}`,
    () => (locale.value === 'en' ? Promise.resolve(null) : queryCollectionNavigation(collection.value)),
    { watch: [locale] },
  );
  const navigation = computed(() => localizeNavigation(sourceNavigation.value, localeNavigation.value, prefix.value));

  const { data: searchFiles } = useLazyAsyncData(
    () => `search-${locale.value}`,
    async () => {
      const source = await queryCollectionSearchSections('docs_en');
      if (!prefix.value) return source;
      const own = await queryCollectionSearchSections(collection.value);
      const translated = new Set(own.map((section) => section.id.split('#')[0]));
      const untranslated = source
        .map((section) => ({ ...section, id: `${prefix.value}${section.id}` }))
        .filter((section) => !translated.has(section.id.split('#')[0]));
      return [...own, ...untranslated];
    },
    { server: false, watch: [locale] },
  );
  provide('navigation', navigation);
</script>

<template>
  <UApp :locale="uiLocale">
    <SiteHeader />
    <UMain>
      <div class="relative mx-auto w-full max-w-(--ui-container) border-x border-default">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
        <SiteFooter />
      </div>
    </UMain>
    <ClientOnly>
      <LazyUContentSearch
        :files="searchFiles"
        :navigation="navigation"
        :placeholder="t('search.placeholder')"
        :fuse="{ resultLimit: 42 }"
      />
    </ClientOnly>
  </UApp>
</template>
