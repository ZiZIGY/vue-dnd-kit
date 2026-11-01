<script setup lang="ts">
import { computed } from 'vue';
import OptionList from './OptionList.vue';
import { KINDS, useForm, type Field, type Setting } from './form';

/**
 * The selected field's settings: a Nuxt UI form of its own. Every change goes through
 * `form.update` with the setting's name, so typing a label is a single step of Undo.
 * `back`: in the narrow layout the panel takes the palette's place, and goes back to it.
 */
defineProps<{ back?: boolean }>();
const form = useForm();

const field = computed(() => form.selected!);
const kind = computed(() => KINDS[field.value.kind]);
const has = (setting: Setting) => kind.value.settings.includes(setting);
const heading = computed(() => field.value.kind === 'heading');

function edit<K extends keyof Field>(key: K, value: Field[K]) {
  form.update(field.value.id, { [key]: value }, key);
}
</script>

<template>
  <section aria-label="Field settings" class="flex h-full flex-col">
    <header class="flex h-12 shrink-0 items-center gap-2.5 border-b border-default px-3">
      <UButton
        v-if="back"
        icon="i-lucide-arrow-left"
        size="sm"
        color="neutral"
        variant="ghost"
        aria-label="Back to the fields"
        @click="form.select(null)"
      />
      <span class="grid size-7 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
        <UIcon :name="kind.icon" class="size-4" />
      </span>
      <div class="min-w-0 flex-1 leading-tight">
        <h3 class="truncate text-sm font-semibold text-highlighted">{{ kind.name }}</h3>
        <p v-if="!heading" class="truncate font-mono text-[11px] text-dimmed">{{ form.names.get(field.id) }}</p>
      </div>
      <UButton
        v-if="!back"
        icon="i-lucide-x"
        size="sm"
        color="neutral"
        variant="ghost"
        aria-label="Close the settings"
        @click="form.select(null)"
      />
    </header>

    <div class="min-h-0 flex-1 space-y-4 overflow-y-auto p-4">
      <UFormField :label="heading ? 'Title' : 'Label'">
        <UInput :model-value="field.label" class="w-full" @update:model-value="edit('label', String($event))" />
      </UFormField>
      <UFormField :label="heading ? 'Subtitle' : 'Description'" hint="Optional">
        <UTextarea
          :model-value="field.description"
          :rows="2"
          autoresize
          class="w-full"
          @update:model-value="edit('description', String($event))"
        />
      </UFormField>
      <UFormField v-if="has('placeholder')" :label="field.kind === 'file' ? 'Drop zone text' : 'Placeholder'">
        <UInput :model-value="field.placeholder" class="w-full" @update:model-value="edit('placeholder', String($event))" />
      </UFormField>
      <UFormField v-if="has('options')" label="Options" description="Drag the grips to reorder them.">
        <OptionList :field="field" class="mt-1" />
      </UFormField>
      <div v-if="has('range')" class="grid grid-cols-2 gap-3">
        <UFormField label="Minimum">
          <UInputNumber :model-value="field.min" placeholder="None" class="w-full" @update:model-value="edit('min', $event ?? null)" />
        </UFormField>
        <UFormField label="Maximum">
          <UInputNumber :model-value="field.max" placeholder="None" class="w-full" @update:model-value="edit('max', $event ?? null)" />
        </UFormField>
      </div>
      <UFormField v-if="has('stars')" label="Stars">
        <UInputNumber :model-value="field.max ?? 5" :min="3" :max="10" class="w-full" @update:model-value="edit('max', $event ?? 5)" />
      </UFormField>

      <template v-if="has('multiple') || has('required')">
        <USeparator />
        <USwitch
          v-if="has('multiple')"
          :model-value="field.multiple"
          label="Several answers"
          description="Checkboxes instead of radio buttons."
          @update:model-value="edit('multiple', $event)"
        />
        <USwitch
          v-if="has('required')"
          :model-value="field.required"
          label="Required"
          description="The form can't be sent without it."
          @update:model-value="edit('required', $event)"
        />
      </template>
    </div>

    <footer class="flex shrink-0 gap-2 border-t border-default p-3">
      <UButton
        label="Duplicate"
        icon="i-lucide-copy"
        size="sm"
        color="neutral"
        variant="outline"
        class="flex-1 justify-center"
        @click="form.duplicate(field.id)"
      />
      <UTooltip text="Delete" :kbds="['delete']">
        <UButton
          icon="i-lucide-trash-2"
          size="sm"
          color="error"
          variant="soft"
          square
          :aria-label="`Delete ${field.label}`"
          @click="form.remove(field.id)"
        />
      </UTooltip>
    </footer>
  </section>
</template>
