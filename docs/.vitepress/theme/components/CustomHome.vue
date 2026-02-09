<script setup lang="ts">
  import { useData } from 'vitepress';
  import { BackgroundLens } from './BackgroundLens';

  const { frontmatter } = useData();
  const hero = frontmatter.value.hero;
  const actions = hero?.actions ?? [];

  const logoUrl =
    'https://raw.githubusercontent.com/ZiZIGY/vue-dnd-kit/refs/heads/v2/public/logo.svg';
</script>

<template>
  <div class="VDndHome relative">
    <BackgroundLens class="fixed! inset-0 -z-20" />
    <div class="container mx-auto px-6 md:px-12">
      <div class="VDndHome__hero glass-card">
        <div class="VDndHome__hero-inner">
          <div class="VDndHome__hero-layout">
            <div class="VDndHome__hero-text">
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
              <p class="VDndHome__sub">
                A set of composables to build anything: custom drag overlays, containers that react to hover, selection zones with multi-drag out of the box — all with full control over rendering and behavior.
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
            <div class="VDndHome__hero-logo">
              <div class="VDndHome__logo-glow" aria-hidden="true" />
              <img
                :src="logoUrl"
                alt="Vue DnD Kit"
                class="VDndHome__logo-img"
              />
            </div>
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
