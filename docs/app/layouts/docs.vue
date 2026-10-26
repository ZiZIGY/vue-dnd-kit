<script setup lang="ts">
  import type { ContentNavigationItem } from '@nuxt/content';

  const { locale } = useI18n();
  const navigation = inject<Ref<ContentNavigationItem[] | null>>('navigation');
  const items = computed(() => docsNavigation(navigation?.value, localePrefix(locale.value)));
</script>

<template>
  <div class="frame lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
    <aside class="hidden border-e border-default lg:block">
      <div class="sticky top-(--ui-header-height) max-h-[calc(100dvh-var(--ui-header-height))] overflow-y-auto px-6 py-10">
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
