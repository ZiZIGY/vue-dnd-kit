---
title: "Decidir un drop"
description: "Aceptar, rechazar o aplazar un drop — reglas durante el arrastre o al soltar, parte de un multi-drag, un diálogo, un servidor que debe estar de acuerdo primero, monitores que vetan y drops fuera de cualquier destino."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/guides/drop-decisions"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Arrastra una tarjeta a **Done**. El drop espera tu respuesta: mover la tarjeta, seguir
arrastrándola a otro sitio o cancelar.

<example height="25rem" hint="Arrastra una tarjeta a Done" name="drop-confirm">



</example>

## onBeforeDrop

```ts
makeSortableList(listRef, {
  items: tasks,
  onBeforeDrop: (e) => (e.items.some((task) => task.locked) ? 'reject' : 'accept'),
});
```

Las listas, los árboles, los destinos de drop (`makeDroppable`) y los monitores (`useDnDMonitor`)
aceptan un `onBeforeDrop`. Se ejecuta al soltar el arrastre, antes de que cambie nada, y su
respuesta decide:

<table>
<thead>
  <tr>
    <th>
      Respuesta
    </th>
    
    <th>
      Qué pasa
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'accept'
      </code>
      
      , <code>
        true
      </code>
      
       o nada
    </td>
    
    <td>
      El drop se completa.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'reject'
      </code>
      
       o <code>
        false
      </code>
    </td>
    
    <td>
      No hay drop: los ítems vuelven a su sitio. Un error lanzado también rechaza.
    </td>
  </tr>
  
  <tr>
    <td>
      Un array de claves
    </td>
    
    <td>
      Solo esos ítems se sueltan; los demás vuelven a su sitio.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'continue'
      </code>
    </td>
    
    <td>
      No hay drop y el arrastre continúa.
    </td>
  </tr>
  
  <tr>
    <td>
      Una promesa de cualquiera de estas
    </td>
    
    <td>
      El overlay espera donde se soltó hasta que la promesa se resuelva.
    </td>
  </tr>
</tbody>
</table>

