<script setup lang="ts">
  import { computed, shallowRef, watch } from 'vue';
  import { useClipboard } from '@vueuse/core';
  import UButton from '@nuxt/ui/components/Button.vue';
  import UIcon from '@nuxt/ui/components/Icon.vue';
  import { SECTIONS, demoById, frameUrl } from '../catalog';
  import { docsOf } from './links';
  import { highlight } from './highlight';
  import { sourcesOf, testsOf, type SourceFile, type Spec } from './sources';
  import { demo, open, tab, type Tab } from './state';

  const TABS: Array<{ value: Tab; label: string; icon: string }> = [
    { value: 'about', label: 'About', icon: 'i-lucide-info' },
    { value: 'code', label: 'Code', icon: 'i-lucide-code' },
    { value: 'tests', label: 'Tests', icon: 'i-lucide-flask-conical' },
  ];

  const section = computed(() => SECTIONS.find((entry) => entry.id === demo.value.section)?.title);
  const docs = computed(() => docsOf(demo.value));

  // Tests: read for the About tab's count too. A late answer for another demo is dropped.
  const specs = shallowRef<Spec[] | null>(null);
  watch(
    demo,
    async (entry) => {
      specs.value = null;
      const found = await testsOf(entry);
      if (demo.value === entry) specs.value = found;
    },
    { immediate: true },
  );
  const testCount = computed(() => specs.value?.reduce((sum, spec) => sum + spec.count, 0) ?? 0);
  /** Run from `playground/`. */
  const command = computed(() => (specs.value ? `npx playwright test ${specs.value.map((spec) => spec.file).join(' ')}` : ''));

  // Code: loaded when the tab first shows for a demo.
  const sources = shallowRef<SourceFile[] | null>(null);
  const selected = shallowRef(0);
  const html = shallowRef('');
  watch(
    [demo, tab],
    async ([entry, current], [previous]) => {
      if (entry !== previous) {
        sources.value = null;
        selected.value = 0;
      }
      if (current !== 'code' || sources.value) return;
      const found = await sourcesOf(entry);
      if (demo.value === entry) sources.value = found;
    },
    { immediate: true },
  );
  watch([sources, selected], async ([files, index]) => {
    const file = files?.[index];
    html.value = '';
    if (!file) return;
    const result = await highlight(file.code, file.path);
    if (sources.value?.[selected.value] === file) html.value = result;
  });
  const fileName = (path: string) => path.split('/').at(-1)!;

  const { copy, copied } = useClipboard({ legacy: true });
  const copiedWhat = shallowRef<string | null>(null);
  const copyText = (what: string, text: string) => {
    copiedWhat.value = what;
    void copy(text);
  };

  /** Phone demos lead to the checklist for a real phone; that one, to the long list. */
  const companion = computed(() => (demo.value.phone ? demoById(demo.value.id === 'device-check' ? 'touch-list' : 'device-check') : null));
</script>

