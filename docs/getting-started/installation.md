---
title: "Installation"
description: "Add the core package to a Vue or Nuxt project, plus the optional packages for programmatic drags and the DevTools."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/getting-started/installation"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

## The core

<code-group>

```bash [npm]
npm i @vue-dnd-kit/core
```

```bash [yarn]
yarn add @vue-dnd-kit/core
```

```bash [pnpm]
pnpm add @vue-dnd-kit/core
```

```bash [bun]
bun add @vue-dnd-kit/core
```

</code-group>

Vue `^3.5` is a peer dependency. The package has one dependency of its own, `@vueuse/core`.

## Nuxt

The Nuxt module registers `DnDProvider` and `DragPreview` as global components and
auto-imports the composables and the main types.

```bash
npx nuxi module add @vue-dnd-kit/nuxt
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@vue-dnd-kit/nuxt'],
});
```

<note>

Modifiers, collision helpers and sensors have generic names (`snapToGrid`, `closestCenter`), so
they aren't auto-imported unless you ask for them:
`vueDndKit: { autoImports: { modifiers: true, collision: true, sensors: true } }`.

</note>

## Optional packages

<table>
<thead>
  <tr>
    <th>
      Package
    </th>
    
    <th>
      What it adds
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        @vue-dnd-kit/actions
      </code>
    </td>
    
    <td>
      Programmatic drags: "move up" buttons, menus, tours and tests.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/devtools
      </code>
    </td>
    
    <td>
      A Vue DnD Kit tab in Vue DevTools and Nuxt DevTools.
    </td>
  </tr>
</tbody>
</table>

```bash
npm i @vue-dnd-kit/actions
npm i -D @vue-dnd-kit/devtools
```

## For AI assistants

The docs ship an agent skill: assistants such as Claude Code learn the model of the library,
its rules and its pitfalls.

```bash
npx skills add ZiZIGY/vue-dnd-kit
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
