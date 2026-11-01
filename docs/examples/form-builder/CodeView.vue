<script setup lang="ts">
import { computed, ref } from 'vue';
import { useClipboard } from '@vueuse/core';
import { useForm } from './form';
import { toJson, toVue } from './export';

/** The form as code: a Vue component with Nuxt UI and Zod, or the form's data as JSON. */
const form = useForm();

const TABS = [
  { label: 'Vue', value: 'vue', icon: 'i-lucide-file-code' },
  { label: 'JSON', value: 'json', icon: 'i-lucide-braces' },
];
const tab = ref('vue');
const code = computed(() => (tab.value === 'vue' ? toVue : toJson)(form.state, form.names));
const { copy, copied } = useClipboard({ copiedDuring: 1600 });
</script>

<template>
  <div class="flex h-full flex-col bg-muted p-3 @lg:p-8">
    <div class="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col overflow-hidden rounded-lg bg-default shadow-sm ring ring-default">
      <header class="flex shrink-0 items-center gap-3 border-b border-default px-3 py-2">
        <UTabs v-model="tab" :items="TABS" :content="false" size="xs" />
        <span class="hidden truncate font-mono text-xs text-dimmed @2xl:inline">
          {{ tab === 'vue' ? 'A component: Nuxt UI + Zod' : 'The form as data' }}
        </span>
        <UButton
          :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
          :label="copied ? 'Copied' : 'Copy'"
          size="sm"
          color="neutral"
          variant="outline"
          class="ms-auto"
          @click="copy(code)"
        />
      </header>
      <pre class="min-h-0 flex-1 overflow-auto p-4 font-mono text-xs/5 text-default"><code>{{ code }}</code></pre>
    </div>
  </div>
</template>
