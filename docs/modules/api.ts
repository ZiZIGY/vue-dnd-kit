/**
 * The API reference, read from the library's sources at build time (`tools/types-reader.ts`):
 * every exported interface of `packages/core/src/types/*.ts` with its members, their types and
 * JSDoc, and the signature and JSDoc of every function, component and value `index.ts`
 * exports. The reference can't drift from the code.
 *
 * English comes from the JSDoc; translations from `i18n/api/<locale>/<file>.json`
 * (`"Interface.member": { source, text }`). A translation counts only while its `source` is
 * the hash of the current English: an outdated one shows the English until it is redone.
 *
 * Generates `#api`:
 * - `api[name] = { description, members: [{ name, type, optional, reactive, description }] }`, the types;
 * - `signatures[name] = { kind, code, html, type, description }`, the exports, `html` their highlighted `code`;
 * - `translations[locale]()`, the up-to-date texts of a language (`"Interface.member": "…"`, `"makeDraggable": "…"`).
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { addTemplate, createResolver, defineNuxtModule, updateTemplates } from '@nuxt/kit';
import { createHighlighter } from 'shiki';
import { DEFAULT_LOCALE, LOCALES } from '../i18n/locales';
import { codeDark, codeLight } from '../shiki/themes';
import { sourceHash } from '../tools/source';
import { apiTexts, readApi, type ApiTranslation } from '../tools/types-reader';
import { watchDirs } from '../tools/watch';

export type { ApiEntry, ApiMember, ApiSignature } from '../tools/types-reader';

export default defineNuxtModule({
  meta: { name: 'docs-api' },
  async setup(_, nuxt) {
    const { resolve: resolvePath } = createResolver(import.meta.url);
    const srcDir = resolve(resolvePath('..'), '../packages/core/src');
    const translationsDir = resolve(resolvePath('..'), 'i18n/api');
    const locales = LOCALES.map(({ code }) => code).filter((code) => code !== DEFAULT_LOCALE);
    const highlighter = await createHighlighter({ themes: [codeLight, codeDark], langs: ['ts'] });

    /** The code of a signature, highlighted: the lines of Shiki's `<code>`, for a prose `<pre>`. */
    const highlight = (code: string) =>
      highlighter
        .codeToHtml(code, { lang: 'ts', themes: { light: 'dnd-light', dark: 'dnd-dark' }, defaultColor: false })
        .replace(/^[\s\S]*?<code>|<\/code>[\s\S]*$/g, '')
        // The lines are blocks (the prose `<pre>`): the line breaks between them would add empty ones.
        .replace(/<\/span>\n<span class="line">/g, '</span><span class="line">');

    /** What `#api` exports, as JSON: the types and the highlighted signatures. */
    const read = () => {
      const { types, signatures } = readApi(srcDir);
      const highlighted = Object.fromEntries(
        Object.entries(signatures).map(([name, { kind, file, code, type, description, deprecated }]) => [
          name,
          { kind, file, code, html: highlight(code), type, description, deprecated },
        ]),
      );
      return { types: JSON.stringify(types), signatures: JSON.stringify(highlighted) };
    };

    /** The translations of a language that still match the English. */
    const translationsOf = (code: string) => {
      const dir = join(translationsDir, code);
      if (!existsSync(dir)) return {};
      const current = Object.fromEntries(apiTexts(readApi(srcDir)).map(({ key, text }) => [key, sourceHash(text)]));
      const words: Record<string, string> = {};
      for (const file of readdirSync(dir).filter((name) => name.endsWith('.json'))) {
        const texts = JSON.parse(readFileSync(join(dir, file), 'utf8')) as Record<string, ApiTranslation>;
        for (const [key, { source, text }] of Object.entries(texts)) {
          if (text && current[key] === source) words[key] = text;
        }
      }
      return words;
    };

    /** The reference as last written: the library's other sources change without touching it. */
    let last = '';
    const template = addTemplate({
      filename: 'api/index.mjs',
      getContents: () => {
        const { types, signatures } = read();
        last = types + signatures;
        return [
          `export const api = ${types};`,
          `export const signatures = ${signatures};`,
          'export const translations = {',
          ...locales.map((code) => `  ${JSON.stringify(code)}: () => import(${JSON.stringify(`./${code}.mjs`)}),`),
          '};',
          '',
        ].join('\n');
      },
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
          "export type { ApiEntry, ApiMember, ApiSignature } from '../../modules/api';",
          "import type { ApiEntry, ApiSignature } from '../../modules/api';",
          'export declare const api: Record<string, ApiEntry>;',
          "export declare const signatures: Record<string, Omit<ApiSignature, 'problem' | 'source'> & { html: string }>;",
          'export declare const translations: Record<string, () => Promise<{ default: Record<string, string> }>>;',
          '',
        ].join('\n'),
    });
    nuxt.options.alias['#api'] = template.dst;

    // A translation, or a change of what the reference shows: not every edit of the library.
    watchDirs('docs-api-watch', [srcDir, translationsDir], (path) => {
      if (path.startsWith(srcDir)) {
        if (!path.endsWith('.ts') || path.endsWith('.test.ts')) return;
        const { types, signatures } = read();
        if (types + signatures === last) return;
      }
      return updateTemplates({ filter: (entry) => entry.filename.startsWith('api/') });
    });
  },
});
