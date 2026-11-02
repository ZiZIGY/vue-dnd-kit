<script setup lang="ts">
  /**
   * A JSDoc text of the API reference, as HTML: paragraphs, `- ` lines as a list, `code` and
   * **bold**. Used by `::api-table` and `::api-signature`.
   */
  const props = defineProps<{ text: string }>();

  const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  /** Inline marks of the JSDoc: `code`, **bold**. */
  const inline = (text: string) =>
    escape(text)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  const html = computed(() => {
    const blocks: string[] = [];
    let paragraph: string[] = [];
    let list: string[] = [];
    const flush = () => {
      if (paragraph.length) blocks.push(`<p>${inline(paragraph.join(' '))}</p>`);
      if (list.length) blocks.push(`<ul>${list.map((item) => `<li>${inline(item)}</li>`).join('')}</ul>`);
      paragraph = [];
      list = [];
    };
    for (const raw of props.text.split('\n')) {
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
  });
</script>

<template>
  <div
    class="api-text"
    v-html="html"
  />
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
