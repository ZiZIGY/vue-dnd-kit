<script setup lang="ts">
  import { docsCollection } from '~~/i18n/locales';

  definePageMeta({ layout: 'docs' });

  const route = useRoute();
  const { locale, t } = useI18n();
  const localePath = useLocalePath();

  const prefix = computed(() => (locale.value === 'en' ? '' : `/${locale.value}`));
  /** The page's path in the English source. */
  const sourcePath = computed(() => (prefix.value ? route.path.slice(prefix.value.length) : route.path).replace(/\/$/, '') || '/');

  const { data } = await useAsyncData(`docs-${route.path}`, async () => {
    const own = await queryCollection(docsCollection(locale.value) as 'docs_en')
      .path(route.path.replace(/\/$/, ''))
      .first();
    if (own) return { page: own, fallback: false };
    // Not translated yet: the English original, flagged.
    const original = locale.value === 'en' ? null : await queryCollection('docs_en').path(sourcePath.value).first();
    return original ? { page: original, fallback: true } : null;
  });

  if (!data.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true });
  }

  const page = computed(() => data.value!.page);

  const { data: surround } = await useAsyncData(`docs-surround-${route.path}`, () =>
    queryCollectionItemSurroundings(docsCollection(locale.value) as 'docs_en', route.path.replace(/\/$/, ''), {
      fields: ['description'],
    }),
  );

  useSeoMeta({
    title: () => page.value.title,
    description: () => page.value.description,
  });

  const editLink = computed(
    () => `https://github.com/ZiZIGY/vue-dnd-kit/edit/v3/docs/content/${data.value?.fallback ? 'en' : locale.value}/${page.value.stem.split('/').slice(1).join('/')}.${page.value.extension}`,
  );
</script>

<template>
  <div class="xl:grid xl:grid-cols-[minmax(0,1fr)_14rem]">
    <article class="min-w-0 px-6 py-10 lg:px-12 lg:py-14">
      <div class="mx-auto max-w-3xl">
        <header class="relative pb-10 divider-dashed-b">
          <p
            v-if="page.category"
            class="mb-5 flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-muted"
          >
            <span
              aria-hidden="true"
              class="size-1.5 bg-primary"
            />{{ page.category }}
          </p>
          <h1 class="text-4xl font-medium leading-[1.05] tracking-[-0.03em] text-highlighted sm:text-5xl">{{ page.title }}</h1>
          <p
            v-if="page.description"
            class="mt-6 max-w-2xl text-lg leading-relaxed text-muted"
          >
            {{ page.description }}
          </p>

          <div
            v-if="locale !== 'en'"
            class="mt-8 flex items-start gap-3 bg-muted px-4 py-3 text-sm text-muted ring-1 ring-inset ring-default"
          >
            <span
              aria-hidden="true"
              class="mt-1.5 size-1.5 shrink-0 bg-primary"
            />
            <p>
              {{ data!.fallback ? t('docs.notTranslated') : t('docs.aiNotice') }}
              <NuxtLink
                v-if="!data!.fallback"
                :to="sourcePath"
                class="text-highlighted underline decoration-(--ui-border-accented) underline-offset-4 hover:decoration-(--ui-text-highlighted)"
                >{{ t('docs.readOriginal') }}</NuxtLink
              >
            </p>
          </div>
        </header>

        <ContentRenderer
          :value="page"
          class="mt-2"
        />

        <div class="mt-14 flex justify-end">
          <UButton
            color="neutral"
            variant="ghost"
            size="sm"
            icon="i-lucide-pen-line"
            :to="editLink"
            target="_blank"
            :label="t('docs.edit')"
            class="font-mono text-xs"
          />
        </div>

        <nav
          v-if="surround?.some(Boolean)"
          class="mt-6 cells-dashed border border-default sm:grid-cols-2"
          :aria-label="`${t('docs.previous')} / ${t('docs.next')}`"
        >
          <template
            v-for="(item, index) in surround"
            :key="index"
          >
            <NuxtLink
              v-if="item"
              :to="item.path"
              class="group bg-default p-6 transition-colors duration-300 hover:bg-muted"
              :class="index === 1 ? 'text-right sm:col-start-2' : ''"
            >
              <span
                class="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-dimmed"
                :class="index === 1 ? 'justify-end' : ''"
              >
                <UIcon
                  v-if="index === 0"
                  name="i-lucide-arrow-left"
                  class="size-3.5 transition-transform group-hover:-translate-x-0.5"
                />
                {{ index === 0 ? t('docs.previous') : t('docs.next') }}
                <UIcon
                  v-if="index === 1"
                  name="i-lucide-arrow-right"
                  class="size-3.5 transition-transform group-hover:translate-x-1"
                />
              </span>
              <span class="mt-3 block text-lg font-medium tracking-tight text-highlighted">{{ item.title }}</span>
            </NuxtLink>
            <div
              v-else
              class="hidden bg-default sm:block"
              aria-hidden="true"
            />
          </template>
        </nav>
      </div>
    </article>

    <aside class="hidden border-s border-default xl:block">
      <div class="sticky top-(--ui-header-height) max-h-[calc(100dvh-var(--ui-header-height))] overflow-y-auto px-6 py-10">
        <UContentToc
          v-if="page.body?.toc?.links?.length"
          :links="page.body.toc.links"
          :title="t('docs.onThisPage')"
          highlight
          :ui="{
            root: 'static bg-transparent backdrop-blur-none p-0',
            container: 'border-0 p-0',
            title: 'font-mono text-[10px] uppercase tracking-[0.2em] text-dimmed',
            link: 'text-xs',
          }"
        />
      </div>
    </aside>
  </div>
</template>