<template>
  <aside
    class="flex min-h-0 w-[420px] shrink-0 flex-col border-s border-default bg-default"
    aria-label="About the demo"
  >
    <div
      class="flex h-11 shrink-0 items-stretch gap-1 border-b border-default px-2"
      role="tablist"
    >
      <button
        v-for="option in TABS"
        :key="option.value"
        type="button"
        role="tab"
        :aria-selected="tab === option.value"
        class="label relative flex items-center gap-1.5 px-3 text-[10px] text-dimmed transition-colors hover:text-highlighted aria-selected:text-highlighted"
        @click="tab = option.value"
      >
        <UIcon
          :name="option.icon"
          class="size-3.5"
        />
        {{ option.label }}
        <span
          v-if="option.value === 'tests' && testCount"
          class="font-normal text-dimmed tabular-nums"
          >{{ testCount }}</span
        >
        <span
          v-if="tab === option.value"
          class="absolute inset-x-2 -bottom-px h-0.5 bg-(--ui-primary)"
        />
      </button>
    </div>

    <!-- About -->
    <div
      v-if="tab === 'about'"
      class="min-h-0 flex-1 overflow-y-auto p-6"
    >
      <p class="label text-[10px] text-(--ui-primary)">{{ section }}</p>
      <h2 class="mt-2 text-2xl font-bold tracking-[-0.035em] text-highlighted">{{ demo.title }}</h2>
      <p class="mt-3 text-[15px] leading-relaxed text-muted">{{ demo.description }}</p>

      <div class="mt-6 flex flex-wrap gap-2">
        <UButton
          v-if="docs"
          :href="docs"
          target="_blank"
          label="Read the guide"
          icon="i-lucide-book-open"
          color="neutral"
          variant="outline"
          size="sm"
        />
        <UButton
          :href="frameUrl(demo)"
          target="_blank"
          label="Open on its own"
          icon="i-lucide-external-link"
          color="neutral"
          variant="outline"
          size="sm"
        />
      </div>

      <dl class="mt-8 divide-y divide-default border-y border-default text-sm">
        <div class="flex items-center justify-between gap-4 py-2.5">
          <dt class="label text-[10px] text-dimmed">Page</dt>
          <dd class="truncate font-mono text-xs text-muted">{{ frameUrl(demo) }}</dd>
        </div>
        <div class="flex items-center justify-between gap-4 py-2.5">
          <dt class="label text-[10px] text-dimmed">E2E</dt>
          <dd>
            <button
              type="button"
              class="font-mono text-xs text-muted underline decoration-dotted underline-offset-4 hover:text-highlighted"
              @click="tab = 'tests'"
            >
              {{ specs ? `${testCount} tests in ${specs.length} ${specs.length === 1 ? 'spec' : 'specs'}` : '…' }}
            </button>
          </dd>
        </div>
      </dl>

      <div
        v-if="demo.phone"
        class="mt-6 border-s-2 border-(--ui-primary) bg-elevated/60 p-4 text-sm leading-relaxed text-muted"
      >
        A mouse drives this frame as a mouse. For touch, open the demo on its own in the browser's
        device mode, or on a real phone (<code class="font-mono text-xs">yarn dev:host</code>).
        <button
          v-if="companion"
          type="button"
          class="mt-2 block font-medium text-highlighted underline decoration-dotted underline-offset-4"
          @click="open(companion.id)"
        >
          {{ companion.title }} →
        </button>
      </div>
    </div>

    <!-- Code -->
    <div
      v-else-if="tab === 'code'"
      class="flex min-h-0 flex-1 flex-col"
    >
      <div
        v-if="sources"
        class="flex shrink-0 gap-1 overflow-x-auto border-b border-default px-2 py-2"
      >
        <button
          v-for="(file, index) in sources"
          :key="file.path"
          type="button"
          :title="file.path"
          class="shrink-0 rounded-(--ui-radius) px-2 py-1 font-mono text-[11px] text-dimmed transition-colors hover:bg-elevated hover:text-highlighted"
          :class="{ 'bg-elevated text-highlighted': index === selected }"
          @click="selected = index"
        >
          {{ fileName(file.path) }}
        </button>
      </div>
      <div
        v-if="sources?.[selected]"
        class="flex h-9 shrink-0 items-center gap-2 border-b border-default ps-4 pe-1.5"
      >
        <span class="truncate font-mono text-[11px] text-dimmed">playground/{{ sources[selected]!.path }}</span>
        <UButton
          class="ms-auto"
          :icon="copied && copiedWhat === 'code' ? 'i-lucide-check' : 'i-lucide-copy'"
          size="sm"
          color="neutral"
          variant="ghost"
          square
          aria-label="Copy the code"
          @click="copyText('code', sources[selected]!.code)"
        />
      </div>
      <div class="min-h-0 flex-1 overflow-auto bg-(--code-bg)">
        <div
          v-if="html"
          class="code p-4 font-mono text-[12px] leading-[1.65]"
          v-html="html"
        />
        <p
          v-else
          class="label p-6 text-[10px] text-dimmed"
        >
          Loading…
        </p>
      </div>
    </div>

    <!-- Tests -->
    <div
      v-else
      class="min-h-0 flex-1 overflow-y-auto"
    >
      <p
        v-if="!specs"
        class="label p-6 text-[10px] text-dimmed"
      >
        Loading…
      </p>
      <p
        v-else-if="!specs.length"
        class="p-6 text-sm text-muted"
      >
        No e2e spec opens this demo.
      </p>
      <template v-else>
        <div class="flex items-center gap-2 border-b border-default bg-(--code-bg) ps-4 pe-1.5 py-2">
          <code class="truncate font-mono text-[11px] text-muted">{{ command }}</code>
          <UButton
            class="ms-auto"
            :icon="copied && copiedWhat === 'all' ? 'i-lucide-check' : 'i-lucide-copy'"
            size="sm"
            color="neutral"
            variant="ghost"
            square
            aria-label="Copy the command"
            @click="copyText('all', command)"
          />
        </div>
        <section
          v-for="spec in specs"
          :key="spec.file"
          class="border-b border-default px-4 py-4"
        >
          <h3 class="flex items-center gap-2">
            <UIcon
              name="i-lucide-flask-conical"
              class="size-3.5 text-(--ui-primary)"
            />
            <span class="font-mono text-xs font-semibold text-highlighted">{{ spec.file.replace('e2e/', '') }}</span>
            <span class="font-mono text-[11px] text-dimmed tabular-nums">{{ spec.count }}</span>
          </h3>
          <div
            v-for="group in spec.groups"
            :key="group.title ?? ''"
            class="mt-3"
          >
            <p
              v-if="group.title"
              class="label text-[10px] text-dimmed"
            >
              {{ group.title }}
            </p>
            <ul class="mt-1.5 space-y-1">
              <li
                v-for="test in group.tests"
                :key="test.title"
                class="flex gap-2 text-[13px] leading-snug text-muted"
              >
                <span
                  aria-hidden="true"
                  class="mt-[0.45em] size-1 shrink-0 bg-(--ui-text-dimmed)"
                />
                <span>
                  {{ test.title.replace(' @touch', '') }}
                  <span
                    v-if="test.touch"
                    class="label ms-1 text-[9px] text-(--ui-primary)"
                    >mobile</span
                  >
                </span>
              </li>
            </ul>
          </div>
        </section>
      </template>
    </div>
  </aside>
</template>

<style scoped>
  .code :deep(pre) {
    margin: 0;
    white-space: pre;
  }
</style>
