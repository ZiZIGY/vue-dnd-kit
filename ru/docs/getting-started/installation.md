---
title: "Установка"
description: "Добавьте основной пакет в проект на Vue или Nuxt, а при необходимости — пакеты для программного перетаскивания и DevTools."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/getting-started/installation"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

## Ядро

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

Vue `^3.5` — peer-зависимость. Собственная зависимость у пакета одна: `@vueuse/core`.

## Nuxt

Nuxt-модуль регистрирует `DnDProvider` и `DragPreview` как глобальные компоненты и
автоимпортирует композаблы и основные типы.

```bash
npx nuxi module add @vue-dnd-kit/nuxt
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@vue-dnd-kit/nuxt'],
});
```

<note>

У модификаторов, функций определения коллизий и сенсоров общие имена (`snapToGrid`,
`closestCenter`), поэтому они не автоимпортируются, пока вы об этом не попросите:
`vueDndKit: { autoImports: { modifiers: true, collision: true, sensors: true } }`.

</note>

## Дополнительные пакеты

<table>
<thead>
  <tr>
    <th>
      Пакет
    </th>
    
    <th>
      Что добавляет
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
      Программное перетаскивание: кнопки «вверх», меню, туры и тесты.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/devtools
      </code>
    </td>
    
    <td>
      Вкладку Vue DnD Kit в Vue DevTools и Nuxt DevTools.
    </td>
  </tr>
</tbody>
</table>

```bash
npm i @vue-dnd-kit/actions
npm i -D @vue-dnd-kit/devtools
```

## Для ИИ-ассистентов

К документации прилагается навык для агентов: ассистенты вроде Claude Code узнают модель
библиотеки, её правила и подводные камни.

```bash
npx skills add ZiZIGY/vue-dnd-kit
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
