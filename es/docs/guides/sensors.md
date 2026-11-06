---
title: "Sensores y arrastres programáticos"
description: "Cómo la entrada se convierte en un arrastre — los sensores de puntero y teclado, las restricciones de activación, canDrag, sensores propios y arrastres que programas con @vue-dnd-kit/actions."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/guides/sensors"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

Un sensor convierte la entrada en arrastres. Solo le dice al provider «arrastra este ítem desde
aquí», luego adónde se movió la entrada, y si soltó o canceló. El provider hace el resto, igual
para todos los sensores: un arrastre a la vez, rechazo de los ítems desactivados, restricciones de
activación, ordenación, desplazamiento automático, anuncios, <kbd value="Escape">



</kbd>

 y todo el drop.

## Los sensores integrados

<table>
<thead>
  <tr>
    <th>
      Sensor
    </th>
    
    <th>
      Entrada
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        pointerSensor
      </code>
    </td>
    
    <td>
      Ratón, táctil y lápiz, a través de Pointer Events. Captura el puntero, evita que la página seleccione texto o se desplace bajo un arrastre táctil, y se traga el clic que sigue a un arrastre.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        keyboardSensor
      </code>
    </td>
    
    <td>
      <kbd value="Space">
        
      </kbd>
      
       y <kbd value="Enter">
        
      </kbd>
      
       agarran y sueltan, las flechas mueven, <kbd value="Escape">
        
      </kbd>
      
       cancela — cualquier arrastre, también los de puntero.
    </td>
  </tr>
</tbody>
</table>

Los dos funcionan por defecto. Los `sensors` del provider sustituyen la lista:

```vue
<DnDProvider :sensors="[pointerSensor, keyboardSensor, joystick.sensor]">
```

Para desactivar los arrastres con teclado, prefiere `:keyboard="false"` a dejar fuera
`keyboardSensor`: el sensor de teclado es también lo que cancela cualquier arrastre con
<kbd value="Escape">



</kbd>

