---
title: "DevTools"
description: "Vue DevTools 和 Nuxt DevTools 中的 Vue DnD Kit 标签页——实时小地图、能真正拖拽的摇杆、实时编辑选项，以及每次拖拽的日志。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/guides/devtools"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

`@vue-dnd-kit/devtools` 在 Vue DevTools（`vite-plugin-vue-devtools`）和 Nuxt DevTools 中添加一个 **Vue DnD Kit** 标签页。它在实时小地图中显示页面上的每个列表、树和放置目标，用摇杆拖拽任意项，在应用运行时编辑选项，并记录每次拖拽做了什么。它只在开发环境中工作：它的任何部分都不会进入生产构建。

这个标签页是一个独立的页面，由你的开发服务器在你的应用旁边提供，所以无法在本文档中运行。三步即可完成设置。

## 安装

### 1. 添加包

```bash
npm i -D @vue-dnd-kit/devtools @vue-dnd-kit/actions
```

`@vue-dnd-kit/actions` 是一个对等依赖：标签页中的移动都通过它进行。npm 7+ 和 pnpm 会自动安装它；使用 Yarn 1 时需要手动添加。

### 2. 添加插件

<code-group>

```ts [vite.config.ts]
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { vueDnDKitDevtools } from '@vue-dnd-kit/devtools/vite';

export default defineConfig({
  // Next to the Vue DevTools plugin: the tab joins its sidebar.
  plugins: [vueDevTools(), vueDnDKitDevtools(), vue()],
});
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // With @vue-dnd-kit/devtools installed, the tab appears in development.
  modules: ['@vue-dnd-kit/nuxt'],
});
```

</code-group>

使用 Vite 时，插件在开发服务器（`vite serve`）上做三件事：在 `/__vue-dnd-kit-devtools/`（位于你的 `base` 之下）提供标签页，把它添加到 Vue DevTools 中，并让页面在你的应用启动之前向它报告。不需要 `app.use()`，构建也不受影响。

使用 Nuxt 时，`@vue-dnd-kit/nuxt` 模块会找到这个包，提供标签页，把它添加到 Nuxt DevTools 中，并通过一个客户端插件安装页面一侧的部分。`vueDndKit: { devtools: false }` 关闭它。

### 3. 在开发环境中运行应用

像往常一样启动开发服务器（`vite`、`nuxt dev`）并打开应用：标签页就绪。页面上的每个 provider 都会显示在其中，无论它在哪个应用中渲染。

### 不使用插件

对于你自己的开发服务器，或者不是由 Vite 从 `index.html` 提供的页面（SSR 配置），自己安装页面一侧的部分：

```ts [main.ts]
import { createApp } from 'vue';
import { DnDDevtools } from '@vue-dnd-kit/devtools';
import App from './App.vue';

const app = createApp(App);
app.use(DnDDevtools); // before mount: providers set up earlier aren't seen
app.mount('#app');
```

或者在入口文件中最先导入 `@vue-dnd-kit/devtools/auto`。如果希望插件提供标签页，但页面一侧由你自己安装，使用 `vueDnDKitDevtools({ inject: false })`；`@vue-dnd-kit/devtools/vite` 中的 `serveTab()` 就是提供标签页的中间件。

<note>

在生产构建中，`app.use(DnDDevtools)` 和 `auto` 导入几乎缩减为零：每个入口点都会先检查 `process.env.NODE_ENV`，打包工具会去掉其余部分。在服务端它们什么都不做。

</note>

## 打开它

- **Vue DevTools**：:kbd{value="Alt"} + <kbd value="Shift">



</kbd>

 + <kbd value="D">



</kbd>

，或页面底部的 Vue 按钮，然后选择 **Vue DnD Kit** 标签页。
- **Nuxt DevTools**：:kbd{value="Alt"} + <kbd value="Shift">



</kbd>

 + <kbd value="D">



</kbd>

，或 Nuxt 按钮，然后选择 **Vue DnD Kit**（在侧边栏或它的溢出菜单中）。
- **独立窗口**：在你的开发服务器上打开 `http://localhost:5173/__vue-dnd-kit-devtools/`，或点击标签页的 ⧉ 按钮。在第二块屏幕上很方便。打开了多个页面时，顶部的下拉框可以选择要观察的那个。

<warning>

把标签页放在单独的窗口中，而不是同一窗口中的后台浏览器标签页：页面必须保持可见，隐藏的页面会取消拖拽。

</warning>

## 标签页一览

