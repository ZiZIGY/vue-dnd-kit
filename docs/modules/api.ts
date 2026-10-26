/**
 * The API reference, read from the library's types (`packages/core/src/types/*.ts`) at
 * build time: every exported interface with its members, their types and JSDoc. The
 * reference can't drift from the code.
 *
 * English comes from the JSDoc; translations from `i18n/api/<locale>/<file>.json`
 * (`"Interface.member": { source, text }`). A translation counts only while its `source` is
 * the hash of the current English: an outdated one shows the English until it is redone.
 *
 * Generates `#api`: `api[name] = { description, members: [{ name, type, optional, reactive, description }] }`,
 * and `translations[locale]()`, the up-to-date texts of a language (`"Interface.member": "…"`).
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { addTemplate, createResolver, defineNuxtModule, updateTemplates } from '@nuxt/kit';
import { DEFAULT_LOCALE, LOCALES } from '../i18n/locales';
import { sourceHash } from '../tools/source';
import { apiTexts, readTypes, type ApiTranslation } from '../tools/types-reader';
import { watchDirs } from '../tools/watch';

export type { ApiEntry, ApiMember } from '../tools/types-reader';

export default defineNuxtModule({
  meta: { name: 'docs-api' },
  setup(_, nuxt) {
    const { resolve: resolvePath } = createResolver(import.meta.url);
    const typesDir = resolve(resolvePath('..'), '../packages/core/src/types');
    const translationsDir = resolve(resolvePath('..'), 'i18n/api');
    const locales = LOCALES.map(({ code }) => code).filter((code) => code !== DEFAULT_LOCALE);

    /** The translations of a language that still match the English. */
    const translationsOf = (code: string) => {
      const dir = join(translationsDir, code);
      if (!existsSync(dir)) return {};
      const current = Object.fromEntries(apiTexts(readTypes(typesDir)).map(({ key, text }) => [key, sourceHash(text)]));
      const words: Record<string, string> = {};
      for (const file of readdirSync(dir).filter((name) => name.endsWith('.json'))) {
        const texts = JSON.parse(readFileSync(join(dir, file), 'utf8')) as Record<string, ApiTranslation>;
        for (const [key, { source, text }] of Object.entries(texts)) {
          if (text && current[key] === source) words[key] = text;
        }
      }
      return words;
    };

    const template = addTemplate({
      filename: 'api/index.mjs',
      getContents: () =>
        [
          `export const api = ${JSON.stringify(readTypes(typesDir))};`,
          'export const translations = {',
          ...locales.map((code) => `  ${JSON.stringify(code)}: () => import(${JSON.stringify(`./${code}.mjs`)}),`),
          '};',
          '',
        ].join('\n'),
    });
    for (const code of locales) {
      addTemplate({
        filename: `api/${code}.mjs`,
        getContents: () => `export default ${JSON.stringify(translationsOf(code))};\n`,
      });
    }
    addTemplate({
      filename: 'api/index.d.mts',
      getContents: () =>
        [
          "export type { ApiEntry, ApiMember } from '../../modules/api';",
          "import type { ApiEntry } from '../../modules/api';",
          'export declare const api: Record<string, ApiEntry>;',
          'export declare const translations: Record<string, () => Promise<{ default: Record<string, string> }>>;',
        ].join('\n'),
    });
    nuxt.options.alias['#api'] = template.dst;

    watchDirs('docs-api-watch', [typesDir, translationsDir], () =>
      updateTemplates({ filter: (entry) => entry.filename.startsWith('api/') }),
    );
  },
});