. Sus teclas se reasignan con `keyboard.keys` (consulta
[Accesibilidad](https://zizigy.github.io/docs/guides/accessibility#the-keyboard)).

## Restricciones de activación

Una pulsación no arrastra de inmediato: espera a su restricción de activación, para que un clic
siga siendo un clic y un deslizamiento pueda seguir desplazando la página. Cambia las reglas de
esta lista y pulsa una fila:

<example height="34.5rem" hint="Mantén pulsada una fila hasta que se cierre el anillo, o cambia la regla" name="activation-modes">



</example>

Una restricción tiene tres campos:

<table>
<thead>
  <tr>
    <th>
      Campo
    </th>
    
    <th>
      El arrastre empieza…
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        distance
      </code>
    </td>
    
    <td>
      Cuando el puntero se ha movido esos px.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        delay
      </code>
    </td>
    
    <td>
      Cuando la pulsación ha durado esos ms. Con <code>
        distance
      </code>
      
       también, lo que ocurra primero.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        tolerance
      </code>
    </td>
    
    <td>
      Con <code>
        delay
      </code>
      
      : cuánto puede moverse el puntero entretanto. Si lo supera, la pulsación se abandona, para que la página pueda desplazarse. 5 px por defecto cuando no hay <code>
        distance
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Si no pones una propia, cada tipo de puntero tiene la suya por defecto:

<table>
<thead>
  <tr>
    <th>
      Puntero
    </th>
    
    <th>
      Por defecto
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Ratón
    </td>
    
    <td>
      Tras moverse 4 px. De inmediato al pulsar sobre un asa (<code>
        handle
      </code>
      
      ), salvo que haya una restricción de ratón.
    </td>
  </tr>
  
  <tr>
    <td>
      Lápiz
    </td>
    
    <td>
      Tras moverse 4 px.
    </td>
  </tr>
  
  <tr>
    <td>
      Táctil
    </td>
    
    <td>
      Tras una pulsación de 200 ms. Moverse más de 5 px antes la abandona, y la página se desplaza en su lugar.
    </td>
  </tr>
</tbody>
</table>

### Dónde ponerlas

Por tipo de puntero — `mouse`, `touch`, `pen` — en el provider, en un área de arrastre o en el
ítem. Para cada tipo gana la del ítem, luego la de su área y luego la del provider:

```vue
<DnDProvider :activation="{ mouse: { distance: 8 }, touch: { delay: 250, tolerance: 5 } }">
```

```ts
// Inbox.vue: the rules of every drag that starts inside the panel.
makeDragArea(panel, { activation: () => MODES[mode.value].activation });

// One item: a longer press by touch, the area's rule for the mouse.
makeSortableItem(el, { item: () => props.task, activation: { touch: { delay: 400, tolerance: 8 } } });
```

Las opciones se leen cuando empieza una pulsación, así que un getter o una ref las cambia en vivo,
como hace la demo. Los arrastres con teclado empiezan de inmediato.
[Un sensor propio](#a-sensor-of-your-own) pide su propia restricción, o la configurada para un
tipo de puntero.

### Un anillo de pulsación larga

Mientras una pulsación espera, `useDnD().status` es `'activating'` y `activation.progress` va de 0
a 1 — por tiempo con `delay`, por la distancia recorrida con `distance`. La demo dibuja un anillo
donde empezó la pulsación:

```vue [Inbox.vue]
<script setup lang="ts">
const { status, activation } = useDnD();
</script>

<template>
  <svg v-if="status === 'activating'" class="ring" viewBox="0 0 40 40">
    <circle cx="20" cy="20" r="17" pathLength="1" :stroke-dasharray="`${activation.progress.value} 1`" />
  </svg>
</template>
```

Dale al anillo `pointer-events: none`: está bajo el puntero, y el arrastre hace la prueba de
colisión con lo que hay ahí. Una pulsación que se abandona — movida más allá de su `tolerance`, o
soltada demasiado pronto — devuelve `status` directamente a `'idle'`.

### Las asas empiezan de inmediato

Con un `handle`, solo el asa inicia un arrastre, y una pulsación de ratón sobre ella arrastra de
inmediato: agarrar un asa no deja nada que distinguir. Una pulsación que se suelta donde empezó
sigue siendo un clic, así que el asa puede abrir un menú en `click` (el puntero solo se captura
cuando se mueve). Un toque sigue esperando su pulsación larga, salvo que el asa no pueda desplazar la página. Dale `touch-action: none` y al ítem una
distancia corta:

```ts [Message.vue]
makeSortableItem(el, {
  item: () => props.chat,
  handle: '.grip',
  // The grip has `touch-action: none`: a touch on it can't scroll, so it drags after 4 px.
  activation: { touch: { distance: 4 } },
});
```

Una restricción de ratón puesta en el ítem, su área o el provider también se aplica a las asas.
Haz que el asa sea un `<button>`, como hace la demo: recibe el foco, así que un arrastre con
teclado también empieza desde ella.

## Solo algunas pulsaciones

`canDrag` es un filtro más en los elementos arrastrables y los ítems ordenables. Recibe el evento
de entrada y responde `true` o `false` para esta pulsación. Aquí los arrastres de puntero necesitan
<kbd value="Shift">



</kbd>

; el teclado arrastra como siempre:

<example height="28rem" hint="Arrastra una fila con y sin Mayús; marca una casilla, elige un responsable" name="can-drag">



</example>

```ts [Task.vue]
makeSortableItem(el, {
  item: () => props.task,
  // Never: the row is locked (and says so to screen readers with aria-disabled).
  disabled: () => !!props.task.locked,
  // Per press: pointer drags only with Shift held; the keyboard as usual.
  canDrag: (event) => {
    if (!props.shiftOnly || event instanceof KeyboardEvent || event.shiftKey) return true;
    emit('refused');
    return false;
  },
});
```

<table>
<thead>
  <tr>
    <th>
      Opción
    </th>
    
    <th>
      Se pregunta
    </th>
    
    <th>
      Úsala para
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        disabled
      </code>
    </td>
    
    <td>
      En vivo, y se pone como <code>
        aria-disabled
      </code>
    </td>
    
    <td>
      Ítems que no pueden moverse en absoluto: bloqueados, de solo lectura.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        canDrag
      </code>
    </td>
    
    <td>
      Una vez por pulsación, con su evento
    </td>
    
    <td>
      Reglas sobre la entrada: una tecla mantenida, un botón, un tipo de puntero.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        handle
      </code>
    </td>
    
    <td>
      Donde cae la pulsación
    </td>
    
    <td>
      Ítems que solo inician un arrastre desde una parte.
    </td>
  </tr>
</tbody>
</table>

A `canDrag` se le pregunta antes de la restricción de activación, con el `pointerdown` o el
`keydown`. Un tipo de puntero es una regla más que puede poner:

```ts
// Mouse and pen drag; a touch on the row always scrolls the page.
canDrag: (event) => !(event instanceof PointerEvent && event.pointerType === 'touch'),
```

Los hijos interactivos — botones, inputs, casillas, campos editables — nunca inician un arrastre
de puntero, así que siguen funcionando dentro de un elemento arrastrable, como la casilla y el
menú del responsable de la demo. Con un `handle`, solo el asa inicia uno.

## Un sensor propio

Un mando, un joystick en pantalla, comandos de voz: cualquier cosa que pueda señalar un ítem y
moverse puede conducir un arrastre. Este mando es un sensor. Mantén <kbd value="A">



</kbd>

 sobre un héroe
para agarrarlo, dirige con la cruceta, <kbd value="A">



</kbd>

 otra vez lo suelta y <kbd value="B">



</kbd>


cancela. El ratón y el teclado siguen funcionando a su lado:

<example height="30rem" hint="Mantén A sobre un héroe y luego mantén una flecha: el héroe recorre la lista" name="joystick">



</example>

`defineSensor` da al sensor su nombre y un `setup` que recibe la parte del provider, una vez por
provider:

```ts [joystick.ts]
const sensor = defineSensor({
  name: 'joystick',
  // Once per provider, in the browser. The cleanup runs when the provider unmounts.
  setup(ctx) {
    context = ctx;
    return () => {
      context = null;
      drag = null;
    };
  },
});
```

Una pulsación pide un arrastre al provider con `activate()`. El destino se comprueba como una
pulsación real: debe ser un elemento arrastrable de este provider, no desactivado, y no un botón
dentro de uno:

```ts [joystick.ts]
/** A goes down: drops a running drag, or starts a hold over what is under the cursor. */
const press = () => {
  if (drag?.state === 'dragging') return void drag.drop();
  const at = point();
  const target = document.elementFromPoint(at.x, at.y);
  if (!target || !context) return;
  drag = context.activate({
    target, // checked like a real press: a draggable of this provider, not disabled
    point: at,
    type: 'pointer', // follows points: lists sort under it, containers auto-scroll
    activation: { delay: 300 }, // `useDnD().activation.progress` runs meanwhile
    onEnd: (ended) => {
      if (drag === ended) drag = null;
    },
  }); // null: nothing to drag there
};
```

Luego el arrastre se mueve con la cruceta, y A o B lo terminan:

```ts [joystick.ts]
const move = (dx: number, dy: number) => {
  cursor.value = { x: cursor.value.x + dx, y: cursor.value.y + dy }; // clamped in the demo
  drag?.move(point()); // pending: checks the tolerance; dragging: moves
};

const release = () => {
  if (drag?.state === 'pending') drag.cancel(); // A let go before the hold is over
};

const cancel = () => drag?.cancel();
```

Añade el sensor a los `sensors` del provider, como hace la demo, o ejecútalo mientras viva un
componente con `useSensor(joystick.sensor)`. Los puntos están en coordenadas del viewport: la demo
guarda su cursor en coordenadas del escenario, para que se desplace con la página, y lo convierte
en `point()`.

### Lo que recibe el sensor

`setup(context)` recibe la parte del provider:

<table>
<thead>
  <tr>
    <th>
      Miembro
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
        props
      </code>
    </td>
    
    <td>
      Las props del provider (<code>
        activation
      </code>
      
      , <code>
        keyboard
      </code>
      
      …). Léelas cuando las necesites: pueden cambiar.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        status
      </code>
    </td>
    
    <td>
      El estado de arrastre del provider, sea cual sea el sensor que lleve el arrastre.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drag
      </code>
    </td>
    
    <td>
      El arrastre actual del provider, pendiente o en curso, sea cual sea el sensor que lo empezó. <code>
        null
      </code>
      
       cuando no hay ninguno.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activate(options)
      </code>
    </td>
    
    <td>
      Pide un arrastre. Devuelve un <code>
        SensorDrag
      </code>
      
      , o <code>
        null
      </code>
      
       cuando no puede empezar ningún arrastre.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel()
      </code>
    </td>
    
    <td>
      Cancela el arrastre o la pulsación pendiente del provider.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onWindow(setup)
      </code>
    </td>
    
    <td>
      Ejecuta <code>
        setup(view)
      </code>
      
       en la ventana de la página y en todas las <a href="/docs/guides/provider#other-windows-of-the-app">
        demás ventanas de la app
      </a>
      
       a medida que se unen. Escucha allí la entrada; se limpia cuando esa ventana se cierra.
    </td>
  </tr>
</tbody>
</table>

`activate()` acepta:

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
        target
      </code>
    </td>
    
    <td>
      Dónde cayó la entrada: un elemento dentro de un elemento arrastrable, o el id de un elemento arrastrable. Un elemento se comprueba como una pulsación real (asa, ningún hijo interactivo); un id se salta las comprobaciones.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        point
      </code>
    </td>
    
    <td>
      Dónde empieza el arrastre, en coordenadas del viewport. Por defecto: el centro del elemento arrastrable.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        type
      </code>
    </td>
    
    <td>
      <code>
        'pointer'
      </code>
      
       (por defecto): sigue puntos, hace la prueba de colisión con los destinos, desplaza automáticamente. <code>
        'keyboard'
      </code>
      
      : se mueve de ítem en ítem, hace visibles los destinos, devuelve el foco al terminar.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        activation
      </code>
    </td>
    
    <td>
      Una restricción (<code>
        { delay: 300 }
      </code>
      
      ), o un tipo de puntero (<code>
        'touch'
      </code>
      
      ) para usar la configurada. Por defecto: ninguna, el arrastre empieza de inmediato.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        event
      </code>
    </td>
    
    <td>
      El evento de entrada, que se pasa al <code>
        canDrag
      </code>
      
       del ítem (sin él, no se pregunta a <code>
        canDrag
      </code>
      
      ). Un <code>
        pointerType
      </code>
      
       táctil lo convierte en un arrastre táctil (vibración).
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onStart(drag)
      </code>
    </td>
    
    <td>
      El arrastre empezó, tras su activación.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onEnd(drag)
      </code>
    </td>
    
    <td>
      El arrastre terminó: abortado, soltado o cancelado — por quien sea.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onResume(drag)
      </code>
    </td>
    
    <td>
      <code>
        onBeforeDrop
      </code>
      
       respondió <code>
        'continue'
      </code>
      
      : el arrastre continúa, y <code>
        move
      </code>
      
      , <code>
        drop
      </code>
      
       y <code>
        cancel
      </code>
      
       vuelven a aplicarse.
    </td>
  </tr>
</tbody>
</table>

El `SensorDrag` que devuelve:

<table>
<thead>
  <tr>
    <th>
      Miembro
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
        id
      </code>
      
      , <code>
        type
      </code>
    </td>
    
    <td>
      El id del ítem arrastrado, y <code>
        'pointer'
      </code>
      
       o <code>
        'keyboard'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        state
      </code>
    </td>
    
    <td>
      <code>
        'pending'
      </code>
      
       (esperando la activación), <code>
        'dragging'
      </code>
      
       y luego <code>
        'ended'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        started
      </code>
    </td>
    
    <td>
      El arrastre empezó, aunque haya terminado desde entonces.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        move(point)
      </code>
    </td>
    
    <td>
      La entrada se movió. Mientras está pendiente, comprueba la tolerancia; durante el arrastre, mueve el arrastre.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        step(direction)
      </code>
    </td>
    
    <td>
      Arrastres con teclado: un paso de flecha, <code>
        'up' | 'down' | 'left' | 'right'
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        place({ list, index })
      </code>
    </td>
    
    <td>
      Pone el ítem en una posición de una lista ordenable, como hacen los movimientos con teclado. Se resuelve a <code>
        false
      </code>
      
       cuando ninguna lista lo acepta ahí.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop()
      </code>
    </td>
    
    <td>
      Suelta. Se resuelve a <code>
        true
      </code>
      
       cuando el drop se completó, una vez que ha aterrizado.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel()
      </code>
    </td>
    
    <td>
      Cancela: el ítem vuelve a su sitio, o se abandona una pulsación pendiente.
    </td>
  </tr>
</tbody>
</table>

Las llamadas que ya no se aplican — un movimiento tras el final, un segundo `drop()` — se ignoran.
Tipos completos: [Sensores](https://zizigy.github.io/docs/api/sensors).

<tip>

Para envolver un sensor integrado, ejecuta su `setup` con un contexto propio. Créalo con
`Object.create(context, { activate: { value: myActivate } })` en lugar de con un spread, para que
los getters en vivo (`status`, `drag`, `props`) sigan funcionando.

</tip>

## Arrastres programáticos

`@vue-dnd-kit/actions` mueve ítems desde el código: botones de «Subir», menús, atajos de teclado,
deshacer, recorridos de bienvenida, tests. Está construido sobre la API pública de sensores, y sus
arrastres son reales: anunciados y animados, pasando por `onBeforeDrop`, `onDrop`, `e.result` y
`preventDefault()`, bajo las reglas del provider (un arrastre a la vez, ítems desactivados,
`accept` y `group.put`).

<example height="31.5rem" hint="Pasa por encima de una pista para ver sus flechas, baraja, o reproduce el arrastre programado" name="actions">



</example>

```bash
npm i @vue-dnd-kit/actions
```

### moveItem: una llamada, un movimiento

```ts
import { useDnDActions } from '@vue-dnd-kit/actions';

const { moveItem } = useDnDActions(); // in setup, under a provider

await moveItem('card-1', { index: 0 }); // to the top of its list
await moveItem('card-1', { list: 'done' }); // to the end of another list
await moveItem('card-1', { list: 'done', index: 2 }); // to a place in another list
```

- `list` es el `id` de una lista ordenable. Sin él, el ítem se queda en su lista.
- `index` es donde acaba el ítem, contado sin el propio ítem y ajustado a los límites de la lista.
Sin él, el ítem va al final.
- Se resuelve a `true` cuando el drop se completó, y a `false` cuando el ítem no está renderizado
o está desactivado, ninguna lista lo acepta ahí o se rechazó el drop.
- Las llamadas se ponen en cola: cada una espera a que el provider esté en reposo, para que no se
pierda un segundo clic rápido. El barajado de la demo son cinco llamadas seguidas.
- Se ejecuta como un arrastre con teclado, así que se anuncia y el foco se queda en el ítem.
- Solo listas: las posiciones en un árbol también tienen profundidad.

Consulta [Accesibilidad](https://zizigy.github.io/docs/guides/accessibility#moving-without-dragging) para una fila con
botones de mover.

### startDrag: un arrastre programado

```ts
const { startDrag } = useDnDActions();

const drag = startDrag('card-1'); // null when it can't start now
if (drag) {
  await drag.moveTo(document.querySelector('#trash')!); // onto an element
  await drag.moveTo({ x: 400, y: 120 }); // to a point, in viewport coordinates
  await drag.moveTo({ list: 'done', index: 2 }); // to a list position
  await drag.drop(); // true when the drop went through; or drag.cancel()
}
```

`moveTo` se resuelve una vez renderizado el movimiento, `drop` una vez aterrizado el drop. El
botón «Play a scripted drag» de la demo sube la última pista en pequeños pasos de `moveTo` y luego
la suelta arriba. `startDrag(id, { from: { x, y } })` agarra el ítem en un punto en lugar de en su
centro.

### Pasar un arrastre al teclado

`startDrag(id, { type: 'keyboard' })` levanta el ítem como un arrastre con teclado. Tu código
puede moverlo con `await drag.step('down')`, o dejárselo al usuario: el sensor de teclado conduce
cualquier arrastre con teclado, lo haya empezado quien lo haya empezado. Así se hace un elemento
de menú «Mover»:

<example height="26rem" hint="Abre el menú de una fila: flechas del teclado, o envíala a la otra semana" name="move-menu">



</example>

```ts [Row.vue]
const { moveItem, startDrag } = useDnDActions();

// One move in one call: picked up, put there and dropped, announced and animated.
const toOther = () => moveItem(props.task.id, { list: props.other.id, index: 0 });
// A keyboard drag, handed to the arrow keys: Space or Enter drops, Escape cancels.
const withKeys = () => {
  el.value?.focus();
  startDrag(props.task.id, { type: 'keyboard' });
};
```

Las flechas mueven la fila de hueco en hueco, <kbd value="ArrowLeft">



</kbd>

 y <kbd value="ArrowRight">



</kbd>

 a
la otra semana (las listas comparten un `group`). Cuando termina el arrastre, el foco vuelve a la
fila. Las pistas de teclas bajo el tablero se iluminan mientras `useDnD().active.value?.sensor`
es `'keyboard'`.

### Fuera de los componentes

`useDnDActions()` ejecuta un sensor, llamado `actions`, en el provider de arriba. Para conducir un
provider desde un store o un entorno de tests, o con un nombre propio, crea las acciones en un
sensor que ejecutes tú:

```ts
import { defineSensor } from '@vue-dnd-kit/core';
import { createDnDActions, type DnDActions } from '@vue-dnd-kit/actions';

export let tour: DnDActions | undefined;
export const tourSensor = defineSensor({
  name: 'tour',
  setup: (context) => void (tour = createDnDActions(context)),
});
```

```vue
<DnDProvider :sensors="[pointerSensor, keyboardSensor, tourSensor]">
```

Luego `await tour?.moveItem('card-1', { list: 'done' })` desde cualquier sitio. Durante el
renderizado en el servidor no se arrastra nada: `moveItem` se resuelve a `false` y `startDrag`
devuelve `null`.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
