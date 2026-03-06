<script setup lang="ts">
  const props = withDefaults(
    defineProps<{
      size?: 'large' | 'small';
      number: number;
      symbol: string;
      name: string;
      mass: string;
      config?: string[];
    }>(),
    {
      size: 'large',
      config: () => [],
    }
  );
</script>

<template>
  <div
    class="element"
    :class="`element--${props.size}`"
  >
    <div class="element__number">{{ props.number }}</div>
    <div class="element__symbol">{{ props.symbol }}</div>
    <div class="element__name">{{ props.name }}</div>
    <div class="element__mass">{{ props.mass }}</div>
    <div class="element__config">
      <span
        v-for="(c, idx) in props.config"
        :key="idx"
      >
        {{ c }}
      </span>
    </div>
  </div>
</template>

<style scoped>
  .element {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 0.75rem;
    background: linear-gradient(
      135deg,
      rgba(248, 187, 208, 0.96),
      rgba(244, 143, 177, 0.95)
    );
    color: #111827;
    box-shadow: 0 10px 25px rgba(244, 63, 94, 0.25);
    border: 1px solid rgba(248, 113, 113, 0.35);
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      sans-serif;
  }

  .element--large {
    width: 140px;
    padding: 0.75rem;
  }

  .element--small {
    width: 90px;
    height: 90px;
    padding: 0.5rem;
  }

  .element__number {
    font-size: 0.75rem;
    font-weight: 600;
  }

  .element__symbol {
    font-size: 2.4rem;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0.02em;
  }

  .element--small .element__symbol {
    font-size: 1.6rem;
  }

  .element__name {
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    margin-top: 0.2rem;
  }

  .element__mass {
    font-size: 0.75rem;
    font-weight: 500;
  }

  .element__config {
    display: flex;
    justify-content: space-between;
    font-size: 0.6rem;
  }
</style>
