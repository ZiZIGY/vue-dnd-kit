<script setup lang="ts">
  import { motion } from 'motion-v';
  import { useData, withBase } from 'vitepress';
  import { BackgroundLens } from './BackgroundLens';

  const { frontmatter, theme } = useData();

  const actionHref = (link: string) => {
    return link.startsWith('http') ? link : withBase(link);
  };
  const hero = frontmatter.value.hero ?? {};
  const actions = hero.actions ?? [];
  const features = frontmatter.value.features ?? [];

  const secondLogoUrl =
    'https://raw.githubusercontent.com/ZiZIGY/vue-dnd-kit/refs/heads/v2/public/logo-v2.svg';

  const heroTransition = {
    type: 'spring' as const,
    stiffness: 120,
    damping: 24,
  };
  const heroStagger = 0.08;
</script>

<template>
  <motion.div
    class="VDndHome relative"
    :initial="{ opacity: 0 }"
    :animate="{ opacity: 1 }"
    :transition="{ duration: 0.4 }"
  >
    <BackgroundLens class="fixed! inset-0 -z-20" />
    <motion.main
      class="container mx-auto px-6 md:px-12"
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{ duration: 0.5, delay: 0.1 }"
    >
      <motion.section
        class="VDndHome__hero glass-card rounded-4xl"
        :initial="{ opacity: 0, y: 24 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ ...heroTransition, delay: 0.15 }"
      >
        <div class="VDndHome__hero-inner">
          <div class="VDndHome__hero-layout">
            <header class="VDndHome__hero-text">
              <motion.h1
                class="VDndHome__title"
                :initial="{ opacity: 0, y: 16 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ ...heroTransition, delay: 0.25 }"
              >
                <span
                  v-if="hero.name"
                  class="accent"
                >
                  {{ hero.name }}
                </span>
                <span v-if="hero.text"> — {{ hero.text }}</span>
              </motion.h1>
              <motion.p
                v-if="hero.tagline"
                class="VDndHome__tagline"
                :initial="{ opacity: 0, y: 12 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ ...heroTransition, delay: 0.25 + heroStagger }"
              >
                {{ hero.tagline }}
              </motion.p>
              <motion.p
                v-if="hero.sub"
                class="VDndHome__sub"
                :initial="{ opacity: 0, y: 12 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ ...heroTransition, delay: 0.25 + heroStagger * 2 }"
              >
                {{ hero.sub }}
              </motion.p>
              <motion.nav
                v-if="actions.length"
                class="VDndHome__actions"
                aria-label="Main"
                :initial="{ opacity: 0, y: 12 }"
                :animate="{ opacity: 1, y: 0 }"
                :transition="{ ...heroTransition, delay: 0.25 + heroStagger * 3 }"
              >
                <a
                  v-for="action in actions"
                  :key="action.link"
                  :href="actionHref(action.link)"
                  class="glass-btn"
                  :class="action.theme === 'brand' ? 'glass-btn--primary' : ''"
                >
                  {{ action.text }}
                </a>
              </motion.nav>
            </header>
            <motion.div
              class="VDndHome__hero-logo"
              aria-hidden="true"
              :initial="{ opacity: 0, scale: 0.96 }"
              :animate="{ opacity: 1, scale: 1 }"
              :transition="{ ...heroTransition, delay: 0.35 }"
            >
              <div class="VDndHome__logo-glow" />
              <img
                :src="secondLogoUrl"
                alt="Vue DnD Kit"
                class="VDndHome__logo-img"
              />
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section
        v-if="features.length"
        class="VDndHome__features"
        aria-label="Features"
      >
        <motion.article
          v-for="(feat, i) in features"
          :key="i"
          class="VDndHome__feature-card glass-card rounded-4xl"
          :initial="{ opacity: 0, y: 20 }"
          :while-in-view="{ opacity: 1, y: 0 }"
          :transition="{
            type: 'spring' as const,
            stiffness: 100,
            damping: 20,
            delay: Number(i) * 0.08,
          }"
          :in-view-options="{ once: true, margin: '-40px' }"
        >
          <span
            class="VDndHome__feature-icon"
            aria-hidden="true"
          >
            {{ feat.icon }}
          </span>
          <h3 class="VDndHome__feature-title">{{ feat.title }}</h3>
          <p class="VDndHome__feature-desc">{{ feat.description }}</p>
        </motion.article>
      </motion.section>
    </motion.main>
  </motion.div>
</template>
