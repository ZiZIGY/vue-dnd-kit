<script setup lang="ts">
  import { computed, provide, reactive, shallowRef } from 'vue';
  import FieldPalette from './FieldPalette.vue';
  import FieldList from './FieldList.vue';
  import {
    FORM_BUILDER,
    KIND_LABELS,
    createForm,
    outline,
    toSchema,
    type FieldContainer,
    type FormField,
  } from './form';

  const form = reactive(createForm());
  const title = shallowRef('Contact us');

  let created = 0;
  const nextId = () => `f${++created}`;

  const fromTemplate = (template: FormField): FormField => ({
    id: nextId(),
    kind: template.kind,
    label: KIND_LABELS[template.kind],
    required: false,
    ...(template.kind === 'select' ? { options: ['Option 1', 'Option 2'] } : {}),
    ...(template.kind === 'section' ? { fields: [] } : {}),
  });

  const copy = (source: FormField): FormField => ({
    ...source,
    id: nextId(),
    ...(source.options ? { options: [...source.options] } : {}),
    ...(source.fields ? { fields: source.fields.map(copy) } : {}),
  });
  const duplicate = (source: FormField): FormField => ({ ...copy(source), label: `${source.label} (copy)` });

  const removeFrom = (container: FieldContainer, id: string): boolean => {
    const index = container.fields.findIndex((item) => item.id === id);
    if (index !== -1) {
      container.fields.splice(index, 1);
      return true;
    }
    return container.fields.some((item) => !!item.fields && removeFrom(item as FieldContainer, id));
  };

  provide(FORM_BUILDER, { fromTemplate, duplicate, remove: (id) => removeFrom(form, id) });

  const json = computed(() => JSON.stringify({ title: title.value, fields: toSchema(form.fields) }, null, 2));
  const count = computed(() => {
    const walk = (fields: readonly FormField[]): number =>
      fields.reduce((sum, item) => sum + (item.kind === 'section' ? walk(item.fields ?? []) : 1), 0);
    return walk(form.fields);
  });
</script>

<template>
  <div class="fb">
    <aside class="fb-side">
      <h3>Fields</h3>
      <p class="fb-tip">Drag into the form. Hold <kbd>Alt</kbd> while moving a field to duplicate it.</p>
      <FieldPalette />
    </aside>
    <div class="fb-canvas">
      <input
        v-model="title"
        class="fb-title"
        aria-label="Form title"
        data-testid="form-title"
      />
      <p class="fb-meta">{{ count }} inputs</p>
      <FieldList
        list-id="canvas"
        :owner="form"
      />
    </div>
    <div class="fb-json">
      <h3>Schema</h3>
      <pre data-testid="form-json">{{ json }}</pre>
    </div>
  </div>
  <pre data-testid="form-outline">{{ outline(form.fields) }}</pre>
</template>

<style scoped>
  .fb {
    display: grid;
    grid-template-columns: 200px 440px 1fr;
    gap: 16px;
    align-items: start;
    max-width: 1140px;
  }

  h3 {
    margin: 0 0 8px;
    font-size: 14px;
  }

  .fb-side {
    padding: 12px;
    background: var(--ui-bg-muted);
    border: 1px solid var(--ui-border);
    border-radius: var(--ui-radius-lg);
  }

  .fb-tip {
    margin: 0 0 10px;
    color: var(--ui-text-muted);
    font-size: 12px;
  }

  kbd {
    padding: 0 4px;
    border: 1px solid var(--ui-border-accented);
    border-radius: var(--ui-radius-sm);
    background: var(--ui-bg);
    color: var(--ui-text);
    font: inherit;
  }

  .fb-canvas {
    padding: 16px;
    background: var(--ui-bg-muted);
    border: 1px solid var(--ui-border);
    border-radius: var(--ui-radius-lg);
  }

  .fb-title {
    width: 100%;
    padding: 4px 6px;
    border: 1px solid transparent;
    border-radius: var(--ui-radius-sm);
    background: none;
    color: var(--ui-text-highlighted);
    font: inherit;
    font-size: 20px;
    font-weight: 700;
    letter-spacing: -0.02em;
  }

  .fb-title:hover,
  .fb-title:focus {
    border-color: var(--ui-border-accented);
  }

  .fb-title:focus {
    border-color: var(--ui-primary);
    outline: none;
  }

  .fb-meta {
    margin: 0 6px 12px;
    color: var(--ui-text-dimmed);
    font-family: var(--font-mono);
    font-size: 12px;
  }

  /* The schema: a code panel, as in the docs. */
  .fb-json {
    min-width: 0;
    padding: 12px;
    background: var(--ui-bg-muted);
    border-radius: var(--ui-radius-lg);
    box-shadow: inset 0 0 0 1px var(--ui-border);
  }

  .fb-json pre {
    max-height: 560px;
    margin: 0;
    overflow: auto;
    color: var(--ui-text);
    font-size: 11px;
  }
</style>
