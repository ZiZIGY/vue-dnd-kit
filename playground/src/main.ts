import './style.css';

import App from './App.vue';
import VueDnDKitPlugin from '@vue-dnd-kit/core';
import { createApp } from 'vue';

const app = createApp(App);
app.use(VueDnDKitPlugin);
app.mount('#app');
