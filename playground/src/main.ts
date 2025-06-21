import './style.css';

import App from './App.vue';
import VueDnDKitDevtools from '@vue-dnd-kit/devtools';
import VueDnDKitPlugin, { type IPluginOptions } from '@vue-dnd-kit/core';
import { createApp } from 'vue';

// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
  },
});

const app = createApp(App);
app.use(VueDnDKitPlugin, {
  defaultOverlay: {
    styles: {
      transition: 'none',
    },
  },
} as IPluginOptions);
app.use(VueDnDKitDevtools);
app.use(vuetify);
app.mount('#app');
