---
title: "Archivos y otras apps"
description: "El arrastrar y soltar propio del navegador, como arrastres de la biblioteca — archivos, enlaces y texto de otras apps en destinos de drop y listas que les hacen sitio, ítems arrastrados fuera de la página, y entre ventanas de tu app."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/guides/native"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Los arrastres de la biblioteca viven dentro de la página. El navegador tiene un arrastrar y
soltar propio que cruza los bordes de la página: archivos desde el escritorio, un enlace desde
otra pestaña, texto desde otra app, y tus ítems arrastrados hacia todos esos sitios. La
biblioteca también gestiona esos arrastres, como arrastres del provider: los destinos se
iluminan, las listas hacen sitio, los eventos y los textos para lectores de pantalla son los de
siempre.

<example height="34rem" hint="Suelta imágenes, enlaces o texto de otras apps; arrastra una tarjeta fuera, o a esta página abierta en una segunda ventana" name="moodboard">



</example>

## Desde fuera de la página

Un destino acepta esos arrastres con `external`, que dice lo que acepta. Los destinos sin esta
opción los ignoran.

```ts [Board.vue]
const { items } = makeSortableList(grid, {
  items: cards,
  group: 'moodboard',
  strategy: 'grid',
  external: { files: 'image/*', links: true, text: true },
  createItem: fromOutside,
});
```

<table>
<thead>
  <tr>
    <th>
      <code>
        external
      </code>
    </th>
    
    <th>
      Acepta
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        files
      </code>
    </td>
    
    <td>
      Archivos: <code>
        true
      </code>
      
       cualquiera, tipos MIME y extensiones tal como los lee <code>
        <input accept>
      </code>
      
       (<code>
        'image/*, .md'
      </code>
      
      ), o una función a la que se pregunta archivo por archivo. Carpetas nunca.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        multiple
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
      
      : un archivo cada vez. Un arrastre de varios se rechaza.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        links
      </code>
    </td>
    
    <td>
      Enlaces (<code>
        text/uri-list
      </code>
      
      ): una dirección desde otra pestaña, un enlace de una página.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        text
      </code>
    </td>
    
    <td>
      Texto plano: una selección desde otra app.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        types
      </code>
    </td>
    
    <td>
      Otros tipos MIME, exactamente como los ofrecen otras apps.
    </td>
  </tr>
</tbody>
</table>

