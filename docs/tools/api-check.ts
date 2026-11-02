/**
 * Checks that the API reference covers the library's public API (`packages/core/src/index.ts`),
 * and exits non-zero when it doesn't:
 *
 * - every export (function, component, value, type) has JSDoc, and the signature of every
 *   function, component and value can be read from its declaration;
 * - every member of a public interface has JSDoc;
 * - every public type and export is shown on an English page: `::api-table{name}` for a type,
 *   `::api-signature{name}` (or `names`) for the others;
 * - every name those components ask for, on the pages of every language, is a public one.
 *
 *   node tools/api-check.ts          from docs/ (`yarn api:check`), or `node docs/tools/api-check.ts`
 *   node tools/api-check.ts --list   prints the signatures as the API pages show them
 *
 * Runs on Node 22.18+ (TypeScript without a build step).
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readApi } from './types-reader.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const srcDir = join(root, '../packages/core/src');
const content = join(root, 'content');

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
const posix = (path: string) => path.replaceAll('\\', '/');

const api = readApi(srcDir);
const publicTypes = new Set(api.publicTypes.map(({ name }) => name));

if (process.argv.includes('--list')) {
  for (const [name, entry] of Object.entries(api.signatures)) {
    console.log(`// ${name} (${entry.kind}, src/${entry.source})${entry.problem ? `: ${entry.problem}` : ''}\n${entry.code}\n`);
  }
  process.exit(0);
}

/** Problems by kind, in the order they are reported. */
const problems = new Map<string, string[]>();
const report = (kind: string, line: string) => {
  if (!problems.has(kind)) problems.set(kind, []);
  problems.get(kind)!.push(line);
};

/* --- The declarations: JSDoc everywhere, signatures that can be read. */

for (const [name, entry] of Object.entries(api.signatures)) {
  if (entry.problem) report("Signatures that can't be read", `${name}  src/${entry.source}: ${entry.problem}`);
  if (!entry.description) report('Exports without JSDoc', `${name}  src/${entry.source}`);
  if (api.types[name]) report('Names used twice', `${name}: a type and an export (their translations would share a key)`);
}

for (const { name, module } of api.publicTypes) {
  if (module !== './types') {
    report('Public types the reference cannot read', `${name}: exported from \`${module}\`, move it to src/types/`);
    continue;
  }
  const entry = api.types[name];
  if (!entry) {
    report('Public types the reference cannot read', `${name}: not found in src/types/`);
    continue;
  }
  if (!entry.description) report('Exports without JSDoc', `${name}  src/types/${entry.file}.ts`);
  for (const member of entry.members) {
    if (!member.description) report('Members without JSDoc', `${name}.${member.name}  src/types/${entry.file}.ts`);
  }
}

/* --- The pages: what they show, and names that don't exist. */

const shown = new Set<string>();
const COMPONENT = /::api-(table|signature)\{([^}]*)\}/g;
const ATTRIBUTE = /(\w+)=(?:"([^"]*)"|'([^']*)')/g;

for (const path of walk(content).filter((file) => file.endsWith('.md'))) {
  const file = posix(relative(root, path));
  const english = file.startsWith('content/en/');
  let fenced = false;
  readFileSync(path, 'utf8')
    .split(/\r?\n/)
    .forEach((line, index) => {
      if (/^\s*(```|~~~)/.test(line)) fenced = !fenced;
      if (fenced) return;
      for (const [, component, attributes] of line.matchAll(COMPONENT)) {
        const props = Object.fromEntries([...attributes!.matchAll(ATTRIBUTE)].map(([, key, double, single]) => [key, double ?? single ?? '']));
        const names = [props.name, ...(props.names?.split(/[\s,]+/) ?? [])].filter((name): name is string => !!name);
        const where = `${file}:${index + 1}`;
        if (!names.length) report('Unknown names on pages', `${where}: ::api-${component} without a name`);
        for (const name of names) {
          if (component === 'table' && !api.types[name]) report('Unknown names on pages', `${where}: "${name}" is no type of src/types/`);
          else if (component === 'table' && !publicTypes.has(name)) report('Unknown names on pages', `${where}: "${name}" is internal (not exported from src/index.ts)`);
          else if (component === 'signature' && !api.signatures[name]) report('Unknown names on pages', `${where}: "${name}" is no export of src/index.ts`);
          else if (english) shown.add(name);
        }
      }
    });
}

for (const { name } of api.publicTypes) {
  if (api.types[name] && !shown.has(name)) report('Not shown on any page', `${name}: add ::api-table{name="${name}"} to an API page`);
}
for (const name of Object.keys(api.signatures)) {
  if (!shown.has(name)) report('Not shown on any page', `${name}: add ::api-signature{name="${name}"} to an API page`);
}

/* --- Report */

const total = [...problems.values()].reduce((sum, lines) => sum + lines.length, 0);
const members = api.publicTypes.reduce((sum, { name }) => sum + (api.types[name]?.members.length ?? 0), 0);
const checked = `${Object.keys(api.signatures).length} exports, ${publicTypes.size} public types, ${members} members`;
if (!total) {
  console.log(`API check: ${checked}: all documented and shown.`);
} else {
  for (const [kind, lines] of problems) {
    console.log(`${kind} (${lines.length}):`);
    for (const line of lines) console.log(`  ${line}`);
  }
  console.log(`\nAPI check: ${total} problem${total === 1 ? '' : 's'} (${checked}).`);
  process.exit(1);
}
