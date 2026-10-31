import { createApp } from 'vue';
import ui from '@nuxt/ui/vue-plugin';
import '@fontsource-variable/geist';
import '@fontsource-variable/geist-mono';
import Lab from './Lab.vue';
import './lab.css';

// The Lab: every demo in a frame of the demo page (`/demo/#<id>`), with its code, its tests
// and the devtools around it.
createApp(Lab).use(ui).mount('#app');