Las listas y los árboles pasan un `SortableDropEvent`: `keys`, `items`, `from`, `to`, `mode`,
`sameList` y `result`, los nuevos arrays de cada lista que cambia el drop. Los destinos de drop y
los monitores reciben el `DnDEvent` genérico: `active`, `over`, `position` y `source`. Consulta
[eventos](https://zizigy.github.io/docs/api/events).

## Una regla durante el arrastre, o al soltar

Email y Chat aceptan adjuntos de 10 MB como máximo. Arrastra **demo.mov** sobre cada uno:
Email lo rechaza mientras estás encima, Chat lo acepta y lo devuelve cuando sueltas.

<example height="27rem" hint="Arrastra un archivo de más de 10 MB a cada sitio" name="drop-rules">



</example>

```ts [Column.vue]
// Asked while dragging: a refused drag never enters the list.
group: { name: 'attachments', put: ({ items }) => fits(items as Attachment[]) },

// Asked on release: the drag enters the list, then flies back.
onBeforeDrop: (e) => (fits(e.items) ? 'accept' : 'reject'),
```

<table>
<thead>
  <tr>
    <th>
      
    </th>
    
    <th>
      <code>
        group.put
      </code>
      
       (o el <code>
        accept
      </code>
      
       de un destino)
    </th>
    
    <th>
      <code>
        onBeforeDrop
      </code>
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Se pregunta
    </td>
    
    <td>
      Durante el arrastre, en cuanto el arrastre llega a la lista.
    </td>
    
    <td>
      Una vez, cuando se suelta el arrastre.
    </td>
  </tr>
  
  <tr>
    <td>
      El usuario ve
    </td>
    
    <td>
      La lista rechaza al instante: no se abre ningún hueco, <code>
        isAccepting
      </code>
      
       es <code>
        false
      </code>
      
      , <code>
        over.accepted
      </code>
      
       es <code>
        false
      </code>
      
      .
    </td>
    
    <td>
      El hueco se abre como siempre; los ítems vuelven a su sitio al soltar.
    </td>
  </tr>
  
  <tr>
    <td>
      Sabe
    </td>
    
    <td>
      Qué se arrastra: <code>
        keys
      </code>
      
      , <code>
        items
      </code>
      
      , <code>
        types
      </code>
      
      , <code>
        from
      </code>
      
      , <code>
        to
      </code>
      
      .
    </td>
    
    <td>
      Todo el drop: <code>
        to.index
      </code>
      
      , <code>
        sameList
      </code>
      
      , <code>
        mode
      </code>
      
      , <code>
        result
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      Puede
    </td>
    
    <td>
      Decir sí o no.
    </td>
    
    <td>
      Esperar una promesa, aceptar algunas claves, mantener el arrastre.
    </td>
  </tr>
</tbody>
</table>

Usa `group.put` para lo que se sabe solo con los ítems (un tipo, una marca, una cantidad): el
usuario lo ve antes de soltar. Usa `onBeforeDrop` para lo que depende del sitio, de la respuesta
del usuario o de la del servidor. Las reglas propias del destino van primero: sobre una lista o
un destino que rechaza el arrastre, el drop se cancela y no se pregunta a su `onBeforeDrop`.

### Aceptar algunos de los ítems

Algunas reglas solo se pueden comprobar al soltar, contra un servidor. Las plazas de este taller
también las reservan otros: al soltar, la lista pregunta al servidor cuántas quedan, y acepta ese
número de las personas arrastradas. Marca unas cuantas y arrástralas juntas.

<example height="28.5rem" hint="Marca tres personas y arrastra una de ellas al taller" name="drop-partial">



</example>

```ts [Column.vue]
makeSortableList(list, {
  items: toRef(props.column, 'people'),
  group: 'workshop',
  // Some keys: those land, the others fly back to where they came from.
  onBeforeDrop: async (e) => {
    const { free } = await seatsLeft(props.column.people.length); // the overlay waits
    return e.keys.slice(0, free);
  },
  onDrop: (e) => {
    selection.delete(...e.accepted); // the ones sent back stay selected
    notice.value = `${e.accepted.length} booked, ${e.rejected.length} back to the waiting list`;
  },
});
```

En un [multi-drag](https://zizigy.github.io/docs/guides/multi-drag), las claves que devuelves aterrizan juntas y el resto
vuelve a su sitio. `onDrop` las ve luego en `e.accepted` y `e.rejected`, y su `e.result` es el
definitivo. Un array vacío no acepta nada: el drop se rechaza.

## Seguir arrastrando: 'continue'

`'continue'` cancela el drop, no el arrastre. Responde **Keep dragging** en el diálogo de arriba:
el ítem sigue en la mano desde donde estaba, la página vuelve al modo de arrastre y el usuario
continúa.

- Con ratón o lápiz, el ítem sigue al puntero sin ningún botón pulsado. La siguiente vez que se
suelta — un clic — lo suelta, y ese clic nunca llega a la página de debajo.
- Con el dedo, el ítem se vuelve a agarrar donde se posa el dedo; levantar el dedo lo suelta.
- Un arrastre con teclado continúa: las flechas mueven el ítem, <kbd value="Space">



</kbd>

 o
<kbd value="Enter">



</kbd>

 lo sueltan.
- <kbd value="Escape">



</kbd>

 lo cancela, como cualquier arrastre.
- El siguiente drop vuelve a preguntar a `onBeforeDrop`.

Los monitores reciben `onDragResume`, y los lectores de pantalla anuncian que el ítem no se soltó
y que sigue moviéndose (cambia el texto con `announcements.onDragResume` del provider).

```ts
useDnDMonitor({
  onDragResume() {
    hint.value = 'Still dragging: click to drop, Esc to cancel';
  },
});
```

## Preguntar al usuario

`onBeforeDrop` puede devolver una promesa. Abre un diálogo y resuelve la promesa con el botón que
elija el usuario:

```ts [Column.vue]
const { items } = makeSortableList(list, {
  id: props.column.id,
  items: toRef(props.column, 'tasks'),
  group: 'release',
  onBeforeDrop: (e) => (props.column.confirm && !e.sameList ? props.ask(e) : 'accept'),
});
```

```ts [Board.vue]
type Answer = 'accept' | 'continue' | 'reject';
const question = shallowRef<{ title: string; resolve: (answer: Answer) => void } | null>(null);

/** Opens the dialog: `onBeforeDrop` waits for the button the user picks. */
const ask = (e: SortableDropEvent<Task>) =>
  new Promise<Answer>((resolve) => {
    question.value = { title: e.items[0]!.title, resolve };
  });
```

Mientras la promesa está pendiente:

- el overlay espera donde se soltó, marcado con `data-dnd-overlay="dropping"`;
- `useDnD()` conserva el estado que tenía al soltar, y `status` es `'dropping'`;
- la página sale del modo de arrastre: vuelven el cursor y la selección de texto, así que un
diálogo funciona como siempre;
- no puede empezar ningún otro arrastre.

<tip>

Un `<dialog>` modal abierto con `showModal()` está en la top layer, por encima del overlay que
espera. Convierte su evento `cancel` (<kbd value="Escape">



</kbd>

) en `'reject'`, como hace el ejemplo.

</tip>

## El orden de los hooks

Reordena las notas, suelta una en la papelera, luego cambia una respuesta y vuelve a hacerlo. El
panel muestra los hooks del último drop en el orden en que se ejecutaron.

<example height="27.5rem" hint="Mueve una nota o tira una a la papelera, y luego cambia una respuesta a reject o continue" name="drop-hooks">



</example>

1. El `onBeforeDrop` de cada `useDnDMonitor`, por turnos. Un `'reject'` o un `'continue'` termina
las preguntas; unas claves acotan el drop.
2. El `onBeforeDrop` del destino: la lista o el árbol al que van los ítems, o el destino de drop.
3. El `onDrop` solo del destino: no se pregunta a una lista que los ítems dejan por otra, y su
nuevo array está en el `e.result` del destino. Cuando se quitan ítems (una zona de papelera,
`dropOutside: 'remove'`), se ejecuta el `onDrop` de su lista, con `to.index` igual a `-1`.
4. La escritura por defecto: cada lista que cambia el drop recibe su nuevo array.
5. El `onDragEnd` del provider (`@drag-end`) y de los monitores. Luego aterriza el overlay, y
`onDragSettle` (`@drag-settle`) avisa de que lo ha hecho.

Un drop rechazado salta en su lugar a `onDragCancel` (`@drag-cancel`), y los ítems vuelven a su
sitio. Un `'continue'` también termina las preguntas, con `onDragResume`: el arrastre sigue, y su
siguiente drop vuelve a preguntar.

Los monitores deciden antes que el destino, así que un veto nunca llega después de que una lista
haya aplicado ya un drop propio. Eso convierte a un monitor en el sitio para las reglas sobre
todos los drops de la app:

```ts [Monitor.vue]
const { syncing } = useSync();

// Read-only while syncing: every drop under the provider flies back.
useDnDMonitor({
  onBeforeDrop: () => (syncing.value ? 'reject' : 'accept'),
});
```

## onDrop: avisado antes de la escritura

```ts
makeSortableList(listRef, {
  items: tasks,
  onDrop: (e) => {
    // `tasks` still holds the old order, `e.result` the new one.
    console.log(e.keys, e.from, e.to, e.result.get(e.to.list));
  },
});
```

El `onDrop` de una lista se ejecuta una vez aceptado el drop, de forma síncrona, justo antes de
que la lista lo escriba. Para actuar después de la escritura, usa el `@drag-end` del provider o
`useDnDMonitor({ onDragEnd })`. En un destino de drop simple, `onDrop` es donde cambias tus datos:
la biblioteca no mueve nada por él.

## Stores y servidores: listas controladas

```ts
const store = useBoardStore();
const { items } = makeSortableList(listRef, {
  id: 'todo',
  group: 'board',
  items: () => store.lists.todo, // a getter: read-only
  onDrop: (e) => {
    e.preventDefault();
    for (const [listId, next] of e.result) store.setList(listId, next);
  },
});
```

La biblioteca solo escribe un drop en una ref modificable. Un getter, un `computed` o una ref
`readonly` nunca se escriben: llama a `e.preventDefault()` y aplica `e.result` tú mismo — los
nuevos arrays de cada lista que cambia el drop, por id de lista. `preventDefault()` omite la
escritura en todas ellas, ya que escribir solo algunas perdería o duplicaría ítems. Las builds de
desarrollo avisan cuando el drop de una lista de solo lectura se deja a la biblioteca.

### Guardar primero en un servidor

Mueve una tarjeta con el servidor en **flaky** (falla una de cada dos peticiones) o en **down**.
La tarjeta espera con una insignia mientras se ejecuta la petición, y luego aterriza, o vuelve a
su sitio si falló.

<example height="31.5rem" hint="Mueve tarjetas y luego cambia el servidor a flaky o down" name="drop-server">



</example>

```ts [Column.vue]
const { items } = makeSortableList(list, {
  id: props.id,
  // A getter: the library never writes it. The drop is applied below, once saved.
  items: () => board[props.id]!,
  group: 'sprint',
  onBeforeDrop: async (e) => {
    e.preventDefault();
    try {
      await saveMove(e.keys, e.to);
    } catch {
      return 'reject'; // nothing applied: the card flies back
    }
    for (const [id, tasks] of e.result) board[id] = tasks; // lands in its new place
    return 'accept';
  },
});
```

Aplica `e.result` antes de que se resuelva la promesa y el overlay aterrizará en el nuevo orden.
Cuando la petición falla, no apliques nada y rechaza: los ítems vuelven a su sitio y los monitores
reciben `onDragCancel`.

La insignia viene del slot `#overlay` del provider, que renderiza el overlay de cada arrastre. Un
`DragPreview` muestra la copia habitual de la tarjeta, y la insignia se coloca encima mientras se
ejecuta la petición:

```vue [index.vue]
<DnDProvider>
  <Board />
  <template #overlay="{ active }">
    <div class="carried">
      <DragPreview :id="active.id" />
      <span v-if="saving" class="saving">Saving…</span>
    </div>
  </template>
</DnDProvider>
```

## Soltar fuera de cualquier destino

Arrastra una app fuera del dock y suéltala, en cada modo.

<example height="24.5rem" hint="Arrastra una app fuera del dock y suéltala" name="drop-outside">



</example>

```ts [Dock.vue]
const { items } = makeSortableList(dock, {
  items: apps,
  strategy: 'horizontal',
  dropOutside: () => props.dropOutside,
  // Called on the list the items leave, with `to.index` -1, when they are removed.
  onDrop: (e) => {
    if (e.to.index === -1) notice.value = `Removed ${e.items.map((app) => app.name).join(', ')}`;
  },
});
```

<table>
<thead>
  <tr>
    <th>
      <code>
        dropOutside
      </code>
    </th>
    
    <th>
      Un drop fuera de cualquier destino…
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        'placeholder'
      </code>
    </td>
    
    <td>
      Aterriza donde está el placeholder: el último sitio que mostró la lista. El valor por defecto.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'cancel'
      </code>
    </td>
    
    <td>
      Se cancela: los ítems vuelven a su sitio. El valor por defecto con <code>
        placeholder: 'indicator'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        'remove'
      </code>
    </td>
    
    <td>
      Quita los ítems de su lista. Primero se pregunta al <code>
        onBeforeDrop
      </code>
      
       de la lista, y su <code>
        onDrop
      </code>
      
       recibe <code>
        to.index
      </code>
      
       igual a <code>
        -1
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Se lee al soltar, así que una ref o un getter puede cambiarlo. Una zona de papelera hace lo mismo
a propósito: `makeDroppable(trash, { onDrop: (e) => e.source?.remove() })`. Consulta
[arrastrar y soltar](https://zizigy.github.io/docs/guides/drag-and-drop).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
