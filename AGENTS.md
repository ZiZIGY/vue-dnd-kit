# Agent instructions

Vue DnD Kit: drag and drop for Vue 3. Four npm packages, a playground and a docs site. Read
[CONTRIBUTING.md](CONTRIBUTING.md) for the layout, the commands and the release flow; this
file is the short version, plus what an agent must never do.

## Never, unless the maintainer asks in so many words

- Publish to npm, merge a pull request, create or push tags, or run the Release workflow.
- Push, force-push, or rewrite history on `master` or `v2`. Commit only when asked.
- Change a version in a `package.json`, `.release-please-manifest.json` or a `CHANGELOG.md`:
  release-please owns them.
- Make a breaking change to the public API (v3 follows semver; breaking means 4.0.0).
- Edit a translation by hand (`docs/content/<code>/` other than `en`, `docs/i18n/api/`,
  `docs/i18n/locales/` other than `en.json`), except by following
  `docs/i18n/TRANSLATING.md`.
- Delete files or folders you didn't create, or rewrite a large part of the code base: ask
  first, with a plan.

## Commands

Each folder installs and runs on its own (Yarn 1, its own `yarn.lock`; never install with npm
or pnpm, they would add other lockfiles):

```bash
yarn --cwd packages/core test          # unit tests (also packages/actions, packages/devtools)
yarn --cwd packages/core typecheck
yarn --cwd packages/core size          # the size budget
yarn --cwd playground e2e --project=chromium e2e/<spec>.spec.ts
yarn --cwd docs api:check              # public API documented and shown in the docs
node docs/tools/i18n.ts status         # translations missing or outdated
```

The root `package.json` has shortcuts: `yarn test`, `yarn typecheck`, `yarn e2e`,
`yarn playground`, `yarn docs` (they call each folder's script with `npm run --prefix`: a
`yarn` nested in a Yarn script breaks on Windows with a non-ASCII user folder). On Windows,
run Vitest from a path with an upper-case drive letter (`C:/…`): `c:/…` loads Vitest twice
and every test fails with "failed to find the current suite".

Dev servers: the playground runs on port 4100 (`PLAYGROUND_PORT` to change it), the docs on
3000. The maintainer often has them open already: reuse a running server, and never start a
second one on a port that is taken.

## The code

- `packages/core/src`: `core/` (the drag manager, sensors, auto-scroll, overlay, a11y),
  `sortable/` (lists and trees, their modes and projection), `animation/`, `types/` (the
  public types: their JSDoc is the API reference), `devtools/` (the bridge),
  `index.ts` (every export).
- The actions, devtools, playground and docs compile the core from its sources through
  aliases. No build is needed to see a change.
- The library stays generic: options, events and hooks, not one app's scenario. A demo's
  special case belongs in the demo.
- Every public export has JSDoc. A change to the public API also updates, in the same change,
  the English docs (`docs/content/en/`), the agent skill (`skills/vue-dnd-kit/`) and, when it
  concerns v2 users, the migration guide.
- Tests come with the change: a `*.test.ts` next to the code, an e2e spec in
  `playground/e2e/` for anything a user drags. Run the tests of the area you touched before
  saying it works, and report failures as they are.
- Prettier style: two spaces, single quotes, semicolons. Match the comments around you:
  plain sentences that say why.

## The docs

- English first, in `docs/content/en/`; the other eight languages are AI translations made
  from it later.
- Live examples: `docs/examples/<name>/`, shown with `::example{name="<name>"}`. One page per
  demo. Demos in English, without the site's utility classes (`label`, `heading`, `display`,
  `stage`, `frame`, or Tailwind's such as `container`: on the site a `class="container"` gets
  `width: 100%`), runnable as a plain Vite project (the StackBlitz button).

## Commits

Conventional Commits. The type decides the release: `fix`/`perf` → patch, `feat` → minor,
`!` or `BREAKING CHANGE:` → major; `docs`, `test`, `refactor`, `chore`, `ci` release nothing.
A commit belongs to the packages whose folders it changes. Subject: what changes for the user,
present tense, e.g. `fix(core): a landing box no longer jumps a row when the next drag
reorders its list`.

A release is the maintainer merging the release pull request. When the core gets a new
version, its page in `docs/content/en/docs/5.changelog/` must exist before that merge (see
CONTRIBUTING.md).
