<script setup lang="ts">
  defineProps<{ titles: string[]; mode: string; accepted: boolean }>();
</script>

<template>
  <div
    class="overlay-card"
    :class="{ rejected: !accepted }"
    :data-mode="mode"
  >
    <span>{{ titles.join(', ') }}</span>
    <em data-testid="mode">{{ mode }}</em>
    <b v-if="titles.length > 1">{{ titles.length }}</b>
  </div>
</template>

<style scoped>
  .overlay-card {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: space-between;
    width: 200px;
    padding: 10px 12px;
    background: var(--ui-surface);
    border: 1px solid var(--ui-border-strong);
    border-radius: var(--ui-radius);
    box-shadow: var(--ui-shadow-overlay);
    font: 14px/1.4 var(--font-sans);
  }

  .overlay-card[data-mode='copy'] {
    border-color: var(--ui-primary);
  }

  .overlay-card.rejected {
    border-color: var(--ui-danger);
  }

  em {
    font-family: var(--font-mono);
    font-size: 11px;
    font-style: normal;
    color: var(--ui-text-muted);
  }
</style>