`makeDroppable` acepta la misma opción: una zona que acepta una imagen de avatar está en
[arrastrar y soltar](https://zizigy.github.io/docs/guides/drag-and-drop#files-from-the-computer).

### Lo que lleva el arrastre

El navegador se guarda los datos de un arrastre hasta que se suelta. Mientras se mantiene, la
página solo sabe qué tipos de datos lleva. `active.external` y `e.external` dicen lo que se sabe:

<table>
<thead>
  <tr>
    <th>
      
    </th>
    
    <th>
      Mientras se mantiene
    </th>
    
    <th>
      Al soltar
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        types
      </code>
    </td>
    
    <td>
      Los tipos MIME que ofrece: <code>
        Files
      </code>
      
      , <code>
        text/uri-list
      </code>
      
      …
    </td>
    
    <td>
      Los mismos
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        fileTypes
      </code>
    </td>
    
    <td>
      Un tipo MIME por archivo
    </td>
    
    <td>
      Los mismos
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        files
      </code>
    </td>
    
    <td>
      Vacío
    </td>
    
    <td>
      Los archivos que acepta el destino, como <code>
        File
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        urls
      </code>
      
      , <code>
        text
      </code>
      
      , <code>
        html
      </code>
    </td>
    
    <td>
      Vacío
    </td>
    
    <td>
      Sus enlaces, su texto, su HTML
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        getData(type)
      </code>
    </td>
    
    <td>
      <code>
        ''
      </code>
    </td>
    
    <td>
      Los datos de cualquier tipo que ofrezca
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        ready
      </code>
    </td>
    
    <td>
      <code>
        false
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
    </td>
  </tr>
</tbody>
</table>

### En una lista

Una lista le hace sitio como a un elemento arrastrable simple: con `createItem`, al que se le
pregunta dos veces: mientras se mantiene el arrastre, por el ítem que muestra adónde va, y
al soltar, con los datos, por lo que entra. Un array de ítems se inserta entero en ese sitio: una
tarjeta por imagen.

```ts [cards.ts]
export const fromOutside = (active: Active): Card | Card[] | undefined => {
  const { external } = active;
  if (!external) return undefined;
  // While it is held: a tile that says what is coming.
  if (!external.ready) return { id: 'incoming', kind: 'incoming', label: incoming(external) };
  // At the drop: a card each.
  if (external.files.length) {
    return external.files.map((file) => ({ id: uid(), kind: 'image', src: URL.createObjectURL(file), name: file.name }));
  }
  if (external.urls.length) return external.urls.map((url) => ({ id: uid(), kind: 'link', url, title: host(url) }));
  const text = external.text.trim();
  return text ? { id: uid(), kind: 'note', text } : undefined;
};
```

- La ficha de lo que llega es una fila de tu lista como cualquier otra: la lista la renderiza,
las filas de alrededor se apartan de su camino, `onDrop` recibe los ítems reales.
- Los árboles también aceptan estos arrastres, un nodo cada vez: un nodo carpeta con un hijo por
archivo admite varios.
- El evento del drop tiene `e.external` con los datos, tanto en el `onDrop` de la lista como en
el de los monitores.

## Fuera de la página

Con `native`, un arrastre de un ítem con el ratón es el arrastre propio del navegador, así que
puede salir de la página: al escritorio, a un editor, a un chat, a otra pestaña.

```ts [Tile.vue]
makeSortableItem(el, {
  item: () => props.card,
  native: { data: () => toOutside(props.card) },
});
```

```ts [cards.ts]
case 'link':
  return { 'text/uri-list': card.url, 'text/plain': card.url };
case 'note':
  return { 'text/plain': card.text };
```

- `data` da a otras apps el ítem como tipos MIME y texto: `text/plain`, `text/uri-list`,
`text/html`. Se lee cuando empieza el arrastre. Sin ella, `native: true` lleva el `label` como
texto.
- En la página, el arrastre funciona como cualquier otro: destinos, listas que hacen sitio, el
drop. El navegador dibuja la imagen arrastrada en lugar del overlay, y el elemento se queda en
su sitio (`transform` sigue siendo `null` con `overlay: false`).
- Los arrastres táctiles y con teclado del ítem siguen siendo de la biblioteca: el navegador no
tiene un arrastre propio para ellos.
- `effect` (`effectAllowed`) dice qué puede hacer el sitio donde se suelta: `'copyMove'` por
defecto. Un drop en otro sitio termina el arrastre con `droppedOutside`, `'move'`, `'copy'` o
`'link'`, en `onDragEnd`. Un movimiento saca los ítems de su lista; una copia los deja.

`makeDraggable` acepta `native` de la misma forma.

## Entre ventanas

Un ítem con `native` también se lleva a sí mismo: las listas de su grupo en otra ventana de tu
app lo aceptan como si viniera de una de sus propias listas. Abre el moodboard en una segunda
ventana y arrastra una tarjeta de una a otra.

- Mientras se mantiene el arrastre, la otra ventana ya tiene el ítem: su lista lo muestra en su
sitio.
- Al soltar, entra allí, y aquí sale de su lista (el drop fue un movimiento). Mantén
<kbd value="Ctrl">



</kbd>

 (<kbd value="Option">



</kbd>

 en Mac) para copiarlo en su lugar.
- A una lista con `createItem` también se le pregunta por estos ítems, con
`active.external.group` definido y los ítems en `active.items[].item`: devuélvelos, o copias
con claves de esa ventana. Sin `createItem`, entran tal cual.
- Los ítems viajan como JSON: las fechas se vuelven cadenas, las funciones se descartan.

## Límites

- Los datos llegan solo con el drop, nunca antes: planifica sin ellos el ítem que se muestra
mientras se mantiene un arrastre.
- Arrastrar archivos es cosa de quien usa ratón o trackpad. Ofrece también un
`<input type="file">` junto a la zona.
- Un único provider de la página acepta arrastres de fuera: el primero que tenga un destino para
ellos.
- En Firefox, un ítem movido a otra lista durante el arrastre y luego soltado en otra ventana no
se entera de ese drop: aquí se queda donde estaba.
- Un ítem cuyo JSON pasa de 16 KB sigue yendo a otra ventana, pero esa ventana solo lo muestra al
soltar.

La API está en [makeDroppable](https://zizigy.github.io/docs/api/make-droppable#from-outside-the-page) y
[makeDraggable](https://zizigy.github.io/docs/api/make-draggable#out-of-the-page).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
