---
title: "Ejes, límites y cuadrículas"
description: "Bloquea los arrastres en un eje, mantenlos dentro de una caja, ajústalos a una cuadrícula o a guías propias — para un ítem, una lista o toda una parte de la página."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/guides/constraints"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Un arrastre puede sujetarse a un eje, mantenerse dentro de una caja, ajustarse a una cuadrícula o
doblegarse a una regla tuya. Esas reglas son **modificadores**: ajustan el desplazamiento del
arrastre en cada frame. Ponlos en un elemento arrastrable, en una lista o en una parte de la
página, y el overlay, los destinos de drop y el drop los siguen.

## Bloquear un eje

Los clips de una línea de tiempo se deslizan a lo largo de su pista. Quita el bloqueo y también
podrán cambiar de pista.

<example height="22rem" hint="Arrastra un clip; quita el bloqueo y arrástralo a la otra pista" name="axis-timeline">



</example>

```ts [TimelineClip.vue]
const { isDragging } = makeDraggable(el, {
  id: () => props.clip.id,
  axis: () => (props.locked ? 'x' : undefined),
});
```

`axis: 'x'` solo mueve en horizontal, `'y'` solo en vertical. `makeDraggable`, `makeSortableList`,
`makeSortableTree`, `makeSortableItem` y `makeDragArea` lo aceptan todos:

```ts
makeSortableList(listRef, { items: tracks, axis: 'y' });
```

- El bloqueo se ejecuta **después de todos los modificadores**, así que se mantiene hagan lo que
hagan: un ajuste o un límite no puede sacar el ítem de su línea.
- La línea está en el contenido, no en la pantalla: se mueve con la lista (o el elemento padre)
donde empezó el arrastre. Desplaza la página a mitad del arrastre y el ítem se queda en su fila.
- El `axis` propio de un ítem gana al de su lista o su árbol, y el de un elemento arrastrable (o
el de su lista) gana al de su área de arrastre.
- Se lee cuando empieza un arrastre, así que un getter puede activarlo y desactivarlo, como arriba.
- Un árbol bloqueado en `'y'` sigue anidando: la profundidad sale entonces de pasar sobre el
centro de una fila.

<tip>

Prefiere `axis` a los modificadores `restrictToVerticalAxis` y `restrictToHorizontalAxis`. Hacen
lo mismo, pero como modificadores normales se ejecutan en medio de la cadena, y un modificador
posterior (una cuadrícula que ajusta los dos ejes) puede volver a sacar el ítem del eje.

</tip>

## Modificadores

Un modificador ajusta el desplazamiento del arrastre en cada frame. Su resultado mueve el overlay
**y** es el punto donde se buscan los destinos, así que una lista ordena según la posición
bloqueada, limitada o ajustada, y la `position` del drop es donde acabó la caja.

<table>
<thead>
  <tr>
    <th>
      Modificador
    </th>
    
    <th>
      Qué hace
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        restrictToParent
      </code>
    </td>
    
    <td>
      Mantiene el overlay dentro del contenedor donde empezó el arrastre: la lista ordenable, o el elemento padre de un elemento arrastrable simple.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToElement(target)
      </code>
    </td>
    
    <td>
      Mantiene el overlay dentro de un elemento: una ref de plantilla, un getter o el propio elemento.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToWindowEdges
      </code>
    </td>
    
    <td>
      Mantiene el overlay dentro de la ventana.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToFirstScrollableAncestor
      </code>
    </td>
    
    <td>
      Mantiene el overlay dentro del primer ancestro desplazable del elemento arrastrado.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapToGrid(size)
      </code>
    </td>
    
    <td>
      Ajusta el overlay a una cuadrícula (más abajo).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        snapCenterToCursor
      </code>
    </td>
    
    <td>
      Centra el overlay bajo el puntero en lugar de mantener el desplazamiento del agarre.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToVerticalAxis
      </code>
    </td>
    
    <td>
      Solo se mueve en vertical. Prefiere <code>
        axis: 'y'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToHorizontalAxis
      </code>
    </td>
    
    <td>
      Solo se mueve en horizontal. Prefiere <code>
        axis: 'x'
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

