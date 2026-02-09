<script setup lang="ts">
import { useData } from 'vitepress'

const { frontmatter } = useData()
const hero = frontmatter.value.hero
const actions = hero?.actions ?? []
</script>

<template>
  <div class="VDndHome">
    <div class="VDndHome__hero">
      <h1 class="VDndHome__title">
        <span v-if="hero?.name" class="accent">{{ hero.name }}</span>
        <span v-if="hero?.text"> — {{ hero.text }}</span>
      </h1>
      <p v-if="hero?.tagline" class="VDndHome__tagline">{{ hero.tagline }}</p>
      <div v-if="actions.length" class="VDndHome__actions">
        <a
          v-for="(action, i) in actions"
          :key="action.link"
          :href="action.link"
          class="VDndHome__btn"
          :class="action.theme === 'brand' ? 'VDndHome__btn--primary' : 'VDndHome__btn--secondary'"
        >
          {{ action.text }}
        </a>
      </div>
    </div>
    <div class="VDndHome__content">
      <Content />
    </div>
  </div>
</template>
