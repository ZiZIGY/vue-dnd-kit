<script setup lang="ts">
  import type { ContentNavigationItem } from '@nuxt/content';

  const { locale } = useI18n();
  const navigation = inject<Ref<ContentNavigationItem[] | null>>('navigation');
  const items = computed(() => docsNavigation(navigation?.value, localePrefix(locale.value)));
</script>

<template>
  <div class="mx-auto max-w-(--ui-container) px-5 lg:grid lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-10 lg:px-8">
    <aside class="hidden lg:block">
      <div class="sticky top-(--ui-header-height) max-h-[calc(100dvh-var(--ui-header-height))] overflow-y-auto py-10 pe-2">
        <UContentNavigation
          :navigation="items"
          :collapsible="false"
          highlight
          highlight-color="primary"
          color="primary"
          variant="link"
          :ui="{
            root: 'text-[14px]',
            content: 'mt-2',
            list: 'ms-0 mx-0',
            listWithChildren: 'ms-0 border-s-0',
            itemWithChildren: 'mb-7',
            trigger: 'label text-[11px] text-highlighted px-0 py-1 pointer-events-none',
            linkTrailingIcon: 'hidden',
            linkLeadingIcon: 'hidden',
            link: 'px-0 py-1.5 text-muted hover:text-highlighted data-active:text-(--ui-primary)',
          }"
        />
      </div>
    </aside>
    <div class="min-w-0">
      <slot />
    </div>
  </div>
</template>
