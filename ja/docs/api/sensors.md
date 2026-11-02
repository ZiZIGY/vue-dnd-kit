---
title: "センサー"
description: "入力をドラッグに変換するもの。組み込みのポインターセンサーとキーボードセンサー、そして独自のセンサーを書くための API。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ja/docs/api/sensors"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
import { defineSensor, useSensor, pointerSensor, keyboardSensor } from '@vue-dnd-kit/core';
```

<table>
<thead>
  <tr>
    <th>
      エクスポート
    </th>
    
    <th>
      内容
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pointerSensor
      </code>
    </td>
    
    <td>
      Pointer Events を通じたマウス、タッチ、ペン。デフォルトで <code>
        sensors
      </code>
      
       に含まれます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboardSensor
      </code>
    </td>
    
    <td>
      Space/Enter で持ち上げとドロップ、矢印キーで移動、Escape でキャンセル。デフォルトで <code>
        sensors
      </code>
      
       に含まれます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        defineSensor(sensor)
      </code>
    </td>
    
    <td>
      センサーオブジェクトに型を付けます。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useSensor(sensor)
      </code>
    </td>
    
    <td>
      プロバイダーの下のコンポーネントで、そのコンポーネントが生きている間センサーを実行します。
    </td>
  </tr>
</tbody>
</table>

センサーが伝えるのは「このアイテムをここからドラッグする」ということと、その後どこへ動いたか、ドロップしたかキャンセルされたかだけです。それ以外（何をドラッグできるか、アクティベーション、ドラッグは一度に 1 つ）はプロバイダーがチェックします。[センサーとプログラムによるドラッグ](https://zizigy.github.io/docs/guides/sensors)を参照してください。

下では、小さな独自のセンサー（`useSensor` で動かします）が、プロバイダー自身のセンサーと並んで、ミニマップからボードの駒をドラッグします。

<example height="28rem" hint="ミニマップの点をドラッグしてみましょう。対応する駒が動きます" name="api-sensor-minimap">



</example>

## Sensor

<api-table name="Sensor">



</api-table>

<api-table name="SensorContext">



</api-table>

## アクティベーション

<api-table name="SensorActivation">



</api-table>

<api-table name="ActivationOptions">



</api-table>

<api-table name="ActivationConstraint">



</api-table>

## ドラッグ

<api-table name="SensorDrag">



</api-table>

<api-table name="SensorDragState">



</api-table>

<api-table name="SensorStepOptions">



</api-table>

<api-table name="SensorDirection">



</api-table>

<api-table name="SortablePosition">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
