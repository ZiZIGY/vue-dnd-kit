---
title: "Installation"
description: "Füge das Core-Paket zu einem Vue- oder Nuxt-Projekt hinzu, dazu die optionalen Pakete für programmatisches Ziehen und die DevTools."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/de/docs/getting-started/installation"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

## Der Kern

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

Vue `^3.5` ist eine Peer-Dependency. Das Paket selbst hat eine einzige Abhängigkeit,
`@vueuse/core`.

## Nuxt

Das Nuxt-Modul registriert `DnDProvider` und `DragPreview` als globale Komponenten und importiert
die Composables und die wichtigsten Typen automatisch.

```bash
npx nuxi module add @vue-dnd-kit/nuxt
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@vue-dnd-kit/nuxt'],
});
```

<note>

Modifier, Hilfsfunktionen zur Kollisionserkennung und Sensoren haben allgemeine Namen
(`snapToGrid`, `closestCenter`), deshalb werden sie nur automatisch importiert, wenn du es
verlangst: `vueDndKit: { autoImports: { modifiers: true, collision: true, sensors: true } }`.

</note>

## Optionale Pakete

<table>
<thead>
  <tr>
    <th>
      Paket
    </th>
    
    <th>
      Was es hinzufügt
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
      Programmatische Drags: „Nach oben“-Buttons, Menüs, Touren und Tests.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/devtools
      </code>
    </td>
    
    <td>
      Einen Tab für Vue DnD Kit in den Vue DevTools und den Nuxt DevTools.
    </td>
  </tr>
</tbody>
</table>

```bash
npm i @vue-dnd-kit/actions
npm i -D @vue-dnd-kit/devtools
```

## Für KI-Assistenten

Zur Dokumentation gehört ein Agent-Skill: Assistenten wie Claude Code lernen das Modell der
Bibliothek kennen, ihre Regeln und ihre Fallstricke.

```bash
npx skills add ZiZIGY/vue-dnd-kit
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
