---
title: "Lienzo de diseño"
description: "Un editor al estilo de Figma — frames y capas en un lienzo con zoom, guías inteligentes, un rectángulo de selección, Alt para duplicar, y un panel de capas que es el árbol del diseño."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/examples/design-canvas"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

<example height="43rem" hint="Arrastra una capa al otro frame; dibuja un rectángulo, Mayús-clic, mantén Alt para soltar copias" name="design-canvas" title="Lienzo de diseño">



</example>

## Qué observar

- **Shape.vue** y **Artboard.vue**: cada capa es un elemento arrastrable simple, y un frame se
arrastra por su nombre (`handle`), con sus capas dentro. Una pulsación selecciona de inmediato,
como en Figma, así que la selección del provider es lo que se lleva un arrastre: pulsa una de
varias capas seleccionadas y se mueven todas.
- **useLayerDrop.ts**: el lienzo y cada frame son destinos de drop que funcionan igual. Una capa
soltada sobre un frame entra en él; sobre el lienzo, sale de él. Mantén <kbd value="Alt">



</kbd>

 y lo
que aterriza son copias, y las capas se quedan donde estaban.
- **LayersPanel.vue**: el panel es `makeSortableTree` sobre el propio diseño. El orden de las
filas es el orden de apilamiento, y soltar una fila dentro de un frame mueve la capa a ese frame.
- **Canvas.vue**: las guías inteligentes son un modificador propio de la demo;
`makeSelectionArea` dibuja el rectángulo de selección, y `makeDragArea` da sus reglas a cada
arrastre que empieza en el lienzo.
- **editor.ts**, **geometry.ts** y **design.ts**: el diseño, su historial, la vista y las
cuentas del ajuste y la alineación, sin nada de arrastrar y soltar.

## Dibujado al zoom

El lienzo hace zoom sin `scale()` de CSS: cada capa se maqueta a su tamaño multiplicado por el
zoom, en píxeles de pantalla. Lo que mide la biblioteca es entonces lo que hay en pantalla, así
que los destinos de drop, el rectángulo de selección y los clones del overlay no necesitan nada
especial. El mundo dentro del lienzo solo lo mueve el desplazamiento, con `translate()`.

```ts [Shape.vue]
const style = computed(() => {
  const { zoom } = editor.view;
  const { x, y, width, height } = props.shape;
  return { left: `${x * zoom}px`, top: `${y * zoom}px`, width: `${width * zoom}px`, height: `${height * zoom}px` };
});
```

La rueda desplaza y hace zoom (<kbd value="Ctrl">



</kbd>

 o un pellizco), y también lo hacen arrastrar
con <kbd value="Space">



</kbd>

, la herramienta mano y los botones de la esquina: eventos de puntero y de
rueda normales, como las asas de redimensionar. Como Espacio es la mano, una capa se agarra solo
con <kbd value="Enter">



</kbd>

 (el `keyboard.keys` del provider).

## Mover capas entre frames

Una capa es un elemento arrastrable simple con un overlay propio, `DragGroup.vue`. Coloca las capas
arrastradas tal como están: un `DragPreview` (el clon tomado al agarrar) de cada una, colocado a
partir del `data` de su capa, donde se dibuja. Las propias capas se apartan mientras sus clones se
mueven, salvo que se mantenga <kbd value="Alt">



</kbd>

.

```ts [Shape.vue]
const { isDragging, selected } = makeDraggable(el, {
  id: () => props.shape.id,
  type: 'layer',
  data: () => editor.dragData(props.shape), // { layer, left, top }
  overlay: DragGroup,
});
```

Al soltar, `position` es donde se soltó la esquina de la capa agarrada dentro del destino, en
píxeles de pantalla. Dividido entre el zoom, dice cuánto se movió esa capa en el mundo, y cada capa
arrastrada se mueve lo mismo, dentro del frame o sobre el lienzo:

```ts [useLayerDrop.ts]
const corner = target ? editor.boxOf(target) : { x: -view.x / view.zoom, y: -view.y / view.zoom };
const toWorld = (x: number, y: number) => ({ x: corner.x + x / view.zoom, y: corner.y + y / view.zoom });

const from = editor.boxOf(grabbed); // the layer of `active.id`
const to = toWorld(position.x, position.y);
editor.move(active.ids, { x: to.x - from.x, y: to.y - from.y }, target, editor.altHeld.value);
```

Un frame acepta capas, no frames: un arrastre que lleva un frame pasa por encima de los otros
frames (`disabled`, leído en vivo) hasta el lienzo. Los destinos tienen `overDropAnimation: false`,
porque las capas aparecen justo donde se soltaron sus clones. Las herramientas de la barra también
son elementos arrastrables simples: soltadas en un frame, añaden su capa dentro de él, centrada en
el punto del drop; con un clic, en el centro de la vista.

