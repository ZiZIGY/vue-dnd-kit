import { createApp } from 'vue';
import { DnDDevtools } from '@vue-dnd-kit/devtools';
import App from './App.vue';
import './style.css';

const app = createApp(App);
// The "Vue DnD Kit" inspector and timeline in the Vue DevTools (the browser extension, or
// `yarn dev:devtools`). Development only: production builds drop it.
if (import.meta.env.DEV) app.use(DnDDevtools);
app.mount('#app');
