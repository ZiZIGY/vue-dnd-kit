---
title: "传感器"
description: "把输入转换为拖拽的东西——内置的指针和键盘传感器，以及编写自定义传感器的 API。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/api/sensors"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

```ts
import { defineSensor, useSensor, pointerSensor, keyboardSensor } from '@vue-dnd-kit/core';
```

<table>
<thead>
  <tr>
    <th>
      导出
    </th>
    
    <th>
      含义
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
      鼠标、触摸和触控笔，通过 Pointer Events 实现。默认包含在 <code>
        sensors
      </code>
      
       中。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboardSensor
      </code>
    </td>
    
    <td>
      Space/Enter 拿起和放下，方向键移动，Escape 取消。默认包含在 <code>
        sensors
      </code>
      
       中。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        defineSensor(sensor)
      </code>
    </td>
    
    <td>
      为传感器对象提供类型。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        useSensor(sensor)
      </code>
    </td>
    
    <td>
      在 provider 之下的组件中运行传感器，持续到组件销毁。
    </td>
  </tr>
</tbody>
</table>

传感器只说“从这里拖拽这个项”，然后说明它移动到了哪里、是放下了还是被取消了；其余的由 provider 检查（什么可以被拖拽、激活、同一时间只有一次拖拽）。参见[传感器与程序化拖拽](https://zizigy.github.io/docs/guides/sensors)。

下面是一个小型自定义传感器（用 `useSensor` 运行），它与 provider 自己的传感器并存，从小地图上拖动棋盘上的棋子。

<example height="28rem" hint="在小地图上拖动一个圆点：对应的棋子随之移动" name="api-sensor-minimap">



</example>

## Sensor

<api-table name="Sensor">



</api-table>

<api-table name="SensorContext">



</api-table>

## 激活

<api-table name="SensorActivation">



</api-table>

<api-table name="ActivationOptions">



</api-table>

<api-table name="ActivationConstraint">



</api-table>

## 拖拽

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
