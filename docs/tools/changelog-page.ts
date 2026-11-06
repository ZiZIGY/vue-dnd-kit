/**
 * A page in the docs' changelog for the core's version, when it has none: what changed, from
 * the version's section of `packages/core/CHANGELOG.md` (release-please's), and a card for it
 * on the changelog's overview.
 *
 *   node tools/changelog-page.ts    the version in packages/core/package.json
 *
 * The release workflow runs it on the release pull request, so no release goes out without a
 * page. The page it writes lists the changes only: write the real one on master (highlights,
 * live demos, upgrade notes; see `release-notes.ts`) before merging, and it stays out.
 *
 * Runs on Node 22.18+ (TypeScript without a build step).
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = fileURLToPath(new URL('../content/en/docs/5.changelog', import.meta.url));
const core = fileURLToPath(new URL('../../packages/core', import.meta.url));

const read = (file: string) => readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const version: string = JSON.parse(read(join(core, 'package.json'))).version;

// The release pages, `<n>.v<version>.md`: the newest has the smallest `<n>`.
const pages = readdirSync(dir).filter((file) => /^\d+\.v.+\.md$/.test(file));
const versionOf = (file: string) => /^version:\s*['"]?([^'"\s]+)/m.exec(read(join(dir, file)))?.[1];
const existing = pages.find((file) => versionOf(file) === version);
if (existing) {
  console.log(`${version} has its page: ${existing}`);
  process.exit(0);
}

// The version's section of the changelog: from its heading to the next version's.
const changelog = read(join(core, 'CHANGELOG.md')).split('\n');
const escaped = version.replace(/[.+]/g, '\\$&');
const start = changelog.findIndex((line) => new RegExp(`^## \\[?${escaped}\\]?[ (]`).test(line));
if (start < 0) {
  console.error(`packages/core/CHANGELOG.md has no section for ${version}`);
  process.exit(1);
}
const end = changelog.findIndex((line, index) => index > start && line.startsWith('## '));
const compare = /\((https:\/\/github\.com\/[^)]+\/compare\/([^)]+))\)/.exec(changelog[start]!);
const section = changelog.slice(start + 1, end < 0 ? undefined : end);

// `* **core:** a change ([abc1234](…))` becomes `- A change ([abc1234](…))`.
const changes: string[] = [];
const summaries: string[] = [];
for (const line of section) {
  const item = /^\* (?:\*\*[\w-]+:\*\* )?(.*)$/.exec(line);
  if (item) {
    const text = item[1]!.charAt(0).toUpperCase() + item[1]!.slice(1);
    changes.push(`- ${text}`);
    summaries.push(text.replace(/\s*\(\[[0-9a-f]+\]\([^)]*\)\)\s*$/, ''));
  } else if (line.startsWith('### ')) {
    changes.push('', line, '');
  }
}

const description = summaries.length
  ? `${summaries.slice(0, 2).join('; ')}${summaries.length > 2 ? '; and more' : ''}.`
  : `What changed in @vue-dnd-kit/core ${version}.`;
const yaml = (text: string) => `"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
const slug = `v${version.replace(/\./g, '-')}`;
const prefix = Math.min(...pages.map((file) => Number.parseInt(file, 10))) - 1;
const file = `${prefix}.${slug}.md`;

const page = [
  '---',
  `title: ${version}`,
  `description: ${yaml(description)}`,
  'category: Changelog',
  `version: ${version}`,
  'navigation:',
  `  title: ${version}`,
  '  icon: i-lucide-tag',
  '---',
  '',
  '```bash',
  'npm i @vue-dnd-kit/core',
  '```',
  '',
  '## All changes {#changes}',
  ...changes,
  '',
  ...(compare ? [`The commits: [${compare[2]}](${compare[1]}).`, ''] : []),
].join('\n');
writeFileSync(join(dir, file), page.replace(/\n{3,}/g, '\n\n'));

// The card goes first among the releases on the overview.
const indexFile = join(dir, '0.index.md');
const raw = readFileSync(indexFile, 'utf8');
const eol = raw.includes('\r\n') ? '\r\n' : '\n';
const index = raw.replace(/\r\n/g, '\n');
const group = index.indexOf('::card-group\n', index.indexOf('## Releases'));
if (group < 0) {
  console.error('No card group under "Releases" in 0.index.md');
  process.exit(1);
}
const at = group + '::card-group\n'.length;
const card = `\n::card{title="${version}" icon="i-lucide-tag" to="/docs/changelog/${slug}"}\n${description}\n::\n`;
writeFileSync(indexFile, (index.slice(0, at) + card + index.slice(at)).replace(/\n/g, eol));

console.log(`${version}: wrote ${file} and its card`);
