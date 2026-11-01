<script setup lang="ts">
import type { Artwork } from './design';

// Pictures for image layers, drawn here so the example needs no files: they fill the
// layer's box at any size and crop like a photo would.
defineProps<{ art: Artwork }>();
</script>

<template>
  <svg class="art" viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <template v-if="art === 'mountains'">
      <rect width="160" height="120" fill="#c7d2fe" />
      <circle cx="116" cy="36" r="14" fill="#fef3c7" />
      <path d="M0 120V80l38-34 34 38 32-32 56 44v24z" fill="#a5b4fc" />
      <path d="M0 120V96l44-28 42 34 36-26 38 26v18z" fill="#6366f1" />
      <path d="M0 120v-10l50-16 48 18 62-14v22z" fill="#3730a3" />
    </template>
    <template v-else-if="art === 'portrait'">
      <rect width="160" height="120" fill="#fdba74" />
      <path d="M28 120c0-26 22-40 52-40s52 14 52 40z" fill="#ea580c" />
      <circle cx="80" cy="52" r="22" fill="#9a3412" />
    </template>
    <template v-else>
      <rect width="160" height="120" fill="#fecdd3" />
      <circle cx="52" cy="42" r="15" fill="#fff1f2" />
      <path d="M0 82q50-22 100 0t60-6v44H0z" fill="#fb7185" />
      <path d="M0 100q60-22 120 0t40-4v24H0z" fill="#be123c" />
    </template>
  </svg>
</template>

<style scoped>
.art {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
