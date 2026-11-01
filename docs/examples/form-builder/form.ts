import { computed, inject, reactive, ref, type InjectionKey } from 'vue';
import type { AnnouncedPosition, Key, SortableDropEvent } from '@vue-dnd-kit/core';

export type FieldKind =
  | 'text'
  | 'textarea'
  | 'email'
  | 'number'
  | 'date'
  | 'select'
  | 'choice'
  | 'checkbox'
  | 'switch'
  | 'rating'
  | 'file'
  | 'heading';

export interface Option {
  id: string;
  label: string;
}

export interface Field {
  id: string;
  kind: FieldKind;
  label: string;
  placeholder: string;
  description: string;
  required: boolean;
  /** Dropdowns and multiple choice. */
  options: Option[];
  /** Multiple choice: checkboxes instead of radio buttons. */
  multiple: boolean;
  /** Numbers: the bounds. Ratings: `max` is the number of stars. */
  min: number | null;
  max: number | null;
}

/** Fields side by side: one to three columns. */
export interface Row {
  id: string;
  fields: Field[];
}

export interface FormState {
  title: string;
  description: string;
  rows: Row[];
}

/** What the inspector lets you change, per kind. */
export type Setting = 'placeholder' | 'required' | 'options' | 'multiple' | 'range' | 'stars';

interface Kind {
  name: string;
  icon: string;
  settings: Setting[];
  defaults: Partial<Field>;
}

const TEXT: Setting[] = ['placeholder', 'required'];

export const KINDS: Record<FieldKind, Kind> = {
  text: {
    name: 'Short text',
    icon: 'i-lucide-text-cursor-input',
    settings: TEXT,
    defaults: { label: 'Short answer', placeholder: 'Type here…' },
  },
  textarea: {
    name: 'Long text',
    icon: 'i-lucide-align-left',
    settings: TEXT,
    defaults: { label: 'Long answer', placeholder: 'Type here…' },
  },
  email: {
    name: 'Email',
    icon: 'i-lucide-at-sign',
    settings: TEXT,
    defaults: { label: 'Email', placeholder: 'name@example.com' },
  },
  number: {
    name: 'Number',
    icon: 'i-lucide-hash',
    settings: [...TEXT, 'range'],
    defaults: { label: 'Number', placeholder: '0' },
  },
  date: { name: 'Date', icon: 'i-lucide-calendar', settings: ['required'], defaults: { label: 'Date' } },
  select: {
    name: 'Dropdown',
    icon: 'i-lucide-square-chevron-down',
    settings: [...TEXT, 'options'],
    defaults: { label: 'Dropdown', placeholder: 'Select an option' },
  },
  choice: {
    name: 'Multiple choice',
    icon: 'i-lucide-list-checks',
    settings: ['required', 'options', 'multiple'],
    defaults: { label: 'Multiple choice' },
  },
  checkbox: {
    name: 'Checkbox',
    icon: 'i-lucide-square-check',
    settings: ['required'],
    defaults: { label: 'I agree to the terms' },
  },
  switch: { name: 'Switch', icon: 'i-lucide-toggle-right', settings: [], defaults: { label: 'Send me updates' } },
  rating: { name: 'Rating', icon: 'i-lucide-star', settings: ['required', 'stars'], defaults: { label: 'Rating', max: 5 } },
  file: {
    name: 'File upload',
    icon: 'i-lucide-paperclip',
    settings: TEXT,
    defaults: { label: 'Attachment', placeholder: 'Drop a file or click to browse' },
  },
  heading: {
    name: 'Heading',
    icon: 'i-lucide-heading',
    settings: [],
    defaults: { label: 'Section title', description: 'A few words about this section.' },
  },
};

/** The palette's sections. */
export const SECTIONS: { title: string; kinds: FieldKind[] }[] = [
  { title: 'Inputs', kinds: ['text', 'textarea', 'email', 'number', 'date'] },
  { title: 'Choices', kinds: ['select', 'choice', 'checkbox', 'switch', 'rating'] },
  { title: 'More', kinds: ['file', 'heading'] },
];

/** A row holds three fields at most. */
export const MAX_COLUMNS = 3;

// Keys must be unique across every list of a group: fields, rows and options get their own.
let seq = 0;
const uid = (prefix: string) => `${prefix}${++seq}`;

export const createOption = (label: string): Option => ({ id: uid('o'), label });
const options = (...labels: string[]) => labels.map(createOption);

