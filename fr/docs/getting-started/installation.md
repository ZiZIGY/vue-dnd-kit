---
title: "Installation"
description: "Ajoutez le paquet principal à un projet Vue ou Nuxt, ainsi que les paquets optionnels pour les glissements programmatiques et les DevTools."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/fr/docs/getting-started/installation"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

## Le paquet principal

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

Vue `^3.5` est une peer dependency. Le paquet n'a qu'une seule dépendance propre, `@vueuse/core`.

## Nuxt

Le module Nuxt enregistre `DnDProvider` et `DragPreview` comme composants globaux et
importe automatiquement les composables et les principaux types.

```bash
npx nuxi module add @vue-dnd-kit/nuxt
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@vue-dnd-kit/nuxt'],
});
```

<note>

Les modificateurs, les helpers de collision et les capteurs ont des noms génériques
(`snapToGrid`, `closestCenter`) : ils ne sont donc pas importés automatiquement, sauf si vous
le demandez :
`vueDndKit: { autoImports: { modifiers: true, collision: true, sensors: true } }`.

</note>

## Paquets optionnels

<table>
<thead>
  <tr>
    <th>
      Paquet
    </th>
    
    <th>
      Ce qu'il ajoute
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
      Les glissements programmatiques : boutons « monter », menus, visites guidées et tests.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/devtools
      </code>
    </td>
    
    <td>
      Un onglet Vue DnD Kit dans Vue DevTools et Nuxt DevTools.
    </td>
  </tr>
</tbody>
</table>

```bash
npm i @vue-dnd-kit/actions
npm i -D @vue-dnd-kit/devtools
```

## Pour les assistants IA

La documentation fournit un skill pour agents : les assistants comme Claude Code apprennent le
modèle de la bibliothèque, ses règles et ses pièges.

```bash
npx skills add ZiZIGY/vue-dnd-kit
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
