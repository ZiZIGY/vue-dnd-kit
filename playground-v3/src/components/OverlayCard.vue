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
    background: #fff;
    border: 1px solid #2563eb;
    border-radius: 6px;
    box-shadow: 0 8px 20px rgb(0 0 0 / 0.15);
    font: 14px/1.4 system-ui, sans-serif;
  }

  .overlay-card[data-mode='copy'] {
    border-color: #16a34a;
  }

  .overlay-card.rejected {
    border-color: #dc2626;
  }

  em {
    font-size: 11px;
    color: #6b7280;
  }
</style>
