<script setup lang="ts">
  import { AnimatePresence, motion } from 'motion-v';
  import NotFound from 'vitepress/dist/client/theme-default/NotFound.vue';
  import { useData, useRoute } from 'vitepress';
  import VPDoc from 'vitepress/dist/client/theme-default/components/VPDoc.vue';
  import VPPage from 'vitepress/dist/client/theme-default/components/VPPage.vue';
  import CustomHome from './CustomHome.vue';
  import { computed } from 'vue';
  import { useSidebar } from 'vitepress/dist/client/theme-default/composables/sidebar.js';
  import { BackgroundLens } from './BackgroundLens';

  const { page, frontmatter } = useData();
  const route = useRoute();
  const { hasSidebar } = useSidebar();

  const contentTransition = {
    type: 'spring' as const,
    stiffness: 260,
    damping: 30,
  };

  const isDoc = computed(() => frontmatter.value.layout !== 'home');
</script>

<template>
  <BackgroundLens
    v-if="isDoc"
    class="fixed! inset-0 -z-20 pointer-events-none"
  />
  <AnimatePresence mode="wait">
    <motion.div
      :key="route.path"
      class="VPContent VDndContent"
      id="VPContent"
      :class="{
        'has-sidebar': hasSidebar,
        'is-home': frontmatter.layout === 'home',
      }"
      :initial="{ opacity: 0, y: 8 }"
      :animate="{ opacity: 1, y: 0 }"
      :exit="{ opacity: 0, y: -8 }"
      :transition="contentTransition"
    >
      <slot
        v-if="page.isNotFound"
        name="not-found"
      >
        <NotFound />
      </slot>

      <VPPage v-else-if="frontmatter.layout === 'page'">
        <template #page-top><slot name="page-top" /></template>
        <template #page-bottom><slot name="page-bottom" /></template>
      </VPPage>

      <CustomHome v-else-if="frontmatter.layout === 'home'">
        <template #home-hero-before><slot name="home-hero-before" /></template>
        <template #home-hero-info-before
          ><slot name="home-hero-info-before"
        /></template>
        <template #home-hero-info><slot name="home-hero-info" /></template>
        <template #home-hero-info-after
          ><slot name="home-hero-info-after"
        /></template>
        <template #home-hero-actions-after
          ><slot name="home-hero-actions-after"
        /></template>
        <template #home-hero-image><slot name="home-hero-image" /></template>
        <template #home-hero-after><slot name="home-hero-after" /></template>
        <template #home-features-before
          ><slot name="home-features-before"
        /></template>
        <template #home-features-after
          ><slot name="home-features-after"
        /></template>
      </CustomHome>

      <component
        v-else-if="frontmatter.layout && frontmatter.layout !== 'doc'"
        :is="frontmatter.layout"
      />

      <VPDoc
        v-else
        class="VDndDoc"
      >
        <template #doc-top><slot name="doc-top" /></template>
        <template #doc-bottom><slot name="doc-bottom" /></template>
        <template #doc-footer-before
          ><slot name="doc-footer-before"
        /></template>
        <template #doc-before><slot name="doc-before" /></template>
        <template #doc-after><slot name="doc-after" /></template>
        <template #aside-top><slot name="aside-top" /></template>
        <template #aside-outline-before
          ><slot name="aside-outline-before"
        /></template>
        <template #aside-outline-after
          ><slot name="aside-outline-after"
        /></template>
        <template #aside-ads-before><slot name="aside-ads-before" /></template>
        <template #aside-ads-after><slot name="aside-ads-after" /></template>
        <template #aside-bottom><slot name="aside-bottom" /></template>
      </VPDoc>
    </motion.div>
  </AnimatePresence>
</template>

<style scoped>
  .VPContent {
    flex-grow: 1;
    flex-shrink: 0;
    margin: var(--vp-layout-top-height, 0px) auto 0;
    width: 100%;
  }

  .VPContent.is-home {
    width: 100%;
    max-width: 100%;
  }

  .VPContent.has-sidebar {
    margin: 0;
  }

  @media (min-width: 960px) {
    .VPContent {
      padding-top: var(--vp-nav-height);
    }

    .VPContent.has-sidebar {
      margin: var(--vp-layout-top-height, 0px) 0 0;
      padding-left: var(--vp-sidebar-width);
    }
  }

  @media (min-width: 1440px) {
    .VPContent.has-sidebar {
      padding-right: calc((100vw - var(--vp-layout-max-width)) / 2);
      padding-left: calc(
        (100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width)
      );
    }
  }
</style>
