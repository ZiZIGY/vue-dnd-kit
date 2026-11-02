---
title: "Data table · Vue DnD Kit"
description: "A Nuxt UI table of 2,000 tasks, virtualized and searchable, sorted by dragging its rows by their grips."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/ru/docs/examples/data-table"
meta:
  "og:description": "A Nuxt UI table of 2,000 tasks, virtualized and searchable, sorted by dragging its rows by their grips."
  "og:title": "Data table · Vue DnD Kit"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Документация/Обзор

# Data table

A Nuxt UI table of 2,000 tasks, virtualized and searchable, sorted by dragging its rows by their grips.

[Редактировать страницу](https://github.com/ZiZIGY/vue-dnd-kit/edit/v3/docs/content/en/4.examples/09.data-table.md)

Эта страница ещё не переведена. Вы читаете английский оригинал.

Live Drag a task by its grip; search, then drag: the hidden tasks keep their places X ---- · Y ----

Загружаем демо…

```
<script setup lang="ts">
import { DnDProvider } from '@vue-dnd-kit/core';
import TaskTable from './TaskTable.vue';
</script>

<template>
  <!-- The row in hand: a table row can't have a shadow, so its overlay content has it. -->
  <DnDProvider overlay-class="overflow-hidden rounded-md bg-default shadow-xl ring ring-accented">
    <TaskTable />
  </DnDProvider>
</template>
```

Nuxt UI's `**UTable**` renders the table, its rows and its virtualizer: only the rows on screen are in the DOM. Vue DnD Kit sorts them. The table is the library's as it comes, with its slots and its `**ui**` classes; nothing of it is rewritten.

## What to look at

- **`**TaskTable.vue**`**: the sortable list is the table's `**<tbody>**`, found through the `**tableRef**` that `**UTable**` exposes. The table gets the list's draft as its `**data**`, so the rows move while you drag, and `**get-row-id**` keys them by task, as the list does. `**axis: 'y'**` keeps the drag in its column.
- **`**RowGrip.vue**`**: `**UTable**` renders the rows, so no component of yours is a row. The grip in the first cell (the `**#grip-cell**` slot) makes the row around it the item, and is its handle.
- ****The search**** is the list's `**filter**`: the table shows the matching tasks, and a drop writes the whole array back, the hidden tasks where they were.
- **`**tasks.ts**`**: 2,000 tasks in a `**shallowRef**`: the library never looks inside them.

## A row the table renders

The grip calls `**makeSortableItem**` with a getter for the row: the `**<tr>**` around it, once it is rendered. As the handle, the grip takes the focus and the ARIA attributes, and the rest of the row stays free for clicks and text selection.

RowGrip.vue

```
const grip = useTemplateRef<HTMLElement>('grip');
makeSortableItem(() => grip.value?.closest('tr') ?? null, {
  id: () => props.task.id,
  handle: grip,
  label: () => props.task.title,
});
```

TaskTable.vue

```
<UTable ref="table" :data="items" :get-row-id="(task: Task) => task.id" …>
  <template #grip-cell="{ row }">
    <RowGrip :task="row.original" />
  </template>
</UTable>
```

The overlay is the library's copy of the row, in a table of its own with the cells' widths. A table row draws no shadow, so the provider's `**overlay-class**` gives the overlay's content one, with the table's background and a ring. The row's `**ui**` classes tint its place while it travels (`**data-[dnd-placeholder]:bg-primary/5**`).

index.vue

```
<DnDProvider overlay-class="overflow-hidden rounded-md bg-default shadow-xl ring ring-accented">
  <TaskTable />
</DnDProvider>
```

## Virtualized rows

`**virtualize**` gives the table TanStack Virtual: the rows on screen and 8 more around them (`**overscan**`) are rendered, between two spacer rows.

TaskTable.vue

```
<UTable
  :data="items"
  :watch-options="{ deep: false }"
  :virtualize="{ estimateSize: 45, overscan: 8, onChange: () => captureLayout() }"
  class="h-[26rem]"
/>
```

- `**estimateSize**` is a first guess: the virtualizer measures each row as it renders. A measurement moves the rows below it, and `**onChange**` calls the list's `**captureLayout()**`, so the library animates that move during a drag instead of letting it jump.
- The table is the scroller: near its top or bottom edge a drag scrolls it, and new rows render as they come into view.
- The draft is a new array after every move, so the table needn't watch inside it ( `**deep: false**`).
- Scroll far from the row you hold, and it leaves the rendered range and unmounts. The drag goes on: the overlay still shows it, and it lands where the draft puts it. A virtual list of your own can keep it mounted with `**rangeExtractor**` (see [**Virtual lists**](https://zizigy.github.io/vue-dnd-kit/ru/docs/guides/virtual-lists#tanstack-virtual)). A table lays its rows out between spacer rows, where a row rendered far from the others would push them aside, so this one lets it go.

## Search, then drag

TaskTable.vue

```
const { items, captureLayout } = makeSortableList(() => table.value?.tableRef?.tBodies[0] ?? null, {
  items: tasks,
  filter: (task) => {
    const text = query.value.trim().toLowerCase();
    return !text || `${task.id} ${task.title} ${task.assignee}`.toLowerCase().includes(text);
  },
  axis: 'y',
  label: 'Tasks',
});
```

Search "Mia", move one of her tasks above another, then clear the search: her tasks are in the new order, and every other task is where it was. The drop's `**e.to.index**` counts the rows shown; `**e.result**` holds the whole array.

****Other UI libraries.**** Nuxt UI renders plain elements and passes your classes and attributes on, as the Reka UI primitives it is built on do: a ref, a slot and a class are all it takes. In other libraries a table renders its rows too, and the same recipe works:

- ****The row.**** A slot that renders the whole row (Vuetify's `**#item**`, Quasar's `**#body**`) gives you its element: make it the item. Where you only get cells (a PrimeVue `**Column**`'s `**#body**`, an Element Plus column's default slot, Naive UI's `**render**`), put a grip in one and make its `**closest('tr')**` the item, as here.
- ****The list.**** The `**<tbody>**` inside the table's root element: a template ref on the table gives you the component, and its `**$el**` the element.
- ****The keys and the data.**** Key the rows by your id ( `**item-value**`, `**row-key**`, `**dataKey**`) and give the table the list's draft as its data.
- ****Its own ordering off.**** Leave out the table's own row reordering and its column sorting: the order is the list's.
- ****Virtual tables**** place their rows between spacers or in absolute boxes: both work, and a drag survives its row unmounting.

The StackBlitz button opens the files in a plain Vite project, which has no Nuxt UI. To run this example, copy the folder into a Nuxt app with the `**@nuxt/ui**` module and render `**index.vue**` on a page.

## Keyboard and screen readers

Tab to a task's grip and press `Space` to pick the row up. `ArrowUp` and `ArrowDown` move it, `Space` drops it, `Escape` puts it back. The rows have a `**label**`, and the list too: screen readers hear "Fix the login form dropped at position 3 of 2000 in Tasks.", not keys.

Read more: [**Virtual lists**](https://zizigy.github.io/vue-dnd-kit/ru/docs/guides/virtual-lists) · [**Show some of the items**](https://zizigy.github.io/vue-dnd-kit/ru/docs/guides/sortable-lists#show-some-of-the-items) · [**Styling: Tailwind and UI kits**](https://zizigy.github.io/vue-dnd-kit/ru/docs/guides/styling#tailwind-css) · [**Accessibility**](https://zizigy.github.io/vue-dnd-kit/ru/docs/guides/accessibility)

```json
{"@context":"https://schema.org","@graph":[{"@id":"https://zizigy.github.io/vue-dnd-kit/ru#website","@type":"WebSite","description":"Drag and drop for Vue 3: sortable lists, kanban boards, trees, multi-drag, animations and accessibility out of the box.","inLanguage":"ru-RU","name":"Vue DnD Kit","url":"https://zizigy.github.io/vue-dnd-kit/ru","translationOfWork":{"@id":"https://zizigy.github.io/vue-dnd-kit#website"}},{"@id":"https://zizigy.github.io/vue-dnd-kit/ru/docs/examples/data-table#webpage","@type":"WebPage","description":"A Nuxt UI table of 2,000 tasks, virtualized and searchable, sorted by dragging its rows by their grips.","name":"Data table","url":"https://zizigy.github.io/vue-dnd-kit/ru/docs/examples/data-table","isPartOf":{"@id":"https://zizigy.github.io/vue-dnd-kit/ru#website"},"potentialAction":[{"@type":"ReadAction","target":["https://zizigy.github.io/vue-dnd-kit/ru/docs/examples/data-table"]}]}]}
```

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
