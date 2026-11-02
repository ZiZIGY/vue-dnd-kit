<script setup lang="ts">
  import { useDnDMonitor } from '@vue-dnd-kit/core';

  /**
   * The lost page on a desk, and the places that do exist. Dropped on one (or one clicked),
   * the site goes there: the page slips into the place first.
   */
  const { t } = useI18n();
  const localePath = useLocalePath();
  const route = useRoute();
  const log = useNotFoundLog();

  const zones = computed(() => [
    { key: 'home', title: t('notFound.home'), to: localePath('/'), icon: 'i-lucide-house' },
    { key: 'docs', title: t('nav.docs'), to: localePath('/docs/getting-started/introduction'), icon: 'i-lucide-book-open' },
    { key: 'examples', title: t('nav.examples'), to: localePath('/docs/examples'), icon: 'i-lucide-layout-grid' },
    { key: 'api', title: t('nav.api'), to: localePath('/docs/api/dnd-provider'), icon: 'i-lucide-braces' },
  ]);

  /** The place the page was dropped on: the site goes there once the drop has landed. */
  const sent = ref<string | null>(null);
  const send = (key: string, to: string) => {
    sent.value = key;
    log.write('navigate', to, 'ok');
  };
  useDnDMonitor({
    onDragSettle: () => {
      const zone = zones.value.find((item) => item.key === sent.value);
      if (zone) void navigateTo(zone.to);
    },
  });
</script>

<template>
  <SiteSection>
    <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div class="flex flex-col px-(--gutter) py-14 lg:py-20">
        <SiteEyebrow
          :index="1"
          :label="t('notFound.lost')"
        />
        <h1 class="display mt-6 text-5xl text-balance sm:text-6xl lg:text-7xl">{{ t('notFound.title') }}</h1>
        <p class="mt-5 max-w-md text-lg leading-relaxed text-muted">{{ t('notFound.description') }}</p>
        <!-- The desk the page lies on. -->
        <div class="relative mt-12 flex flex-1 flex-col items-center justify-center gap-8 py-8">
          <div
            aria-hidden="true"
            class="dot-paper fade-radial pointer-events-none absolute inset-0 opacity-70"
          />
          <NotFoundLostPage
            :path="route.path"
            :sent="!!sent"
            class="relative"
          />
          <p class="label relative flex items-center gap-2 text-center text-[10px] text-dimmed">
            <UIcon
              name="i-lucide-move"
              class="size-3.5 shrink-0"
            />
            {{ t('notFound.drag') }}
          </p>
        </div>
      </div>
      <div class="cells-dashed auto-rows-fr grid-cols-2 border-default max-lg:border-t lg:border-s">
        <NotFoundZone
          v-for="(zone, at) in zones"
          :key="zone.key"
          :zone="zone"
          :index="at + 1"
          :sent="sent === zone.key"
          @drop="send(zone.key, zone.to)"
        />
      </div>
    </div>
  </SiteSection>
</template>
