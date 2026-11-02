/**
 * Bundle size budget: what an app pays for typical imports of the library.
 *
 * Each scenario is bundled the way an app's production build does it: the built ESM entry
 * (`dist/index.js`), Rollup's tree-shaking, `vue` and `@vueuse/*` external,
 * `process.env.NODE_ENV` set to "production", minified by esbuild, then gzipped. A
 * scenario past its limit fails the run.
 *
 * The same imports are bundled from the sources too, to see which modules each one keeps:
 * a scenario fails when it keeps a module it has no use for (`forbidden`), e.g. plain
 * draggables carrying the sortable layer.
 *
 *   node scripts/size.mjs                  measure dist/ (build it first)
 *   node scripts/size.mjs --build          build, then measure
 *   node scripts/size.mjs --modules        also list each scenario's modules by size
 *   node scripts/size.mjs --out <dir>      also write each scenario's bundle (from the sources)
 */

import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { rollup } from 'rollup';
import { build, transform } from 'esbuild';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(root, 'dist/index.js');
const SRC = join(root, 'src/index.ts');

/**
 * `limit`: minified and gzipped bytes, about 10% above the sizes when it was set
 * (2026-11-02: 74.9/28.1, 133.0/48.6, 146.4/53.2, 158.1/57.3 KB).
 * `forbidden`: source paths (from `src/`) the scenario must not keep. A module may lend a
 * constant (up to `LENT` bytes, e.g. lists use the band trees nest with), not its code.
 */
const KB = 1024;
const LENT = 256;
const scenarios = [
  {
    // The provider runs the browser's drag and drop (`core/native/`, ~7 KB minified) in any
    // case: drags from outside the page and from the app's other windows need it from the start.
    name: 'draggable + droppable',
    imports: ['DnDProvider', 'makeDraggable', 'makeDroppable'],
    limit: { min: 82.5 * KB, gzip: 31 * KB },
    forbidden: ['sortable/', 'core/makeSelectionArea', 'core/makeDragArea', 'devtools/', 'core/devtoolsHook'],
  },
  {
    name: 'sortable list',
    imports: ['DnDProvider', 'makeSortableList', 'makeSortableItem'],
    limit: { min: 146.5 * KB, gzip: 53.5 * KB },
    forbidden: ['sortable/makeSortableTree', 'sortable/tree/', 'core/makeSelectionArea', 'core/makeDragArea', 'devtools/', 'core/devtoolsHook'],
  },
  {
    // The tree runs on the lists' machinery (`makeSortableList` lends it the context helpers).
    name: 'sortable tree',
    imports: ['DnDProvider', 'makeSortableTree', 'makeSortableItem'],
    limit: { min: 161 * KB, gzip: 58.5 * KB },
    forbidden: ['core/makeSelectionArea', 'core/makeDragArea', 'devtools/', 'core/devtoolsHook'],
  },
  {
    name: 'everything',
    imports: '*',
    limit: { min: 174 * KB, gzip: 63 * KB },
    // The devtools bridge is its own entry; the hook into it is for development builds.
    forbidden: ['devtools/', 'core/devtoolsHook'],
  },
];

const args = process.argv.slice(2);
const outIndex = args.indexOf('--out');
const outDir = outIndex >= 0 ? resolve(args[outIndex + 1]) : null;

if (args.includes('--build')) {
  const vite = await import('vite');
  await vite.build({ root, configFile: join(root, 'vite.config.ts'), logLevel: 'warn' });
}
if (!existsSync(DIST)) {
  console.error('dist/index.js is missing: build the library first (`yarn build`, or this script with --build).');
  process.exit(1);
}

const isFile = (path) => existsSync(path) && statSync(path).isFile();
const slash = (path) => path.replace(/\\/g, '/');

/** The scenario as an app's module: it uses (re-exports) what it imports. */
const entryPlugin = (scenario, target) => ({
  name: 'size:entry',
  resolveId: (source) => (source === '\0entry' ? source : null),
  load: (id) =>
    id === '\0entry'
      ? scenario.imports === '*'
        ? `export * from ${JSON.stringify(target)};`
        : `export { ${scenario.imports.join(', ')} } from ${JSON.stringify(target)};`
      : null,
});

/** The sources: extensionless imports of `.ts` files, compiled by esbuild. */
const sourcePlugin = () => ({
  name: 'size:sources',
  resolveId(source, importer) {
    if (isAbsolute(source) && isFile(source)) return source;
    if (!importer || !source.startsWith('.')) return null;
    const base = resolve(dirname(importer), source);
    return [`${base}.ts`, join(base, 'index.ts'), base].find(isFile) ?? null;
  },
  async transform(code, id) {
    if (!id.endsWith('.ts')) return null;
    const result = await transform(code, { loader: 'ts', target: 'es2022', format: 'esm', sourcefile: id });
    return { code: result.code, map: null };
  },
});

/** What an app's build does to the library's dev-only checks. */
const productionPlugin = () => ({
  name: 'size:production',
  transform: (code) => (code.includes('process.env.NODE_ENV') ? { code: code.replaceAll('process.env.NODE_ENV', '"production"'), map: null } : null),
});

