export default defineNuxtConfig({
  modules: ['@vue-dnd-kit/nuxt'],
  vueDndKit: {
    autoImports: { modifiers: true },
  },
  devtools: { enabled: true },
  // The packages are linked from this repository (build them first): what they import of
  // each other resolves from here, as in an app that installed them (the devtools tab).
  vite: { resolve: { dedupe: ['vue', '@vue-dnd-kit/core', '@vue-dnd-kit/actions'] } },
  compatibilityDate: 'latest',
})
