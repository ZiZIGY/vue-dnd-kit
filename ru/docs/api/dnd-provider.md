---
title: "DnDProvider"
description: "Компонент, который отвечает за драг — ввод, оверлей, выделение, автоскролл и live-регион — для всего, что отрендерено внутри него."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/api/dnd-provider"
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

Каждый композабл должен вызываться в компоненте, отрендеренном **внутри** провайдера. Цель —
один провайдер на всё приложение: части страницы получают свои правила через
[`makeDragArea`](https://zizigy.github.io/docs/api/make-drag-area). См. [руководство по провайдеру](https://zizigy.github.io/docs/guides/provider).

Большинство пропсов читается тогда, когда они нужны провайдеру: измените один, и следующий драг
его использует.

<example height="37rem" hint="Переключите проп, затем перетащите задачу: мышью, с удержанием, с Alt или Shift или клавишей Space на задаче в фокусе" name="api-provider-props">



</example>

### Где рендерится оверлей

`overlayTo` выносит оверлей из `body`: в модальный `<dialog>`, который находится над всем
остальным на странице. Выключите переключатель, и строки, которые вы перетаскиваете, исчезнут
под диалогом. [Руководство по оверлею](https://zizigy.github.io/docs/guides/overlay#where-it-renders-overlayto)
объясняет, когда это нужно.

<example height="22rem" hint="Откройте диалог и перетащите колонку; затем выключите переключатель и перетащите снова" name="overlay-dialog">



</example>

## Пропсы

<api-table name="DnDProviderProps">



</api-table>

## События

<table>
<thead>
  <tr>
    <th>
      Событие
    </th>
    
    <th>
      Данные
    </th>
    
    <th>
      Когда
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
      Драг начался (после своей активации).
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
      Указатель сдвинулся во время драга (не чаще раза за кадр).
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
      Сменилась цель под драгом.
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
      Бросок состоялся и был записан.
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
      Драг отменён или бросок отклонён.
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
      
       или <code>
        DnDEvent
      </code>
    </td>
    
    <td>
      Оверлей драга приземлился: то же, что получил <code>
        drag-end
      </code>
      
       или <code>
        drag-cancel
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Те же события, а также `onBeforeDrop` и `onDragResume`, доступны в любом месте под провайдером
через [`useDnDMonitor`](https://zizigy.github.io/docs/api/use-dnd). Их данные описаны на
[странице событий](https://zizigy.github.io/docs/api/events).

## Слот `#overlay`

Рендерит то, что следует за указателем, для каждого драга без собственного компонента оверлея
(см. [руководство по оверлею](https://zizigy.github.io/docs/guides/overlay)). Если слот ничего не рендерит, используется
клон.

<api-table name="OverlaySlotProps">



</api-table>

## Клавиатура

<api-table name="KeyboardOptions">



</api-table>

## Автоскролл

<api-table name="AutoScrollOptions">



</api-table>

## Вибрация

<api-table name="HapticsOptions">



</api-table>

## Объявления

<api-table name="Announcements">



</api-table>

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