```ts [Artboard.vue]
makeDroppable(body, {
  id: () => props.frame.id,
  accept: 'layer',
  disabled: () => !!active.value?.items.some((item) => item.type.includes('frame')),
  overDropAnimation: false,
  onDrop: useLayerDrop(() => props.frame),
});
```

## Guías inteligentes

`smartGuides` es un modificador: recibe el desplazamiento del arrastre, calcula dónde estarían las
capas arrastradas en el mundo, y las atrae al borde o al centro más cercano de otra capa a menos de
6 píxeles de pantalla. El overlay, el destino de debajo y el drop lo siguen. Un monitor dibuja las
líneas rosas y las distancias a partir del `delta` del arrastre, el desplazamiento después de los
modificadores.

```ts [Canvas.vue]
const smartGuides: Modifier = ({ transform, active }) => {
  const moving = editor.boundsOf(active.ids);
  if (!moving) return transform; // a tool from the toolbar
  const { zoom } = view;
  const box = offsetBox(moving, transform.x / zoom, transform.y / zoom);
  const targets = editor.snapTargets(active.ids);
  return {
    x: transform.x + snapBox(box, targets, 'x', SNAP / zoom) * zoom,
    y: transform.y + snapBox(box, targets, 'y', SNAP / zoom) * zoom,
  };
};

// Every drag that starts on the canvas, frames and layers alike, gets the guides.
makeDragArea(viewport, { modifiers: [smartGuides], disabled: panning });
```

Las asas de redimensionar se ajustan a las mismas líneas y dibujan las mismas guías.

## Seleccionar

Un rectángulo de selección dibujado en el lienzo vacío selecciona frames y capas sueltas; dibujado
dentro de un frame, las capas del frame. Los dos son `makeSelectionArea`: el área más interior se
queda la pulsación, y es dueña de los elementos arrastrables que contiene. <kbd value="Shift">



</kbd>


añade a la selección (`strategy: 'toggle'`).

```ts [Artboard.vue]
const { isSelecting, style: band } = makeSelectionArea(body, {
  strategy: () => (editor.shiftHeld.value ? 'toggle' : 'select'),
  disabled: editor.panning,
});
```

El editor nunca selecciona un frame junto con una capa que contiene: al arrastrarla, la capa se
movería dos veces. Un rectángulo captura el puntero al empezar, así que un clic en el espacio vacío
de un frame nunca llega al frame: `Artboard.vue` selecciona el frame cuando una pulsación ahí se
suelta donde empezó.

## El panel de capas

Los ítems del árbol son el diseño: frames con sus `children`, la fila de arriba delante. `canNest`
deja que los frames acepten capas y mantiene los frames en el nivel superior. Las filas tienen
claves propias (`row:…`), porque los ids de las capas pertenecen a sus elementos arrastrables en el
lienzo; la selección es la del lienzo, así que una fila se ilumina con su capa.

```ts [LayersPanel.vue]
makeSortableTree(tree, {
  items: editor.layers,
  getKey: (layer) => `row:${layer.id}`,
  canNest: (layer, parent) => parent.kind === 'frame' && layer.kind !== 'frame',
  maxDepth: 1,
  animateChanges: true,
  onDrop: ({ items, from, to }) => {
    // Positions count from the frame's corner: a layer changing frames takes the
    // difference, so it stays where it is on the canvas.
  },
});
```

`onDrop` se ejecuta antes de que se escriba el árbol, así que el editor todavía sabe de qué frame
viene cada capa, y guarda el diseño para deshacer. Una capa movida a un frame que no la cubre
quedaría recortada fuera de la vista: en su lugar va al centro del frame. Con `animateChanges`, las filas
también se deslizan con los cambios hechos en el lienzo y al deshacer. Una fila tiene tipo
(`type: 'row'`), así que el lienzo y los frames, que aceptan capas y herramientas, la rechazan.

## Teclado

Llega a una capa con Tab (queda seleccionada), luego <kbd value="Enter">



</kbd>

 la agarra, las flechas la
mueven 10 píxeles (<kbd value="Shift">



</kbd>

: 40), y <kbd value="Enter">



</kbd>

 la suelta en el frame de debajo.
Sin arrastre, las flechas mueven la selección un píxel. Una herramienta se agarra igual, y sus
flechas saltan entre el lienzo y los frames (`keyboardMode: 'droppables'`). Los demás atajos aparecen
en el panel Design cuando no hay nada seleccionado.

Más información: [Arrastrar y soltar](https://zizigy.github.io/docs/guides/drag-and-drop#leave-it-where-it-was-dropped) ·
[Un modificador propio](https://zizigy.github.io/docs/guides/constraints#your-own-modifier) ·
[Reglas para una parte de la página](https://zizigy.github.io/docs/guides/constraints#rules-for-a-part-of-the-page) ·
[Rectángulo de selección](https://zizigy.github.io/docs/guides/multi-drag#rubber-band-selection) ·
[Árboles](https://zizigy.github.io/docs/guides/trees)

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
