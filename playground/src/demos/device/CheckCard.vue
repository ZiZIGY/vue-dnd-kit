<script setup lang="ts">
  import type { Check, CheckResult, CheckState } from './checks';

  /** One device check: what to do, where to do it, what should happen, and the verdict. */
  const props = defineProps<{ check: Check; index: number; state: CheckState | undefined }>();
  const emit = defineEmits<{ change: [state: CheckState] }>();

  const decide = (result: CheckResult) =>
    emit('change', { ...props.state, result: props.state?.result === result ? undefined : result });
  const annotate = (event: Event) => emit('change', { ...props.state, note: (event.target as HTMLInputElement).value });
</script>

<template>
  <article
    class="check"
    :class="state?.result"
    :data-testid="`check-${check.id}`"
  >
    <header>
      <h3>{{ index + 1 }}. {{ check.title }}</h3>
      <span class="platforms">{{ check.platforms }}</span>
    </header>
    <ol class="steps">
      <li
        v-for="step in check.steps"
        :key="step"
      >
        {{ step }}
      </li>
    </ol>
    <slot />
    <p class="expected"><strong>Expected:</strong> {{ check.expected }}</p>
    <div class="verdict">
      <button
        type="button"
        class="pass"
        :aria-pressed="state?.result === 'pass'"
        data-testid="pass"
        @click="decide('pass')"
      >
        Pass
      </button>
      <button
        type="button"
        class="fail"
        :aria-pressed="state?.result === 'fail'"
        data-testid="fail"
        @click="decide('fail')"
      >
        Fail
      </button>
      <input
        type="text"
        :value="state?.note ?? ''"
        placeholder="Note (optional)"
        aria-label="Note"
        data-testid="note"
        @change="annotate"
      />
    </div>
  </article>
</template>

<style scoped>
  .check {
    padding: 12px;
    background: #fff;
    border: 1px solid #d1d5db;
    border-left-width: 4px;
    border-radius: 10px;
  }

  .check.pass {
    border-left-color: #16a34a;
  }

  .check.fail {
    border-left-color: #dc2626;
  }

  header {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 8px;
  }

  h3 {
    margin: 0;
    font-size: 16px;
  }

  .platforms {
    color: #6b7280;
    font-size: 12px;
  }

  .steps {
    margin: 8px 0 12px;
    padding-left: 20px;
    color: #374151;
  }

  .expected {
    margin: 12px 0 0;
    padding: 8px 10px;
    background: #f0fdf4;
    border-radius: 6px;
    color: #14532d;
  }

  .verdict {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 12px;
  }

  .verdict button {
    min-width: 72px;
    min-height: 40px;
    padding: 0 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #f9fafb;
    font: inherit;
    font-weight: 600;
  }

  .verdict .pass[aria-pressed='true'] {
    border-color: #16a34a;
    background: #16a34a;
    color: #fff;
  }

  .verdict .fail[aria-pressed='true'] {
    border-color: #dc2626;
    background: #dc2626;
    color: #fff;
  }

  .verdict input {
    flex: 1 1 160px;
    min-width: 0;
    min-height: 40px;
    padding: 0 10px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    /* 16px: iOS zooms into smaller text fields on focus. */
    font: 16px system-ui, sans-serif;
  }
</style>
