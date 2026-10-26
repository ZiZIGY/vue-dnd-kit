<script setup lang="ts">
  /** The hero's right half: a blueprint with axes and rings, and a live sortable grid at its centre. */
  const { t, tm, rt } = useI18n();
  const corners = computed(() => (tm('home.visual.corners') as unknown[]).map((entry) => rt(entry as never)));

  const RINGS = [
    { r: 120, dash: '2 4', period: 52, reverse: false },
    { r: 180, dash: '2 6', period: 70, reverse: true },
    { r: 240, dash: '1 9', period: 120, reverse: false },
  ];
</script>

<template>
  <div class="relative h-full min-h-[560px] overflow-hidden">
    <DecorPattern
      variant="dots"
      fade="radial"
    />

    <!-- Axes through the centre, with pulses running along them. -->
    <div class="absolute inset-x-0 top-1/2 h-px line-dashed-x">
      <DecorBeam
        :duration="5"
        :delay="1.5"
      />
    </div>
    <div class="absolute inset-y-0 left-1/2 w-px line-dashed-y">
      <DecorBeam
        axis="y"
        :duration="6"
        :delay="3"
      />
    </div>

    <svg
      aria-hidden="true"
      class="pointer-events-none absolute top-1/2 left-1/2 size-[520px] -translate-x-1/2 -translate-y-1/2 text-dimmed"
      viewBox="0 0 520 520"
      fill="none"
    >
      <circle
        v-for="ring in RINGS"
        :key="ring.r"
        cx="260"
        cy="260"
        :r="ring.r"
        stroke="currentColor"
        :stroke-dasharray="ring.dash"
        class="animate-grid-spin [transform-box:view-box] [transform-origin:260px_260px]"
        :style="{ animationDuration: `${ring.period}s`, animationDirection: ring.reverse ? 'reverse' : 'normal' }"
      />
      <path
        d="M260 80 A180 180 0 0 1 440 260"
        stroke="currentColor"
        stroke-width="1.5"
        class="animate-grid-spin text-muted [transform-box:view-box] [transform-origin:260px_260px]"
        style="animation-duration: 24s"
      />
    </svg>

    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <HomeHeroBoard />
    </div>

    <span
      v-for="(label, index) in corners"
      :key="label"
      class="absolute font-mono text-[10px] uppercase tracking-[0.2em] text-dimmed"
      :class="[
        index < 2 ? 'top-8' : 'bottom-8',
        index % 2 ? 'right-8 text-right' : 'left-8',
      ]"
      >{{ label }}</span
    >
    <p
      class="absolute inset-x-0 bottom-20 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-dimmed"
    >
      {{ t('home.visual.hint') }}
    </p>
  </div>
</template>
