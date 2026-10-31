import { createApp } from 'vue';
import { useDark } from '@vueuse/core';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import App from './App.vue';
import './style.css';

// The theme: `dark` on <html>, from the `vueuse-color-scheme` key the Lab's color mode
// writes (its changes arrive as storage events), or from the system on `auto`.
useDark();

// The "Vue DnD Kit" devtools tab: its Vite plugin (vite.config.ts) makes the page report to
// it before this runs, in development only. Without the plugin: `app.use(DnDDevtools)`.
createApp(App).mount('#app');
