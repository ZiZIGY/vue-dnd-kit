import DefaultTheme from 'vitepress/theme';
import VueDnDKitDevtools from '@vue-dnd-kit/devtools';
import VueDnDKitPlugin from '@vue-dnd-kit/core';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.use(VueDnDKitPlugin);
    app.use(VueDnDKitDevtools);
  },
};
