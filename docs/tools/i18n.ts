/**
 * The translations of the docs: what is missing or outdated, and the API texts to translate.
 * English is the source. How to translate: `i18n/TRANSLATING.md`.
 *
 *   node tools/i18n.ts status              every language: pages, API texts, UI strings
 *   node tools/i18n.ts status <code>       that language: the files to (re)translate, with their `source`
 *   node tools/i18n.ts prepare <code>      writes the API texts to (re)translate into `i18n/api/<code>/`
 *   node tools/i18n.ts headings <file>     the ids of a page's headings, to keep in its translations
 *
 * Runs on Node 22.18+ (TypeScript without a build step).
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import Slugger from 'github-slugger';
import { DEFAULT_LOCALE, LOCALES } from '../i18n/locales.ts';
import { sourceHash, sourceOf } from './source.ts';
import { apiTexts, readTypes, type ApiTranslation } from './types-reader.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const content = join(root, 'content');
const typesDir = join(root, '../packages/core/src/types');
const apiDir = (code: string) => join(root, 'i18n/api', code);

const read = (path: string) => readFileSync(path, 'utf8');
const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
const posix = (path: string) => path.replaceAll('\\', '/');

/* --- Pages: content/<code>/** mirrors content/en/**, each file with the `source:` it was made from. */

type State = 'done' | 'outdated' | 'missing';

/** The English pages and navigation files, relative to `content/en`. */
const sourceFiles = () =>
  walk(join(content, DEFAULT_LOCALE))
    .filter((path) => /\.(md|yml)$/.test(path))
    .map((path) => posix(relative(join(content, DEFAULT_LOCALE), path)))
    .sort();

const pageState = (code: string, file: string): { state: State; source: string } => {
  const source = sourceHash(read(join(content, DEFAULT_LOCALE, file)));
  const path = join(content, code, file);
  if (!existsSync(path)) return { state: 'missing', source };
  return { state: sourceOf(read(path), extname(file)) === source ? 'done' : 'outdated', source };
};

/* --- API texts: i18n/api/<code>/<types file>.json, `"Name.member": { source, text }`. */

const readApi = (code: string): Record<string, ApiTranslation> => {
  const dir = apiDir(code);
  if (!existsSync(dir)) return {};
  return Object.assign({}, ...readdirSync(dir).filter((name) => name.endsWith('.json')).map((name) => JSON.parse(read(join(dir, name)))));
};

const apiState = (code: string) => {
  const done = readApi(code);
  return apiTexts(readTypes(typesDir)).map((entry) => {
    const source = sourceHash(entry.text);
    const translation = done[entry.key];
    const state: State = !translation?.text ? 'missing' : translation.source === source ? 'done' : 'outdated';
    return { ...entry, source, state, translation };
  });
};

/* --- UI strings: i18n/locales/<code>.json, the keys of en.json. */

const keysOf = (value: unknown, prefix = ''): string[] =>
  value && typeof value === 'object'
    ? Object.entries(value).flatMap(([key, child]) => keysOf(child, prefix ? `${prefix}.${key}` : key))
    : [prefix];

const uiMissing = (code: string) => {
  const english = keysOf(JSON.parse(read(join(root, 'i18n/locales/en.json'))));
  const path = join(root, `i18n/locales/${code}.json`);
  const own = new Set(existsSync(path) ? keysOf(JSON.parse(read(path))) : []);
  return { total: english.length, missing: english.filter((key) => !own.has(key)) };
};

/* --- Commands */

const count = (states: State[]) =>
  `${states.filter((state) => state === 'done').length}/${states.length}` +
  (states.includes('outdated') ? `, ${states.filter((state) => state === 'outdated').length} outdated` : '');

const status = (code?: string) => {
  const files = sourceFiles();
  if (!code) {
    console.log('lang  pages            API texts        UI strings');
    for (const { code } of LOCALES.filter(({ code }) => code !== DEFAULT_LOCALE)) {
      const pages = count(files.map((file) => pageState(code, file).state));
      const api = count(apiState(code).map(({ state }) => state));
      const ui = uiMissing(code);
      console.log(`${code.padEnd(6)}${pages.padEnd(17)}${api.padEnd(17)}${ui.total - ui.missing.length}/${ui.total}`);
    }
    return;
  }
  const pages = files.map((file) => ({ file, ...pageState(code, file) })).filter(({ state }) => state !== 'done');
  console.log(pages.length ? `Pages to translate (content/${code}/…, with \`source:\`):` : 'Pages: all up to date.');
  for (const { file, state, source } of pages) console.log(`  ${state.padEnd(9)}${file}  source: ${source}`);
  const api = apiState(code).filter(({ state }) => state !== 'done');
  const byFile = Object.entries(Object.groupBy(api, ({ file }) => file));
  console.log(api.length ? `API texts to translate (run \`prepare ${code}\`):` : 'API texts: all up to date.');
  for (const [file, texts] of byFile) console.log(`  i18n/api/${code}/${file}.json  ${texts!.length}`);
  const ui = uiMissing(code);
  console.log(ui.missing.length ? `UI strings missing in i18n/locales/${code}.json:` : 'UI strings: complete.');
  for (const key of ui.missing) console.log(`  ${key}`);
};

/** Rewrites `i18n/api/<code>/*.json`: done texts stay, the others get `en` and the new `source`. */
const prepare = (code: string) => {
  const dir = apiDir(code);
  mkdirSync(dir, { recursive: true });
  const groups = Object.groupBy(apiState(code), ({ file }) => file);
  for (const [file, texts] of Object.entries(groups)) {
    const data: Record<string, ApiTranslation> = {};
    for (const { key, text, source, state, translation } of texts!) {
      data[key] = state === 'done' ? { source, text: translation!.text } : { source, en: text, text: translation?.text ?? '' };
    }
    writeFileSync(join(dir, `${file}.json`), `${JSON.stringify(data, null, 2)}\n`);
    const todo = texts!.filter(({ state }) => state !== 'done').length;
    console.log(`i18n/api/${code}/${file}.json  ${todo ? `${todo} to translate` : 'up to date'}`);
  }
};

/** Heading ids as the Markdown parser makes them (github-slugger, see @nuxtjs/mdc's compiler). */
const headings = (file: string) => {
  const slugger = new Slugger();
  let fenced = false;
  for (const line of read(file).split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
    const match = !fenced && /^(#{2,6})\s+(.*?)\s*$/.exec(line);
    if (!match) continue;
    const text = match[2]!
      .replace(/\s*\{#[^}]*\}$/, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/`([^`]*)`/g, '$1')
      .replace(/\*\*([^*]*)\*\*/g, '$1');
    const id = slugger.slug(text).replace(/-+/g, '-').replace(/^-|-$/g, '').replace(/^(\d)/, '_$1');
    console.log(`${match[1]} ${text}  {#${id}}`);
  }
};

const [command, argument] = process.argv.slice(2);
const known = (code?: string) => {
  if (!code || code === DEFAULT_LOCALE || !LOCALES.some((locale) => locale.code === code)) {
    console.error(`Unknown language "${code ?? ''}". One of: ${LOCALES.map(({ code }) => code).filter((code) => code !== DEFAULT_LOCALE).join(', ')}.`);
    process.exit(1);
  }
  return code;
};

if (command === 'status') status(argument && known(argument));
else if (command === 'prepare') prepare(known(argument));
else if (command === 'headings' && argument) headings(argument);
else {
  console.log(read(fileURLToPath(import.meta.url)).match(/\/\*\*([\s\S]*?)\*\//)![1]!.replace(/^ \* ?/gm, '').trim());
  process.exit(command ? 1 : 0);
}
