<script setup lang="ts">
  import { useReadMode } from '../composables/useReadMode';
  import { onMounted } from 'vue';

  const { isReadMode, toggle } = useReadMode();

  // Re-initialize on client (SSR guard)
  onMounted(() => useReadMode());
</script>

<template>
  <button
    class="read-mode-btn"
    :class="{ 'read-mode-btn--active': isReadMode }"
    :title="isReadMode ? 'Disable read mode (show background)' : 'Enable read mode (hide background)'"
    :aria-label="isReadMode ? 'Disable read mode' : 'Enable read mode'"
    :aria-pressed="isReadMode"
    @click="toggle"
  >
    <svg
      v-if="!isReadMode"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <!-- Sparkles / ambient icon -->
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
      <path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" />
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <!-- Book / read icon -->
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
    <span class="read-mode-label">{{ isReadMode ? 'Read mode' : 'Read mode' }}</span>
  </button>
</template>

<style scoped>
  .read-mode-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 0 8px;
    height: 32px;
    margin-left: 4px;
    border-radius: 6px;
    border: 1px solid transparent;
    background: transparent;
    color: var(--vp-c-text-2);
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    transition: color 0.2s, background 0.2s, border-color 0.2s;
    white-space: nowrap;
  }

  .read-mode-btn:hover {
    color: var(--vp-c-text-1);
    background: var(--vp-c-bg-soft);
    border-color: var(--vp-c-divider);
  }

  .read-mode-btn--active {
    color: var(--vp-c-brand-1);
    background: color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent);
    border-color: color-mix(in srgb, var(--vp-c-brand-1) 25%, transparent);
  }

  .read-mode-btn--active:hover {
    background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  }

  /* Button only makes sense on desktop where background is visible */
  @media (max-width: 767px) {
    .read-mode-btn { display: none; }
  }
</style>
