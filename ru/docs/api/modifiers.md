---
title: "Модификаторы и коллизии"
description: "Функции, которые меняют, куда идёт перетаскиваемый элемент, и функции, которые выбирают цель под ним."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/api/modifiers"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="35rem" hint="Переключайте модификаторы, затем перетащите зелёный токен" name="api-modifiers">



</example>

## Модификаторы

```ts
import { restrictToParent, snapToGrid } from '@vue-dnd-kit/core';

makeSortableList(list, { items, modifiers: [restrictToParent] });
makeDragArea(board, { modifiers: [snapToGrid({ x: 24, y: 24, smooth: true })] });
```

Модификатор принимает смещение драга и возвращает новое. Модификаторы выполняются по порядку:
`modifiers` провайдера, области перетаскивания, собственные модификаторы перетаскиваемого
элемента (или его списка), затем границы области (`restrictToArea`) и последней — фиксация
`axis`. См. [оси, границы и сетки](https://zizigy.github.io/docs/guides/constraints).

<table>
<thead>
  <tr>
    <th>
      Модификатор
    </th>
    
    <th>
      Что делает
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
      Двигает только по вертикали. Опция <code>
        axis: 'y'
      </code>
      
       делает то же самое, последней. По горизонтали остаётся с содержимым, в котором начался драг (<code>
        containerShift
      </code>
      
      ), как бы ни прокручивалась страница.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToHorizontalAxis
      </code>
    </td>
    
    <td>
      Двигает только по горизонтали (<code>
        axis: 'x'
      </code>
      
      ), а по вертикали остаётся с содержимым, в котором начался драг.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToWindowEdges
      </code>
    </td>
    
    <td>
      Держит оверлей внутри окна.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToParent
      </code>
    </td>
    
    <td>
      Держит оверлей внутри контейнера, в котором начался драг: сортируемого списка или родительского элемента обычного перетаскиваемого элемента.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToElement(element)
      </code>
    </td>
    
    <td>
      Держит оверлей внутри элемента (ref, геттера или самого элемента).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToFirstScrollableAncestor
      </code>
    </td>
    
    <td>
      Держит оверлей внутри первого прокручиваемого предка перетаскиваемого элемента.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapToGrid(size | options)
      </code>
    </td>
    
    <td>
      Привязывает к сетке: <code>
        { x, y, origin: 'container' | 'delta', smooth }
      </code>
      
      . Не задайте <code>
        x
      </code>
      
       или <code>
        y
      </code>
      
      , чтобы привязывать только одну ось. <code>
        'container'
      </code>
      
       (по умолчанию) ставит левый верхний угол блока на линии сетки от левого верхнего угла контейнера; <code>
        'delta'
      </code>
      
       округляет смещение, сохраняя собственное выравнивание элемента. <code>
        smooth
      </code>
      
       плавно ведёт оверлей между ячейками.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapCenterToCursor
      </code>
    </td>
    
    <td>
      Центрирует оверлей под указателем вместо того, чтобы сохранять смещение захвата.
    </td>
  </tr>
</tbody>
</table>

<api-table name="Modifier">



</api-table>

<api-table name="ModifierArgs">



</api-table>

## Определение коллизий

```ts
import { closestCorners } from '@vue-dnd-kit/core';
```

```vue
<DnDProvider :collision="closestCorners" />
```

`collision` провайдера выбирает цель; лучший кандидат идёт первым.

<table>
<thead>
  <tr>
    <th>
      Функция
    </th>
    
    <th>
      Что выбирает
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
      По умолчанию: то, что под указателем, а иначе — то, что перекрывает оверлей.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        pointerWithin
      </code>
    </td>
    
    <td>
      Цели под указателем, по проверке попадания (с учётом z-порядка, оверлеев и shadow root).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        rectIntersection
      </code>
    </td>
    
    <td>
      Цели, которые перекрывает оверлей: сначала по приоритету, затем по глубине вложенности, затем по отношению пересечения к объединению.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCenter
      </code>
    </td>
    
    <td>
      Все цели, по расстоянию между центрами.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        closestCorners
      </code>
    </td>
    
    <td>
      Все цели, по сумме расстояний между углами (для целей друг над другом, например колонок канбана).
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
