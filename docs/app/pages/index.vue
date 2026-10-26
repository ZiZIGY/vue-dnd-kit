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

  const list = (key: string) => (tm(key) as unknown[]).map((entry) => rt(entry as never));
  const specs = computed(() => list('home.specs'));
  const SPEC_ICONS = ['i-lucide-layers', 'i-lucide-gauge', 'i-lucide-accessibility', 'i-lucide-rows-4'];

  const FEATURE_ICONS = [
    'i-lucide-list-ordered',
    'i-lucide-kanban',
    'i-lucide-list-tree',
    'i-lucide-boxes',
    'i-lucide-move',
    'i-lucide-accessibility',
    'i-lucide-rows-4',
    'i-lucide-database',
    'i-lucide-monitor-cog',
  ];
  const features = computed(() =>
    (tm('home.features.items') as { title: unknown; text: unknown }[]).map((item, index) => ({
      title: rt(item.title as never),
      text: rt(item.text as never),
      icon: FEATURE_ICONS[index]!,
    })),
  );

  const packages = computed(() => [
    { name: '@vue-dnd-kit/core', text: t('home.ecosystem.core'), icon: 'i-lucide-box', to: localePath('/docs/getting-started/installation') },
    { name: '@vue-dnd-kit/actions', text: t('home.ecosystem.actions'), icon: 'i-lucide-mouse-pointer-click' },
    { name: '@vue-dnd-kit/devtools', text: t('home.ecosystem.devtools'), icon: 'i-lucide-monitor-cog' },
    { name: '@vue-dnd-kit/nuxt', text: t('home.ecosystem.nuxt'), icon: 'i-simple-icons-nuxt' },
  ]);

  const metrics = computed(() => [
    { value: 1243, suffix: '', label: t('home.metrics.e2e') },
    { value: 469, suffix: '', label: t('home.metrics.unit') },
    { value: 21, suffix: ' KB', label: t('home.metrics.size') },
    { value: 9, suffix: '', label: t('home.metrics.languages') },
  ]);
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="relative border-b border-default">
      <DecorPattern
        variant="glow"
        fade="none"
        class="hidden lg:block"
      />
      <div class="grid lg:grid-cols-12">
        <div class="relative px-6 pt-20 pb-16 lg:col-span-7 lg:px-12 lg:pt-28 lg:pb-24">
          <DecorPattern
            variant="dots"
            fade="top-right"
            class="opacity-60 lg:hidden"
          />
          <div class="relative">
            <div
              v-reveal
              style="--reveal-distance: 140%"
            >
              <span
                class="inline-flex items-center gap-2.5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-muted ring-1 ring-inset ring-default"
              >
                <span
                  aria-hidden="true"
                  class="size-1.5 animate-blink bg-primary"
                />{{ t('home.badge') }}
              </span>
            </div>
            <RevealText
              tag="h1"
              :text="t('home.title')"
              :delay="0.1"
              :stagger="0.06"
              :duration="1"
              class="mt-8 text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-highlighted sm:text-6xl sm:leading-[1.02] lg:text-7xl xl:text-[5.5rem]"
            />
            <RevealText
              tag="p"
              :text="t('home.lead')"
              :delay="0.45"
              :stagger="0.014"
              :duration="0.8"
              class="mt-8 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
            />
            <div
              v-reveal="0.7"
              style="--reveal-distance: 120%"
              class="mt-10"
            >
              <div class="flex flex-col gap-3 sm:flex-row">
                <UButton
                  size="xl"
                  trailing-icon="i-lucide-arrow-right"
                  :to="localePath('/docs/getting-started/introduction')"
                  :label="t('home.start')"
                  class="justify-center"
                />
                <UButton
                  size="xl"
                  color="neutral"
                  variant="outline"
                  :to="localePath('/docs/getting-started/quick-start')"
                  :label="t('home.examples')"
                  class="justify-center"
                />
              </div>
            </div>
            <div
              v-reveal="0.85"
              style="--reveal-distance: 120%"
              class="mt-4"
            >
              <SiteCopyCommand
                command="npm i @vue-dnd-kit/core"
                class="w-full justify-center sm:w-auto sm:justify-start"
              />
            </div>
          </div>
        </div>
        <div class="relative hidden divider-dashed-s lg:col-span-5 lg:block">
          <HomeHeroVisual />
        </div>
      </div>
      <DecorGridCircle side="bottom-left" />
      <DecorGridCircle
        side="bottom-right"
        reverse
      />
    </section>

    <!-- Specs -->
    <div class="cells-dashed border-b border-default sm:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="(spec, index) in specs"
        :key="spec"
        class="bg-default"
      >
        <div
          v-reveal="1 + index * 0.08"
          class="h-full"
        >
          <div
            class="flex h-full items-center gap-3 px-6 py-5 font-mono text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:bg-muted lg:px-12"
          >
            <UIcon
              :name="SPEC_ICONS[index]!"
              class="size-4 shrink-0 text-dimmed"
            />{{ spec }}
          </div>
        </div>
      </div>
    </div>

    <!-- Features -->
    <section class="relative border-b border-default">
      <DecorGridCross side="top-left" />
      <DecorGridCross side="top-right" />
      <SectionHeader
        :eyebrow="t('home.features.eyebrow')"
        :title="t('home.features.title')"
        :description="t('home.features.description')"
        pattern="hatch"
      />
      <div class="cells-dashed sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(feature, index) in features"
          :key="feature.title"
          class="bg-default"
        >
          <div
            v-reveal="(index % 3) * 0.08"
            class="h-full"
          >
            <article class="group flex h-full flex-col p-8 transition-colors duration-300 hover:bg-muted lg:p-12">
              <div class="flex items-center justify-between">
                <div
                  class="flex size-10 items-center justify-center text-highlighted ring-1 ring-inset ring-default transition-colors duration-300 group-hover:bg-primary group-hover:text-inverted"
                >
                  <UIcon
                    :name="feature.icon"
                    class="size-5"
                  />
                </div>
                <span class="font-mono text-xs text-dimmed">{{ String(index + 1).padStart(2, '0') }}</span>
              </div>
              <h3 class="mt-12 text-lg font-medium tracking-tight text-highlighted lg:text-xl">{{ feature.title }}</h3>
              <p class="mt-3 max-w-md text-sm leading-relaxed text-muted lg:text-base">{{ feature.text }}</p>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="relative border-b border-default">
      <DecorGridCross side="top-left" />
      <DecorGridCross side="top-right" />
      <SectionHeader
        :eyebrow="t('home.how.eyebrow')"
        :title="t('home.how.title')"
        :description="t('home.how.description')"
        pattern="cross"
        fade="right"
      />
      <div class="px-6 py-10 lg:px-12 lg:py-14">
        <Example
          name="quick-start"
          title="Quick start"
          height="22rem"
          class="my-0!"
        />
      </div>
    </section>

    <!-- Ecosystem -->
    <section class="relative border-b border-default">
      <DecorGridCross side="top-left" />
      <DecorGridCross side="top-right" />
      <SectionHeader
        :eyebrow="t('home.ecosystem.eyebrow')"
        :title="t('home.ecosystem.title')"
        pattern="grid"
        fade="top-right"
      />
      <div class="cells-dashed md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(pkg, index) in packages"
          :key="pkg.name"
          class="bg-default"
        >
          <div
            v-reveal="(index % 3) * 0.08"
            class="h-full"
          >
            <article class="group flex h-full flex-col p-8 transition-colors duration-300 hover:bg-muted lg:p-12">
              <div class="flex items-center justify-between">
                <div
                  class="flex size-10 items-center justify-center text-highlighted ring-1 ring-inset ring-default transition-colors duration-300 group-hover:bg-primary group-hover:text-inverted"
                >
                  <UIcon
                    :name="pkg.icon"
                    class="size-5"
                  />
                </div>
                <span class="font-mono text-xs text-dimmed">{{ String(index + 1).padStart(2, '0') }}</span>
              </div>
              <h3 class="mt-12 font-mono text-sm tracking-tight text-highlighted">{{ pkg.name }}</h3>
              <p class="mt-3 max-w-md text-sm leading-relaxed text-muted lg:text-base">{{ pkg.text }}</p>
            </article>
          </div>
        </div>
        <div class="bg-default md:col-span-2">
          <div
            v-reveal="0.16"
            class="h-full"
          >
            <article class="relative flex h-full flex-col justify-between gap-8 p-8 lg:p-12">
              <DecorPattern
                variant="hatch"
                fade="left"
                class="opacity-50"
              />
              <div class="relative flex items-center justify-between">
                <div class="flex size-10 items-center justify-center text-highlighted ring-1 ring-inset ring-default">
                  <UIcon
                    name="i-lucide-sparkles"
                    class="size-5"
                  />
                </div>
                <span class="font-mono text-xs text-dimmed">05</span>
              </div>
              <div class="relative">
                <p class="max-w-md text-sm leading-relaxed text-muted lg:text-base">{{ t('home.ecosystem.skill') }}</p>
                <SiteCopyCommand
                  command="npx skills add ZiZIGY/vue-dnd-kit"
                  class="mt-6"
                />
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>

    <!-- Metrics -->
    <section class="relative border-b border-default">
      <DecorGridCircle
        side="top-left"
        :size="56"
      />
      <DecorGridCircle
        side="top-right"
        :size="56"
        reverse
      />
      <div class="cells-dashed sm:grid-cols-2 lg:grid-cols-4">
        <div
          v-for="(metric, index) in metrics"
          :key="metric.label"
          class="relative bg-default"
        >
          <DecorPattern
            variant="hatch"
            fade="bottom"
            class="opacity-40"
          />
          <div
            v-reveal="index * 0.08"
            class="relative h-full"
          >
            <div class="px-8 py-10 lg:px-12 lg:py-16">
              <p class="text-5xl font-medium tracking-tight text-highlighted lg:text-6xl">
                <CountUp
                  :value="metric.value"
                  :delay="0.2 + index * 0.08"
                /><span class="text-dimmed">{{ metric.suffix }}</span>
              </p>
              <p class="mt-4 font-mono text-[11px] uppercase tracking-[0.16em] text-muted">{{ metric.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="relative border-b border-default">
      <DecorGridCross side="top-left" />
      <DecorGridCross side="top-right" />
      <DecorPattern
        variant="dots"
        fade="radial"
        class="opacity-70"
      />
      <div class="relative flex flex-col items-center px-6 py-24 text-center lg:px-12 lg:py-40">
        <div v-reveal>
          <p class="mb-6 flex items-center justify-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            <span
              aria-hidden="true"
              class="size-1.5 bg-primary"
            />{{ t('home.cta.eyebrow') }}
          </p>
        </div>
        <RevealText
          tag="h2"
          :text="t('home.cta.title')"
          :delay="0.05"
          class="max-w-4xl text-4xl font-medium leading-[1.05] tracking-tight text-highlighted sm:text-5xl lg:text-6xl"
        />
        <RevealText
          tag="p"
          :text="t('home.cta.description')"
          :delay="0.2"
          :stagger="0.012"
          class="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg"
        />
        <div
          v-reveal="0.35"
          style="--reveal-distance: 120%"
          class="mt-10"
        >
          <div class="flex flex-col gap-3 sm:flex-row">
            <UButton
              size="xl"
              trailing-icon="i-lucide-arrow-right"
              :to="localePath('/docs/getting-started/introduction')"
              :label="t('home.cta.primary')"
              class="justify-center"
            />
            <UButton
              size="xl"
              color="neutral"
              variant="outline"
              icon="i-simple-icons-github"
              to="https://github.com/ZiZIGY/vue-dnd-kit"
              target="_blank"
              :label="t('home.cta.secondary')"
              class="justify-center"
            />
          </div>
        </div>
        <div
          v-reveal="0.45"
          style="--reveal-distance: 120%"
          class="mt-4"
        >
          <SiteCopyCommand command="npm i @vue-dnd-kit/core" />
        </div>
      </div>
    </section>
  </div>
</template>
