---
title: "インストール"
description: "Vue または Nuxt のプロジェクトにコアパッケージを追加し、必要に応じてプログラムによるドラッグと DevTools のためのオプションパッケージを追加します。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/getting-started/installation"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

## コアパッケージ

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

Vue `^3.5` は peer dependency です。パッケージ自身の依存関係は `@vueuse/core` の 1 つだけです。

## Nuxt

Nuxt モジュールは `DnDProvider` と `DragPreview` をグローバルコンポーネントとして登録し、コンポーザブルと主要な型を自動インポートします。

```bash
npx nuxi module add @vue-dnd-kit/nuxt
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@vue-dnd-kit/nuxt'],
});
```

<note>

モディファイア、衝突判定ヘルパー、センサーは汎用的な名前（`snapToGrid`、`closestCenter`）を持つため、明示的に指定しない限り自動インポートされません：`vueDndKit: { autoImports: { modifiers: true, collision: true, sensors: true } }`。

</note>

## オプションパッケージ

<table>
<thead>
  <tr>
    <th>
      パッケージ
    </th>
    
    <th>
      追加される機能
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
      プログラムによるドラッグ：「上へ移動」ボタン、メニュー、ツアー、テスト。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/devtools
      </code>
    </td>
    
    <td>
      Vue DevTools と Nuxt DevTools の Vue DnD Kit タブ。
    </td>
  </tr>
</tbody>
</table>

```bash
npm i @vue-dnd-kit/actions
npm i -D @vue-dnd-kit/devtools
```

## AI アシスタント向け

このドキュメントにはエージェントスキルが付属しています。Claude Code などのアシスタントが、ライブラリのモデル、ルール、落とし穴を学べます。

```bash
npx skills add ZiZIGY/vue-dnd-kit
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
