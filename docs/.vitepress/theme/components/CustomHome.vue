<script setup lang="ts">
  import { useData } from 'vitepress';
  import { BackgroundLens } from './BackgroundLens';

  const { frontmatter } = useData();
  const hero = frontmatter.value.hero;
  const actions = hero?.actions ?? [];
</script>

<template>
  <div class="VDndHome relative">
    <BackgroundLens class="fixed! inset-0 -z-20" />
    <div class="container mx-auto px-6 md:px-12">
      <div class="VDndHome__hero glass-card">
        <div class="VDndHome__hero-inner">
          <h1 class="VDndHome__title">
            <span
              v-if="hero?.name"
              class="accent"
            >{{ hero.name }}</span>
            <span v-if="hero?.text"> — {{ hero.text }}</span>
          </h1>
          <p
            v-if="hero?.tagline"
            class="VDndHome__tagline"
          >
            {{ hero.tagline }}
          </p>
          <div
            v-if="actions.length"
            class="VDndHome__actions"
          >
            <a
              v-for="action in actions"
              :key="action.link"
              :href="action.link"
              class="VDndHome__btn"
              :class="
                action.theme === 'brand'
                  ? 'VDndHome__btn--primary'
                  : 'VDndHome__btn--secondary'
              "
            >
              {{ action.text }}
            </a>
          </div>
        </div>
      </div>
      <div class="VDndHome__content glass-card">
        <div class="VDndHome__content-inner">
          <Content />
        </div>
      </div>
    </div>
  </div>
</template>
