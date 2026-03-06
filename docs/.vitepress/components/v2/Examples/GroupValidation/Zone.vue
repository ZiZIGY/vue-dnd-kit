<script setup lang="ts">
  import { computed, ref, useTemplateRef } from 'vue';
  import { makeDroppable, useDnDProvider } from '@vue-dnd-kit/core';
  import type {
    IDragEvent,
    IDragItem,
    IDropValidateEvent,
    TModifierMethod,
  } from '@vue-dnd-kit/core';

  const props = defineProps<{
    label: string;
    groups?: string[];
    groupMatch?: TModifierMethod;
    /** Show async onValidate dialog when invalid items are present */
    withValidate?: boolean;
  }>();

  const emit = defineEmits<{ (e: 'drop', event: IDragEvent): void }>();

  interface ValidateState {
    validItems: IDragItem[];
    invalidItems: IDragItem[];
    resolve: (result: void | false | IDragItem[]) => void;
  }

  const validateState = ref<ValidateState | null>(null);

  const zoneRef = useTemplateRef<HTMLElement>('zoneRef');

  const { isAllowed, isDragOver } = makeDroppable(zoneRef, {
    groups: props.groups ?? [],
    groupMatch: props.groupMatch ?? 'every',
    events: {
      onDrop: (event) => emit('drop', event),
      onValidate: props.withValidate
        ? (event: IDropValidateEvent) =>
            new Promise<void | false | IDragItem[]>((resolve) => {
              validateState.value = {
                validItems: event.validItems,
                invalidItems: event.invalidItems,
                resolve,
              };
            })
        : undefined,
    },
  });

  function dropValid() {
    validateState.value?.resolve(undefined);
    validateState.value = null;
  }

  function dropAll() {
    const s = validateState.value;
    if (s) {
      s.resolve([...s.validItems, ...s.invalidItems]);
      validateState.value = null;
    }
  }

  function cancelDrop() {
    validateState.value?.resolve(false);
    validateState.value = null;
  }

  const provider = useDnDProvider();
  const status = computed(() => {
    if (!provider.state.value) return 'idle';
    return isAllowed.value ? 'allowed' : 'blocked';
  });
</script>

<template>
  <div
    ref="zoneRef"
    class="zone"
    :class="[`zone--${status}`, { 'zone--over': isDragOver }]"
  >
    <div class="zone-header">
      <span class="zone-label">{{ label }}</span>
      <span
        v-if="props.groups?.length"
        class="zone-tag"
        >group: {{ props.groups.join(', ') }}</span
      >
      <span
        v-else
        class="zone-tag zone-tag--any"
        >accepts all</span
      >
      <span
        v-if="props.groupMatch"
        class="zone-tag zone-tag--match"
        >{{ props.groupMatch }}</span
      >
    </div>

    <div class="zone-status-badge">
      <template v-if="status === 'allowed'">✓ allowed</template>
      <template v-else-if="status === 'blocked'">✗ blocked</template>
    </div>

    <slot />

    <!-- Async validate dialog -->
    <Transition name="dialog">
      <div
        v-if="validateState"
        class="validate-dialog"
      >
        <p class="dialog-title">Group mismatch</p>
        <p class="dialog-body">
          <span class="valid-count"
            >{{ validateState.validItems.length }} compatible</span
          >
          ·
          <span class="invalid-count"
            >{{ validateState.invalidItems.length }} incompatible</span
          >
        </p>
        <div class="dialog-actions">
          <button
            class="btn btn--primary"
            @click="dropValid"
            >Drop compatible only</button
          >
          <button
            class="btn btn--secondary"
            @click="dropAll"
            >Drop all</button
          >
          <button
            class="btn btn--cancel"
            @click="cancelDrop"
            >Cancel</button
          >
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
  .zone {
    position: relative;
    flex: 1;
    min-height: 110px;
    padding: 0.875rem;
    border: 2px dashed rgba(148, 163, 184, 0.25);
    border-radius: 10px;
    background-color: rgba(148, 163, 184, 0.04);
    transition: background-color 0.15s, border-color 0.15s;
    overflow: hidden;
  }

  .zone--allowed {
    border-color: rgba(62, 175, 124, 0.6);
    background-color: rgba(62, 175, 124, 0.07);
  }

  .zone--blocked {
    border-color: rgba(239, 68, 68, 0.4);
    background-color: rgba(239, 68, 68, 0.04);
  }

  .zone--over {
    border-style: solid;
    background-color: rgba(62, 175, 124, 0.12);
  }

  .zone-header {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin-bottom: 0.5rem;
    flex-wrap: wrap;
  }

  .zone-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }

  .zone-tag {
    font-size: 0.62rem;
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
    background-color: rgba(168, 85, 247, 0.15);
    color: rgb(196, 154, 250);
    border: 1px solid rgba(168, 85, 247, 0.3);
    letter-spacing: 0.03em;
  }

  .zone-tag--any {
    background-color: rgba(62, 175, 124, 0.1);
    color: rgba(62, 175, 124, 0.9);
    border-color: rgba(62, 175, 124, 0.3);
  }

  .zone-tag--match {
    background-color: rgba(59, 130, 246, 0.1);
    color: rgb(147, 197, 253);
    border-color: rgba(59, 130, 246, 0.3);
  }

  .zone-status-badge {
    min-height: 1.2rem;
    font-size: 0.7rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: var(--vp-c-text-3);
  }

  .zone--allowed .zone-status-badge {
    color: rgba(62, 175, 124, 0.9);
  }
  .zone--blocked .zone-status-badge {
    color: rgba(239, 68, 68, 0.7);
  }

  /* ── Validate dialog ───────────────────────────────────────── */
  .validate-dialog {
    position: fixed;
    inset: 0;
    background: rgba(15, 18, 28, 0.92);
    backdrop-filter: blur(4px);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
  }

  .dialog-title {
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--vp-c-text-1);
  }

  .dialog-body {
    font-size: 0.72rem;
    color: var(--vp-c-text-2);
  }

  .valid-count {
    color: rgba(62, 175, 124, 0.9);
    font-weight: 600;
  }
  .invalid-count {
    color: rgba(239, 68, 68, 0.8);
    font-weight: 600;
  }

  .dialog-actions {
    display: flex;
    gap: 0.4rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn {
    font-size: 0.68rem;
    padding: 0.25rem 0.65rem;
    border-radius: 5px;
    border: 1px solid transparent;
    cursor: pointer;
    font-weight: 500;
    transition: background 0.12s;
  }

  .btn--primary {
    background: rgba(62, 175, 124, 0.2);
    border-color: rgba(62, 175, 124, 0.5);
    color: rgba(62, 175, 124, 0.95);
  }
  .btn--primary:hover {
    background: rgba(62, 175, 124, 0.3);
  }

  .btn--secondary {
    background: rgba(59, 130, 246, 0.15);
    border-color: rgba(59, 130, 246, 0.4);
    color: rgb(147, 197, 253);
  }
  .btn--secondary:hover {
    background: rgba(59, 130, 246, 0.25);
  }

  .btn--cancel {
    background: rgba(148, 163, 184, 0.08);
    border-color: rgba(148, 163, 184, 0.25);
    color: var(--vp-c-text-2);
  }
  .btn--cancel:hover {
    background: rgba(148, 163, 184, 0.15);
  }

  .dialog-enter-active,
  .dialog-leave-active {
    transition: opacity 0.15s, transform 0.15s;
  }
  .dialog-enter-from,
  .dialog-leave-to {
    opacity: 0;
    transform: scale(0.96);
  }
</style>
