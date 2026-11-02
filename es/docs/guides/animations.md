---
title: "Animaciones"
description: "Los ítems se deslizan mientras ordenas, el drop aterriza en su hueco y los cambios de datos también pueden animarse. Ajusta cada uno, anima el overlay, el hueco y las listas con CSS, o usa motion o GSAP."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/guides/animations"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Tres cosas se animan solas: los ítems que se deslizan mientras ordenas, el overlay que aterriza
al soltar y, si lo activas, los cambios de tus datos que no hizo ningún arrastre. Cada una acepta
los mismos valores, en el provider o más cerca de lo que anima:

<table>
<thead>
  <tr>
    <th>
      Opción
    </th>
    
    <th>
      Dónde
    </th>
    
    <th>
      Por defecto
    </th>
    
    <th>
      Qué anima
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        animation
      </code>
    </td>
    
    <td>
      provider, lista, árbol
    </td>
    
    <td>
      activada, 200 ms
    </td>
    
    <td>
      Los ítems que se deslizan a sus nuevos sitios mientras ordenas, al soltar y al cancelar.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        dropAnimation
      </code>
    </td>
    
    <td>
      provider, elemento arrastrable, ítem, lista, árbol (<code>
        overDropAnimation
      </code>
      
       en un destino de drop)
    </td>
    
    <td>
      activada, 250 ms
    </td>
    
    <td>
      El overlay que aterriza en su hueco, o que vuelve a su sitio al cancelar.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        animateChanges
      </code>
    </td>
    
    <td>
      provider, lista, árbol
    </td>
    
    <td>
      <strong>
        desactivada
      </strong>
    </td>
    
    <td>
      Los cambios de tus datos que no hizo ningún arrastre: ítems añadidos, quitados, movidos o filtrados, filas de árbol mostradas u ocultas.
    </td>
  </tr>
</tbody>
</table>

Cada una acepta `true` (el timing por defecto), `false` (desactivada), `{ duration, easing }`, o
una función que hace la animación tú mismo:

```vue
<DnDProvider
  :animation="{ duration: 180, easing: 'cubic-bezier(.2, .8, .2, 1)' }"
  :drop-animation="{ duration: 300 }"
  animate-changes
>
```

