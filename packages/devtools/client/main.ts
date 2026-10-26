/**
 * The devtools tab: a Vue app of its own, served by the dev server next to the app it
 * inspects (`src/vite.ts`, the Nuxt module) and talking to it over the page's channel
 * (`lib/connection.ts`). It runs in the Nuxt DevTools, the Vue DevTools of
 * `vite-plugin-vue-devtools`, or a window of its own.
 */

import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

createApp(App).mount('#app');
