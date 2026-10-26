import { resolve } from 'node:path';
import { addVitePlugin } from '@nuxt/kit';

/**
 * Calls `onChange` when a file under `dirs` is added, changed or removed while the dev server
 * runs. Nuxt's own watcher (the `builder:watch` hook) covers `app/` only, and the folders the
 * docs' modules read (`examples/`, `content/`, `i18n/`, the library's types) live beside it.
 */
export const watchDirs = (name: string, dirs: string[], onChange: (path: string, event: string) => unknown) =>
  addVitePlugin(
    {
      name,
      apply: 'serve',
      configureServer(server) {
        server.watcher.add(dirs);
        server.watcher.on('all', (event, file) => {
          const path = resolve(file);
          if (dirs.some((dir) => path.startsWith(dir))) onChange(path, event);
        });
      },
    },
    { server: false },
  );
