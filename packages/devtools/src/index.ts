import { App } from 'vue';
import { setupDevtools } from './devtools';

function setupDndKitDevtools(app: App) {
  if (process.env.NODE_ENV === 'development' || __VUE_PROD_DEVTOOLS__) {
    return setupDevtools(app);
  }
  return {};
}

export default setupDndKitDevtools;

declare global {
  var __VUE_PROD_DEVTOOLS__: boolean;
}
