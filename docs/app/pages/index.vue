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
  const index = (value: number) => String(value).padStart(2, '0');
  /** A list of `{ title, text }`-like objects from the messages, resolved. */
  const list = <T extends string>(key: string, fields: T[]) =>
    (tm(key) as Record<T, unknown>[]).map((item) => Object.fromEntries(fields.map((field) => [field, rt(item[field] as never)])) as Record<T, string>);

  const showcases = computed(() => [
    { key: 'lists', label: t('home.deck.sortable.label'), example: 'lists', focus: 'Playlist.vue', docs: docs('getting-started/quick-start'), height: '34rem' },
    { key: 'kanban', label: t('home.deck.kanban.label'), example: 'kanban', focus: 'Column.vue', docs: docs('getting-started/quick-start'), height: '30rem' },
    { key: 'tree', label: t('home.deck.tree.label'), example: 'tree', focus: 'FileTree.vue', docs: docs('getting-started/quick-start'), height: '34rem' },
    { key: 'multi', label: t('home.deck.multi.label'), example: 'multi-drag', focus: 'Gallery.vue', docs: docs('getting-started/quick-start'), height: '30rem' },
  ]);

  const apis = computed(() => list('home.intro.apis', ['code', 'text']));
  const MORE_ICONS = ['i-lucide-wand-sparkles', 'i-lucide-accessibility', 'i-lucide-rows-3', 'i-lucide-database'];
  const more = computed(() => list('home.more', ['title', 'text']).map((item, at) => ({ ...item, icon: MORE_ICONS[at] })));

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
    <!-- Hero: the deck on drafting paper, lights running down the frame. -->
    <SiteSection>
      <div
        aria-hidden="true"
        class="grid-paper fade-radial pointer-events-none absolute inset-0 opacity-70"
      />
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_42%_at_50%_48%,rgba(66,184,131,0.16),transparent_70%)]"
      />
      <DecorBeam class="inset-y-0 -left-px w-px" />
      <DecorBeam
        class="inset-y-0 -right-px w-px"
        delay="-2.5s"
      />
      <div class="label relative flex items-center justify-between gap-6 px-(--gutter) pt-6 text-[10px] text-dimmed">
        <span class="flex items-center gap-2">
          <span class="size-1.5 bg-(--ui-primary)" />
          v3 — {{ t('home.tag') }}
        </span>
        <span class="hidden sm:block">Vue 3 · TypeScript · SSR</span>
      </div>
      <div class="relative flex h-[330px] items-center justify-center overflow-x-clip lg:h-[420px]">
        <HomeDeck />
      </div>
      <p class="label relative px-(--gutter) pb-8 text-center text-[10px] text-dimmed">{{ t('home.hint') }}</p>
    </SiteSection>

    <!-- The pitch -->
    <SiteSection>
      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div class="px-(--gutter) py-14 lg:py-20">
          <h1 class="display text-5xl sm:text-6xl lg:text-7xl xl:text-[6rem] 2xl:text-[6.75rem]">
            <template
              v-for="(line, at) in lines(t('home.title'))"
              :key="at"
            >
              <br v-if="at" />{{ line }}
            </template>
          </h1>
        </div>
        <div class="flex flex-col justify-end gap-8 border-default px-(--gutter) pb-14 max-lg:pt-0 lg:border-s lg:py-20">
          <p class="max-w-md text-lg leading-relaxed text-muted">{{ t('home.lead') }}</p>
          <div class="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <SiteCopyCommand command="npm i @vue-dnd-kit/core" />
            <UButton
              size="xl"
              trailing-icon="i-lucide-chevron-right"
              :to="docs('getting-started/introduction')"
              :label="t('home.start')"
              class="justify-center"
            />
          </div>
          <p class="label text-[10px] text-dimmed">{{ t('home.openSource') }}</p>
        </div>
      </div>
    </SiteSection>

    <!-- Intro: the composables at a glance -->
    <SiteSection>
      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div class="relative overflow-hidden px-(--gutter) py-16 lg:py-24">
          <div
            aria-hidden="true"
            class="dot-paper fade-right pointer-events-none absolute inset-0 opacity-60"
          />
          <p class="label relative flex items-center gap-3 text-[11px] text-dimmed">
            <span class="text-(--ui-primary)">00</span>
            <span class="h-px w-8 bg-(--ui-border-accented)" />
            {{ t('home.intro.label') }}
          </p>
          <h2 class="heading relative mt-6 text-4xl sm:text-5xl lg:text-6xl">
            <template
              v-for="(line, at) in lines(t('home.intro.title'))"
              :key="at"
            >
              <br v-if="at" />{{ line }}
            </template>
          </h2>
          <p class="relative mt-6 max-w-lg text-base leading-relaxed text-muted lg:text-lg">{{ t('home.intro.text') }}</p>
        </div>
        <ul class="flex flex-col border-default max-lg:border-t lg:border-s">
          <li
            v-for="(api, at) in apis"
            :key="api.code"
            class="group flex flex-1 flex-col justify-center gap-3 border-dashed border-default px-(--gutter) py-8 transition-colors duration-300 hover:bg-muted"
            :class="at ? 'border-t' : ''"
          >
            <span class="flex items-center gap-3">
              <span class="font-mono text-[11px] text-dimmed">{{ index(at + 1) }}</span>
              <code class="font-mono text-[15px] font-medium text-highlighted transition-colors group-hover:text-(--ui-primary)">{{ api.code }}</code>
            </span>
            <span class="max-w-md text-[15px] leading-relaxed text-muted">{{ api.text }}</span>
          </li>
        </ul>
      </div>
    </SiteSection>

    <!-- Features, each running live -->
    <HomeShowcase
      v-for="(showcase, at) in showcases"
      :key="showcase.key"
      :index="at + 1"
      :label="showcase.label"
      :title="t(`home.showcase.${showcase.key}.title`)"
      :text="t(`home.showcase.${showcase.key}.text`)"
      :hint="t(`home.showcase.${showcase.key}.hint`)"
      :example="showcase.example"
      :focus="showcase.focus"
      :docs="showcase.docs"
      :docs-label="t('home.showcase.docs')"
      :height="showcase.height"
    />

    <!-- And the rest -->
    <SiteSection>
      <p class="label flex items-center gap-3 px-(--gutter) pt-16 text-[11px] text-dimmed lg:pt-20">
        <span class="text-(--ui-primary)">05</span>
        <span class="h-px w-8 bg-(--ui-border-accented)" />
        {{ t('home.moreLabel') }}
      </p>
      <h2 class="heading mt-6 px-(--gutter) text-4xl sm:text-5xl lg:text-6xl">{{ t('home.moreTitle') }}</h2>
      <div class="cells-dashed grid-cols-1 mt-12 border-t border-default sm:grid-cols-2 lg:grid-cols-4 lg:mt-16">
        <article
          v-for="(item, at) in more"
          :key="item.title"
          class="group flex flex-col bg-default px-(--gutter) py-10 transition-colors duration-300 hover:bg-muted lg:py-12"
        >
          <div class="flex items-center justify-between">
            <span class="grid size-10 place-items-center text-highlighted ring-1 ring-inset ring-default transition-colors duration-300 group-hover:bg-(--color-accent) group-hover:text-(--color-on-accent) group-hover:ring-(--color-accent)">
              <UIcon
                :name="item.icon!"
                class="size-[18px]"
              />
            </span>
            <span class="font-mono text-[11px] text-dimmed">{{ index(at + 1) }}</span>
          </div>
          <h3 class="heading mt-12 text-xl lg:text-2xl">{{ item.title }}</h3>
          <p class="mt-3 text-[15px] leading-relaxed text-muted">{{ item.text }}</p>
        </article>
      </div>
    </SiteSection>

    <!-- Ecosystem -->
    <SiteSection>
      <div class="relative overflow-hidden px-(--gutter) pt-16 pb-12 lg:pt-24 lg:pb-16">
        <div
          aria-hidden="true"
          class="hatch-paper fade-right pointer-events-none absolute inset-0 text-(--ui-border-accented) opacity-60"
        />
        <p class="label relative flex items-center gap-3 text-[11px] text-dimmed">
          <span class="text-(--ui-primary)">06</span>
          <span class="h-px w-8 bg-(--ui-border-accented)" />
          {{ t('nav.ecosystem') }}
        </p>
        <h2 class="heading relative mt-6 max-w-3xl text-4xl sm:text-5xl lg:text-6xl">{{ t('home.ecosystem.title') }}</h2>
        <p class="relative mt-5 max-w-xl text-base leading-relaxed text-muted lg:text-lg">{{ t('home.ecosystem.text') }}</p>
      </div>
      <div class="cells-dashed grid-cols-1 border-t border-default md:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="(item, at) in ecosystem"
          :key="item.key"
          class="group flex flex-col bg-default px-(--gutter) py-10 transition-colors duration-300 hover:bg-muted lg:py-12"
        >
          <div class="flex items-center justify-between">
            <span class="grid size-10 place-items-center text-(--ui-primary) ring-1 ring-inset ring-default transition-colors duration-300 group-hover:bg-(--color-accent) group-hover:text-(--color-on-accent) group-hover:ring-(--color-accent)">
              <UIcon
                :name="item.icon"
                class="size-[18px]"
              />
            </span>
            <span class="font-mono text-[11px] text-dimmed">{{ index(at + 1) }}</span>
          </div>
          <span class="mt-10 font-mono text-xs text-muted">{{ item.tag }}</span>
          <h3 class="heading mt-3 text-2xl">{{ t(`home.ecosystem.${item.key}.title`) }}</h3>
          <p class="mt-3 text-[15px] leading-relaxed text-muted">{{ t(`home.ecosystem.${item.key}.text`) }}</p>
          <SiteCopyCommand
            v-if="item.key === 'skill'"
            command="npx skills add ZiZIGY/vue-dnd-kit"
            class="mt-6 self-start"
          />
        </article>
      </div>
    </SiteSection>

    <!-- Numbers -->
    <SiteSection
      class="bg-(--color-accent) text-(--color-on-accent)"
      frame-class="border-(--color-on-accent)/15"
    >
      <div
        aria-hidden="true"
        class="hatch-paper fade-bottom pointer-events-none absolute inset-0 opacity-[0.09]"
      />
      <div class="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(metric, at) in metrics"
          :key="metric.label"
          class="border-dashed border-(--color-on-accent)/25 px-(--gutter) py-12 lg:py-16"
          :class="[at ? 'max-sm:border-t' : '', at % 2 ? 'sm:border-s' : '', at > 1 ? 'sm:max-lg:border-t' : '', at === 2 ? 'lg:border-s' : '']"
        >
          <p class="font-mono text-[11px] font-semibold opacity-60">{{ index(at + 1) }}</p>
          <p class="mt-6 text-6xl font-bold tracking-[-0.05em] tabular-nums lg:text-7xl">
            <CountUp :value="metric.value" /><span class="text-4xl lg:text-5xl">{{ metric.suffix }}</span>
          </p>
          <p class="label mt-3 text-[11px] opacity-75">{{ metric.label }}</p>
        </div>
      </div>
    </SiteSection>

    <!-- Where to start -->
    <SiteSection>
      <h2 class="heading px-(--gutter) pt-16 pb-12 text-4xl sm:text-5xl lg:pt-24 lg:pb-16 lg:text-6xl">{{ t('home.next.title') }}</h2>
      <div class="grid grid-cols-1 border-t border-default md:grid-cols-2">
        <NuxtLink
          v-for="(card, at) in ['guide', 'examples']"
          :key="card"
          :to="at ? docs('getting-started/quick-start') : docs('getting-started/introduction')"
          class="group relative flex min-h-72 flex-col justify-between overflow-hidden px-(--gutter) py-10 transition-colors lg:min-h-80 lg:py-12"
          :class="at ? 'border-default hover:bg-muted max-md:border-t md:border-s' : 'bg-(--color-accent) text-(--color-on-accent) hover:bg-(--color-accent-strong)'"
        >
          <div
            v-if="at"
            aria-hidden="true"
            class="grid-paper fade-right pointer-events-none absolute inset-0 opacity-70"
          />
          <span class="relative flex items-center justify-between">
            <span class="font-mono text-[11px] font-semibold opacity-60">{{ index(at + 1) }}</span>
            <UIcon
              name="i-lucide-arrow-up-right"
              class="size-6 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
          <div class="relative">
            <h3 class="text-3xl font-bold tracking-[-0.04em] lg:text-5xl">{{ t(`home.next.${card}.title`) }}</h3>
            <p
              class="mt-4 max-w-sm text-[15px] leading-relaxed"
              :class="at ? 'text-muted' : 'opacity-80'"
            >
              {{ t(`home.next.${card}.text`) }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </SiteSection>
  </div>
</template>
