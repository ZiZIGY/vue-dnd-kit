<script setup lang="ts">
  import { computed, inject, useTemplateRef } from 'vue';
  import { makeSortableItem } from '@vue-dnd-kit/core';
  import FieldList from './FieldList.vue';
  import FieldIcon from './FieldIcon.vue';
  import { FORM_BUILDER, KIND_LABELS, fieldType, type FieldContainer, type FormField } from './form';

  const props = defineProps<{ field: FormField }>();
  const builder = inject(FORM_BUILDER)!;
  const el = useTemplateRef<HTMLElement>('el');
  const { indicator, isDragging } = makeSortableItem(el, {
    id: () => props.field.id,
    type: () => fieldType(props.field.kind),
  });

  const section = computed(() => (props.field.kind === 'section' ? (props.field as FieldContainer) : null));
</script>

<template>
  <li
    ref="el"
    class="fb-field"
    :class="[field.kind, { dragging: isDragging }]"
    :data-id="field.id"
    :data-indicator="indicator?.side"
  >
    <header class="fb-field-head">
      <span
        class="fb-grip"
        aria-hidden="true"
        >⋮⋮</span
      >
      <FieldIcon
        :kind="field.kind"
        :title="KIND_LABELS[field.kind]"
      />
      <!-- Inputs and buttons never start a drag: the label is edited in place. -->
      <input
        v-model="field.label"
        class="fb-label"
        :aria-label="`${KIND_LABELS[field.kind]} label`"
        :data-testid="`label-${field.id}`"
      />
      <span class="fb-kind">{{ KIND_LABELS[field.kind] }}</span>
      <label
        v-if="!section"
        class="fb-required"
      >
        <input
          v-model="field.required"
          type="checkbox"
          :data-testid="`required-${field.id}`"
        />
        Required
      </label>
      <button
        type="button"
        class="fb-remove"
        :aria-label="`Remove ${field.label}`"
        :data-testid="`remove-${field.id}`"
        @click="builder.remove(field.id)"
      >
        ×
      </button>
    </header>
    <FieldList
      v-if="section"
      :list-id="`section-${field.id}`"
      :owner="section"
      nested
    />
  </li>
</template>

<style scoped>
  .fb-field {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 6px 10px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    cursor: grab;
  }

  .fb-field:focus-visible {
    outline: 2px solid #2563eb;
    outline-offset: 2px;
  }

  .fb-field.section {
    padding-bottom: 10px;
    background: #fffbeb;
    border-color: #fcd34d;
  }

  /* Indicator mode: the dragged field stays dimmed in place, a line marks the drop. */
  .fb-field.dragging {
    opacity: 0.45;
  }

  .fb-field[data-indicator]::after {
    content: '';
    position: absolute;
    left: -4px;
    right: -4px;
    height: 3px;
    border-radius: 2px;
    background: #2563eb;
    box-shadow: 0 0 0 2px rgb(37 99 235 / 0.2);
    pointer-events: none;
  }

  .fb-field[data-indicator='before']::after {
    top: -6px;
  }

  .fb-field[data-indicator='after']::after {
    bottom: -6px;
  }

  .fb-field-head {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 28px;
  }

  .fb-grip {
    color: #94a3b8;
    font-size: 12px;
    letter-spacing: -2px;
  }

  .fb-kind {
    color: #94a3b8;
    font-size: 11px;
    white-space: nowrap;
  }

  .fb-label {
    flex: 1;
    min-width: 0;
    padding: 2px 6px;
    border: 1px solid transparent;
    border-radius: 4px;
    background: none;
    font: inherit;
    font-weight: 600;
  }

  .fb-label:hover,
  .fb-label:focus {
    border-color: #cbd5e1;
    background: #fff;
  }

  .fb-required {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #64748b;
    font-size: 12px;
    cursor: pointer;
  }

  .fb-remove {
    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: none;
    color: #94a3b8;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
  }

  .fb-remove:hover {
    background: #fee2e2;
    color: #dc2626;
  }
</style>
