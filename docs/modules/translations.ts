/**
 * Translated pages whose English has changed since: their `source:` is no longer the hash of
 * the English page (`tools/source.ts`). Read from the files at build time, so a page knows it
 * is outdated even when its own file hasn't changed.
 *
 * Generates `#translations`: `outdated`, the stems of those pages (`ru/docs/2.guides/07.overlay`).
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { addTemplate, defineNuxtModule, updateTemplates } from '@nuxt/kit';
import { DEFAULT_LOCALE, LOCALES } from '../i18n/locales';
import { sourceHash, sourceOf } from '../tools/source';
import { watchDirs } from '../tools/watch';

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });

export default defineNuxtModule({
  meta: { name: 'docs-translations' },
  setup(_, nuxt) {
    const content = resolve(nuxt.options.rootDir, 'content');

    const outdated = () =>
      LOCALES.filter(({ code }) => code !== DEFAULT_LOCALE && existsSync(join(content, code))).flatMap(({ code }) =>
        walk(join(content, code))
          .filter((path) => path.endsWith('.md'))
          .filter((path) => {
            const english = join(content, DEFAULT_LOCALE, relative(join(content, code), path));
            if (!existsSync(english)) return false;
            return sourceOf(readFileSync(path, 'utf8'), '.md') !== sourceHash(readFileSync(english, 'utf8'));
          })
          .map((path) => relative(content, path).replaceAll('\\', '/').replace(/\.md$/, '')),
      );

    /** The list as last written into the template. */
    let last = '';
    const template = addTemplate({
      filename: 'translations.mjs',
      getContents: () => `export const outdated = ${(last = JSON.stringify(outdated()))};\n`,
    });
    addTemplate({
      filename: 'translations.d.mts',
      getContents: () => 'export declare const outdated: string[];\n',
    });
    nuxt.options.alias['#translations'] = template.dst;

    // Only when the list changes: a new template reloads the page, and saving a page shouldn't.
    watchDirs('docs-translations-watch', [content], (path) => {
      if (!path.endsWith('.md')) return;
      const current = JSON.stringify(outdated());
      if (current === last) return;
      last = current;
      return updateTemplates({ filter: (entry) => entry.filename === 'translations.mjs' });
    });
  },
});
