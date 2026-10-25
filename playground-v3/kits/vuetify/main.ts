import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';
import 'vuetify/styles';
import App from './App.vue';

// Components are imported where they are used; SVG icons need no icon font.
const vuetify = createVuetify({
  icons: { defaultSet: 'mdi', aliases, sets: { mdi } },
});

createApp(App).use(vuetify).mount('#app');
