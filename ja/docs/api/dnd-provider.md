---
title: "DnDProvider"
description: "ドラッグを管理するコンポーネント。その内側に描画されるすべてのものについて、入力、オーバーレイ、選択、自動スクロール、ライブリージョンを担います。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/api/dnd-provider"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```vue [App.vue]
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
</script>

<template>
  <DnDProvider :animation="{ duration: 200 }" @drag-end="save">
    <RouterView />
    <template #overlay="{ items, over, accepted }">
      <!-- optional: a custom overlay for every drag -->
    </template>
  </DnDProvider>
</template>
```

すべてのコンポーザブルは、プロバイダーの**内側**に描画されるコンポーネントで実行する必要があります。目指すのはアプリ全体で 1 つのプロバイダーです：ページの各部分は [`makeDragArea`](https://zizigy.github.io/docs/api/make-drag-area) で独自のルールを持てます。[プロバイダーのガイド](https://zizigy.github.io/docs/guides/provider)を参照してください。

ほとんどの props は、プロバイダーが必要とした時点で読まれます。1 つを変更すると、次のドラッグからそれが使われます。

<example height="37rem" hint="prop を切り替えてから、タスクをドラッグしてみましょう：マウスで、長押しで、Alt や Shift を押しながら、またはフォーカスしたタスクで Space を押して" name="api-provider-props">



</example>

### オーバーレイの描画先

`overlayTo` はオーバーレイを `body` の外へ移します：ページのほかのすべてより上にある、モーダルの `<dialog>` の中などです。スイッチをオフにすると、ドラッグした行がダイアログの下に消えます。それが必要になる場面は[オーバーレイのガイド](https://zizigy.github.io/docs/guides/overlay#where-it-renders-overlayto)で説明しています。

<example height="22rem" hint="ダイアログを開いて列をドラッグし、スイッチをオフにしてもう一度ドラッグしてみましょう" name="overlay-dialog">



</example>

## Props

<api-table name="DnDProviderProps">



</api-table>

## イベント

<table>
<thead>
  <tr>
    <th>
      イベント
    </th>
    
    <th>
      ペイロード
    </th>
    
    <th>
      タイミング
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        drag-start
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      ドラッグが始まった（アクティベーションの後）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-move
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      ドラッグ中にポインターが動いた（最大で 1 フレームに 1 回）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-over
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      ドラッグの下のターゲットが変わった。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-end
      </code>
    </td>
    
    <td>
      <code>
        DnDEndEvent
      </code>
    </td>
    
    <td>
      ドロップが成立し、書き込まれた。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-cancel
      </code>
    </td>
    
    <td>
      <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      ドラッグがキャンセルされた、またはドロップが拒否された。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag-settle
      </code>
    </td>
    
    <td>
      <code>
        DnDEndEvent
      </code>
      
       または <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      ドラッグのオーバーレイが着地した：<code>
        drag-end
      </code>
      
       または <code>
        drag-cancel
      </code>
      
       が受け取ったもの。
    </td>
  </tr>
</tbody>
</table>

同じイベントに `onBeforeDrop` と `onDragResume` を加えたものが、[`useDnDMonitor`](https://zizigy.github.io/docs/api/use-dnd) を使えばプロバイダーの下のどこでも利用できます。ペイロードは[イベントのページ](https://zizigy.github.io/docs/api/events)にあります。

## `#overlay` スロット

独自のオーバーレイコンポーネントを持たないすべてのドラッグについて、ポインターに追従するものを描画します（[オーバーレイのガイド](https://zizigy.github.io/docs/guides/overlay)を参照）。何も描画しない場合はクローンにフォールバックします。

<api-table name="OverlaySlotProps">



</api-table>

## キーボード

<api-table name="KeyboardOptions">



</api-table>

## 自動スクロール

<api-table name="AutoScrollOptions">



</api-table>

## 触覚フィードバック

<api-table name="HapticsOptions">



</api-table>

## 読み上げ

<api-table name="Announcements">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
