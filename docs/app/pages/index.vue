<script setup lang="ts">
  import { LOCALES } from '~~/i18n/locales';

  const { t, tm, rt, locale } = useI18n();
  const localePath = useLocalePath();
  const { app } = useRuntimeConfig();

  useSeoMeta({
    title: '',
    description: () => t('home.lead'),
  });

  // The English home sends a first visit to the browser's language, before hydration. Once
  // a language is picked (LocaleSelect stores it), the choice stands.
  if (locale.value === 'en') {
    const codes = JSON.stringify(LOCALES.map((entry) => entry.code).filter((code) => code !== 'en'));
    useHead({
      script: [
        {
          key: 'locale-redirect',
          innerHTML: `(function(){try{if(localStorage.getItem('vdk_locale'))return}catch(e){return}var codes=${codes};var langs=navigator.languages||[navigator.language];for(var i=0;i<langs.length;i++){var c=String(langs[i]).slice(0,2).toLowerCase();if(c==='en')return;if(codes.indexOf(c)>-1){location.replace('${app.baseURL}'+c+'/');return}}})()`,
        },
      ],
    });
  }

  const docs = (path: string) => localePath(`/docs/${path}`);
  const lines = (text: string) => text.split('\n');

  const showcases = computed(() => [
    { key: 'lists', example: 'sortable-grid', focus: 'AppGrid.vue', docs: docs('getting-started/quick-start'), height: '24rem' },
    { key: 'kanban', example: 'kanban', focus: 'Column.vue', docs: docs('getting-started/quick-start'), height: '26rem' },
    { key: 'tree', example: 'tree', focus: 'FileTree.vue', docs: docs('getting-started/quick-start'), height: '24rem' },
    { key: 'multi', example: 'multi-drag', focus: 'Gallery.vue', docs: docs('getting-started/quick-start'), height: '24rem' },
  ]);

  const more = computed(() =>
    (tm('home.more') as { title: unknown; text: unknown }[]).map((item) => ({ title: rt(item.title as never), text: rt(item.text as never) })),
  );

  const ecosystem = computed(() => [
    { key: 'devtools', tag: '@vue-dnd-kit/devtools', icon: 'i-lucide-monitor-cog' },
    { key: 'actions', tag: '@vue-dnd-kit/actions', icon: 'i-lucide-mouse-pointer-click' },
    { key: 'nuxt', tag: '@vue-dnd-kit/nuxt', icon: 'i-simple-icons-nuxt' },
    { key: 'skill', tag: 'npx skills add', icon: 'i-lucide-sparkles' },
  ]);

  const metrics = computed(() => [
    { value: 1243, suffix: '', label: t('home.metrics.e2e') },
    { value: 469, suffix: '', label: t('home.metrics.unit') },
    { value: 21, suffix: 'KB', label: t('home.metrics.size') },
    { value: 9, suffix: '', label: t('home.metrics.languages') },
  ]);
</script>

