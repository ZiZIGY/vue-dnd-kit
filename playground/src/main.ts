import './style.css';

import App from './App.vue';
import VueDnDKitDevtools from '@vue-dnd-kit/devtools';
import VueDnDKitPlugin, { type IPluginOptions } from '@vue-dnd-kit/core';
import { createApp } from 'vue';
import router from './router';

const app = createApp(App);
app.use(VueDnDKitPlugin, {
  defaultOverlay: {
    styles: {
      opacity: 0.8,
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'none',
    },
  },
} as IPluginOptions);
app.use(router);
app.use(VueDnDKitDevtools);
app.mount('#app');