export function createField(kind: FieldKind, patch: Partial<Field> = {}): Field {
  const withOptions = KINDS[kind].settings.includes('options');
  return {
    id: uid('f'),
    label: '',
    placeholder: '',
    description: '',
    required: false,
    options: withOptions ? options('Option 1', 'Option 2', 'Option 3') : [],
    multiple: false,
    min: null,
    max: null,
    ...KINDS[kind].defaults,
    ...patch,
    kind,
  };
}

/** The palette's field of a kind: a field like the others, with a key of the palette's. */
export const template = (kind: FieldKind) => createField(kind, { id: `new:${kind}` });

/** A copy with keys of its own: Alt-drags and Duplicate. */
export const cloneField = (field: Field): Field => ({
  ...field,
  id: uid('f'),
  options: field.options.map((option) => ({ ...option, id: uid('o') })),
});

const row = (...fields: Field[]): Row => ({ id: uid('r'), fields });

const sample = (): FormState => ({
  title: 'Event registration',
  description: 'Vue Meetup · Amsterdam · June 12. Tell us who is coming.',
  rows: [
    row(createField('text', { label: 'First name', placeholder: 'Ada', required: true }), createField('text', { label: 'Last name', placeholder: 'Lovelace', required: true })),
    row(createField('email', { label: 'Work email', required: true, description: 'Your ticket is sent here.' })),
    row(
      createField('select', { label: 'Ticket', placeholder: 'Choose a ticket', required: true, options: options('Standard', 'Student', 'Speaker') }),
      createField('number', { label: 'Guests', placeholder: '0', min: 0, max: 3 }),
    ),
    row(createField('choice', { label: 'Sessions', multiple: true, options: options('Keynote', 'Workshops', 'Lightning talks') })),
    row(createField('rating', { label: 'How was last year?' })),
    row(createField('checkbox', { label: 'I accept the code of conduct', required: true })),
  ],
});

// ─── List ids ──────────────────────────────────────────────────────────────────
// Drop events name the lists they change by these ids, and `apply` reads them back.

/** The rows of the form. */
export const ROWS = 'rows';
/** The fields of one row. */
export const rowList = (rowId: string) => `row:${rowId}`;
/** An empty list that makes a new row: above a row, or after the last one (`null`). */
export const newRowList = (beforeRowId: string | null) => `new:${beforeRowId ?? 'end'}`;
/** The trash, a plain drop target. */
export const TRASH = 'trash';

/** `First name` → `firstName`: the key of a field's answer. */
const camelCase = (text: string) =>
  text
    .replace(/[^a-z0-9]+/gi, ' ')
    .trim()
    .split(' ')
    .map((word, index) => (index ? word[0]!.toUpperCase() + word.slice(1).toLowerCase() : word.toLowerCase()))
    .join('')
    .replace(/^\d/, '_$&');

const HISTORY = 100;

/**
 * The form, and the only place that changes it. The lists read it through getters and never
 * write it themselves: each drop calls `drop`, which applies the drop's `result`, so every
 * change goes through `commit`, and Undo can take it back.
 */
