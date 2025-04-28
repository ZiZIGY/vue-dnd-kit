import DefaultTheme from 'vitepress/theme';
import VueDnDKitPlugin from '@vue-dnd-kit/core';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(VueDnDKitPlugin);
  },
};
