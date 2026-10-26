import { createApp } from 'vue';
import App from './App.vue';
import './style.css';

// The "Vue DnD Kit" devtools tab: its Vite plugin (vite.config.ts) makes the page report to
// it before this runs, in development only. Without the plugin: `app.use(DnDDevtools)`.
createApp(App).mount('#app');
