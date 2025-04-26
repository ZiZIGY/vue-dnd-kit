import { App } from 'vue';
import { setupDevtools } from './devtools';

export function setupDndKitDevtools(app: App) {
  if (process.env.NODE_ENV === 'development' || __VUE_PROD_DEVTOOLS__) {
    console.log('Инициализация Vue DnD Kit DevTools');
    return setupDevtools(app);
  }
  return {};
}

export default setupDndKitDevtools;

// Для поддержки сборщиков
export * from './devtools';

// Для типов TypeScript
declare global {
  var __VUE_PROD_DEVTOOLS__: boolean;
}