<template>
  <div>
    <!-- Hero: the deck, then the pitch. -->
    <section class="relative overflow-x-clip">
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_30%,rgba(66,184,131,0.14),transparent_70%)]"
      />
      <div class="relative mx-auto max-w-(--ui-container) px-5 pt-8 pb-20 lg:px-8 lg:pb-28">
        <div class="flex h-[320px] items-center justify-center lg:h-[380px]">
          <HomeDeck />
        </div>
        <p class="label mt-2 text-center text-[10px] text-dimmed">{{ t('home.hint') }}</p>

        <div class="mt-16 grid items-end gap-10 lg:mt-20 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div>
            <h1 class="display text-5xl sm:text-6xl lg:text-7xl xl:text-[5.25rem]">
              <template
                v-for="(line, index) in lines(t('home.title'))"
                :key="index"
              >
                <br v-if="index" />{{ line }}
              </template>
            </h1>
            <p class="mt-6 max-w-xl text-lg leading-relaxed text-muted">{{ t('home.lead') }}</p>
          </div>
          <div class="flex flex-col gap-4 lg:items-end">
            <p class="text-sm text-muted">{{ t('home.openSource') }}</p>
            <div class="flex flex-col gap-3 sm:flex-row">
              <SiteCopyCommand command="npm i @vue-dnd-kit/core" />
              <UButton
                size="xl"
                trailing-icon="i-lucide-chevron-right"
                :to="docs('getting-started/introduction')"
                :label="t('home.start')"
                class="justify-center"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Intro -->
    <section class="mx-auto max-w-(--ui-container) px-5 lg:px-8">
      <div class="border-b border-default pb-16 lg:pb-20">
        <h2 class="heading text-4xl sm:text-5xl">
          <template
            v-for="(line, index) in lines(t('home.intro.title'))"
            :key="index"
          >
            <br v-if="index" />{{ line }}
          </template>
        </h2>
        <p class="mt-5 max-w-xl text-base leading-relaxed text-muted lg:text-lg">{{ t('home.intro.text') }}</p>
      </div>
    </section>

    <!-- Features, each running live -->
    <HomeShowcase
      v-for="showcase in showcases"
      :key="showcase.key"
      :title="t(`home.showcase.${showcase.key}.title`)"
      :text="t(`home.showcase.${showcase.key}.text`)"
      :example="showcase.example"
      :focus="showcase.focus"
      :docs="showcase.docs"
      :docs-label="t('home.showcase.docs')"
      :height="showcase.height"
    />

    <!-- And the rest -->
    <section class="mx-auto max-w-(--ui-container) px-5 pb-24 lg:px-8">
      <div class="grid border-t border-default pt-14 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(item, index) in more"
          :key="item.title"
          class="py-6 sm:pe-8 lg:py-0"
          :class="index ? 'lg:border-s lg:border-default lg:ps-8' : ''"
        >
          <h3 class="heading text-xl">{{ item.title }}</h3>
          <p class="mt-3 text-[15px] leading-relaxed text-muted">{{ item.text }}</p>
        </div>
      </div>
    </section>

    <!-- Ecosystem -->
    <section class="mx-auto max-w-(--ui-container) px-5 py-20 lg:px-8 lg:py-28">
      <h2 class="heading max-w-2xl text-4xl sm:text-5xl">{{ t('home.ecosystem.title') }}</h2>
      <p class="mt-5 max-w-xl text-base leading-relaxed text-muted lg:text-lg">{{ t('home.ecosystem.text') }}</p>
      <div class="mt-12 grid gap-px overflow-hidden rounded-(--ui-radius) bg-(--ui-border) ring-1 ring-default md:grid-cols-2">
        <article
          v-for="item in ecosystem"
          :key="item.key"
          class="group flex flex-col bg-default p-8 transition-colors duration-200 hover:bg-muted lg:p-10"
        >
          <div class="flex items-center gap-3">
            <span class="grid size-9 place-items-center rounded-(--ui-radius) bg-elevated text-(--ui-primary) transition-colors group-hover:bg-(--color-accent) group-hover:text-(--color-on-accent)">
              <UIcon
                :name="item.icon"
                class="size-[18px]"
              />
            </span>
            <span class="font-mono text-xs text-muted">{{ item.tag }}</span>
          </div>
          <h3 class="heading mt-8 text-2xl">{{ t(`home.ecosystem.${item.key}.title`) }}</h3>
          <p class="mt-3 max-w-md text-[15px] leading-relaxed text-muted">{{ t(`home.ecosystem.${item.key}.text`) }}</p>
          <SiteCopyCommand
            v-if="item.key === 'skill'"
            command="npx skills add ZiZIGY/vue-dnd-kit"
            class="mt-6 self-start"
          />
        </article>
      </div>
    </section>

    <!-- Numbers -->
    <section class="bg-(--color-accent) text-(--color-on-accent)">
      <div class="mx-auto grid max-w-(--ui-container) gap-10 px-5 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-8 lg:py-20">
        <div
          v-for="metric in metrics"
          :key="metric.label"
        >
          <p class="text-6xl font-bold tracking-[-0.05em] tabular-nums lg:text-7xl">
            <CountUp :value="metric.value" /><span class="text-4xl lg:text-5xl">{{ metric.suffix }}</span>
          </p>
          <p class="label mt-3 text-[11px] opacity-75">{{ metric.label }}</p>
        </div>
      </div>
    </section>

    <!-- Where to start -->
    <section class="mx-auto max-w-(--ui-container) px-5 py-20 lg:px-8 lg:py-28">
      <h2 class="heading text-center text-4xl sm:text-5xl">{{ t('home.next.title') }}</h2>
      <div class="mt-12 grid gap-4 md:grid-cols-2">
        <NuxtLink
          v-for="(card, index) in ['guide', 'examples']"
          :key="card"
          :to="index ? docs('getting-started/quick-start') : docs('getting-started/introduction')"
          class="group flex min-h-64 flex-col justify-between rounded-(--ui-radius) p-8 transition-colors lg:p-10"
          :class="index ? 'bg-elevated hover:bg-accented' : 'bg-(--color-accent) text-(--color-on-accent) hover:bg-(--color-accent-strong)'"
        >
          <h3 class="text-3xl font-bold tracking-[-0.04em] lg:text-4xl">{{ t(`home.next.${card}.title`) }}</h3>
          <div>
            <p
              class="max-w-sm text-[15px] leading-relaxed"
              :class="index ? 'text-muted' : 'opacity-80'"
            >
              {{ t(`home.next.${card}.text`) }}
            </p>
            <span class="label mt-6 inline-flex items-center gap-1 text-[11px]">
              {{ t(`home.next.${card}.action`) }}
              <UIcon
                name="i-lucide-chevron-right"
                class="size-3.5 transition-transform group-hover:translate-x-0.5"
              />
            </span>
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
