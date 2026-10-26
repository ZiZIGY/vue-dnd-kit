<script setup lang="ts">
  const { t } = useI18n();
  const localePath = useLocalePath();
  const route = useRoute();

  const links = computed(() => [
    { label: t('nav.docs'), to: localePath('/docs/getting-started/introduction'), active: route.path.includes('/docs/') },
    { label: t('nav.examples'), to: localePath('/docs/getting-started/quick-start'), active: false },
    { label: 'GitHub', to: 'https://github.com/ZiZIGY/vue-dnd-kit', active: false, external: true },
  ]);

  // The bar gets its panel once the page scrolls under it.
  const scrolled = ref(false);
  const open = ref(false);
  onMounted(() => {
    const update = () => (scrolled.value = window.scrollY > 8);
    update();
    window.addEventListener('scroll', update, { passive: true });
    onBeforeUnmount(() => window.removeEventListener('scroll', update));
  });
  watch(() => route.fullPath, () => (open.value = false));
</script>

<template>
  <header
    class="sticky top-0 z-50 h-(--ui-header-height) transition-colors duration-200"
    :class="scrolled || open ? 'border-b border-default bg-default/85 backdrop-blur-md' : 'border-b border-transparent'"
  >
    <div class="mx-auto flex h-full max-w-(--ui-container) items-center gap-6 px-5 lg:px-8">
      <NuxtLink
        :to="localePath('/')"
        :aria-label="t('nav.home')"
        class="shrink-0 rounded-(--ui-radius) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--ui-primary)"
      >
        <SiteLogo />
      </NuxtLink>

      <nav
        :aria-label="t('nav.menu')"
        class="mx-auto hidden items-center gap-1 md:flex"
      >
        <NuxtLink
          v-for="link in links"
          :key="link.label"
          :to="link.to"
          :target="link.external ? '_blank' : undefined"
          class="label rounded-(--ui-radius) px-3 py-2 text-[11px] transition-colors"
          :class="link.active ? 'text-(--ui-primary)' : 'text-highlighted hover:text-(--ui-primary)'"
          >{{ link.label }}</NuxtLink
        >
      </nav>

      <div class="ms-auto flex items-center gap-1 md:ms-0">
        <UContentSearchButton
          color="neutral"
          variant="ghost"
          :aria-label="t('search.button')"
        />
        <SiteVersionSelect class="hidden sm:inline-flex" />
        <SiteLocaleSelect />
        <SiteThemeToggle />
        <UButton
          color="neutral"
          variant="ghost"
          square
          class="md:hidden"
          :icon="open ? 'i-lucide-x' : 'i-lucide-menu'"
          :aria-label="t('nav.menu')"
          :aria-expanded="open"
          @click="open = !open"
        />
      </div>
    </div>

    <div
      v-if="open"
      class="border-t border-default bg-default px-5 pb-8 pt-4 md:hidden"
    >
      <nav class="flex flex-col">
        <NuxtLink
          v-for="link in links"
          :key="link.label"
          :to="link.to"
          :target="link.external ? '_blank' : undefined"
          class="heading border-b border-default py-4 text-2xl"
          >{{ link.label }}</NuxtLink
        >
      </nav>
      <SiteVersionSelect class="mt-6" />
    </div>
  </header>
</template>
