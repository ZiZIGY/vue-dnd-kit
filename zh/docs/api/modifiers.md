---
title: "修饰器与碰撞检测"
description: "改变被拖拽项去向的函数，以及选出它下方目标的函数。"
canonical_url: "https://zizigy.github.io/vue-dnd-kit/zh/docs/api/modifiers"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="35rem" hint="切换修饰器，然后拖动绿色的方块" name="api-modifiers">



</example>

## 修饰器

```ts
import { restrictToParent, snapToGrid } from '@vue-dnd-kit/core';

makeSortableList(list, { items, modifiers: [restrictToParent] });
makeDragArea(board, { modifiers: [snapToGrid({ x: 24, y: 24, smooth: true })] });
```

修饰器接收拖拽的偏移量，并返回一个新的偏移量。它们按顺序运行：provider 的 `modifiers`、拖拽区域的、可拖拽元素自己的（或其列表的），然后是区域的边界（`restrictToArea`），最后是 `axis` 锁定。参见[轴、边界与网格](https://zizigy.github.io/docs/guides/constraints)。

<table>
<thead>
  <tr>
    <th>
      修饰器
    </th>
    
    <th>
      作用
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
      只垂直移动。<code>
        axis: 'y'
      </code>
      
       选项效果相同，并且最后执行。水平方向上，无论页面如何滚动，它都跟随拖拽开始时所在的内容（<code>
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
      只水平移动（<code>
        axis: 'x'
      </code>
      
      ），垂直方向上跟随拖拽开始时所在的内容。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToWindowEdges
      </code>
    </td>
    
    <td>
      把浮层限制在窗口内。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToParent
      </code>
    </td>
    
    <td>
      把浮层限制在拖拽开始时所在的容器内：可排序列表，或普通可拖拽元素的父元素。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToElement(element)
      </code>
    </td>
    
    <td>
      把浮层限制在某个元素内（ref、getter 或元素本身）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToFirstScrollableAncestor
      </code>
    </td>
    
    <td>
      把浮层限制在被拖拽元素的第一个可滚动祖先内。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapToGrid(size | options)
      </code>
    </td>
    
    <td>
      吸附到网格：<code>
        { x, y, origin: 'container' | 'delta', smooth }
      </code>
      
      。省略 <code>
        x
      </code>
      
       或 <code>
        y
      </code>
      
       就只吸附一个轴。<code>
        'container'
      </code>
      
      （默认）把盒子的左上角放在从容器左上角开始的网格线上；<code>
        'delta'
      </code>
      
       对偏移量取整，保持项自身的对齐。<code>
        smooth
      </code>
      
       让浮层在格子之间平滑滑动。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapCenterToCursor
      </code>
    </td>
    
    <td>
      让浮层的中心对准指针，而不是保持抓取时的偏移。
    </td>
  </tr>
</tbody>
</table>

<api-table name="Modifier">



</api-table>

<api-table name="ModifierArgs">



</api-table>

## 碰撞检测

```ts
import { closestCorners } from '@vue-dnd-kit/core';
```

```vue
<DnDProvider :collision="closestCorners" />
```

provider 的 `collision` 负责选出目标；最佳候选排在最前。

<table>
<thead>
  <tr>
    <th>
      函数
    </th>
    
    <th>
      选出什么
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
      默认：指针下方的目标，否则是与浮层重叠的目标。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointerWithin
      </code>
    </td>
    
    <td>
      通过命中测试得到的指针下方的目标（遵循 z 轴顺序、浮层和 shadow root）。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        rectIntersection
      </code>
    </td>
    
    <td>
      与浮层重叠的目标：先比较优先级，再比较嵌套深度，最后比较交并比。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCenter
      </code>
    </td>
    
    <td>
      所有目标，按中心之间的距离排序。
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCorners
      </code>
    </td>
    
    <td>
      所有目标，按各角之间距离之和排序（适用于看板列这类上下堆叠的目标）。
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
