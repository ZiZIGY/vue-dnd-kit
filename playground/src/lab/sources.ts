/**
 * What the Lab shows of a demo besides the demo: its source files, and the e2e specs that
 * open it. Read as text on demand (Vite's `?raw`): nothing loads until a tab asks.
 */

import type { DemoEntry } from '../catalog';

type Load = () => Promise<string>;

/** A glob key (relative to this file) as a path in the playground: `src/demos/TreeDemo.vue`. */
const BASE = 'file:///playground/src/lab/';
const inPlayground = (key: string) => new URL(key, BASE).pathname.replace('/playground/', '');

const files = new Map<string, Load>(
  Object.entries({
    ...import.meta.glob<string>(['../demos/**/*.{vue,ts}', '../components/**/*.{vue,ts}', '../*.ts', '!../{main,catalog}.ts'], {
      query: '?raw',
      import: 'default',
    }),
    ...import.meta.glob<string>('../../kits/**/*.{vue,ts}', { query: '?raw', import: 'default' }),
  }).map(([key, load]) => [inPlayground(key), load]),
);

const specs = Object.entries(import.meta.glob<string>('../../e2e/*.spec.ts', { query: '?raw', import: 'default' })).map(
  ([key, load]) => ({ file: inPlayground(key), load }),
);

export interface SourceFile {
  path: string;
  code: string;
}

/** Relative imports of a file: `./Row.vue`, `../data`. */
const importsOf = (code: string): string[] =>
  [...code.matchAll(/(?:from\s*|import\s*\(\s*)['"](\.{1,2}\/[^'"]+)['"]/g)].map((match) => match[1]!);

/** The file a relative import of `from` names, if the playground has it (`../data` → `src/data.ts`). */
const resolve = (from: string, specifier: string): string | null => {
  const path = new URL(specifier, `file:///playground/${from}`).pathname.replace('/playground/', '');
  return [path, `${path}.ts`, `${path}/index.ts`].find((candidate) => files.has(candidate)) ?? null;
};

const entryFile = (entry: DemoEntry) =>
  entry.file ? `src/demos/${entry.file}` : `kits/${/kits\/([\w-]+)\.html/.exec(entry.page ?? '')?.[1]}/App.vue`;

/** At most this many files: the demo, then what it imports, level by level. */
const MAX_FILES = 14;

/** The demo's file and the playground files it uses (its rows, overlays, data), demo first. */
export const sourcesOf = async (entry: DemoEntry): Promise<SourceFile[]> => {
  const result: SourceFile[] = [];
  const seen = new Set<string>();
  let level = [entryFile(entry)];
  while (level.length && result.length < MAX_FILES) {
    const paths = level.filter((path) => !seen.has(path) && files.has(path)).slice(0, MAX_FILES - result.length);
    paths.forEach((path) => seen.add(path));
    const loaded = await Promise.all(paths.map(async (path) => ({ path, code: await files.get(path)!() })));
    result.push(...loaded);
    level = loaded.flatMap(({ path, code }) => importsOf(code).flatMap((specifier) => resolve(path, specifier) ?? []));
  }
  return result;
};

export interface SpecTest {
  title: string;
  /** Runs in the `mobile` project only (tagged `@touch`). */
  touch: boolean;
}

export interface SpecGroup {
  /** The `test.describe` it is in; `null` before the first one. */
  title: string | null;
  tests: SpecTest[];
}

export interface Spec {
  file: string;
  groups: SpecGroup[];
  count: number;
}

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Every `test.describe(…)` and `test(…)` title, in order: tests go under the describe before them. */
const parse = (file: string, text: string): Spec => {
  const groups: SpecGroup[] = [];
  const title = /\btest(\.describe)?(?:\.(?:only|skip|fixme))?\(\s*(['"`])((?:\\.|(?!\2)[^\\])*)\2/g;
  for (const [, describe, , name] of text.matchAll(title)) {
    if (describe) groups.push({ title: name!, tests: [] });
    else {
      if (!groups.length) groups.push({ title: null, tests: [] });
      groups.at(-1)!.tests.push({ title: name!, touch: name!.includes('@touch') });
    }
  }
  const kept = groups.filter((group) => group.tests.length);
  return { file, groups: kept, count: kept.reduce((sum, group) => sum + group.tests.length, 0) };
};

/** The specs that open the demo (its `/demo/#id`, or its own page), with their tests. */
export const testsOf = async (entry: DemoEntry): Promise<Spec[]> => {
  const opens = entry.page
    ? new RegExp(escape(entry.page))
    : new RegExp(`/demo/(?:\\?[^#'"\`]*)?#${escape(entry.id)}(?![\\w-])`);
  const loaded = await Promise.all(specs.map(async ({ file, load }) => ({ file, text: await load() })));
  return loaded.filter(({ text }) => opens.test(text)).map(({ file, text }) => parse(file, text));
};
