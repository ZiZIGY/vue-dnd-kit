/**
 * The notes of a release for its GitHub release, from its page in the docs' changelog.
 *
 *   node tools/release-notes.ts <version>    the notes of the page with `version: <version>`
 *
 * The page's components become GitHub Markdown: a live demo turns into a link to it on the
 * page, cards into a list of links, tips and notes into alerts, and links to the docs become
 * absolute. "All changes" is left out: the release keeps release-please's list of commits
 * under the notes (`.github/workflows/release.yml`). A version without a page prints nothing.
 *
 * A release's page, written before its release pull request is merged:
 * `content/en/docs/5.changelog/<n>.v3-0-0-beta-3.md`, `<n>` one less than the newest page's
 * (the newest comes first), with `version: 3.0.0-beta.3` and an `{#changes}` section last.
 *
 * Runs on Node 22.18+ (TypeScript without a build step).
 */

import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Where the docs are published: `ORIGIN` and `BASE_URL` of `nuxt.config.ts`. */
const SITE = 'https://zizigy.github.io/vue-dnd-kit';
const dir = fileURLToPath(new URL('../content/en/docs/5.changelog', import.meta.url));

/** The first line of the notes: the workflow doesn't add them twice. */
export const MARKER = '<!-- changelog-page -->';

interface Page {
  file: string;
  meta: Record<string, string>;
  body: string;
}

const readPage = (file: string): Page => {
  const text = readFileSync(join(dir, file), 'utf8').replace(/\r\n/g, '\n');
  const front = /^---\n([\s\S]*?)\n---\n/.exec(text);
  const meta: Record<string, string> = {};
  // Top-level `key: value` lines: enough for `title`, `description` and `version`.
  for (const line of front?.[1]?.split('\n') ?? []) {
    const pair = /^(\w+):\s*(.+)$/.exec(line);
    if (pair) meta[pair[1]!] = pair[2]!.replace(/^(['"])(.*)\1$/, '$2');
  }
  return { file, meta, body: front ? text.slice(front[0].length) : text };
};

const attributes = (source = '') =>
  Object.fromEntries([...source.matchAll(/([\w-]+)="([^"]*)"/g)].map(([, key, value]) => [key, value]));

const ALERTS: Record<string, string> = { tip: 'TIP', note: 'NOTE', warning: 'WARNING', caution: 'CAUTION' };

/** A component still open, with the lines it wraps when it renders them itself. */
interface Open {
  name: string;
  attrs: Record<string, string>;
  lines: string[];
}

/** Components whose content the notes render their own way; the others pass it through. */
const wraps = (name: string) => name === 'card' || name in ALERTS;

export function releaseNotes(page: Page): string {
  const url = `${SITE}/docs/changelog/${page.file.replace(/^\d+\./, '').replace(/\.md$/, '')}`;
  const absolute = (href: string) => (href.startsWith('/') ? `${SITE}${href}` : href.startsWith('#') ? `${url}${href}` : href);
  const inline = (line: string) =>
    line
      .replace(/:kbd\{value="([^"]*)"\}/g, '<kbd>$1</kbd>')
      .replace(/\]\(([^)\s]+)\)/g, (_, href: string) => `](${absolute(href)})`);
  const trim = (lines: string[]) => lines.join('\n').trim().split('\n');

  const out: string[] = [MARKER];
  if (page.meta.description) out.push(page.meta.description, '');
  out.push(`**[The notes with their live demos →](${url})**`, '');

  const open: Open[] = [];
  const emit = (line: string) => {
    const inner = open.findLast((component) => wraps(component.name));
    (inner ? inner.lines : out).push(line);
  };
  /** The heading the text is under: a demo links to its place on the page. */
  let section = '';
  let fence = false;

  for (const line of page.body.split('\n')) {
    if (line.startsWith('```')) {
      // Code blocks keep their language, not their file name (`ts [Board.vue]`).
      emit(fence ? line : line.replace(/^(```[\w-]*)\s+\[[^\]]*\]\s*$/, '$1'));
      fence = !fence;
      continue;
    }
    if (fence) {
      emit(line);
      continue;
    }
    // Cards make one list.
    if (!line.trim() && open.at(-1)?.name === 'card-group') continue;
    const heading = /^(#{1,6}) (.*?)(?: \{#([\w-]+)\})?\s*$/.exec(line);
    if (heading) {
      if (heading[3] === 'changes') break;
      section = heading[3] ?? '';
      emit(`${heading[1]} ${inline(heading[2]!)}`);
      continue;
    }
    const start = /^::([\w-]+)(\{.*\})?\s*$/.exec(line);
    if (start) {
      open.push({ name: start[1]!, attrs: attributes(start[2]), lines: [] });
      continue;
    }
    if (line.trim() === '::') {
      const component = open.pop();
      if (!component) continue;
      const { name, attrs, lines } = component;
      if (name === 'example') {
        const demo = `${url}${section ? `#${section}` : ''}`;
        emit(`▶ **[Live demo](${demo})**${attrs.hint ? `: ${attrs.hint}` : ''}`);
      } else if (name === 'card') {
        const title = attrs.to ? `[${attrs.title}](${absolute(attrs.to)})` : attrs.title;
        emit(`- **${title}**: ${lines.join(' ').replace(/\s+/g, ' ').trim()}`);
      } else if (name in ALERTS) {
        emit(`> [!${ALERTS[name]}]`);
        for (const text of trim(lines)) emit(text ? `> ${text}` : '>');
      }
      continue;
    }
    emit(inline(line));
  }

  return `${out.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

const version = process.argv[2];
if (!version) {
  console.error('Usage: node tools/release-notes.ts <version>');
  process.exit(1);
}
const page = readdirSync(dir)
  .filter((file) => file.endsWith('.md'))
  .map(readPage)
  .find((candidate) => candidate.meta.version === version);
if (page) process.stdout.write(releaseNotes(page));
