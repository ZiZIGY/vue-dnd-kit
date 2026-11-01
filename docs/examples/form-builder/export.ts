import { KINDS, type Field, type FormState } from './form';
import { initialValue } from './schema';

/** The form as data: rows of fields, each with the settings its kind has. */
export function toJson(form: FormState, names: Map<string, string>): string {
  const fieldJson = (field: Field) => {
    const has = (setting: string) => (KINDS[field.kind].settings as string[]).includes(setting);
    return {
      type: field.kind,
      name: names.get(field.id),
      label: field.label,
      description: field.description || undefined,
      placeholder: has('placeholder') && field.placeholder ? field.placeholder : undefined,
      required: has('required') ? field.required : undefined,
      options: has('options') ? field.options.map((option) => option.label) : undefined,
      multiple: has('multiple') ? field.multiple : undefined,
      min: has('range') ? (field.min ?? undefined) : undefined,
      max: has('range') || has('stars') ? (field.max ?? undefined) : undefined,
    };
  };
  const data = { title: form.title, description: form.description, rows: form.rows.map((row) => row.fields.map(fieldJson)) };
  return JSON.stringify(data, null, 2);
}

// ─── Vue code: the same form, written with Nuxt UI components and a Zod schema ──────

/** A string literal, an HTML text, an attribute: what the user typed, escaped for each. */
const text = (value: string) => `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
const html = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const attr = (name: string, value: string | null | undefined) => (value ? ` ${name}="${html(value)}"` : '');
const items = (field: Field) => `:items="[${field.options.map((option) => text(option.label)).join(', ')}]"`;

/** The rule of `schema.ts`'s `ruleOf`, as code. */
function ruleCode(field: Field): string | null {
  const { required, min, max } = field;
  switch (field.kind) {
    case 'text':
    case 'textarea':
      return required ? `z.string().min(1, 'Required')` : 'z.string()';
    case 'email':
      return required ? `z.email('Enter a valid email')` : `z.email('Enter a valid email').or(z.literal(''))`;
    case 'number': {
      let rule = `z.number({ error: 'Required' })`;
      if (min != null) rule += `.min(${min}, 'At least ${min}')`;
      if (max != null) rule += `.max(${max}, 'At most ${max}')`;
      return required ? rule : `${rule}.nullish()`;
    }
    case 'select':
      return required ? `z.string({ error: 'Pick an option' })` : 'z.string().optional()';
    case 'choice':
      if (field.multiple) return required ? `z.array(z.string()).min(1, 'Pick at least one')` : 'z.array(z.string())';
      return required ? `z.string({ error: 'Pick an option' })` : 'z.string().optional()';
    case 'checkbox':
      return required ? `z.literal(true, { error: 'Required' })` : 'z.boolean()';
    case 'switch':
      return 'z.boolean()';
    case 'rating':
      return required ? `z.number().min(1, 'Pick a rating')` : 'z.number()';
    case 'date':
      return required ? `z.custom((value) => value != null, 'Pick a date')` : 'z.unknown()';
    case 'file':
      return required ? `z.instanceof(File, { error: 'Attach a file' })` : 'z.instanceof(File).nullish()';
    case 'heading':
      return null;
  }
}

/** The control of `FieldView.vue`, as code. */
function controlCode(field: Field, name: string): string {
  const model = `v-model="state.${name}"`;
  const placeholder = attr('placeholder', field.placeholder);
  switch (field.kind) {
    case 'text':
      return `<UInput ${model}${placeholder} class="w-full" />`;
    case 'textarea':
      return `<UTextarea ${model}${placeholder} :rows="3" autoresize class="w-full" />`;
    case 'email':
      return `<UInput ${model} type="email" icon="i-lucide-at-sign"${placeholder} class="w-full" />`;
    case 'number': {
      const bounds = `${field.min != null ? ` :min="${field.min}"` : ''}${field.max != null ? ` :max="${field.max}"` : ''}`;
      return `<UInputNumber ${model}${bounds}${placeholder} class="w-full" />`;
    }
    case 'date':
      return `<UInputDate ${model} class="w-full" />`;
    case 'select':
      return `<USelect ${model} ${items(field)}${placeholder} class="w-full" />`;
    case 'choice':
      return `<${field.multiple ? 'UCheckboxGroup' : 'URadioGroup'} ${model} ${items(field)} />`;
    case 'checkbox':
    case 'switch': {
      const tag = field.kind === 'checkbox' ? 'UCheckbox' : 'USwitch';
      return `<${tag} ${model}${attr('label', field.label)}${attr('description', field.description)}${field.required ? ' required' : ''} />`;
    }
    case 'rating':
      return `<UInputRating ${model} :length="${field.max ?? 5}" />`;
    case 'file':
      return `<UFileUpload ${model} icon="i-lucide-upload"${attr('label', field.placeholder)} class="min-h-28 w-full" />`;
    case 'heading':
      return '';
  }
}

function fieldCode(field: Field, name: string | undefined, indent: string): string {
  if (field.kind === 'heading') {
    return [
      `${indent}<div>`,
      `${indent}  <h3 class="text-base font-semibold text-highlighted">${html(field.label)}</h3>`,
      ...(field.description ? [`${indent}  <p class="text-sm text-muted">${html(field.description)}</p>`] : []),
      `${indent}</div>`,
    ].join('\n');
  }
  // A checkbox and a switch carry their label themselves.
  const labelled = field.kind !== 'checkbox' && field.kind !== 'switch';
  const head = labelled
    ? `${attr('label', field.label)}${attr('description', field.description)}${attr('name', name)}${field.required ? ' required' : ''}`
    : attr('name', name);
  return [`${indent}<UFormField${head}>`, `${indent}  ${controlCode(field, name!)}`, `${indent}</UFormField>`].join('\n');
}

export function toVue(form: FormState, names: Map<string, string>): string {
  const fields = form.rows.flatMap((row) => row.fields);
  const rules = fields.flatMap((field) => {
    const rule = ruleCode(field);
    return rule ? [`  ${names.get(field.id)}: ${rule},`] : [];
  });
  const values = fields.flatMap((field) => {
    const value = initialValue(field);
    const code = typeof value === 'string' ? text(value) : JSON.stringify(value);
    return field.kind === 'heading' || value === undefined ? [] : [`  ${names.get(field.id)}: ${code},`];
  });

  // A row of several fields is a grid: one column on phones, side by side from `sm` up.
  const rows = form.rows.map((row) => {
    if (row.fields.length === 1) return fieldCode(row.fields[0]!, names.get(row.fields[0]!.id), '    ');
    const columns = `sm:grid-cols-${row.fields.length}`;
    const inner = row.fields.map((field) => fieldCode(field, names.get(field.id), '      '));
    return [`    <div class="grid gap-4 ${columns}">`, ...inner, '    </div>'].join('\n');
  });

  return `<script setup lang="ts">
import { reactive } from 'vue';
import * as z from 'zod';
import type { FormSubmitEvent } from '@nuxt/ui';

const schema = z.object({
${rules.join('\n')}
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
${values.join('\n')}
});

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
}
</script>

<template>
  <UForm :schema="schema" :state="state" novalidate class="flex flex-col gap-5" @submit="onSubmit">
    <div>
      <h2 class="text-xl font-semibold text-highlighted">${html(form.title)}</h2>
      <p class="text-sm text-muted">${html(form.description)}</p>
    </div>
${rows.join('\n')}
    <UButton type="submit" label="Submit" />
  </UForm>
</template>
`;
}