<table>
<thead>
  <tr>
    <th>
      部分
    </th>
    
    <th>
      内容
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      顶栏
    </td>
    
    <td>
      拖拽此刻正在做什么（<code>
        dragging card-3 → done (accepts)
      </code>
      
      ）、被观察的页面、<strong>
        ⌖ Pick
      </strong>
      
      、已编辑选项的数量及重置按钮、⧉（独立窗口）以及主题。
    </td>
  </tr>
  
  <tr>
    <td>
      左侧：注册表
    </td>
    
    <td>
      以树的形式显示每个 provider：它的列表、树、放置目标和可拖拽元素。<strong>
        ☰
      </strong>
      
       显示或隐藏它。
    </td>
  </tr>
  
  <tr>
    <td>
      中间：<strong>
        Map
      </strong>
      
       和 <strong>
        Log
      </strong>
    </td>
    
    <td>
      页面的实时小地图，或拖拽日志。
    </td>
  </tr>
  
  <tr>
    <td>
      右侧：<strong>
        Drive
      </strong>
      
      、<strong>
        Options
      </strong>
      
      、<strong>
        State
      </strong>
    </td>
    
    <td>
      摇杆和移动按钮、所选节点的选项，以及 provider 对它所知的信息。
    </td>
  </tr>
</tbody>
</table>

在注册表中选择一个节点，或在地图上选择一个项，右侧就会跟随它。

## 小地图

每个列表、树和放置目标都有一张实时卡片，其中的项的副本位于它们所在的位置——与浮层会显示的克隆相同，并带有页面的 CSS。拖拽期间它会标出：

- **接收**该拖拽（蓝色）或**拒绝**该拖拽（红色）的列表和目标；
- 占位元素，以及指针下方的目标；
- 指针、浮层的盒子，以及 `placeholder: 'indicator'` 列表的插入线。

单击会选中一个项并在页面上高亮它；双击会把页面滚动到它那里。当放置没有到达你预期的地方时，使用地图：它一眼就能看出哪些列表接收这次拖拽。

## Drive：摇杆

选择一个项——在地图上、在注册表中，或用 **⌖ Pick**，它会接管页面上对可拖拽元素的下一次按下，而不让按下产生作用——然后推动摇杆的旋钮。项被拿起并朝那个方向移动，旋钮离中心越远，移动越快。松开它就停下；**Drop** 和 **Cancel** 结束拖拽。

