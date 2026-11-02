---
title: "モディファイアと衝突判定"
description: "ドラッグ中のアイテムの行き先を変える関数と、その下のターゲットを選ぶ関数。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/api/modifiers"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="35rem" hint="モディファイアを切り替えてから、緑のトークンをドラッグしてみましょう" name="api-modifiers">



</example>

## モディファイア

```ts
import { restrictToParent, snapToGrid } from '@vue-dnd-kit/core';

makeSortableList(list, { items, modifiers: [restrictToParent] });
makeDragArea(board, { modifiers: [snapToGrid({ x: 24, y: 24, smooth: true })] });
```

モディファイアはドラッグのオフセットを受け取り、新しいオフセットを返します。実行順は次のとおりです：プロバイダーの `modifiers`、ドラッグエリアのもの、ドラッグ可能な要素自身のもの（またはそのリストのもの）、次にエリアの境界（`restrictToArea`）、最後に `axis` による固定。[軸、境界、グリッド](https://zizigy.github.io/docs/guides/constraints)を参照してください。

<table>
<thead>
  <tr>
    <th>
      モディファイア
    </th>
    
    <th>
      役割
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        restrictToVerticalAxis
      </code>
    </td>
    
    <td>
      縦方向にだけ動かします。<code>
        axis: 'y'
      </code>
      
       オプションも同じことを、最後に行います。横方向は、ページがどうスクロールしても、ドラッグを開始したコンテンツに追従します（<code>
        containerShift
      </code>
      
      ）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToHorizontalAxis
      </code>
    </td>
    
    <td>
      横方向にだけ動かし（<code>
        axis: 'x'
      </code>
      
      ）、縦方向はドラッグを開始したコンテンツに追従します。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToWindowEdges
      </code>
    </td>
    
    <td>
      オーバーレイをウィンドウ内に留めます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToParent
      </code>
    </td>
    
    <td>
      オーバーレイを、ドラッグが始まったコンテナー（並べ替え可能なリスト、または通常のドラッグ可能な要素の親要素）内に留めます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToElement(element)
      </code>
    </td>
    
    <td>
      オーバーレイを要素内に留めます（ref、ゲッター、または要素そのもの）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToFirstScrollableAncestor
      </code>
    </td>
    
    <td>
      オーバーレイを、ドラッグ中の要素の最初のスクロール可能な祖先内に留めます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapToGrid(size | options)
      </code>
    </td>
    
    <td>
      グリッドにスナップさせます：<code>
        { x, y, origin: 'container' | 'delta', smooth }
      </code>
      
      。<code>
        x
      </code>
      
       か <code>
        y
      </code>
      
       を省くと、1 つの軸だけをスナップします。<code>
        'container'
      </code>
      
      （デフォルト）はボックスの左上をコンテナーの左上から引いたグリッド線に合わせ、<code>
        'delta'
      </code>
      
       はオフセットを丸めて、アイテム自身の揃え方を保ちます。<code>
        smooth
      </code>
      
       はオーバーレイをセルの間で滑らかに移動させます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapCenterToCursor
      </code>
    </td>
    
    <td>
      掴んだ位置のオフセットを保つ代わりに、オーバーレイの中心をポインターの下に合わせます。
    </td>
  </tr>
</tbody>
</table>

<api-table name="Modifier">



</api-table>

<api-table name="ModifierArgs">



</api-table>

## 衝突判定

```ts
import { closestCorners } from '@vue-dnd-kit/core';
```

```vue
<DnDProvider :collision="closestCorners" />
```

プロバイダーの `collision` がターゲットを選びます。最も良い候補が先頭に来ます。

<table>
<thead>
  <tr>
    <th>
      関数
    </th>
    
    <th>
      選ぶもの
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pointerFirst
      </code>
    </td>
    
    <td>
      デフォルト：ポインターの下にあるもの。なければオーバーレイと重なっているもの。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointerWithin
      </code>
    </td>
    
    <td>
      ヒットテストによる、ポインターの下のターゲット（z 順序、オーバーレイ、shadow root を考慮）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        rectIntersection
      </code>
    </td>
    
    <td>
      オーバーレイと重なっているターゲット：優先度が高いもの、次にネストが深いもの、次に IoU（Intersection over Union）が大きいもの。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCenter
      </code>
    </td>
    
    <td>
      すべてのターゲットを、中心間の距離で。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCorners
      </code>
    </td>
    
    <td>
      すべてのターゲットを、角どうしの距離の合計で（カンバンの列のように積み重なったターゲット向け）。
    </td>
  </tr>
</tbody>
</table>

<api-table name="CollisionDetection">



</api-table>

<api-table name="CollisionArgs">



</api-table>

<api-table name="CollisionCandidate">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
