<script setup lang="ts">
  /** Counts from 0 to `value` (out-expo, 1.8s) the first time it is mostly visible. */
  const props = withDefaults(defineProps<{ value: number; delay?: number }>(), { delay: 0 });
  const { locale } = useI18n();
  const el = useTemplateRef<HTMLElement>('el');
  const shown = ref(props.value);
  const format = computed(() => new Intl.NumberFormat(locale.value));

  onMounted(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !el.value) return;
    shown.value = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        const start = performance.now() + props.delay * 1000;
        const tick = (now: number) => {
          const progress = Math.min(Math.max((now - start) / 1800, 0), 1);
          shown.value = Math.round(props.value * (1 - Math.pow(2, -10 * progress)));
          if (progress < 1) requestAnimationFrame(tick);
          else shown.value = props.value;
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(el.value);
  });
</script>

<template>
  <span
    ref="el"
    class="tabular-nums"
    >{{ format.format(shown) }}</span
  >
</template>
