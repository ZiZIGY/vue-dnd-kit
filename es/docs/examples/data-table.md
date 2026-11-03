---
title: "Tabla de datos"
description: "Una tabla de Nuxt UI con 2000 tareas, virtualizada y con búsqueda, ordenada arrastrando sus filas por sus asas."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/examples/data-table"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="34rem" hint="Arrastra una tarea por su asa; busca y luego arrastra: las tareas ocultas conservan sus sitios" name="ui-table" title="Tabla de datos">



</example>

El `UTable` de Nuxt UI renderiza la tabla, sus filas y su virtualizador: solo las filas que están en
pantalla están en el DOM. Vue DnD Kit las ordena. La tabla es la de la biblioteca tal como viene,
con sus slots y sus clases `ui`; no se reescribe nada de ella.

## Qué observar

- **TaskTable.vue**: la lista ordenable es el `<tbody>` de la tabla, que se encuentra a través del
`tableRef` que expone `UTable`. La tabla recibe el borrador de la lista como su `data`, así que las
filas se mueven mientras arrastras, y `get-row-id` les da como clave la tarea, igual que hace la
lista. `axis: 'y'` mantiene el arrastre en su columna, y `restrictToFirstScrollableAncestor`, dentro
de la tabla: su contenedor desplazable es el primer elemento desplazable alrededor de las filas.
Amplía la demo: la tabla llena la pantalla.
- **RowGrip.vue**: `UTable` renderiza las filas, así que ningún componente tuyo es una fila. El asa
de la primera celda (el slot `#grip-cell`) convierte en el ítem la fila que la rodea, y es su asa
(`handle`).
- **La búsqueda** es el `filter` de la lista: la tabla muestra las tareas que coinciden, y un drop
escribe de vuelta el array entero, con las tareas ocultas donde estaban.
- **tasks.ts**: 2000 tareas en un `shallowRef`: la biblioteca nunca mira dentro de ellas.

## Una fila que renderiza la tabla

El asa llama a `makeSortableItem` con un getter para la fila: el `<tr>` que la rodea, una vez
renderizado. Como es el `handle`, el asa recibe el foco y los atributos ARIA, y el resto de la fila
queda libre para los clics y la selección de texto.

```ts [RowGrip.vue]
const grip = useTemplateRef<HTMLElement>('grip');
makeSortableItem(() => grip.value?.closest('tr') ?? null, {
  id: () => props.task.id,
  handle: grip,
  label: () => props.task.title,
});
```

```vue [TaskTable.vue]
<UTable ref="table" :data="items" :get-row-id="(task: Task) => task.id" …>
  <template #grip-cell="{ row }">
    <RowGrip :task="row.original" />
  </template>
</UTable>
```

El overlay es la copia de la fila que hace la biblioteca, en una tabla propia con los anchos de las
celdas. Una fila de tabla no dibuja sombra, así que el `overlay-class` del provider le da una al
contenido del overlay, con el fondo de la tabla y un anillo. Las clases `ui` de la fila tiñen su
sitio mientras viaja (`data-[dnd-placeholder]:bg-primary/5`).

```vue [index.vue]
<DnDProvider overlay-class="overflow-hidden rounded-md bg-default shadow-xl ring ring-accented">
  <TaskTable />
</DnDProvider>
```

## Filas virtualizadas

`virtualize` le da a la tabla TanStack Virtual: se renderizan las filas en pantalla y 8 más a su
alrededor (`overscan`), entre dos filas espaciadoras.

```vue [TaskTable.vue]
<UTable
  :data="items"
  :watch-options="{ deep: false }"
  :virtualize="{ estimateSize: 45, overscan: 8, onChange: () => captureLayout() }"
  class="min-h-0 flex-1"
/>
```