Los `animation` y `animateChanges` propios de una lista o un árbol ganan a los del provider; para
`dropAnimation`, consulta [por ítem y por destino](#per-item-and-per-target). El resto del
movimiento es tuyo: el overlay, el hueco y las listas son elementos con
[atributos data y refs](https://zizigy.github.io/docs/guides/styling), y el CSS o una biblioteca de animación los mueve.

## Ordenación

Mientras arrastras, el borrador de la lista se reordena y los ítems se deslizan a sus nuevos
sitios. La mano de abajo pasa las dos opciones a su lista: elige una `animation` y ordena las
cartas, elige una `dropAnimation` y suelta una.

<example height="24rem" hint="Elige los timings, ordena las cartas, suelta una fuera de la mesa" name="anim-sort">



</example>

```ts [Hand.vue]
const springy: LayoutAnimation = ({ element, from, to, reducedMotion }) => {
  if (reducedMotion) return;
  return element.animate(
    [{ translate: `${from.left - to.left}px ${from.top - to.top}px` }, { translate: '0 0' }],
    { duration: 500, easing: 'cubic-bezier(.34, 1.56, .64, 1)' },
  );
};

const animation = shallowRef<LayoutAnimation>(true); // true, { duration: 600 }, springy or false
const dropAnimation = shallowRef<DropAnimation>(true); // true, { duration: 700 }, toss or false

const { items } = makeSortableList(table, {
  items: cards,
  strategy: 'horizontal',
  dropOutside: 'cancel', // let go off the table: the card flies back
  animation,
  dropAnimation,
});
```

Es FLIP sobre la propiedad CSS `translate`, a través de la Web Animations API. `translate` se
combina con cualquier `transform` tuyo, así que el posicionamiento de las filas de una lista
virtual se mantiene intacto. Cuando un ítem se mueve otra vez antes de que termine su animación,
la siguiente empieza desde donde se muestra. La misma animación mueve los ítems al soltar y al
cancelar.

La `animation` de la lista acepta un valor o una ref, que se lee en cada movimiento: una ref la
cambia, como arriba. Una función ahí es una animación, no un getter.

<warning>

No envuelvas los ítems ordenables en `<TransitionGroup>`: cada movimiento se animaría dos veces.
Para los cambios que no hizo ningún arrastre, activa [`animateChanges`](#data-changes-animatechanges).

</warning>

## El drop

Al soltar, el overlay vuela desde donde soltaste hasta el hueco del ítem; al cancelar, de vuelta
a donde empezó el ítem. En la mano de arriba, elige una `dropAnimation`, arrastra una carta fuera
de la mesa y suéltala: el drop se cancela y vuelve a su sitio. `toss` es una función propia:

```ts [Hand.vue]
/** The overlay arcs to its slot, as if tossed. */
const toss: DropAnimation = ({ overlay, from, to, reducedMotion }) => {
  if (reducedMotion) return;
  // No visible slot to land on: fade out where it is.
  if (!to) return overlay.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
  const place = (x: number, y: number) => `translate3d(${x}px, ${y}px, 0)`;
  const rise = Math.min(120, Math.hypot(to.left - from.left, to.top - from.top) / 2);
  return overlay.animate(
    [
      { transform: place(from.left, from.top), width: `${from.width}px`, height: `${from.height}px` },
      { transform: place((from.left + to.left) / 2, Math.min(from.top, to.top) - rise), offset: 0.45 },
      { transform: place(to.left, to.top), width: `${to.width}px`, height: `${to.height}px` },
    ],
    { duration: 550, easing: 'ease-in-out', fill: 'forwards' },
  );
};
```

La mano se la da a su lista. En el provider, hace aterrizar todos los arrastres:

```vue
<DnDProvider :drop-animation="toss">
```

- La caja aterriza con su posición (`transform`) y su tamaño (`width`, `height`): el contenido se
vuelve a maquetar al tamaño del hueco, nunca se escala.
- Cuando el ítem no tiene un hueco visible tras el drop (se desplazó fuera de la vista, o se
soltó en una carpeta o una zona de papelera), `to` es `null`. La animación por defecto desvanece
entonces el overlay, encogiéndolo dentro de la zona donde se soltó (`into`), o en su sitio.
- En un multi-drag, los clones de los demás ítems aterrizan solos en sus propios huecos, con el
timing por defecto cuando `dropAnimation` es una función. En una zona, entran uno tras otro, y
la caja después de ellos (consulta [los archivos y las carpetas](https://zizigy.github.io/docs/guides/multi-drag#into-a-folder)).
- `dropAnimation` se lee en cada drop: una ref la cambia para el siguiente, como en la mano, y
también una prop del provider ligada a una ref.
- Desplazarte mientras aterriza no lo desvía. La caja es `position: fixed`, así que sigue a aquello
en lo que aterriza (el hueco, la zona o, si no, el destino donde se soltó) con su `translate` de
CSS, sumado al `transform` que mueve la animación. En la tuya, anima `transform`, como arriba, no
`translate`.
- El siguiente arrastre no espera: cada drop aterriza en una caja propia mientras corren arrastres
nuevos. Una pulsación sobre una caja que está aterrizando la atrapa en pleno vuelo, y el arrastre
continúa desde donde está. `onDragSettle` avisa cuando el overlay de un arrastre ha llegado a su
sitio: la papelera de abajo cierra entonces su tapa.

El overlay también toma el tamaño del hueco donde aterrizará mientras arrastras
(`overlayFit: 'slot'`, el valor por defecto), así que un drop rara vez necesita cambiar de tamaño.
Consulta [el overlay](https://zizigy.github.io/docs/guides/overlay#size-overlayfit).

### Por ítem y por destino

La `dropAnimation` del provider es la de por defecto. Un elemento arrastrable, un ítem ordenable o
una lista (para sus ítems) pueden traer la suya, y un destino de drop puede tener la última palabra
sobre lo que aterriza en él: `makeDroppable(el, { overDropAnimation })`, el `overDropAnimation` de una
lista o de un árbol. Para cada drop, la primera que esté definida:

1. La del destino (ninguna al cancelar).
2. La propia del ítem arrastrado.
3. La de su lista.
4. La del provider.

Abajo, el carrito, el jarrón y la estantería definen una cada uno. La estantería hace aterrizar
sus productos con un rebote, el jarrón tiene un aterrizaje lento propio, y el carrito mete en su
icono lo que se suelta sobre él: el producto se queda en su estantería, así que su hueco allí no
es un sitio donde aterrizar. Bajo la estantería se ilumina la animación con la que aterriza cada
arrastre.

<example height="24rem" hint="Ordena la taza y luego el jarrón; después suelta cualquiera de los dos en el carrito" name="anim-cart">



</example>

```ts [Shop.vue]
// 3. The list's, for its items without one of their own.
makeSortableList(shelf, {
  items: products,
  strategy: 'horizontal',
  dropAnimation: { duration: 450, easing: 'cubic-bezier(.34, 1.56, .64, 1)' },
});
```

```ts [Product.vue]
// 2. The item's own: it wins over its list's.
makeSortableItem(el, {
  item: () => props.product,
  dropAnimation: props.product.fragile ? { duration: 1100, easing: 'ease-in-out' } : undefined,
});
```

```ts [Cart.vue]
// 1. The target's: it wins over both.
const intoCart: DropAnimation = ({ overlay, from, reducedMotion }) => {
  const end = icon.value?.getBoundingClientRect();
  if (!end || reducedMotion) return;
  // Into the icon, shrinking: the box scales around its top left corner.
  const scale = end.height / from.height;
  const animation = overlay.animate(
    [
      { transform: `translate3d(${from.left}px, ${from.top}px, 0)` },
      {
        transform: `translate3d(${end.left + (end.width - from.width * scale) / 2}px, ${end.top}px, 0) scale(${scale})`,
        opacity: 0,
      },
    ],
    { duration: 450, easing: 'cubic-bezier(.55, 0, .75, .2)', fill: 'forwards' },
  );
  animation.finished.then(() => landed.value++, () => {}); // the icon bounces
  return animation;
};

makeDroppable(el, { id: 'cart', overDropAnimation: intoCart, onDrop: … });
```

`false` cuenta como definida: un destino con `overDropAnimation: false` deja el overlay donde se soltó.
La función recibe el destino como `over`, así que una sola función puede tratar cada destino a su
manera.

### El aterrizaje propio del contenido

El drop también espera a las animaciones dentro del overlay que están en marcha cuando empieza: las
animaciones y transiciones CSS que un componente de overlay inicia con `status: 'dropping'`. Sobre
la papelera, una foto se arruga; al soltarla, se tira a la papelera, y el drop termina cuando ha
entrado:

<example height="27rem" hint="Arrastra una foto a la papelera; Undo la recupera" name="anim-trash">



</example>

```ts [TrashBin.vue]
makeDroppable(el, {
  id: 'trash',
  // The overlay reads it as `over.data`: it aims the photo at the bin's mouth.
  data: () => ({ bin: bin.value }),
  overOverlay: Crumple,
  // The box stays where it was let go: its content does the landing.
  overDropAnimation: false,
  onDrop: (event) => emit('drop', event), // the gallery calls `event.source?.remove()`
});

// Its landing is over: the photo is in, the lid shuts.
useDnDMonitor({
  onDragSettle: (event) => {
    if ('dropped' in event && event.over?.id === 'trash') shut.value++;
  },
});
```

```vue [Crumple.vue]
<template>
  <div class="crumple">
    <!-- `fall` is set at the drop: `--dx` and `--dy`, from the photo to the bin in `over.data`. -->
    <div class="paper" :class="{ falling: fall }" :style="fall">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.paper { clip-path: polygon(…); rotate: -8deg; scale: 0.7; }
.paper.falling { animation: fall 0.55s forwards; }
@keyframes fall {
  to { translate: var(--dx) var(--dy); rotate: -120deg; scale: 0.12; opacity: 0; }
}
</style>
```

Las animaciones terminadas y los bucles infinitos no cuentan, y el drop espera dos segundos como
máximo.

## Cambios de datos: `animateChanges`

Arrastra un mosaico y luego baraja, añade y quita algunos. El arrastre se anima por defecto; los
cambios de los botones se animan porque la cuadrícula activa `animateChanges`.

<example height="22.75rem" hint="Arrastra, baraja, añade, quita" name="animate">



</example>

```ts
makeSortableList(listRef, { items: swatches, animateChanges: true });
```

Desactivado por defecto, `animateChanges` anima lo que cambia tu array sin arrastre: una ordenación, un
barajado, un movimiento entre listas de un mismo grupo, un ítem añadido, quitado o filtrado. En un
árbol también cubre las filas que un nodo muestra u oculta al desplegarse y plegarse.
`<DnDProvider animate-changes>` lo activa en todas las listas y árboles.

Sus partes se pueden ajustar una a una:

```ts
animateChanges: { duration: 250, move: true, enter: true, leave: { duration: 150 } },
```

<table>
<thead>
  <tr>
    <th>
      Parte
    </th>
    
    <th>
      Por defecto
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        move
      </code>
    </td>
    
    <td>
      Los ítems que cambiaron de sitio se deslizan, como con <code>
        animation
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        enter
      </code>
    </td>
    
    <td>
      Los ítems que aparecieron aparecen con un fundido donde están.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        leave
      </code>
    </td>
    
    <td>
      Una copia del ítem que se fue se desvanece donde estaba, encogiéndose un poco. Se marca con <code>
        data-dnd-leaving
      </code>
      
       y se quita al terminar.
    </td>
  </tr>
</tbody>
</table>

`duration` y `easing` se aplican a todas las partes; cada parte acepta `true`, opciones, `false` o
una función. Solo se animan los ítems cercanos a la zona visible, así que se omiten las filas que
una lista virtual no ha montado. La opción se lee cuando cambia `items`, así que una ref puede
cambiarla, como hace el interruptor de la demo.

## El overlay: levantar, inclinar, asentar

La caja del overlay dice qué está haciendo: `data-dnd-overlay="dragging"` mientras sigue al
puntero, `"dropping"` mientras aterriza. La biblioteca mueve la caja y le da tamaño. Dentro,
`data-dnd-overlay-content` contiene todo lo que muestra el overlay, un clon o una pila entera, y
animarlo te toca a ti. Agarra un candidato: el overlay se levanta y se inclina; suéltalo: vuelve
a quedar plano al aterrizar.

<example height="24.5rem" hint="Agarra un candidato, arrástralo a Hired y suéltalo" name="anim-container">



</example>

```vue [index.vue]
<template>
  <DnDProvider overlay-class="pipeline-hand">…</DnDProvider>
</template>

<!-- Not scoped: the overlay's content element is the library's, outside this component. -->
<style>
.pipeline-hand {
  transition:
    rotate 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
    scale 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);
}

[data-dnd-overlay='dragging'] > .pipeline-hand {
  rotate: 3deg;
  scale: 1.05;
}

/* Where the lift starts: the box appears already `dragging`. */
@starting-style {
  [data-dnd-overlay='dragging'] > .pipeline-hand {
    rotate: 0deg;
    scale: 1;
  }
}
</style>
```

- `overlay-class` pone tus clases en el contenido del overlay de este provider: el del arrastre y
los que todavía aterrizan. Tailwind también lo admite (`starting:` escribe `@starting-style`).
- Una transición necesita un inicio, y la caja aparece ya en `dragging`: `@starting-style` le da
al levantar su «antes». Cuando la caja pasa a `dropping`, la transición vuelve atrás, y el drop
espera a que termine.
- El propio contenido se anima igual, en su propio componente: la tarjeta en la mano y las
columnas del [tablero](https://zizigy.github.io/docs/examples/board) se inclinan al agarrarlas
(`[data-dnd-overlay='dragging'] .column` con `@starting-style`). Los keyframes también
funcionan: se reproducen desde el inicio del estado.
- Un **componente de overlay** recibe `status` como prop: sus transiciones pueden seguirlo. La
nota de la [demo del slot del provider](https://zizigy.github.io/docs/guides/overlay#the-providers-overlay-slot) se
endereza con `transition: rotate 0.25s` cuando `status` pasa a `'dropping'`.
- Deja en paz la propia caja (`[data-dnd-overlay]`): una transición en ella se quedaría detrás del
puntero, y la biblioteca escribe su `transform` y su tamaño.

## El hueco y las listas

El elemento arrastrado se queda en su lista como el **hueco** donde aterrizará, marcado con
`data-dnd-placeholder`. Sus listas también saben del arrastre: `isAccepting` mientras dura un
arrastre que aceptan, `isOver` mientras está sobre ellas. En el pipeline de arriba, cada columna
se prepara en cuanto agarras un candidato, la que está bajo la tarjeta se ilumina, su contador da
un salto y el hueco se abre y respira.

```vue [Lane.vue]
<script setup lang="ts">
const { items, isOver, isAccepting } = makeSortableList(list, {
  id: props.lane.id,
  items: toRef(props.lane, 'people'),
  group: 'pipeline',
  dropzone: zone,
});
</script>

<template>
  <section ref="zone" class="lane" :class="{ ready: isAccepting, over: isOver }">
    <h3>
      {{ lane.title }}
      <!-- A new element for every count: its animation plays on each change. -->
      <span :key="items.length" class="count">{{ items.length }}</span>
    </h3>
    <ul ref="list">…</ul>
  </section>
</template>

<style scoped>
.lane { transition: background-color 0.25s, box-shadow 0.25s; }
.lane.ready { box-shadow: inset 0 0 0 1px color-mix(in srgb, #42b883 35%, transparent); }
.lane.over { background: color-mix(in srgb, #42b883 8%, transparent); box-shadow: inset 0 0 0 1.5px #42b883; }
.count { animation: bump 0.3s ease-out; }
</style>
```

```css [Candidate.vue]
/* The slot opens where it appears, then breathes until the card lands. */
.candidate[data-dnd-placeholder] {
  animation: open 0.2s ease-out, breathe 1.2s ease-in-out 0.2s infinite;
}
```

- `items` es el borrador: su `length` cuenta la tarjeta en cuanto su hueco entra en la columna,
así que el contador cambia mientras arrastras.
- Un hueco que pasa a otra lista es ahí un elemento nuevo, así que sus keyframes se reproducen
otra vez.
- Las propias listas crecen y se encogen con suavidad cuando un hueco entra y sale, y también lo
que las rodea (`animateSize`, activado por defecto; con `false` saltan). Deja sus tamaños a eso:
una lista a la que cambias el tamaño mientras dura un arrastre mueve los destinos bajo el
puntero. Los brillos, contornos, colores y `scale` son seguros.

## Animaciones propias

Cada opción también acepta una función. Recibe un contexto, inicia la animación y devuelve su
`Animation`, una promesa que se resuelve cuando termina, o nada. El arrastre termina cuando
termina la animación del drop, y una copia saliente se quita cuando termina su animación, pero
ninguno espera más de un segundo por encima de `options.duration` (250 ms para el drop, 200 ms
para los demás).

```ts
// animation, animateChanges.move: an item moved from `from` to `to`
({ key, element, from, to, options, reason, signal, reducedMotion }) => Animation | Promise | void
// dropAnimation: `to` is null when there is no visible slot; `into` is the zone it went into
({ overlay, from, to, into, reason, active, options, reducedMotion }) => …
// animateChanges.enter: the element is already in place
({ key, element, to, options, reducedMotion }) => …
// animateChanges.leave: `element` is a copy where the item was, removed when you finish
({ key, element, from, options, reducedMotion }) => …
```

`reason` dice por qué: `'drag'` o `'change'` para un movimiento, `'drop'` o `'cancel'` para el
overlay. `options` contiene el timing de la opción, así que una función puede seguir la
`duration` que pongas a su lado.

Tres reglas mantienen las animaciones propias al compás de la biblioteca:

- **Anima translate** de `from - to` a cero, no `transform`. Se combina con los transforms que
las listas virtuales o tu CSS ponen en las filas, y los arrastres miden los ítems sin él.
- **Respeta signal.** Se aborta cuando el ítem se mueve otra vez antes de que termine la
animación. Detén tu animación y borra sus estilos al momento: la maquetación se mide justo
después. Una `Animation` devuelta se cancela por ti.
- **Aterriza en un hueco con la posición y el tamaño** (`width`, `height`), no con `scale`: el
contenido del overlay se vuelve a maquetar al tamaño del hueco. Donde no hay hueco en el que
aterrizar, encoger está bien: la animación por defecto reduce el overlay dentro de la zona
(`into`), y el carrito de arriba dentro de su icono.

### motion

La guirnalda de abajo funciona con [motion](https://motion.dev/docs/vue): los banderines y el drop
rebotan con muelles a través de las funciones del provider, y el componente de overlay se balancea
según la velocidad del puntero.

<example height="17rem" hint="Arrastra un banderín rápido de un lado a otro y luego suéltalo" name="anim-motion">



</example>

```vue [index.vue]
<script setup lang="ts">
import { animate } from 'motion-v';
import { DnDProvider, type DropAnimationContext, type LayoutAnimationContext } from '@vue-dnd-kit/core';

const spring = { type: 'spring', duration: 0.5, bounce: 0.3 } as const;

const move = ({ element, from, to, signal, reducedMotion }: LayoutAnimationContext) => {
  if (reducedMotion) return;
  const controls = animate(element, { translate: [`${from.left - to.left}px ${from.top - to.top}px`, '0px 0px'] }, spring);
  signal.addEventListener('abort', () => {
    controls.stop();
    element.style.translate = '';
  });
  return controls.finished;
};

const drop = ({ overlay, from, to, reducedMotion }: DropAnimationContext) => {
  if (reducedMotion) return;
  if (!to) return animate(overlay, { opacity: 0 }, { duration: 0.18 }).finished;
  return animate(
    overlay,
    { x: [from.left, to.left], y: [from.top, to.top], width: [from.width, to.width], height: [from.height, to.height] },
    spring,
  ).finished;
};
</script>

<template>
  <DnDProvider :animation="move" :drop-animation="drop">
    <Garland />
  </DnDProvider>
</template>
```

El componente de overlay se renderiza bajo el provider, así que `useDnD()` funciona en él. Sigue
al puntero a través de un motion value:

```vue [FlagOverlay.vue]
<script setup lang="ts">
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, useVelocity } from 'motion-v';
import { useDnD, type DnDStatus, type DragItem } from '@vue-dnd-kit/core';

const props = defineProps<{ items: DragItem[]; status: DnDStatus }>();

const { pointer } = useDnD();
const x = useMotionValue(pointer.value?.x ?? 0);
watch(() => pointer.value?.x, (value) => value !== undefined && x.set(value));
const swing = useSpring(useTransform(useVelocity(x), [-1500, 0, 1500], [-25, 0, 25]), { stiffness: 300, damping: 14 });
const calm = useReducedMotion();
</script>

<template>
  <!-- Held by its top edge: `transform-origin: 50% 0` in its CSS. -->
  <motion.div
    class="flag-overlay"
    :style="{ rotate: calm ? 0 : swing }"
    :animate="{ scale: status === 'dropping' || calm ? 1 : 1.1 }"
  >
    …
  </motion.div>
</template>
```

### GSAP

```ts [gsap-animations.ts]
import gsap from 'gsap';
import type {
  DropAnimationContext,
  EnterAnimationContext,
  LayoutAnimationContext,
  LeaveAnimationContext,
  Rect,
} from '@vue-dnd-kit/core';

const move = ({ element, from, to, signal, reducedMotion }: LayoutAnimationContext) => {
  if (reducedMotion) return;
  const tween = gsap.fromTo(
    element,
    { translate: `${from.left - to.left}px ${from.top - to.top}px` },
    { translate: '0px 0px', duration: 0.4, ease: 'power3.out' },
  );
  signal.addEventListener('abort', () => tween.revert());
  return tween.then();
};

const box = (rect: Rect) => ({ x: rect.left, y: rect.top, width: rect.width, height: rect.height });

const drop = ({ overlay, from, to, reducedMotion }: DropAnimationContext) => {
  if (reducedMotion) return;
  if (!to) return gsap.to(overlay, { opacity: 0, duration: 0.2 }).then();
  return gsap.fromTo(overlay, box(from), { ...box(to), duration: 0.45, ease: 'back.out(1.2)' }).then();
};

const enter = ({ element, reducedMotion }: EnterAnimationContext) =>
  gsap.from(element, reducedMotion ? { opacity: 0, duration: 0.2 } : { opacity: 0, scale: 0.85, duration: 0.35 }).then();

const leave = ({ element, reducedMotion }: LeaveAnimationContext) =>
  gsap.to(element, reducedMotion ? { opacity: 0, duration: 0.2 } : { opacity: 0, scale: 0.85, duration: 0.25 }).then();

export const gsapAnimations = { animation: move, dropAnimation: drop, animateChanges: { move, enter, leave } };
```

```vue
<DnDProvider v-bind="gsapAnimations">
```

Los tipos completos de las opciones están en [Animaciones](https://zizigy.github.io/docs/api/animations).

## Movimiento reducido

Con `prefers-reduced-motion: reduce`, las animaciones propias de la biblioteca no se ejecutan: los
ítems y el overlay van directos a su sitio, y el overlay no se ajusta con suavidad entre tamaños
de hueco. Tus funciones siempre se ejecutan, con `reducedMotion: true`, así que deciden ellas:
saltarse el movimiento o mantener un fundido corto, como hacen las recetas de arriba.

Tu CSS te toca protegerlo a ti. Pon los levantamientos, las inclinaciones y los pulsos dentro de
`@media (prefers-reduced-motion: no-preference)`, como hacen las demos de esta página, y deja
fuera los cambios de color: indican adónde va un drop.

## Cambios de maquetación que no causó la biblioteca

Cuando otra cosa mueve filas durante un arrastre — un virtualizador que vuelve a medir, una imagen
que carga —, llama al `captureLayout()` de la lista justo antes de que se renderice el cambio.
Mide las filas donde están y las anima hasta sus nuevos sitios tras el siguiente render. Fuera de
un arrastre no hace nada. Consulta [Listas virtuales](https://zizigy.github.io/docs/guides/virtual-lists).

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
