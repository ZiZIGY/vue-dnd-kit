export default defineNuxtConfig({
  modules: ['@vue-dnd-kit/nuxt'],
  vueDndKit: {
    autoImports: { modifiers: true },
  },
  devtools: { enabled: true },
  compatibilityDate: 'latest',
})
