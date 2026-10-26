import { addComponent, addImports, defineNuxtModule } from '@nuxt/kit';
import { resolveComponents, resolveImports, type ModuleOptions } from './resolve';
import { setupDevtools } from './devtools';

export type { AutoImportOptions, ModuleOptions } from './resolve';

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@vue-dnd-kit/nuxt',
    configKey: 'vueDndKit',
    compatibility: {
      nuxt: '^4.0.0',
    },
  },
  defaults: {
    prefix: '',
    components: true,
    autoImports: {
      composables: true,
      modifiers: false,
      collision: false,
      sensors: false,
      types: true,
    },
    devtools: true,
  },
  async setup(options, nuxt) {
    for (const component of resolveComponents(options)) addComponent(component);
    const imports = resolveImports(options);
    if (imports.length) addImports(imports);
    // The Nuxt DevTools tab, in development, when the app has @vue-dnd-kit/devtools.
    if (options.devtools !== false) await setupDevtools(nuxt);
  },
});
