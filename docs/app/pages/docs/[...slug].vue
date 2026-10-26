<script setup lang="ts">
  import { useClipboard } from '@vueuse/core';
  import type { ContentNavigationItem } from '@nuxt/content';
  import { docsCollection } from '~~/i18n/locales';

  definePageMeta({ layout: 'docs' });

  const route = useRoute();
  const { locale, t } = useI18n();
  const { app } = useRuntimeConfig();
  const navigation = inject<Ref<ContentNavigationItem[] | null>>('navigation');

  const prefix = computed(() => localePrefix(locale.value));
  const path = computed(() => route.path.replace(/\/$/, ''));
  /** The page's path in the English source. */
  const sourcePath = computed(() => (prefix.value ? path.value.slice(prefix.value.length) : path.value) || '/');

  const { data } = await useAsyncData(`docs-${route.path}`, async () => {
    const own = await queryCollection(docsCollection(locale.value) as 'docs_en').path(path.value).first();
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
    queryCollectionItemSurroundings(docsCollection(locale.value) as 'docs_en', path.value, { fields: ['description'] }),
  );

  useSeoMeta({
    title: () => page.value.title,
    description: () => page.value.description,
  });

  /** The section the page sits in (or opens: its index page), for the breadcrumb. */
  const section = computed(() =>
    docsNavigation(navigation?.value, prefix.value).find(
      (item) => path.value === item.path || path.value.startsWith(`${item.path}/`),
    )?.title,
  );

  // The page as Markdown (the static build writes `<page>.md`): for pasting into an AI chat.
  const { copy, copied } = useClipboard({ copiedDuring: 1600 });
  const copyPage = async () => {
    const response = await fetch(`${app.baseURL.replace(/\/$/, '')}${sourcePath.value}.md`).catch(() => null);
    await copy(response?.ok ? await response.text() : `# ${page.value.title}\n\n${page.value.description ?? ''}`);
  };

  const editLink = computed(
    () =>
      `https://github.com/ZiZIGY/vue-dnd-kit/edit/v3/docs/content/${data.value?.fallback ? 'en' : locale.value}/${page.value.stem.split('/').slice(1).join('/')}.${page.value.extension}`,
  );
</script>

<template>
  <div class="xl:grid xl:grid-cols-[minmax(0,1fr)_16rem]">
    <article class="min-w-0">
      <header class="relative overflow-hidden border-b border-default px-(--gutter) py-12 lg:py-16">
        <div
          aria-hidden="true"
          class="grid-paper fade-right pointer-events-none absolute inset-0 opacity-60"
        />
        <div class="relative mx-auto max-w-3xl">
          <p class="label flex items-center gap-2 text-[11px] text-muted">
            <span class="size-1.5 bg-(--ui-primary)" />
            <span>{{ t('nav.docs') }}</span>
            <template v-if="section">
              <span class="text-dimmed">/</span>
              <span>{{ section }}</span>
            </template>
          </p>
          <h1 class="display mt-5 text-4xl sm:text-5xl lg:text-[3.5rem]">{{ page.title }}</h1>
          <p
            v-if="page.description"
            class="mt-5 max-w-2xl text-lg leading-relaxed text-muted"
          >
            {{ page.description }}
          </p>
          <div class="mt-6 flex flex-wrap items-center gap-2">
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
              :label="copied ? t('docs.copied') : t('docs.copyPage')"
              class="-ms-3"
              @click="copyPage"
            />
            <UButton
              color="neutral"
              variant="ghost"
              size="sm"
              icon="i-lucide-pen-line"
              :to="editLink"
              target="_blank"
              :label="t('docs.edit')"
            />
          </div>

          <div
            v-if="locale !== 'en'"
            class="mt-6 flex items-start gap-3 rounded-(--ui-radius) border-s-2 border-(--ui-primary) bg-elevated/60 px-4 py-3 text-sm text-muted"
          >
            <UIcon
              name="i-lucide-languages"
              class="mt-0.5 size-4 shrink-0 text-(--ui-primary)"
            />
            <p>
              {{ data!.fallback ? t('docs.notTranslated') : t('docs.aiNotice') }}
              <NuxtLink
                v-if="!data!.fallback"
                :to="sourcePath"
                class="font-medium text-highlighted underline decoration-(--ui-primary)/50 decoration-2 underline-offset-4 hover:decoration-(--ui-primary)"
                >{{ t('docs.readOriginal') }}</NuxtLink
              >
            </p>
          </div>
        </div>
      </header>

      <div class="mx-auto max-w-3xl px-(--gutter) py-12 lg:box-content lg:py-14">
        <ContentRenderer :value="page" />

        <nav
          v-if="surround?.some(Boolean)"
          class="mt-16 grid gap-3 sm:grid-cols-2"
          :aria-label="`${t('docs.previous')} / ${t('docs.next')}`"
        >
          <template
            v-for="(item, index) in surround"
            :key="index"
          >
            <NuxtLink
              v-if="item"
              :to="item.path"
              class="group rounded-(--ui-radius) bg-elevated/60 p-5 transition-colors hover:bg-elevated"
              :class="index === 1 ? 'text-right sm:col-start-2' : ''"
            >
              <span
                class="label flex items-center gap-1 text-[10px] text-dimmed"
                :class="index === 1 ? 'justify-end' : ''"
              >
                <UIcon
                  v-if="index === 0"
                  name="i-lucide-chevron-left"
                  class="size-3.5"
                />
                {{ index === 0 ? t('docs.previous') : t('docs.next') }}
                <UIcon
                  v-if="index === 1"
                  name="i-lucide-chevron-right"
                  class="size-3.5"
                />
              </span>
              <span class="heading mt-2 block text-lg transition-colors group-hover:text-(--ui-primary)">{{ item.title }}</span>
            </NuxtLink>
          </template>
        </nav>
      </div>
    </article>

    <aside class="hidden border-s border-default xl:block">
      <div class="sticky top-(--ui-header-height) max-h-[calc(100dvh-var(--ui-header-height))] overflow-y-auto px-6 py-12 lg:py-16">
        <UContentToc
          v-if="page.body?.toc?.links?.length"
          :links="page.body.toc.links"
          :title="t('docs.onThisPage')"
          highlight
          highlight-color="primary"
          color="primary"
          :ui="{
            root: 'static bg-transparent backdrop-blur-none p-0 border-0',
            container: 'border-0 p-0 lg:py-0',
            top: 'hidden',
            title: 'label text-[11px] text-highlighted mb-3',
            link: 'text-[13px] text-muted hover:text-highlighted data-[active=true]:text-(--ui-primary)',
          }"
        />
      </div>
    </aside>
  </div>
</template>
