import { defineNuxtPlugin } from '#app'

// .client suffix ensures this plugin only executes in the browser.
// All DOM operations in @vue-dnd-kit/core are already guarded by onMounted,
// but this file acts as the SSR boundary marker for the module.
export default defineNuxtPlugin(() => {})
