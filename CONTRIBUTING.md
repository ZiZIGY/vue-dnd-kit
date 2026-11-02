# Contributing to Vue DnD Kit

Thanks for helping. Issues and pull requests are welcome. For a larger change (a new option, a
behaviour change, a new package), please open an issue first so we can agree on the approach
before you write code.

## The repository

| Folder | What it is |
| --- | --- |
| `packages/core` | `@vue-dnd-kit/core`: the library. Sources in `src/`, unit tests next to the code (`*.test.ts`). |
| `packages/actions` | `@vue-dnd-kit/actions`: programmatic drags. |
| `packages/devtools` | `@vue-dnd-kit/devtools`: the DevTools tab and its Vite plugin. |
| `packages/nuxt` | `@vue-dnd-kit/nuxt`: the Nuxt module. |
| `playground` | A Vite app with a demo for every feature, the UI kit pages (Nuxt UI, Vuetify) and the end-to-end tests (`e2e/`, Playwright). |
| `docs` | The documentation site: a Nuxt app, deployed to [zizigy.github.io/vue-dnd-kit](https://zizigy.github.io/vue-dnd-kit). |
| `skills/vue-dnd-kit` | The agent skill users install with `npx skills add ZiZIGY/vue-dnd-kit`. |
| `rfcs` | Design documents: the v3 RFC and the API review. |

There is no workspace tool: every folder above has its own `package.json` and `yarn.lock` and
installs on its own. The packages that build on the core (actions, devtools), the playground
and the docs compile the core **from its sources** through aliases, so a change in
`packages/core/src` shows up everywhere without a build.

## Setup

You need Node.js 22 or newer and Yarn 1 (classic).

```bash
yarn --cwd packages/core install
yarn --cwd packages/actions install
yarn --cwd packages/devtools install
yarn --cwd playground install
yarn --cwd docs install       # only for work on the docs
```

Install the core first: the others read its `tsconfig.json`, which extends `@vue/tsconfig`
from its `node_modules`.

## Commands

From the root (they run the same commands in each folder):

| Command | What it does |
| --- | --- |
| `yarn playground` | The playground at `http://localhost:4100`. |
| `yarn docs` | The docs at `http://localhost:3000/vue-dnd-kit/`. |
| `yarn test` | Unit tests of core, actions and devtools. |
| `yarn typecheck` | Types of core, actions, devtools and the playground. |
| `yarn e2e` | The Playwright tests (starts the playground itself). |

In a folder:

| Where | Command | What it does |
| --- | --- | --- |
| a package | `yarn test`, `yarn test:watch`, `yarn typecheck`, `yarn build` | |
| a package | `yarn lint:package` | publint and arethetypeswrong on the packed package. |
| `packages/core` | `yarn size` | The size budget (`scripts/size.mjs`): fails past the limits, or when a scenario keeps code it doesn't use. |
| `playground` | `yarn e2e --project=chromium e2e/sortable.spec.ts` | One spec in one browser. `PLAYGROUND_PORT` changes the port. |
| `docs` | `yarn api:check` | Every public type and function has JSDoc and a page that shows it, and pages name only things that exist. |
| `docs` | `node tools/i18n.ts status` | Which translations are missing or outdated. |

CI (`.github/workflows/ci.yml`) runs typecheck, tests, build, the size budget and the package
checks for every package, and the e2e tests in Chromium (with a touch device), Firefox and
WebKit. A pull request needs it green.

## Working on the library

- **Generic, not scenarios.** The core gives building blocks (options, events, hooks); it
  doesn't hard-code one app's behaviour. If a demo needs something special, it belongs in the
  demo, or the core gets a general option that makes it possible.
- **Every public export has JSDoc.** The docs' API pages are generated from it
  (`packages/core/src/types/`, and the functions and components `src/index.ts` exports);
  `yarn api:check` in `docs/` fails without it.
- **Tests with the change.** A unit test next to the code for logic; an e2e spec in
  `playground/e2e/` (with a demo in the playground) for anything a user drags.
- **Size counts.** `yarn size` in `packages/core` must pass. Don't raise a budget in the same
  change that needs it without saying so in the pull request.
- **The public API is stable.** v3 follows semver: renaming or removing an option, an export
  or a behaviour users rely on means 4.0.0. Add instead of changing, and deprecate first.
- Formatting: Prettier (`.prettierrc`): two spaces, single quotes, semicolons.

When the public API changes, update in the same pull request:

1. the docs pages (`docs/content/en/`) and, if a type changed, its JSDoc;
2. the agent skill (`skills/vue-dnd-kit/`);
3. the migration guide (`docs/content/en/docs/1.getting-started/4.migrating-from-v2.md`) if it
   touches something v2 users move from.

## Working on the docs

- **English is the source.** Write and change pages in `docs/content/en/`. The other eight
  languages are translated from it by AI and track the English they came from; an outdated
  translation tells its readers so. Don't edit a translation by hand without following
  [`docs/i18n/TRANSLATING.md`](docs/i18n/TRANSLATING.md).
- **Live examples** live in `docs/examples/<name>/` (`index.vue` plus its files) and appear on a
  page with `::example{name="<name>"}`. Each demo appears on exactly one page. Demos stay in
  English, and they don't use the site's own utility classes (`label`, `heading`, `display`,
  `stage`, `frame`): readers copy them, and "Open in StackBlitz" runs them as a plain Vite
  project. `http://localhost:3000/vue-dnd-kit/preview/<name>` shows one demo alone.
- Run `yarn api:check` after changing the library's exports or an API page.

## Commits and pull requests

Commits follow [Conventional Commits](https://www.conventionalcommits.org). The release bot
reads them to pick the next versions and write the changelogs, so the type matters:

| Commit | Releases |
| --- | --- |
| `fix(core): …`, `perf(core): …` | a patch (3.0.1) |
| `feat(core): …` | a minor version (3.1.0) |
| `feat(core)!: …`, or a `BREAKING CHANGE:` footer | a major version (4.0.0) |
| `docs`, `test`, `refactor`, `chore`, `ci`, `build` | nothing |

A commit belongs to the packages whose folders it changes (the scope is for readers): a `fix`
that touches `packages/core` and `packages/devtools` releases both. Write the subject as what
changes for the user, in the present tense: `fix(core): a pointer past the edge of a scrolled
list points at the item at that edge`.

Pull requests go to `master`.

## Releases

Releases are automated with [release-please](https://github.com/googleapis/release-please)
(`.github/workflows/release.yml`). Pushing to `master` does **not** publish anything:

1. On every push to `master`, the bot opens or updates a pull request named
   `chore: release master`: each package's next version and its `CHANGELOG.md`, from the
   commits since its last release.
2. **Before merging it**, when the core gets a new version, write its page in the docs'
   changelog: `docs/content/en/docs/5.changelog/`, with `version: <version>` in the front
   matter. File prefixes count down so the newest comes first (`997.v3-0-0.md`, then `996…`).
   Highlights with live examples, upgrade notes, and a last section
   `## All changes {#changes}` (the GitHub release leaves it out: release-please lists the
   commits there). Add a card for it to `0.index.md`.
3. Merging the release pull request tags the packages it bumps, creates their GitHub releases
   and publishes them to npm with Trusted Publishing (no token; with provenance). The core's
   release notes get its changelog page on top (`docs/tools/release-notes.ts`).

If publishing fails, run the **Release** workflow by hand with `publish` checked: it publishes
every package version npm doesn't have yet. As a last resort, a maintainer can publish from a
package folder with `npm publish` (`prepublishOnly` runs the typecheck, tests, build and
package checks first).

The docs deploy on their own (`.github/workflows/deploy-docs.yml`) on every push to `master`
that touches `docs/` or the sources of core or actions.

## Branches

- `master`: v3, where all work happens and where releases and the docs come from.
- `v2`: the v2 code and the old VitePress site of v1 and v2. The docs deployment builds that
  site from this branch under `/legacy/`. It gets fixes only.

## License

By contributing, you agree that your contributions are licensed under the [MIT License](LICENSE).
