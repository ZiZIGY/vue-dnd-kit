import {
  addComponent,
  addImportsSources,
  addPlugin,
  createResolver,
  defineNuxtModule,
  resolvePath,
} from '@nuxt/kit';

import { findExports } from 'mlly';
import { readFile } from 'node:fs/promises';

// Components registered via addComponent so they work in templates without import.
const COMPONENTS = ['DnDProvider', 'DragPreview'];

export default defineNuxtModule({
  meta: {
    name: '@vue-dnd-kit/nuxt',
    configKey: 'vueDndKit',
    compatibility: {
      nuxt: '^4.0.0',
    },
  },
  defaults: {},
  async setup() {
    const resolver = createResolver(import.meta.url);

    addPlugin(resolver.resolve('./runtime/plugin.client'));

    // Dynamically resolve all public exports from @vue-dnd-kit/core.
    const entryPath = await resolvePath('@vue-dnd-kit/core');
    const source = await readFile(entryPath, 'utf-8');

    const allExports = findExports(source)
      .flatMap((e) => (e.names?.length ? e.names : e.name ? [e.name] : []))
      .filter((n) => n !== 'default' && !n.startsWith('_'));

    // Register components through Nuxt's component system so they resolve in templates.
    for (const name of COMPONENTS) {
      if (allExports.includes(name)) {
        addComponent({
          name,
          export: name,
          filePath: '@vue-dnd-kit/core',
        });
      }
    }

    // Register composables and utilities for auto-import in <script setup>.
    addImportsSources({
      from: '@vue-dnd-kit/core',
      imports: allExports.filter((n) => !COMPONENTS.includes(n)),
    });
  },
});
