<script setup lang="ts">
  /** A dashed ¾ arc on an accent crossing, turning slowly (40s). */
  const props = withDefaults(
    defineProps<{ side: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; size?: number; reverse?: boolean }>(),
    { size: 75, reverse: false },
  );
  const id = useId();
  const offset = computed(() => `${-props.size / 2 - 0.5}px`);
</script>

<template>
  <svg
    aria-hidden="true"
    class="pointer-events-none absolute z-2 hidden animate-grid-spin text-dimmed md:block"
    :class="{ '[animation-direction:reverse]': reverse }"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
      top: side.startsWith('top') ? offset : undefined,
      bottom: side.startsWith('bottom') ? offset : undefined,
      left: side.endsWith('left') ? offset : undefined,
      right: side.endsWith('right') ? offset : undefined,
    }"
    viewBox="0 0 75 75"
    fill="none"
  >
    <path
      d="M74 37.5C74 30.281 71.8593 23.2241 67.8486 17.2217C63.838 11.2193 58.1375 6.541 51.4679 3.7784C44.7984 1.0158 37.4595 0.292977 30.3792 1.70134C23.2989 3.1097 16.7952 6.58599 11.6906 11.6906C6.58599 16.7952 3.1097 23.2989 1.70134 30.3792C0.292977 37.4595 1.0158 44.7984 3.7784 51.4679C6.541 58.1375 11.2193 63.838 17.2217 67.8486C23.2241 71.8593 30.281 74 37.5 74"
      :stroke="`url(#${id})`"
      stroke-dasharray="2 2"
    />
    <defs>
      <linearGradient
        :id="id"
        x1="0"
        y1="0"
        x2="1"
        y2="1"
      >
        <stop
          offset="0"
          stop-color="currentColor"
        />
        <stop
          offset="0.6"
          stop-color="currentColor"
          stop-opacity="0.35"
        />
        <stop
          offset="1"
          stop-color="currentColor"
          stop-opacity="0.1"
        />
      </linearGradient>
    </defs>
  </svg>
</template>