- `estimateSize` es una primera estimación: el virtualizador mide cada fila al renderizarla. Una
medición mueve las filas que hay debajo, y `onChange` llama al `captureLayout()` de la lista, así
que la biblioteca anima ese movimiento durante un arrastre en lugar de dejar que salte.
- La tabla es el contenedor desplazable, y la fila en la mano se queda dentro de ella: cerca de su
borde superior o inferior, un arrastre la desplaza, y las filas nuevas se renderizan a medida que
entran a la vista.
- El borrador es un array nuevo después de cada movimiento, así que la tabla no necesita observar su
interior (`deep: false`).
- Desplázate lejos de la fila que sostienes, y sale del rango renderizado y se desmonta. El arrastre
continúa: el overlay la sigue mostrando, y aterriza donde la pone el borrador. Una lista virtual
propia puede mantenerla montada con `rangeExtractor` (consulta
[Listas virtuales](https://zizigy.github.io/docs/guides/virtual-lists#tanstack-virtual)). Una tabla coloca sus filas entre
filas espaciadoras, donde una fila renderizada lejos de las demás las apartaría, así que esta la
deja ir.

## Buscar y luego arrastrar

```ts [TaskTable.vue]
const { items, captureLayout } = makeSortableList(() => table.value?.tableRef?.tBodies[0] ?? null, {
  items: tasks,
  filter: (task) => {
    const text = query.value.trim().toLowerCase();
    return !text || `${task.id} ${task.title} ${task.assignee}`.toLowerCase().includes(text);
  },
  axis: 'y',
  modifiers: [restrictToFirstScrollableAncestor],
  label: 'Tasks',
});
```

Busca «Mia», mueve una de sus tareas encima de otra y luego vacía la búsqueda: sus tareas están en el
nuevo orden, y todas las demás tareas siguen donde estaban. El `e.to.index` del drop cuenta las
filas mostradas; `e.result` contiene el array entero.

<tip>

**Otras bibliotecas de UI.** Nuxt UI renderiza elementos simples y les pasa tus clases y atributos,
como hacen las primitivas de Reka UI sobre las que está construido: una ref, un slot y una clase es
todo lo que hace falta. En otras bibliotecas, una tabla también renderiza sus filas, y la misma
receta funciona:

- **La fila.** Un slot que renderiza la fila entera (`#item` de Vuetify, `#body` de Quasar) te da su
elemento: conviértelo en el ítem. Donde solo recibes celdas (el `#body` de una `Column` de
PrimeVue, el slot por defecto de una columna de Element Plus, el `render` de Naive UI), pon un asa
en una de ellas y convierte su `closest('tr')` en el ítem, como aquí.
- **La lista.** El `<tbody>` dentro del elemento raíz de la tabla: una ref de plantilla en la tabla
te da el componente, y su `$el`, el elemento.
- **Las claves y los datos.** Da a las filas como clave tu id (`item-value`, `row-key`, `dataKey`) y
pásale a la tabla el borrador de la lista como sus datos.
- **Sin su propia ordenación.** Prescinde de la reordenación de filas propia de la tabla y de su
ordenación por columnas: el orden es el de la lista.
- **Las tablas virtuales** colocan sus filas entre espaciadores o en cajas absolutas: las dos cosas
funcionan, y un arrastre sobrevive a que su fila se desmonte.

</tip>

<note>

El botón de StackBlitz abre los archivos en un proyecto de Vite configurado para Nuxt UI, como lo
hace su documentación para Vue: el plugin `@nuxt/ui/vite`, Tailwind CSS y `UApp` alrededor del
ejemplo. En una app de Nuxt con el módulo `@nuxt/ui`, copia la carpeta y renderiza `index.vue` en
una página.

</note>

## Teclado y lectores de pantalla

Llega con Tab al asa de una tarea y pulsa <kbd value="Space">



</kbd>

 para agarrar la fila.
<kbd value="ArrowUp">



</kbd>

 y <kbd value="ArrowDown">



</kbd>

 la mueven, <kbd value="Space">



</kbd>

 la suelta y
<kbd value="Escape">



</kbd>

 la devuelve a su sitio. Las filas tienen un `label`, y la lista también: los
lectores de pantalla oyen «Fix the login form dropped at position 3 of 2000 in Tasks.», no claves.

Más información: [Listas virtuales](https://zizigy.github.io/docs/guides/virtual-lists) ·
[Mostrar solo algunos ítems](https://zizigy.github.io/docs/guides/sortable-lists#show-some-of-the-items) ·
[Estilos: Tailwind y kits de UI](https://zizigy.github.io/docs/guides/styling#tailwind-css) ·
[Accesibilidad](https://zizigy.github.io/docs/guides/accessibility)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
