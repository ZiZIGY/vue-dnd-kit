import { addComponent, addImports, defineNuxtModule } from '@nuxt/kit';
import { resolveComponents, resolveImports, type ModuleOptions } from './resolve';

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
  },
  setup(options) {
    for (const component of resolveComponents(options)) addComponent(component);
    const imports = resolveImports(options);
    if (imports.length) addImports(imports);
  },
});
