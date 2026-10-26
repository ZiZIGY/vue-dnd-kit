<script setup lang="ts">
  /** Light/dark switch: the new theme opens as a circle from the click (a view transition). */
  const colorMode = useColorMode();
  const { t } = useI18n();

  const toggle = async (event: MouseEvent) => {
    const next = colorMode.value === 'dark' ? 'light' : 'dark';
    const apply = () => {
      colorMode.preference = next;
    };
    if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return apply();
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    // The keyboard gives (0, 0): the circle starts from the button then.
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const root = document.documentElement;
    root.classList.add('theme-transition');
    const transition = document.startViewTransition(async () => {
      apply();
      await nextTick();
    });
    try {
      await transition.ready;
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
      );
      await transition.finished;
    } catch {
      // Skipped transitions still apply the theme.
    } finally {
      root.classList.remove('theme-transition');
    }
  };
</script>

<template>
  <ClientOnly>
    <UButton
      color="neutral"
      variant="ghost"
      square
      :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
      :aria-label="t('theme.toggle')"
      @click="toggle"
    />
    <template #fallback>
      <span class="size-8" />
    </template>
  </ClientOnly>
</template>