`modifiers` es una opción del provider, de las áreas de arrastre, de las listas y los árboles, y
de los elementos arrastrables y los ítems ordenables. Todas salvo la del provider aceptan además
una ref o un getter, que se leen cuando empieza el arrastre.

### Mantenerlo dentro

Tu propia imagen en una videollamada se queda en la pantalla. Cambia el límite y arrástrala bien
lejos:

<example height="29rem" hint="Arrastra tu propia imagen fuera de la pantalla con cada límite" name="bounds-pip">



</example>

```ts [SelfView.vue]
const { isDragging } = makeDraggable(el, {
  id: 'self-view',
  modifiers: () => props.modifiers, // [restrictToParent], [restrictToWindowEdges] or []
});
```

- `restrictToParent` la sujeta en la pantalla, su elemento padre. Para un ítem ordenable, el
«padre» es su lista, esté donde esté la lista en el DOM.
- `restrictToWindowEdges` la deja salir de la pantalla, pero no de la ventana. Si se suelta fuera
de la pantalla, no está sobre ningún destino de drop, así que vuelve a su sitio.
- Sin límite, va a cualquier parte.

Un límite mantiene dentro el **overlay**, con el tamaño que tenga: con `overlayFit: 'slot'`, una
caja que crece sobre una lista de ítems más anchos se mantiene dentro con su nuevo tamaño.

### Ajustar a una cuadrícula

Los nodos de un diagrama de flujo se ajustan a la cuadrícula del lienzo. Cambia el tamaño de la
celda y el deslizamiento:

<example height="29rem" hint="Arrastra un nodo; cambia la cuadrícula y el suavizado" name="snap-canvas">



</example>

```ts [FlowNode.vue]
const { isDragging } = makeDraggable(el, {
  id: () => props.node.id,
  modifiers: () => [snapToGrid({ x: props.grid, y: props.grid, smooth: props.smooth })],
});
```

`snapToGrid(24)` ajusta los dos ejes a celdas de 24 px. Un objeto permite ajustar más cosas:

<table>
<thead>
  <tr>
    <th>
      Opción
    </th>
    
    <th>
      Significado
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        x
      </code>
      
      , <code>
        y
      </code>
    </td>
    
    <td>
      El tamaño de la celda en píxeles, por eje. Omite uno para ajustar solo el otro: <code>
        { y: 15 }
      </code>
      
       ajusta un evento a cuartos de hora y lo deja moverse libremente entre los días.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        origin
      </code>
    </td>
    
    <td>
      <code>
        'container'
      </code>
      
       (por defecto): la esquina superior izquierda del overlay cae en líneas de cuadrícula trazadas desde la esquina superior izquierda del contenedor — la lista ordenable, o el padre de un elemento arrastrable simple. <code>
        'delta'
      </code>
      
      : se redondea el propio desplazamiento, así que un ítem que empezó fuera de la cuadrícula se queda fuera de ella y se mueve por celdas enteras desde donde estaba. Elígelo para ítems colocados en cualquier sitio (un lienzo libre) que deben conservar su propia alineación.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        smooth
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
       o <code>
        { duration, easing }
      </code>
      
      : el overlay se desliza entre celdas (80 ms por defecto). Los destinos usan la posición ajustada de inmediato.
    </td>
  </tr>
</tbody>
</table>

Con `origin: 'container'`, dibuja la cuadrícula desde la border box del contenedor: el lienzo de
arriba tiene su marco como `box-shadow`, no como `border`, así que sus líneas empiezan justo en el
borde.

### Un modificador propio

Las cajas de una diapositiva saltan a los bordes y centros de las demás cuando se acercan, y unas
guías rosas muestran las líneas sobre las que se colocan:

<example height="26rem" hint="Arrastra una caja junto a otra, o al centro de la diapositiva" name="magnet-guides">



</example>

```ts [Slide.vue]
import type { Modifier } from '@vue-dnd-kit/core';

/** Near a line, the box jumps onto it. */
const magnet: Modifier = ({ transform, overlayRect, containerRect, active }) => {
  if (!containerRect) return transform;
  const id = String(active.id);
  const left = overlayRect.left - containerRect.left;
  const top = overlayRect.top - containerRect.top;
  return {
    x: transform.x + pull(left, overlayRect.width, lines(id, 'x')),
    y: transform.y + pull(top, overlayRect.height, lines(id, 'y')),
  };
};

// In order: the magnet pulls, then the slide's edges hold.
const modifiers = [magnet, restrictToParent];
```

