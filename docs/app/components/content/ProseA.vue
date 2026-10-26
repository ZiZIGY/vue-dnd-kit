<script setup lang="ts">
  import UiProseA from '@nuxt/ui/runtime/components/prose/A.vue';

  /**
   * A link in the Markdown. A page of the site (`/docs/…`) opens in the reader's language, so
   * every translation keeps the English paths.
   */
  const props = defineProps<{ href?: string; target?: '_blank' | '_parent' | '_self' | '_top' | (string & object) | null }>();
  const localePath = useLocalePath();
  const href = computed(() => (props.href?.startsWith('/') ? localePath(props.href) : props.href));
</script>

<template>
  <UiProseA
    :href="href"
    :target="target"
  >
    <slot />
  </UiProseA>
</template>
