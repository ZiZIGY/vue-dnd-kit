import DefaultTheme from 'vitepress/theme';
import VueDnDKitPlugin from '@vue-dnd-kit/core';
import Layout from './Layout.vue';
import './style.css';

export default {
  ...DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    app.use(VueDnDKitPlugin);
  },
};