这是一个名为 `devtools` 的传感器发起的真正的指针拖拽，基于公开的[传感器 API](https://zizigy.github.io/docs/guides/sensors#a-sensor-of-your-own) 实现：列表在它下方排序，容器在边缘自动滚动，`onBeforeDrop` 和 `onDrop` 像任何拖拽一样运行。禁用的项不会被拿起。页面发起的键盘拖拽也可以操控。

可排序列表的项还有按钮：上移、下移、移到开头、移到末尾、移到同一分组的另一个列表。每个按钮都是一次 [`moveItem`](https://zizigy.github.io/docs/guides/sensors#programmatic-drags) 键盘拖拽。摇杆下方是浮层所显示内容的一个放大副本。

<table>
<thead>
  <tr>
    <th>
      按键（在标签页中）
    </th>
    
    <th>
      作用
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      方向键或 <kbd value="W">
        
      </kbd>
      
       <kbd value="A">
        
      </kbd>
      
       <kbd value="S">
        
      </kbd>
      
       <kbd value="D">
        
      </kbd>
    </td>
    
    <td>
      把旋钮朝那个方向推到一半；按住 <kbd value="Shift">
        
      </kbd>
      
       时推到底
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="G">
        
      </kbd>
    </td>
    
    <td>
      拿起所选的项
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Space">
        
      </kbd>
      
       / <kbd value="Enter">
        
      </kbd>
    </td>
    
    <td>
      放下
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Escape">
        
      </kbd>
    </td>
    
    <td>
      取消
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="P">
        
      </kbd>
    </td>
    
    <td>
      在页面上选取
    </td>
  </tr>
</tbody>
</table>

## 选项

所有不是回调的选项都可以在应用运行时编辑。选择节点并打开 **Options**：

<table>
<thead>
  <tr>
    <th>
      节点
    </th>
    
    <th>
      选项
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Provider
    </td>
    
    <td>
      <code>
        overlayFit
      </code>
      
      、<code>
        autoScroll
      </code>
      
      、<code>
        collision
      </code>
      
      、<code>
        modifiers
      </code>
      
      （库自带的，按名称）、<code>
        animation
      </code>
      
      、<code>
        dropAnimation
      </code>
      
      、<code>
        animate
      </code>
      
      、<code>
        activation
      </code>
      
      、<code>
        keyboard
      </code>
      
      、<code>
        haptics
      </code>
      
      、<code>
        copyModifier
      </code>
      
      ……
    </td>
  </tr>
  
  <tr>
    <td>
      列表
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      、<code>
        strategy
      </code>
      
      、<code>
        placeholder
      </code>
      
      、<code>
        behavior
      </code>
      
      、<code>
        multiple
      </code>
      
      、<code>
        sort
      </code>
      
      、<code>
        dropOutside
      </code>
      
      、<code>
        acceptMode
      </code>
      
      、<code>
        animation
      </code>
      
      、<code>
        animate
      </code>
      
      、<code>
        autoScroll
      </code>
      
      、<code>
        modifiers
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      树
    </td>
    
    <td>
      <code>
        placeholder
      </code>
      
      、<code>
        indentation
      </code>
      
      、<code>
        nesting
      </code>
      
      、<code>
        maxDepth
      </code>
      
      ……
    </td>
  </tr>
  
  <tr>
    <td>
      放置目标
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      、<code>
        priority
      </code>
      
      、<code>
        accept
      </code>
      
      、<code>
        acceptMode
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      项
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      、<code>
        keyboard
      </code>
      
      、<code>
        activation
      </code>
    </td>
  </tr>
</tbody>
</table>

编辑立即生效，只作用于当前页面，永远不会写入你的代码：库在读取选项的地方读取新值。它会一直有效，直到你重置它（每个选项旁的 ↺，或顶栏中的重置）、provider 卸载或页面重新加载。被编辑的选项旁边会显示你代码中的值。在编辑生效期间挂载的项——虚拟列表的行——也会获得它。

## 状态

每个 provider 对你所选节点所知的信息：

- **拖拽会话**：状态、当前的 id、项和传感器、目标及其是否接收、指针、浮层、可排序分组的会话和插入线；
- **列表**：它的顺序和草稿；**树**：它的行；
- **项**：它的类型、数据和位置；**放置目标**：它的规则。

项的挂载和卸载没有事件：注册表会在一秒内跟上。

## 日志

每次拖拽一个条带，按顺序排列：

<table>
<thead>
  <tr>
    <th>
      条目
    </th>
    
    <th>
      说明什么
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        drag start
      </code>
    </td>
    
    <td>
      id、传感器以及是否由触摸发起、它来自的列表。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
      
      、<code>
        left
      </code>
    </td>
    
    <td>
      进入和离开的每个目标，以及它是否接收。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        release
      </code>
    </td>
    
    <td>
      在 <code>
        onBeforeDrop
      </code>
      
       做决定期间，它被松开时所在的目标。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
    </td>
    
    <td>
      裁决：已接受、部分接受、被钩子拒绝、被目标的 <code>
        accept
      </code>
      
       拒绝，以及钩子花了多长时间。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop
      </code>
    </td>
    
    <td>
      目标；对于可排序列表，还有这次移动、<code>
        e.result
      </code>
      
      ，以及是否调用了 <code>
        preventDefault()
      </code>
      
      。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel
      </code>
    </td>
    
    <td>
      原因：被取消（Escape、<code>
        cancel()
      </code>
      
      ）、被钩子拒绝，或被目标的 <code>
        accept
      </code>
      
       拒绝。
    </td>
  </tr>
</tbody>
</table>

还有 `auto-scroll on` 和 `off`、`announcement` 文本（默认隐藏），以及拖拽之外的 `animate`（非拖拽引起的列表项变化）。单击一个条目可以查看它的数据。后来打开的标签页会收到在此之前的拖拽。

## 逐步调试一次放置

一张卡片放不进某一列。打开标签页：

1. **复现问题**，可以手动，也可以用 **Drive**，这样你的手可以腾出来操作标签页。
2. 卡片位于该列上方时**观察地图**。红色表示列表拒绝这张卡片：检查它的 `group`（`put`）或目标的 `accept`。蓝色表示它接收，问题出在后面。
3. **阅读那次拖拽的日志**。`onBeforeDrop` 会说明是谁拒绝的——钩子，还是目标的 `accept`。如果放置完成了但你的数据没有变化，`drop` 条目会说明是否调用了 `preventDefault()` 以及 `e.result` 中有什么：受控列表必须自己应用它。
4. 在 **Options** 中**实时尝试修复**——更宽松的 `acceptMode`、另一种 `collision`、`placeholder: 'indicator'`——然后把有效的那个写进你的代码。

## 工作原理

provider 向页面一侧安装的一个钩子报告。在有标签页观察该页面之前，它们只是被记录下来；之后页面像任何监听器一样进行监听，并把标签页要显示的内容发送给它——拖拽期间每 40 ms 一次，其他时候每秒两次——在几秒钟内没有标签页观察时停止。标签页通过页面源的 `BroadcastChannel` 与页面通信。它只改变你要求的东西：拖拽、选中集合和选项覆盖。

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
