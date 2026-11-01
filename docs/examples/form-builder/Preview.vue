<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import type { FormSubmitEvent } from '@nuxt/ui';
import FieldView from './FieldView.vue';
import { useForm } from './form';
import { initialValue, printable, schemaOf } from './schema';

/** The form as people will fill it: a real `UForm`, validated by a Zod schema made from the fields. */
const form = useForm();

const rows = computed(() =>
  form.state.rows.map((row) => ({
    id: row.id,
    fields: row.fields.map((field) => ({ field, name: form.names.get(field.id) ?? field.id })),
  })),
);
const schema = computed(() => schemaOf(form.fields, form.names));

const blank = () => Object.fromEntries(rows.value.flatMap((row) => row.fields.map(({ field, name }) => [name, initialValue(field)])));
const state = reactive<Record<string, unknown>>(blank());

/** What the last submit sent, as JSON. */
const sent = ref<string | null>(null);
const onSubmit = (event: FormSubmitEvent<Record<string, unknown>>) => (sent.value = printable(event.data));
const again = () => {
  Object.assign(state, blank());
  sent.value = null;
};

// Static class names, so Tailwind finds them. A row's fields stack in a narrow builder (the
// builder is the container) and sit side by side from `@lg` up.
const COLUMNS = ['', '', '@lg:grid-cols-2', '@lg:grid-cols-3'];
</script>

<template>
  <div class="h-full overflow-y-auto bg-muted px-3 py-5 @lg:px-8 @lg:py-8">
    <div class="mx-auto max-w-2xl rounded-lg bg-default px-6 py-6 shadow-sm ring ring-default @lg:px-10 @lg:py-8">
      <div v-if="sent" class="flex flex-col items-center gap-3 py-4 text-center">
        <span class="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
          <UIcon name="i-lucide-check" class="size-6" />
        </span>
        <h3 class="text-lg font-semibold text-highlighted">Thanks, your answers are in</h3>
        <p class="text-sm text-muted">The form sent this:</p>
        <pre class="max-h-64 w-full overflow-auto rounded-md bg-elevated p-4 text-left font-mono text-xs/5">{{ sent }}</pre>
        <UButton label="Fill it again" icon="i-lucide-rotate-ccw" color="neutral" variant="outline" @click="again" />
      </div>

      <!-- `novalidate`: the schema checks the answers and `UFormField` shows its messages,
           not the browser's bubbles (a required checkbox is `required` for the browser too). -->
      <UForm v-else :schema="schema" :state="state" novalidate class="flex flex-col gap-5" @submit="onSubmit">
        <div>
          <h3 class="text-xl font-bold tracking-tight text-highlighted @lg:text-2xl">{{ form.state.title || 'Untitled form' }}</h3>
          <p v-if="form.state.description" class="mt-1 text-sm text-muted">{{ form.state.description }}</p>
        </div>
        <div v-for="row in rows" :key="row.id" class="grid gap-4" :class="COLUMNS[row.fields.length]">
          <FieldView v-for="{ field, name } in row.fields" :key="field.id" v-model="state[name]" :field="field" :name="name" />
        </div>
        <UButton type="submit" label="Submit" class="self-start" />
      </UForm>
    </div>
  </div>
</template>
