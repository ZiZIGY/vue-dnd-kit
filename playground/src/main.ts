import './style.css';

import App from './App.vue';
import VueDnDKitDevtools from '@vue-dnd-kit/devtools';
import VueDnDKitPlugin, { type IPluginOptions } from '@vue-dnd-kit/core';
import { createApp } from 'vue';

const app = createApp(App);
app.use(VueDnDKitPlugin, {
  defaultOverlay: {
    styles: {
      transition: 'none',
    },
  },
} as IPluginOptions);
app.use(VueDnDKitDevtools);
app.mount('#app');
