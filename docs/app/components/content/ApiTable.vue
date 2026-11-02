<script setup lang="ts">
  import { api } from '#api';

  /**
   * The members of an interface (or the definition of a type) of the library, read from its
   * types and JSDoc at build time (`modules/api.ts`): `::api-table{name="SortableListOptions"}`.
   * In another language, the descriptions translated for it, or the English.
   */
  const props = defineProps<{ name: string }>();
  const { t } = useI18n();

  const entry = computed(() => api[props.name]);
  if (!entry.value && import.meta.dev) console.warn(`[docs] No type named "${props.name}" in the library's types.`);

  /** A description in the page's language: `key` is `Name` or `Name.member`. */
  const text = await useApiText();

  const anchor = (member: string) => `${props.name}-${member}`.toLowerCase();
</script>

<template>
  <div
    v-if="entry"
    class="not-prose my-6"
  >
    <ApiText
      v-if="entry.description"
      class="mb-4 text-[15px] leading-relaxed text-muted"
      :text="text(name, entry.description)"
    />
    <pre
      v-if="entry.kind === 'type'"
      class="overflow-x-auto bg-(--code-bg) px-5 py-4 font-mono text-[13px]/6 text-highlighted"
    ><code>type {{ name }} = {{ entry.type }}</code></pre>
    <div
      v-else
      class="divide-y divide-dashed divide-(--ui-border-accented) border-y border-default"
    >
      <div
        v-for="member in entry.members"
        :id="anchor(member.name)"
        :key="member.name"
        class="grid scroll-mt-24 gap-x-8 gap-y-2 py-4 md:grid-cols-[13rem_minmax(0,1fr)]"
      >
        <div class="min-w-0 font-mono text-[13px]">
          <a
            :href="`#${anchor(member.name)}`"
            class="font-semibold break-all text-highlighted hover:text-(--ui-primary)"
            >{{ member.name }}</a
          ><span
            v-if="member.optional"
            class="text-dimmed"
            :title="t('api.optional')"
            >?</span
          >
          <p
            v-if="member.deprecated"
            class="label mt-1 text-[10px] text-(--ui-warning)"
          >
            {{ t('api.deprecated') }}
          </p>
        </div>
        <div class="min-w-0">
          <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <code class="font-mono text-[12.5px] leading-relaxed break-words text-(--ui-primary)">{{ member.type }}</code>
            <span
              v-if="member.reactive"
              class="label text-[10px] text-dimmed"
              >{{ member.reactive === 'getter' ? t('api.reactive') : t('api.reactiveRef') }}</span
            >
          </div>
          <ApiText
            v-if="member.description || member.deprecated"
            class="mt-2 text-[14px] leading-relaxed text-muted"
            :text="[member.deprecated, member.description && text(`${name}.${member.name}`, member.description)].filter(Boolean).join('\n\n')"
          />
        </div>
      </div>
    </div>
  </div>
</template>