export function createForm() {
  const state = reactive<FormState>(sample());
  const selectedId = ref<string | null>(null);

  const fields = computed(() => state.rows.flatMap((row) => row.fields));
  const selected = computed(() => fields.value.find((field) => field.id === selectedId.value) ?? null);
  /** A selected field that is gone (trashed, undone) is no longer selected. */
  const forgetGone = () => {
    if (!selected.value) selectedId.value = null;
  };

  /** The key of every field's answer, unique: `email`, `email2`… Headings have none. */
  const names = computed(() => {
    const result = new Map<string, string>();
    const taken = new Set<string>();
    for (const field of fields.value) {
      if (field.kind === 'heading') continue;
      const base = camelCase(field.label) || field.kind;
      let name = base;
      for (let n = 2; taken.has(name); n++) name = `${base}${n}`;
      taken.add(name);
      result.set(field.id, name);
    }
    return result;
  });

  // ── History: snapshots of the whole form, as JSON. Edits of one property in a row
  // (typing a label) share a key and make a single step.
  const past = ref<string[]>([]);
  const future = ref<string[]>([]);
  let lastKey: string | null = null;
  const snapshot = () => JSON.stringify(state);
  const restore = (json: string) => Object.assign(state, JSON.parse(json) as FormState);

  function commit(change: () => void, key: string | null = null) {
    if (!key || key !== lastKey) {
      past.value = [...past.value.slice(1 - HISTORY), snapshot()];
      future.value = [];
    }
    lastKey = key;
    change();
    // A row whose last field left is gone.
    state.rows = state.rows.filter((row) => row.fields.length > 0);
  }

  function undo() {
    const previous = past.value.at(-1);
    if (!previous) return;
    future.value = [...future.value, snapshot()];
    past.value = past.value.slice(0, -1);
    restore(previous);
    lastKey = null;
    forgetGone();
  }

  function redo() {
    const next = future.value.at(-1);
    if (!next) return;
    past.value = [...past.value, snapshot()];
    future.value = future.value.slice(0, -1);
    restore(next);
    lastKey = null;
    forgetGone();
  }

  // ── Changes

  const rowOf = (fieldId: string) => state.rows.find((row) => row.fields.some((field) => field.id === fieldId));

  /**
   * A drop into any list of the form: its new arrays, by list id. A drop on a "new row"
   * list puts the fields in a row of their own there.
   */
  function apply(result: ReadonlyMap<Key, unknown[]>) {
    commit(() => {
      const created: [before: string, fields: Field[]][] = [];
      for (const [list, items] of result) {
        const [type, id] = String(list).split(':') as [string, string];
        if (list === ROWS) state.rows = items as Row[];
        else if (type === 'row') state.rows.find((row) => row.id === id)!.fields = items as Field[];
        else if (type === 'new' && items.length) created.push([id, items as Field[]]);
      }
      for (const [before, items] of created) {
        const index = state.rows.findIndex((row) => row.id === before);
        state.rows.splice(index < 0 ? state.rows.length : index, 0, row(...items));
      }
    });
  }

  /** `onDrop` of every list: applies the drop, and selects a field that was just added. */
  function drop(event: SortableDropEvent<unknown>) {
    event.preventDefault();
    apply(event.result);
    if (event.mode === 'copy') selectedId.value = (event.items[0] as Field).id;
    forgetGone();
  }

  function add(kind: FieldKind) {
    const field = createField(kind);
    commit(() => state.rows.push(row(field)));
    selectedId.value = field.id;
  }

  function update(id: string, patch: Partial<Field>, key?: keyof Field | `option:${string}`) {
    const field = fields.value.find((item) => item.id === id);
    if (field) commit(() => Object.assign(field, patch), key ? `${id}:${key}` : null);
  }

  function remove(id: string) {
    const from = rowOf(id);
    if (!from) return;
    commit(() => (from.fields = from.fields.filter((field) => field.id !== id)));
    if (selectedId.value === id) selectedId.value = null;
  }

  /** The copy goes next to the field, or below it when its row is full. */
  function duplicate(id: string) {
    const from = rowOf(id);
    const field = from?.fields.find((item) => item.id === id);
    if (!from || !field) return;
    const copy = cloneField(field);
    commit(() => {
      if (from.fields.length < MAX_COLUMNS) from.fields.splice(from.fields.indexOf(field) + 1, 0, copy);
      else state.rows.splice(state.rows.indexOf(from) + 1, 0, row(copy));
    });
    selectedId.value = copy.id;
  }

  /** The form's title or description: typing in one is a single step of Undo. */
  const editHeader = (patch: Partial<Pick<FormState, 'title' | 'description'>>) =>
    commit(() => Object.assign(state, patch), Object.keys(patch)[0]);

  /** A place in the lists, in words, for screen readers. */
  function describe({ list, index, length }: AnnouncedPosition): string {
    const [type, id] = String(list).split(':') as [string, string];
    const rowNumber = (rowId: string) => state.rows.findIndex((item) => item.id === rowId) + 1;
    if (list === ROWS) return `row ${index + 1} of ${length}`;
    if (type === 'row') return length > 1 ? `row ${rowNumber(id)}, column ${index + 1} of ${length}` : `row ${rowNumber(id)}`;
    if (type === 'new') return id === 'end' ? 'a new row at the end' : `a new row above row ${rowNumber(id)}`;
    return 'the palette';
  }

  // Reactive: components read `form.selected`, `form.canUndo`… without `.value`.
  return reactive({
    state,
    fields,
    names,
    selected,
    select: (id: string | null) => (selectedId.value = id),
    canUndo: computed(() => past.value.length > 0),
    canRedo: computed(() => future.value.length > 0),
    undo,
    redo,
    drop,
    add,
    update,
    remove,
    duplicate,
    editHeader,
    describe,
  });
}

export type Form = ReturnType<typeof createForm>;
export const FORM: InjectionKey<Form> = Symbol('form');
export const useForm = () => inject(FORM)!;
