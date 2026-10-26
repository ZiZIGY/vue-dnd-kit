<script setup lang="ts">
  /**
   * One feature on the home page: its index and name, a short text with where to read more,
   * then the live example side by side with its code, like a playground.
   */
  const props = defineProps<{
    index: number;
    label: string;
    title: string;
    text: string;
    example: string;
    /** The file shown first: the one the feature is about. */
    focus?: string;
    hint?: string;
    docs: string;
    docsLabel: string;
    height?: string;
  }>();
  const { Demo, files } = await useExample(props.example);
</script>

<template>
  <SiteSection>
    <div class="grid grid-cols-1 gap-8 px-(--gutter) pt-16 pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-16 lg:pt-24 lg:pb-16">
      <div>
        <p class="label flex items-center gap-3 text-[11px] text-dimmed">
          <span class="text-(--ui-primary) tabular-nums">{{ String(index).padStart(2, '0') }}</span>
          <span class="h-px w-8 bg-(--ui-border-accented)" />
          {{ label }}
        </p>
        <h2 class="heading mt-6 text-4xl sm:text-5xl lg:text-6xl">{{ title }}</h2>
      </div>
      <div>
        <p class="text-base leading-relaxed text-muted">{{ text }}</p>
        <NuxtLink
          :to="docs"
          class="label mt-5 inline-flex items-center gap-1 text-[11px] text-highlighted transition-colors hover:text-(--ui-primary)"
        >
          {{ docsLabel }}
          <UIcon
            name="i-lucide-chevron-right"
            class="size-3.5"
          />
        </NuxtLink>
      </div>
    </div>
    <div class="grid grid-cols-1 border-t border-default xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <ExampleStage
        :demo="Demo"
        :hint="hint"
        :min-height="height ?? '32rem'"
        class="border-default xl:border-e"
      />
      <div class="relative h-[26rem] border-default max-xl:border-t xl:h-auto">
        <ExampleCode
          v-if="files?.length"
          :files="files"
          :name="example"
          :title="title"
          :focus="focus"
          fill
          class="xl:absolute xl:inset-0"
        />
      </div>
    </div>
  </SiteSection>
</template>
