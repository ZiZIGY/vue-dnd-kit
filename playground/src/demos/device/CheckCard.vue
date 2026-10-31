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
    background: var(--ui-surface);
    border: 1px solid var(--ui-border-accented);
    border-left-width: 4px;
    border-radius: var(--ui-radius-lg);
  }

  .check.pass {
    border-left-color: var(--ui-primary);
  }

  .check.fail {
    border-left-color: var(--ui-danger);
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
    color: var(--ui-text-muted);
    font-family: var(--font-mono);
    font-size: 12px;
  }

  .steps {
    margin: 8px 0 12px;
    padding-left: 20px;
    color: var(--ui-text);
  }

  .expected {
    margin: 12px 0 0;
    padding: 8px 10px;
    background: var(--ui-primary-soft);
    border-radius: var(--ui-radius);
    color: color-mix(in srgb, var(--ui-primary) 55%, var(--ui-text-highlighted));
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
    border: 1px solid var(--ui-border-accented);
    border-radius: var(--ui-radius);
    background: var(--ui-bg-muted);
    color: var(--ui-text);
    font: inherit;
    font-weight: 600;
  }

  .verdict .pass[aria-pressed='true'] {
    border-color: var(--ui-primary);
    background: var(--ui-primary);
    color: var(--ui-on-primary);
  }

  .verdict .fail[aria-pressed='true'] {
    border-color: var(--ui-danger);
    background: var(--ui-danger);
    color: var(--ui-on-solid);
  }

  .verdict input {
    flex: 1 1 160px;
    min-width: 0;
    min-height: 40px;
    padding: 0 10px;
    border: 1px solid var(--ui-border-accented);
    border-radius: var(--ui-radius);
    background: var(--ui-bg);
    color: var(--ui-text);
    /* 16px: iOS zooms into smaller text fields on focus. */
    font: 16px var(--font-sans);
  }
</style>
