/**
 * Source code in the docs' colours: Shiki with both themes as CSS variables (`lab.css`
 * picks one by the colour mode). Loaded the first time code is shown.
 */

import type { HighlighterCore } from 'shiki/core';
import { codeDark, codeLight } from './codeThemes';

let highlighter: Promise<HighlighterCore> | null = null;

const load = () =>
  (highlighter ??= (async () => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }] = await Promise.all([
      import('shiki/core'),
      import('shiki/engine/javascript'),
    ]);
    return createHighlighterCore({
      themes: [codeLight, codeDark],
      langs: [import('shiki/langs/vue.mjs'), import('shiki/langs/typescript.mjs'), import('shiki/langs/css.mjs')],
      engine: createJavaScriptRegexEngine(),
    });
  })());

const langOf = (path: string) => (path.endsWith('.vue') ? 'vue' : path.endsWith('.css') ? 'css' : 'typescript');

export const highlight = async (code: string, path: string): Promise<string> =>
  (await load()).codeToHtml(code, {
    lang: langOf(path),
    themes: { light: 'dnd-light', dark: 'dnd-dark' },
    defaultColor: false,
  });
