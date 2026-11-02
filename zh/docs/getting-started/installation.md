---
title: "安装"
description: "将核心包添加到 Vue 或 Nuxt 项目中，并按需添加用于程序化拖拽和 DevTools 的可选包。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/getting-started/installation"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

## 核心包

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

Vue `^3.5` 是 peer dependency。这个包自身只有一个依赖：`@vueuse/core`。

## Nuxt

Nuxt 模块会把 `DnDProvider` 和 `DragPreview` 注册为全局组件，并自动导入组合式函数和主要类型。

```bash
npx nuxi module add @vue-dnd-kit/nuxt
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  modules: ['@vue-dnd-kit/nuxt'],
});
```

<note>

修饰器、碰撞检测辅助函数和传感器的名字比较通用（`snapToGrid`、`closestCenter`），因此除非你主动要求，否则不会自动导入它们：`vueDndKit: { autoImports: { modifiers: true, collision: true, sensors: true } }`。

</note>

## 可选包

<table>
<thead>
  <tr>
    <th>
      包
    </th>
    
    <th>
      新增功能
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
      程序化拖拽：“上移”按钮、菜单、引导和测试。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        @vue-dnd-kit/devtools
      </code>
    </td>
    
    <td>
      Vue DevTools 和 Nuxt DevTools 中的 Vue DnD Kit 标签页。
    </td>
  </tr>
</tbody>
</table>

```bash
npm i @vue-dnd-kit/actions
npm i -D @vue-dnd-kit/devtools
```

## 面向 AI 助手

文档附带一个 agent skill：Claude Code 等助手可以借此学习这个库的模型、规则和易错点。

```bash
npx skills add ZiZIGY/vue-dnd-kit
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
