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
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
  }

  .fb-tip {
    margin: 0 0 10px;
    color: #64748b;
    font-size: 12px;
  }

  kbd {
    padding: 0 4px;
    border: 1px solid #cbd5e1;
    border-radius: 4px;
    background: #f8fafc;
    font: inherit;
  }

  .fb-canvas {
    padding: 16px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    box-shadow: 0 1px 3px rgb(15 23 42 / 0.06);
  }

  .fb-title {
    width: 100%;
    padding: 4px 6px;
    border: 1px solid transparent;
    border-radius: 6px;
    font: inherit;
    font-size: 20px;
    font-weight: 700;
  }

  .fb-title:hover,
  .fb-title:focus {
    border-color: #cbd5e1;
  }

  .fb-meta {
    margin: 0 6px 12px;
    color: #94a3b8;
    font-size: 12px;
  }

  .fb-json {
    min-width: 0;
    padding: 12px;
    background: #0f172a;
    border-radius: 12px;
  }

  .fb-json h3 {
    color: #e2e8f0;
  }

  .fb-json pre {
    max-height: 560px;
    margin: 0;
    overflow: auto;
    color: #a5f3fc;
    font-size: 11px;
  }
</style>
