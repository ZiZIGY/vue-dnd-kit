import type { InjectionKey } from 'vue';

export type FieldKind = 'text' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'date' | 'section';

export interface FormField {
  id: string;
  kind: FieldKind;
  label: string;
  required: boolean;
  /** `select` only. */
  options?: string[];
  /** `section` only: the fields grouped in it. */
  fields?: FormField[];
}

/** Root of the form; sections hold their fields the same way. */
export interface FieldContainer {
  fields: FormField[];
}

export const KIND_LABELS: Record<FieldKind, string> = {
  text: 'Short text',
  email: 'Email',
  number: 'Number',
  textarea: 'Paragraph',
  select: 'Dropdown',
  checkbox: 'Checkbox',
  date: 'Date',
  section: 'Section',
};

/** Palette entries are field templates: same shape as fields, so the palette can clone into the form. */
export const createPalette = (): FormField[] =>
  (Object.keys(KIND_LABELS) as FieldKind[]).map((kind) => ({
    id: `tpl-${kind}`,
    kind,
    label: KIND_LABELS[kind],
    required: false,
  }));

const field = (id: string, kind: FieldKind, label: string, required = false, fields?: FormField[]): FormField => ({
  id,
  kind,
  label,
  required,
  ...(fields ? { fields } : {}),
});

export const createForm = (): FieldContainer => ({
  fields: [
    field('name', 'text', 'Full name', true),
    field('email', 'email', 'Email', true),
    field('address', 'section', 'Address', false, [field('street', 'text', 'Street'), field('city', 'text', 'City')]),
    field('message', 'textarea', 'Message'),
  ],
});

/** Item type for accept rules: sections can't go into sections. */
export const fieldType = (kind: FieldKind): string => (kind === 'section' ? 'section' : 'field');

/** `name,email,address(street,city),message` for assertions. */
export const outline = (fields: readonly FormField[]): string =>
  fields.map((item) => (item.kind === 'section' ? `${item.id}(${outline(item.fields ?? [])})` : item.id)).join(',');

/** The schema an app would store or send: what the live preview shows. */
export const toSchema = (fields: readonly FormField[]): unknown[] =>
  fields.map((item) =>
    item.kind === 'section'
      ? { type: 'section', id: item.id, title: item.label, fields: toSchema(item.fields ?? []) }
      : {
          type: item.kind,
          id: item.id,
          label: item.label,
          required: item.required,
          ...(item.options ? { options: item.options } : {}),
        },
  );

export interface FormBuilderContext {
  /** A new field from a palette template (`pull: 'clone'`). */
  fromTemplate(template: FormField): FormField;
  /** A copy of a field with fresh ids (Alt+drag). */
  duplicate(source: FormField): FormField;
  remove(id: string): void;
}

export const FORM_BUILDER: InjectionKey<FormBuilderContext> = Symbol('form-builder');