Un modificador recibe `transform`, el desplazamiento desde el inicio del arrastre tal como lo
dejaron los modificadores anteriores, y devuelve uno nuevo. También recibe lo que pueda necesitar
para calcularlo:

<table>
<thead>
  <tr>
    <th>
      Argumento
    </th>
    
    <th>
      Qué es
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        transform
      </code>
    </td>
    
    <td>
      El desplazamiento hasta ahora.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        overlayRect
      </code>
    </td>
    
    <td>
      La caja del overlay movida por <code>
        transform
      </code>
      
      , con el tamaño que tiene ahora.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activeRect
      </code>
    </td>
    
    <td>
      El elemento arrastrado cuando empezó el arrastre.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        containerRect
      </code>
    </td>
    
    <td>
      El contenedor donde empezó el arrastre (la lista ordenable, o el elemento padre), donde está ahora: sigue al scroll.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        windowRect
      </code>
    </td>
    
    <td>
      La ventana.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        origin
      </code>
    </td>
    
    <td>
      El puntero cuando empezó el arrastre.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        active
      </code>
      
      , <code>
        over
      </code>
    </td>
    
    <td>
      El arrastre y el destino que tiene debajo.
    </td>
  </tr>
</tbody>
</table>

Los modificadores se ejecutan en cada frame: mantenlos rápidos y sin efectos secundarios. Las
guías de arriba se dibujan a partir del `delta` del arrastre en el `onDragMove` de un monitor, que
es el desplazamiento después de todos los modificadores. Los tipos están en
[Modificadores](https://zizigy.github.io/docs/api/modifiers).

## El orden

Los modificadores de varios sitios se ejecutan uno tras otro, cada uno sobre el resultado del
anterior:

1. los `modifiers` del provider;
2. los `modifiers` del área de arrastre donde empezó el arrastre;
3. los `modifiers` propios del ítem arrastrado o, si no tiene, los de su lista o su árbol;
4. el `restrictToArea` del área de arrastre;
5. el bloqueo de `axis`.

Dentro de un mismo array se ejecutan en orden, así que pon los ajustes y los imanes antes de los
límites: un límite al final mantiene la caja dentro hagan lo que hagan los demás. La diapositiva
de arriba ejecuta `[magnet, restrictToParent]`; al revés, el imán podría arrastrar unos píxeles
más allá del borde una caja sujeta en el borde de la diapositiva.

Los `modifiers` de un ítem **sustituyen** a los de su lista; no se suman. Los límites del área
vienen después de los ajustes de los pasos 1–3, así que un ítem ajustado sigue dentro, y el
bloqueo de eje va el último de todos.

## Las listas limitadas conservan sus extremos

Un panel de capas: las filas solo se mueven arriba y abajo, y nunca salen del panel. Arrastra la
fila de arriba hasta el final:

<example height="26rem" hint="Arrastra Heading hasta abajo, más allá del borde del panel" name="bounded-layers">



</example>

```ts [Layers.vue]
const { items } = makeSortableList(list, { items: layers, axis: 'y', modifiers: [restrictToParent] });
```

Un límite sujeta el overlay en el borde de la caja mientras el puntero sigue avanzando. En cuanto
el puntero ha salido del overlay a lo largo del eje de la lista, la lista ordena según el puntero,
así que el primer y el último puesto siguen a tu alcance sujetes como sujetes el ítem. Las
cuadrículas siguen ordenando según el overlay: sujeto en el borde, ya cubre la celda del borde.

## Reglas para una parte de la página

Dos áreas, dos conjuntos de reglas. Las pegatinas de Layout se ajustan a su cuadrícula y no
pueden salir de ella; las de Sketch van a cualquier parte, también a Layout. Un arrastre conserva
las reglas del área donde empezó, y se ilumina el área cuyas reglas están en vigor.

<example height="25rem" hint="Arrastra una pegatina en Layout y luego una de Sketch a Layout" name="drag-areas">



</example>

```vue [DragArea.vue]
<script setup lang="ts">
const area = useTemplateRef<HTMLElement>('area');
const { isDragging } = makeDragArea(area, {
  modifiers: () => (props.strict ? [snapToGrid(24)] : []),
  restrictToArea: () => props.strict,
});
</script>

<template>
  <div ref="area" class="area" :class="{ busy: isDragging }">
    <Sticker v-for="sticker in stickers" :key="sticker.id" :sticker="sticker" />
  </div>
</template>
```

`makeDragArea` fija reglas para los arrastres que **empiezan dentro** de su elemento — tanto
elementos arrastrables simples como ítems ordenables, que entonces no necesitan reglas propias.
Mantén un único `DnDProvider` para toda la app, y dale a un tablero, un lienzo o un feed su propia
área.

<table>
<thead>
  <tr>
    <th>
      Opción
    </th>
    
    <th>
      Qué hace
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        axis
      </code>
    </td>
    
    <td>
      Bloquea los arrastres en un eje. Gana el <code>
        axis
      </code>
      
       propio de un elemento arrastrable, o el de su lista.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        modifiers
      </code>
    </td>
    
    <td>
      Se ejecutan después de los del provider y antes de los propios del elemento arrastrable.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        restrictToArea
      </code>
    </td>
    
    <td>
      <code>
        true
      </code>
      
      : los arrastres se quedan dentro del elemento del área.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        autoScroll
      </code>
    </td>
    
    <td>
      El desplazamiento automático del contenedor desplazable del área (el elemento, o su ancestro desplazable más cercano). <code>
        false
      </code>
      
       lo desactiva ahí.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
    </td>
    
    <td>
      La <a href="/docs/guides/sensors#activation-constraints">
        activación
      </a>
      
       por tipo de puntero, como una pulsación táctil más larga en un feed que se desplaza. Gana la propia del elemento arrastrable; la del provider va la última.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      No empieza ningún arrastre en el área, ni en las áreas que contiene. Sus elementos arrastrables indican <code>
        aria-disabled
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Cada opción acepta un valor, una ref o un getter, que se leen cuando empieza una pulsación o un
arrastre. El área devuelve `isDragging` (hay en curso un arrastre que empezó aquí, como muestra el
marco iluminado de arriba) e `isAutoScrolling` (el desplazamiento automático está moviendo su
contenedor). Referencia completa: [makeDragArea](https://zizigy.github.io/docs/api/make-drag-area).

### Cómo se combinan las áreas

- Un arrastre sigue al área donde **empezó**, incluso después de salir de ella. Pasar sobre un
área no cambia nada, salvo su `autoScroll`: ese se aplica a cualquier arrastre que desplace su
contenedor.
- Las áreas anidadas no se fusionan: gana la más cercana. `disabled` es la excepción, y se
hereda: un área desactivada desactiva también las áreas que contiene.
- La detección de colisiones, las teclas del teclado y los anuncios siguen siendo de todo el
provider.

<note>

¿Por qué no un segundo `DnDProvider` alrededor del tablero? Los providers son independientes: un
arrastre nunca pasa de uno a otro, así que los ítems del tablero nunca podrían salir de él. Anida
un provider solo cuando una parte de la página necesita sus propios ajustes a nivel de provider y
sus ítems se quedan dentro. Consulta [El provider](https://zizigy.github.io/docs/guides/provider).

</note>

## Dejarlo donde se suelta

La línea de tiempo, la llamada, el diagrama de flujo, la diapositiva y las áreas de arriba
mantienen todos cada ítem donde se soltó. Cada evento de arrastre lleva `position`: la esquina
superior izquierda de la caja arrastrada dentro del destino, desde el borde de su padding y con su
scroll — el `left` y el `top` que colocan justo ahí un ítem con posición absoluta. Se calcula
después de los modificadores, así que un nodo ajustado aterriza en la cuadrícula.

```ts [Flowchart.vue]
makeDroppable(canvas, { id: 'canvas' });
useDnDMonitor({
  onDragEnd({ active, over, position }) {
    const node = nodes.value.find((item) => item.id === active.id);
    if (!node || over?.id !== 'canvas' || !position) return;
    node.x = Math.round(position.x);
    node.y = Math.round(position.y);
  },
});
```

Más sobre el arrastre libre y los destinos de drop en [Arrastrar y soltar](https://zizigy.github.io/docs/guides/drag-and-drop).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
