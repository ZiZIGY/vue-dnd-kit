<script setup lang="ts">
  import { useData } from 'vitepress';
  import { Icon } from '@iconify/vue';
  import { BackgroundLens } from './BackgroundLens';

  const { frontmatter } = useData();
  const hero = frontmatter.value.hero;
  const actions = hero?.actions ?? [];

  const logoUrl =
    'https://raw.githubusercontent.com/ZiZIGY/vue-dnd-kit/refs/heads/v2/public/logo.svg';

  const features = [
    {
      title: 'High Performance',
      description:
        'Optimized for smooth interactions even with large lists and complex interfaces',
      icon: 'mdi:rocket-launch',
    },
    {
      title: 'Composable API',
      description:
        "Built with Vue 3's Composition API for maximum flexibility and reusability",
      icon: 'mdi:puzzle-outline',
    },
    {
      title: 'Accessible',
      description:
        'Full keyboard navigation and screen reader support for inclusive interfaces',
      icon: 'mdi:accessibility',
    },
    {
      title: 'Extensible',
      description:
        'Create custom drag overlays, sensors, and collision detection algorithms',
      icon: 'mdi:wrench',
    },
    {
      title: 'Precise Control',
      description:
        'Fine-grained control over drag start, move, and drop behaviors',
      icon: 'mdi:target',
    },
    {
      title: 'Lightweight',
      description: 'Minimal bundle size impact with no external dependencies',
      icon: 'mdi:package-variant',
    },
  ];
</script>

<template>
  <div class="VDndHome relative">
    <BackgroundLens class="fixed! inset-0 -z-20" />
    <div class="container mx-auto px-6 md:px-12">
      <div class="VDndHome__hero glass-card rounded-4xl">
        <div class="VDndHome__hero-inner">
          <div class="VDndHome__hero-layout">
            <div class="VDndHome__hero-text">
              <h1 class="VDndHome__title">
                <span
                  v-if="hero?.name"
                  class="accent"
                  >{{ hero.name }}</span
                >
                <span v-if="hero?.text"> — {{ hero.text }}</span>
              </h1>
              <p
                v-if="hero?.tagline"
                class="VDndHome__tagline"
              >
                {{ hero.tagline }}
              </p>
              <p class="VDndHome__sub">
                A set of composables to build anything: custom drag overlays,
                containers that react to hover, selection zones with multi-drag
                out of the box — all with full control over rendering and
                behavior.
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
              <div
                class="VDndHome__logo-glow"
                aria-hidden="true"
              />
              <img
                :src="logoUrl"
                alt="Vue DnD Kit"
                class="VDndHome__logo-img"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Градиент для иконок фич с переливом (SMIL) -->
      <svg
        class="absolute w-0 h-0"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="featureIconGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              stop-color="#42b883"
            >
              <animate
                attributeName="stop-color"
                values="#42b883;#5ab8c8;#9080d0;#e0a058;#42b883"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop
              offset="33%"
              stop-color="#5ab8c8"
            >
              <animate
                attributeName="stop-color"
                values="#5ab8c8;#9080d0;#e0a058;#42b883;#5ab8c8"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop
              offset="66%"
              stop-color="#9080d0"
            >
              <animate
                attributeName="stop-color"
                values="#9080d0;#e0a058;#42b883;#5ab8c8;#9080d0"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
            <stop
              offset="100%"
              stop-color="#e0a058"
            >
              <animate
                attributeName="stop-color"
                values="#e0a058;#42b883;#5ab8c8;#9080d0;#e0a058"
                dur="4s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
        </defs>
      </svg>

      <section
        class="VDndHome__features"
        aria-label="Features"
      >
        <div
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
              class="rainbow-text"
            />
          </div>
          <h3 class="VDndHome__feature-title">{{ feat.title }}</h3>
          <p class="VDndHome__feature-desc">{{ feat.description }}</p>
        </div>
      </section>
    </div>
  </div>
</template>
