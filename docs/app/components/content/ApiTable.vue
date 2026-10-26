<script setup lang="ts">
  import { api } from '#api';

  /**
   * The members of an interface (or the definition of a type) of the library, read from its
   * types and JSDoc at build time (`modules/api.ts`): `::api-table{name="SortableListOptions"}`.
   */
  const props = defineProps<{ name: string }>();
  const { t } = useI18n();

  const entry = computed(() => api[props.name]);
  if (!entry.value && import.meta.dev) console.warn(`[docs] No type named "${props.name}" in the library's types.`);

  const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  /** Inline marks of the JSDoc: `code`, **bold**. */
  const inline = (text: string) =>
    escape(text)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  /** JSDoc as HTML: paragraphs, and `- ` lines as a list. */
  const describe = (text: string) => {
    const blocks: string[] = [];
    let paragraph: string[] = [];
    let list: string[] = [];
    const flush = () => {
      if (paragraph.length) blocks.push(`<p>${inline(paragraph.join(' '))}</p>`);
      if (list.length) blocks.push(`<ul>${list.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>`);
      paragraph = [];
      list = [];
    };
    for (const raw of text.split('\n')) {
      const line = raw.trim();
      if (!line) flush();
      else if (line.startsWith('- ')) {
        if (paragraph.length) flush();
        list.push(line.slice(2));
      } else if (list.length) list[list.length - 1] += ` ${line}`;
      else paragraph.push(line);
    }
    flush();
    return blocks.join('');
  };

  const anchor = (member: string) => `${props.name}-${member}`.toLowerCase();
</script>

<template>
  <div
    v-if="entry"
    class="not-prose my-6"
  >
    <div
      v-if="entry.description"
      class="api-text mb-4 text-[15px] leading-relaxed text-muted"
      v-html="describe(entry.description)"
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
          <div
            v-if="member.description || member.deprecated"
            class="api-text mt-2 text-[14px] leading-relaxed text-muted"
            v-html="describe([member.deprecated, member.description].filter(Boolean).join('\n\n'))"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .api-text :deep(code) {
    padding: 0.05em 0.35em;
    border-radius: var(--ui-radius);
    background: var(--ui-bg-elevated);
    font-family: var(--font-mono);
    font-size: 0.9em;
    color: var(--ui-text-highlighted);
  }

  .api-text :deep(p + p),
  .api-text :deep(p + ul),
  .api-text :deep(ul + p) {
    margin-top: 0.5rem;
  }

  .api-text :deep(ul) {
    padding-left: 1.1rem;
    list-style: disc;
  }

  .api-text :deep(li + li) {
    margin-top: 0.25rem;
  }

  .api-text :deep(strong) {
    color: var(--ui-text-highlighted);
  }
</style>
