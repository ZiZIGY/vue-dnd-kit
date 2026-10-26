<script setup lang="ts">
  import type { ContentNavigationItem } from '@nuxt/content';

  const { locale } = useI18n();
  const navigation = inject<Ref<ContentNavigationItem[] | null>>('navigation');
  const items = computed(() => docsNavigation(navigation?.value, localePrefix(locale.value)));
</script>

<template>
  <div class="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
    <aside class="hidden border-e border-default lg:block">
      <div class="sticky top-(--ui-header-height) max-h-[calc(100dvh-var(--ui-header-height))] overflow-y-auto px-6 py-8">
        <UContentNavigation
          :navigation="items"
          highlight
          :ui="{
            root: 'text-sm',
            linkLeadingIcon: 'size-4',
            listWithChildren: 'ms-0',
            link: 'rounded-none before:rounded-none py-1.5',
            linkTrailingBadge: 'font-mono',
            trigger: 'font-mono text-[10px] uppercase tracking-[0.2em] text-dimmed rounded-none',
          }"
        />
      </div>
    </aside>
    <div class="min-w-0">
      <slot />
    </div>
  </div>
</template>
