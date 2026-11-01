<script setup lang="ts">
import { computed } from 'vue';
import type { Field } from './form';

/**
 * A field as Nuxt UI renders it: a `UFormField` (label, description, the error) around its
 * control. The canvas shows it inert, as a picture of the form; the preview binds it to the
 * form's state, and `name` ties it to its rule in the schema.
 */
const props = defineProps<{ field: Field; name?: string }>();
// Each kind has a value of its own type: text, a number, choices, a date, a file.
const value = defineModel<any>();

const items = computed(() => props.field.options.map((option) => option.label));
// A checkbox and a switch carry their label themselves.
const labelled = computed(() => props.field.kind !== 'checkbox' && props.field.kind !== 'switch');
</script>

<template>
  <div v-if="field.kind === 'heading'" class="pt-1">
    <h4 class="text-base font-semibold text-highlighted">{{ field.label }}</h4>
    <p v-if="field.description" class="mt-0.5 text-sm text-muted">{{ field.description }}</p>
  </div>

  <UFormField
    v-else
    :name="name"
    :label="labelled ? field.label : undefined"
    :description="(labelled && field.description) || undefined"
    :required="labelled && field.required"
  >
    <UInput v-if="field.kind === 'text'" v-model="value" :placeholder="field.placeholder" class="w-full" />
    <UTextarea
      v-else-if="field.kind === 'textarea'"
      v-model="value"
      :placeholder="field.placeholder"
      :rows="3"
      autoresize
      class="w-full"
    />
    <UInput
      v-else-if="field.kind === 'email'"
      v-model="value"
      type="email"
      icon="i-lucide-at-sign"
      :placeholder="field.placeholder"
      class="w-full"
    />
    <UInputNumber
      v-else-if="field.kind === 'number'"
      v-model="value"
      :min="field.min ?? undefined"
      :max="field.max ?? undefined"
      :placeholder="field.placeholder"
      class="w-full"
    />
    <UInputDate v-else-if="field.kind === 'date'" v-model="value" class="w-full" />
    <USelect
      v-else-if="field.kind === 'select'"
      v-model="value"
      :items="items"
      :placeholder="field.placeholder"
      class="w-full"
    />
    <UCheckboxGroup v-else-if="field.kind === 'choice' && field.multiple" v-model="value" :items="items" />
    <URadioGroup v-else-if="field.kind === 'choice'" v-model="value" :items="items" />
    <UCheckbox
      v-else-if="field.kind === 'checkbox'"
      v-model="value"
      :label="field.label"
      :description="field.description || undefined"
      :required="field.required"
    />
    <USwitch
      v-else-if="field.kind === 'switch'"
      v-model="value"
      :label="field.label"
      :description="field.description || undefined"
    />
    <UInputRating v-else-if="field.kind === 'rating'" v-model="value" :length="field.max ?? 5" />
    <UFileUpload
      v-else-if="field.kind === 'file'"
      v-model="value"
      icon="i-lucide-upload"
      :label="field.placeholder"
      class="min-h-28 w-full"
    />
  </UFormField>
</template>
