---
title: "Instalación"
description: "Añade el paquete principal a un proyecto Vue o Nuxt, más los paquetes opcionales para arrastres programáticos y las DevTools."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/getting-started/installation"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

## El paquete principal

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

Vue `^3.5` es una peer dependency. El paquete tiene una sola dependencia propia, `@vueuse/core`.

## Nuxt

El módulo de Nuxt registra `DnDProvider` y `DragPreview` como componentes globales e importa
automáticamente los composables y los tipos principales.

```bash
npx nuxi module add @vue-dnd-kit/nuxt
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@vue-dnd-kit/nuxt'],
});
```

<note>

Los modificadores, los helpers de colisión y los sensores tienen nombres genéricos (`snapToGrid`,
`closestCenter`), así que no se importan automáticamente a menos que lo pidas:
`vueDndKit: { autoImports: { modifiers: true, collision: true, sensors: true } }`.

</note>

## Paquetes opcionales

<table>
<thead>
  <tr>
    <th>
      Paquete
    </th>
    
    <th>
      Qué añade
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
      Arrastres programáticos: botones «subir», menús, recorridos guiados y tests.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/devtools
      </code>
    </td>
    
    <td>
      Una pestaña de Vue DnD Kit en Vue DevTools y Nuxt DevTools.
    </td>
  </tr>
</tbody>
</table>

```bash
npm i @vue-dnd-kit/actions
npm i -D @vue-dnd-kit/devtools
```

## Para asistentes de IA

La documentación incluye un skill para agentes: asistentes como Claude Code aprenden el modelo de
la biblioteca, sus reglas y sus trampas.

```bash
npx skills add ZiZIGY/vue-dnd-kit
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
