import * as z from 'zod';
import type { Field } from './form';

/**
 * The preview's validation: a Zod schema made from the fields, which `UForm` takes as it is.
 * `export.ts` writes the same rules as code.
 */
function ruleOf(field: Field): z.ZodType | null {
  const { required, min, max } = field;
  switch (field.kind) {
    case 'text':
    case 'textarea':
      return required ? z.string().min(1, 'Required') : z.string();
    case 'email': {
      const email = z.email('Enter a valid email');
      return required ? email : email.or(z.literal(''));
    }
    case 'number': {
      let number = z.number({ error: 'Required' });
      if (min != null) number = number.min(min, `At least ${min}`);
      if (max != null) number = number.max(max, `At most ${max}`);
      return required ? number : number.nullish();
    }
    case 'select':
      return required ? z.string({ error: 'Pick an option' }) : z.string().optional();
    case 'choice':
      if (field.multiple) return required ? z.array(z.string()).min(1, 'Pick at least one') : z.array(z.string());
      return required ? z.string({ error: 'Pick an option' }) : z.string().optional();
    case 'checkbox':
      return required ? z.literal(true, { error: 'Required' }) : z.boolean();
    case 'switch':
      return z.boolean();
    case 'rating':
      return required ? z.number().min(1, 'Pick a rating') : z.number();
    case 'date':
      return required ? z.custom((value) => value != null, 'Pick a date') : z.unknown();
    case 'file':
      return required ? z.instanceof(File, { error: 'Attach a file' }) : z.instanceof(File).nullish();
    case 'heading':
      return null;
  }
}

export function schemaOf(fields: Field[], names: Map<string, string>) {
  const shape: Record<string, z.ZodType> = {};
  for (const field of fields) {
    const rule = ruleOf(field);
    if (rule) shape[names.get(field.id)!] = rule;
  }
  return z.object(shape);
}

/** What each control starts with: empty text, no choice, unticked. */
export function initialValue(field: Field): unknown {
  switch (field.kind) {
    case 'text':
    case 'textarea':
    case 'email':
      return '';
    case 'choice':
      return field.multiple ? [] : undefined;
    case 'checkbox':
    case 'switch':
      return false;
    case 'rating':
      return 0;
    default:
      return undefined;
  }
}

/** Submitted values as JSON: a file by its name, a date as `2026-06-12`. */
export const printable = (data: unknown) =>
  JSON.stringify(
    data,
    (_key, value: unknown) => {
      if (value instanceof File) return value.name;
      if (value && typeof value === 'object' && 'calendar' in value) return String(value);
      return value;
    },
    2,
  );
