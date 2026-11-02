<script setup lang="ts">
  import { signatures } from '#api';

  /**
   * The signature of a function, component or value of the library, with its JSDoc, read from
   * its declaration at build time (`modules/api.ts`): `::api-signature{name="makeDraggable"}`.
   * `names` (comma-separated) lists several, each with its type and description, as the rows
   * of `::api-table`: `::api-signature{names="pointerSensor, keyboardSensor"}`.
   * In another language, the descriptions translated for it, or the English.
   */
  const props = defineProps<{ name?: string; names?: string }>();
  const { t } = useI18n();

  const list = computed(() => [props.name, ...(props.names?.split(/[\s,]+/) ?? [])].filter((name): name is string => !!name));
  if (import.meta.dev) {
    for (const name of list.value.filter((name) => !signatures[name])) {
      console.warn(`[docs] No function, component or value named "${name}" in the library's exports.`);
    }
  }
  const entries = computed(() => list.value.filter((name) => signatures[name]).map((name) => ({ name, ...signatures[name]! })));
  const single = computed(() => (props.names ? undefined : entries.value[0]));

  /** A description in the page's language: `key` is the export's name. */
  const text = await useApiText();
  const describe = (entry: (typeof entries.value)[number]) =>
    [entry.deprecated, entry.description && text(entry.name, entry.description)].filter(Boolean).join('\n\n');

  /** Long names break between their words: `restrictTo·First·Scrollable·Ancestor`. */
  const words = (name: string) => name.split(/(?=[A-Z][a-z])/);
</script>

<template>
  <div
    v-if="single"
    class="my-6"
  >
    <!-- The colours of the tokens come from the site's Shiki rules (`main.css`). -->
    <ProsePre
      :code="single.code"
      language="ts"
      :ui="{ root: 'my-0' }"
      ><code
        class="shiki shiki-themes"
        v-html="single.html"
    /></ProsePre>
    <ApiText
      v-if="single.description || single.deprecated"
      class="mt-4 text-[15px] leading-relaxed text-muted"
      :text="describe(single)"
    />
  </div>
  <div
    v-else-if="entries.length"
    class="not-prose my-6 divide-y divide-dashed divide-(--ui-border-accented) border-y border-default"
  >
    <div
      v-for="entry in entries"
      :id="entry.name.toLowerCase()"
      :key="entry.name"
      class="grid scroll-mt-24 gap-x-8 gap-y-2 py-4 md:grid-cols-[13rem_minmax(0,1fr)]"
    >
      <div class="min-w-0 font-mono text-[13px]">
        <a
          :href="`#${entry.name.toLowerCase()}`"
          class="font-semibold text-highlighted hover:text-(--ui-primary)"
          ><template
            v-for="(word, index) in words(entry.name)"
            :key="index"
            ><wbr v-if="index" />{{ word }}</template
          ></a
        >
        <p
          v-if="entry.deprecated"
          class="label mt-1 text-[10px] text-(--ui-warning)"
        >
          {{ t('api.deprecated') }}
        </p>
      </div>
      <div class="min-w-0">
        <code class="font-mono text-[12.5px] leading-relaxed break-words text-(--ui-primary)">{{ entry.type }}</code>
        <ApiText
          v-if="entry.description || entry.deprecated"
          class="mt-2 text-[14px] leading-relaxed text-muted"
          :text="describe(entry)"
        />
      </div>
    </div>
  </div>
</template>
