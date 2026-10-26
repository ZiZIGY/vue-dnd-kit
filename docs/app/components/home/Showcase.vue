<script setup lang="ts">
  /**
   * One feature on the home page: its name, a wide stage where its live example runs,
   * then a short text beside the example's code, and where to read more.
   */
  const props = defineProps<{
    title: string;
    text: string;
    example: string;
    /** The file shown first: the one the feature is about. */
    focus?: string;
    docs: string;
    docsLabel: string;
    height?: string;
  }>();
  const { Demo, files } = await useExample(props.example);
</script>

<template>
  <section class="py-20 lg:py-28">
    <div class="mx-auto max-w-(--ui-container) px-5 lg:px-8">
      <h2 class="heading text-4xl sm:text-5xl">{{ title }}</h2>
    </div>
    <div class="mt-10 lg:mt-14">
      <ExampleStage
        :demo="Demo"
        :min-height="height ?? '26rem'"
      />
    </div>
    <div class="mx-auto mt-10 grid max-w-(--ui-container) items-start gap-8 px-5 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] lg:gap-16 lg:px-8">
      <p class="max-w-sm text-base leading-relaxed text-muted lg:text-lg">{{ text }}</p>
      <div>
        <ExampleCode
          v-if="files?.length"
          :files="files"
          :name="example"
          :title="title"
          :focus="focus"
          max-height="22rem"
          class="rounded-(--ui-radius) ring-1 ring-default"
        />
        <div class="mt-5 flex flex-wrap gap-6">
          <NuxtLink
            :to="docs"
            class="label inline-flex items-center gap-1 text-[11px] text-highlighted transition-colors hover:text-(--ui-primary)"
          >
            {{ docsLabel }}
            <UIcon
              name="i-lucide-chevron-right"
              class="size-3.5"
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
