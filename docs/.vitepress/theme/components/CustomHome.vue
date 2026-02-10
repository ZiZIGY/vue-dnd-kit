<script setup lang="ts">
  import { useData } from 'vitepress';
  import { Icon } from '@iconify/vue';
  import { BackgroundLens } from './BackgroundLens';

  const { frontmatter } = useData();
  const hero = frontmatter.value.hero ?? {};
  const actions = hero.actions ?? [];
  const features = frontmatter.value.features ?? [];

  const logoUrl =
    'https://raw.githubusercontent.com/ZiZIGY/vue-dnd-kit/refs/heads/v2/public/logo.svg';
</script>

<template>
  <div class="VDndHome relative">
    <BackgroundLens class="fixed! inset-0 -z-20" />
    <main class="container mx-auto px-6 md:px-12">
      <section class="VDndHome__hero glass-card rounded-4xl">
        <div class="VDndHome__hero-inner">
          <div class="VDndHome__hero-layout">
            <header class="VDndHome__hero-text">
              <h1 class="VDndHome__title">
                <span
                  v-if="hero.name"
                  class="accent"
                >
                  {{ hero.name }}
                </span>
                <span v-if="hero.text"> — {{ hero.text }}</span>
              </h1>
              <p
                v-if="hero.tagline"
                class="VDndHome__tagline"
              >
                {{ hero.tagline }}
              </p>
              <p
                v-if="hero.sub"
                class="VDndHome__sub"
              >
                {{ hero.sub }}
              </p>
              <nav
                v-if="actions.length"
                class="VDndHome__actions"
                aria-label="Main"
              >
                <a
                  v-for="action in actions"
                  :key="action.link"
                  :href="action.link"
                  class="glass-btn"
                  :class="action.theme === 'brand' ? 'glass-btn--primary' : ''"
                >
                  {{ action.text }}
                </a>
              </nav>
            </header>
            <div
              class="VDndHome__hero-logo"
              aria-hidden="true"
            >
              <div class="VDndHome__logo-glow" />
              <img
                :src="logoUrl"
                alt="Vue DnD Kit"
                class="VDndHome__logo-img"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        v-if="features.length"
        class="VDndHome__features"
        aria-label="Features"
      >
        <article
          v-for="(feat, i) in features"
          :key="i"
          class="VDndHome__feature-card glass-card rounded-4xl"
        >
          <div
            class="VDndHome__feature-icon"
            aria-hidden="true"
          >
            <Icon
              :icon="feat.icon"
              width="28"
              height="28"
            />
          </div>
          <h3 class="VDndHome__feature-title">{{ feat.title }}</h3>
          <p class="VDndHome__feature-desc">{{ feat.description }}</p>
        </article>
      </section>
    </main>
  </div>
</template>
