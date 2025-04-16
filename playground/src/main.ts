import './style.css';

import App from './App.vue';
import VueDnDKitPlugin from '@vue-dnd-kit/core';
import { createApp } from 'vue';
import router from './router';

const app = createApp(App);
app.use(VueDnDKitPlugin);
app.use(router);
app.mount('#app');