const bundle = async (scenario, target) => {
  const build = await rollup({
    input: '\0entry',
    external: (id) => id === 'vue' || id.startsWith('@vueuse/'),
    plugins: [entryPlugin(scenario, target), sourcePlugin(), productionPlugin()],
    // The library's own modules keep their side effects (as in its build); Vue and VueUse have none.
    treeshake: { moduleSideEffects: 'no-external' },
    onLog: () => {},
  });
  const { output } = await build.generate({ format: 'es' });
  await build.close();
  return output[0];
};

/**
 * The same with esbuild, which keeps any top-level call it can't prove pure (Rollup infers
 * more): close to what webpack and terser keep. Only reported.
 */
const bundleWithEsbuild = async (scenario) => {
  const result = await build({
    stdin: { contents: entryPlugin(scenario, slash(DIST)).load('\0entry'), resolveDir: root, loader: 'js' },
    bundle: true,
    write: false,
    format: 'esm',
    target: 'es2022',
    minify: true,
    legalComments: 'none',
    external: ['vue', '@vueuse/*'],
    define: { 'process.env.NODE_ENV': '"production"' },
  });
  const min = result.outputFiles[0].contents;
  return { min: min.length, gzip: gzipSync(min, { level: 9 }).length };
};

const measure = async (code) => {
  const { code: min } = await transform(code, { minify: true, format: 'esm', target: 'es2022', legalComments: 'none' });
  return { min: Buffer.byteLength(min), gzip: gzipSync(min, { level: 9 }).length };
};

const kb = (bytes) => `${(bytes / 1024).toFixed(2)} KB`;
const pad = (text, width) => String(text).padEnd(width);
const padStart = (text, width) => String(text).padStart(width);

let failed = false;
const rows = [];
for (const scenario of scenarios) {
  const dist = await bundle(scenario, DIST);
  const size = await measure(dist.code);

  const source = await bundle(scenario, SRC);
  const modules = Object.entries(source.modules)
    .filter(([id, info]) => !id.startsWith('\0') && info.renderedLength > 0)
    .map(([id, info]) => ({ path: slash(relative(join(root, 'src'), id)), bytes: info.renderedLength, code: info.code ?? '' }))
    .sort((a, b) => b.bytes - a.bytes);
  const kept = modules.filter((module) => module.bytes > LENT && scenario.forbidden.some((path) => module.path.startsWith(path)));

  const over = [];
  if (scenario.limit.min && size.min > scenario.limit.min) over.push(`minified ${kb(size.min)} > ${kb(scenario.limit.min)}`);
  if (scenario.limit.gzip && size.gzip > scenario.limit.gzip) over.push(`gzip ${kb(size.gzip)} > ${kb(scenario.limit.gzip)}`);
  if (kept.length) over.push(`keeps ${kept.map((module) => module.path).join(', ')}`);
  if (over.length) failed = true;
  const details = args.includes('--modules');
  rows.push({
    scenario,
    size,
    over,
    modules,
    fromSource: details ? await measure(source.code) : null,
    esbuild: details ? await bundleWithEsbuild(scenario) : null,
  });

  if (outDir) {
    mkdirSync(outDir, { recursive: true });
    writeFileSync(join(outDir, `${scenario.name.replace(/\W+/g, '-')}.js`), source.code);
  }
}

console.log(`\n${pad('scenario', 24)}${padStart('minified', 12)}${padStart('limit', 12)}${padStart('gzip', 12)}${padStart('limit', 12)}  modules`);
for (const { scenario, size, over, modules } of rows) {
  const limit = (bytes) => (bytes ? kb(bytes) : '-');
  console.log(
    `${pad(scenario.name, 24)}${padStart(kb(size.min), 12)}${padStart(limit(scenario.limit.min), 12)}${padStart(kb(size.gzip), 12)}${padStart(limit(scenario.limit.gzip), 12)}  ${modules.length}` +
      (over.length ? `\n  FAIL: ${over.join('; ')}` : ''),
  );
  console.log(`  raw bytes: ${size.min} minified, ${size.gzip} gzip`);
}
for (const file of ['index.js', 'index.cjs']) {
  const code = readFileSync(join(root, 'dist', file));
  console.log(`dist/${file}: ${kb(code.length)}, ${kb(gzipSync(code, { level: 9 }).length)} gzip (whole file, not tree-shaken)`);
}

if (args.includes('--modules')) {
  for (const { scenario, modules, fromSource, esbuild } of rows) {
    // Each module minified on its own: roughly its share of the minified bundle.
    for (const module of modules) {
      module.min = Buffer.byteLength((await transform(module.code, { minify: true, format: 'esm', target: 'es2022' })).code);
    }
    modules.sort((a, b) => b.min - a.min);
    console.log(
      `\n${scenario.name}: ${modules.length} modules` +
        `\n  from the sources: ${kb(fromSource.min)} minified, ${kb(fromSource.gzip)} gzip (dist/ should match)` +
        `\n  dist/ with esbuild: ${kb(esbuild.min)} minified, ${kb(esbuild.gzip)} gzip`,
    );
    for (const module of modules) console.log(`  ${padStart(kb(module.min), 10)}  ${module.path}`);
  }
}

if (failed) {
  console.error('\nSize budget exceeded (limits in scripts/size.mjs).');
  process.exit(1);
}
