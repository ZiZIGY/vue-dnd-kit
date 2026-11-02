---
title: "DevTools"
description: "Una pestaña de Vue DnD Kit en las Vue DevTools y las Nuxt DevTools — un minimapa en vivo, un joystick que arrastra de verdad, edición de opciones en vivo y un registro de cada arrastre."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/es/docs/guides/devtools"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

`@vue-dnd-kit/devtools` añade una pestaña **Vue DnD Kit** a las Vue DevTools
(`vite-plugin-vue-devtools`) y a las Nuxt DevTools. Muestra cada lista, árbol y destino de drop de
la página en un minimapa en vivo, arrastra cualquier ítem con un joystick, edita opciones mientras
la app se ejecuta y registra lo que hizo cada arrastre. Solo funciona en desarrollo: nada de ella
llega a una build de producción.

La pestaña es una página propia, servida por tu servidor de desarrollo junto a tu app, así que no
puede ejecutarse dentro de esta documentación. Se configura en tres pasos.

## Instalación

### 1. Añadir los paquetes

```bash
npm i -D @vue-dnd-kit/devtools @vue-dnd-kit/actions
```

`@vue-dnd-kit/actions` es una peer dependency: los movimientos de la pestaña pasan por él. npm 7+
y pnpm lo instalan solos; con Yarn 1, añádelo.

### 2. Añadir el plugin

<code-group>

```ts [vite.config.ts]
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { vueDnDKitDevtools } from '@vue-dnd-kit/devtools/vite';

export default defineConfig({
  // Next to the Vue DevTools plugin: the tab joins its sidebar.
  plugins: [vueDevTools(), vueDnDKitDevtools(), vue()],
});
```

```ts [nuxt.config.ts]
export default defineNuxtConfig({
  // With @vue-dnd-kit/devtools installed, the tab appears in development.
  modules: ['@vue-dnd-kit/nuxt'],
});
```

</code-group>

Con Vite, el plugin hace tres cosas en el servidor de desarrollo (`vite serve`): sirve la pestaña
en `/__vue-dnd-kit-devtools/` (bajo tu `base`), la añade a las Vue DevTools y hace que la página le
informe antes de que arranque tu app. No hace falta ningún `app.use()`, y las builds no se tocan.

Con Nuxt, el módulo `@vue-dnd-kit/nuxt` encuentra el paquete, sirve la pestaña, la añade a las
Nuxt DevTools e instala la parte de la página con un plugin de cliente.
`vueDndKit: { devtools: false }` la desactiva.

### 3. Ejecutar la app en desarrollo

Arranca el servidor de desarrollo como siempre (`vite`, `nuxt dev`) y abre la app: la pestaña está
lista. Cada provider de la página aparece en ella, sea cual sea la app en la que se renderiza.

### Sin los plugins

Para un servidor de desarrollo propio, o una página que Vite no sirve a partir de un `index.html`
(configuraciones SSR), instala tú la parte de la página:

```ts [main.ts]
import { createApp } from 'vue';
import { DnDDevtools } from '@vue-dnd-kit/devtools';
import App from './App.vue';

const app = createApp(App);
app.use(DnDDevtools); // before mount: providers set up earlier aren't seen
app.mount('#app');
```

O importa `@vue-dnd-kit/devtools/auto` lo primero en el archivo de entrada. Usa
`vueDnDKitDevtools({ inject: false })` cuando el plugin deba servir la pestaña pero la parte de la
página la instales tú; `serveTab()` de `@vue-dnd-kit/devtools/vite` es el middleware que sirve la
pestaña.

<note>

En una build de producción, `app.use(DnDDevtools)` y el import `auto` se reducen casi a nada: cada
punto de entrada comprueba primero `process.env.NODE_ENV`, y los bundlers eliminan el resto. En el
servidor no hacen nada.

</note>

## Abrirla

- **Vue DevTools**: <kbd value="Alt">



</kbd>

 + <kbd value="Shift">



</kbd>

 + <kbd value="D">



</kbd>

, o el botón de Vue
en la parte inferior de la página, y luego la pestaña **Vue DnD Kit**.
- **Nuxt DevTools**: <kbd value="Alt">



</kbd>

 + <kbd value="Shift">



</kbd>

 + <kbd value="D">



</kbd>

, o el botón de
Nuxt, y luego **Vue DnD Kit** (en la barra lateral o en su menú de desbordamiento).
- **Una ventana propia**: abre `http://localhost:5173/__vue-dnd-kit-devtools/` en tu servidor de
desarrollo, o el botón ⧉ de la pestaña. Muy práctico en una segunda pantalla. Con varias páginas
abiertas, un selector arriba elige la que observar.

<warning>

Mantén la pestaña en una ventana propia, no en una pestaña del navegador en segundo plano de la
misma ventana: la página debe seguir visible, y una página oculta cancela los arrastres.

</warning>

## La pestaña de un vistazo

<table>
<thead>
  <tr>
    <th>
      Parte
    </th>
    
    <th>
      Qué contiene
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Barra superior
    </td>
    
    <td>
      Lo que está haciendo el arrastre ahora mismo (<code>
        dragging card-3 → done (accepts)
      </code>
      
      ), la página observada, <strong>
        ⌖ Pick
      </strong>
      
      , el número de opciones editadas con un botón para restablecerlas, ⧉ (una ventana propia) y el tema.
    </td>
  </tr>
  
  <tr>
    <td>
      Izquierda: el registro
    </td>
    
    <td>
      Cada provider como un árbol: sus listas, árboles, destinos de drop y elementos arrastrables. <strong>
        ☰
      </strong>
      
       lo muestra u oculta.
    </td>
  </tr>
  
  <tr>
    <td>
      Centro: <strong>
        Map
      </strong>
      
       y <strong>
        Log
      </strong>
    </td>
    
    <td>
      El minimapa en vivo de la página, o el registro de los arrastres.
    </td>
  </tr>
  
  <tr>
    <td>
      Derecha: <strong>
        Drive
      </strong>
      
      , <strong>
        Options
      </strong>
      
      , <strong>
        State
      </strong>
    </td>
    
    <td>
      El joystick y los botones de mover, las opciones del nodo elegido y lo que el provider sabe de él.
    </td>
  </tr>
</tbody>
</table>

Elige un nodo en el registro o un ítem en el mapa, y la parte derecha lo sigue.

## El minimapa

Una tarjeta en vivo por lista, árbol y destino de drop, con copias de sus ítems donde están — los
mismos clones que mostraría el overlay, con el CSS de la página. Durante un arrastre marca:

- las listas y los destinos que **aceptan** el arrastre (en azul) o lo **rechazan** (en rojo);
- el placeholder y el destino bajo el puntero;
- el puntero, la caja del overlay y la línea de inserción de las listas con
`placeholder: 'indicator'`.

Un clic elige un ítem y lo resalta en la página; un doble clic desplaza la página hasta él. Usa el
mapa cuando un drop no va adonde esperas: muestra de un vistazo qué listas aceptan el arrastre.

## Drive: el joystick

Elige un ítem — en el mapa, en el registro o con **⌖ Pick**, que toma la siguiente pulsación sobre
un elemento arrastrable de la página en lugar de dejar que actúe — y empuja la palanca del
joystick. El ítem se agarra y se mueve en esa dirección, más rápido cuanto más lejos del centro
esté la palanca. Suéltala y se detiene; **Drop** y **Cancel** terminan el arrastre.

Es un arrastre de puntero real de un sensor llamado `devtools`, hecho con la
[API pública de sensores](https://zizigy.github.io/docs/guides/sensors#a-sensor-of-your-own): las listas ordenan debajo,
los contenedores se desplazan automáticamente en sus bordes, y `onBeforeDrop` y `onDrop` se
ejecutan como en cualquier arrastre. Los ítems desactivados no se agarran. También se puede
dirigir un arrastre con teclado que haya empezado la página.

Los ítems de las listas ordenables tienen además botones: arriba, abajo, al principio, al final, a
otra lista del grupo. Cada uno es un arrastre con teclado de
[`moveItem`](https://zizigy.github.io/docs/guides/sensors#programmatic-drags). Debajo del joystick, una copia grande de lo
que muestra el overlay.

<table>
<thead>
  <tr>
    <th>
      Tecla, en la pestaña
    </th>
    
    <th>
      Hace
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Flechas o <kbd value="W">
        
      </kbd>
      
       <kbd value="A">
        
      </kbd>
      
       <kbd value="S">
        
      </kbd>
      
       <kbd value="D">
        
      </kbd>
    </td>
    
    <td>
      Empuja la palanca en esa dirección, a medio recorrido; con <kbd value="Shift">
        
      </kbd>
      
      , hasta el tope
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="G">
        
      </kbd>
    </td>
    
    <td>
      Agarra el ítem elegido
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Space">
        
      </kbd>
      
       / <kbd value="Enter">
        
      </kbd>
    </td>
    
    <td>
      Suelta
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Escape">
        
      </kbd>
    </td>
    
    <td>
      Cancela
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="P">
        
      </kbd>
    </td>
    
    <td>
      Elige en la página
    </td>
  </tr>
</tbody>
</table>

## Opciones

Toda opción que no sea un callback se puede editar mientras la app se ejecuta. Elige el nodo y
abre **Options**:

<table>
<thead>
  <tr>
    <th>
      Nodo
    </th>
    
    <th>
      Opciones
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Provider
    </td>
    
    <td>
      <code>
        overlayFit
      </code>
      
      , <code>
        autoScroll
      </code>
      
      , <code>
        collision
      </code>
      
      , <code>
        modifiers
      </code>
      
       (los de la biblioteca, por nombre), <code>
        animation
      </code>
      
      , <code>
        dropAnimation
      </code>
      
      , <code>
        animateChanges
      </code>
      
      , <code>
        activation
      </code>
      
      , <code>
        keyboard
      </code>
      
      , <code>
        haptics
      </code>
      
      , <code>
        copyModifier
      </code>
      
      …
    </td>
  </tr>
  
  <tr>
    <td>
      Lista
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      , <code>
        strategy
      </code>
      
      , <code>
        placeholder
      </code>
      
      , <code>
        behavior
      </code>
      
      , <code>
        multiple
      </code>
      
      , <code>
        sort
      </code>
      
      , <code>
        dropOutside
      </code>
      
      , <code>
        acceptMode
      </code>
      
      , <code>
        animation
      </code>
      
      , <code>
        animateChanges
      </code>
      
      , <code>
        autoScroll
      </code>
      
      , <code>
        modifiers
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      Árbol
    </td>
    
    <td>
      <code>
        placeholder
      </code>
      
      , <code>
        indentation
      </code>
      
      , <code>
        nesting
      </code>
      
      , <code>
        maxDepth
      </code>
      
      …
    </td>
  </tr>
  
  <tr>
    <td>
      Destino de drop
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      , <code>
        priority
      </code>
      
      , <code>
        accept
      </code>
      
      , <code>
        acceptMode
      </code>
    </td>
  </tr>
  
  <tr>
    <td>
      Ítem
    </td>
    
    <td>
      <code>
        disabled
      </code>
      
      , <code>
        keyboardMode
      </code>
      
      , <code>
        activation
      </code>
    </td>
  </tr>
</tbody>
</table>

Una edición se aplica al momento, solo a esta página, y nunca se escribe en tu código: la
biblioteca lee el nuevo valor donde lee la opción. Dura hasta que la restableces (↺ por opción, o
el botón de la barra superior), se desmonta el provider o se recarga la página. Una opción editada
muestra a su lado el valor de tu código. Los ítems que se montan mientras hay una edición activa —
filas de una lista virtual — también la reciben.

## Estado

Lo que sabe cada provider, para el nodo que elegiste:

- la **sesión de arrastre**: el estado, los ids, ítems y sensor activos, el destino y si acepta,
el puntero, el overlay, la sesión del grupo ordenable y la línea de inserción;
- una **lista**: su orden y su borrador; un **árbol**: sus filas;
- un **ítem**: su tipo, sus datos y su posición; un **destino de drop**: sus reglas.

Los ítems se montan y desmontan sin eventos: el registro se pone al día en menos de un segundo.

## Registro

Una franja por arrastre, en orden:

<table>
<thead>
  <tr>
    <th>
      Entrada
    </th>
    
    <th>
      Qué indica
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      <code>
        drag start
      </code>
    </td>
    
    <td>
      Los ids, el sensor y si es táctil, la lista de la que viene.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        over
      </code>
      
      , <code>
        left
      </code>
    </td>
    
    <td>
      Cada destino en el que entra y del que sale, y si acepta.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        release
      </code>
    </td>
    
    <td>
      El destino sobre el que se soltó, mientras decide <code>
        onBeforeDrop
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
    </td>
    
    <td>
      El veredicto: aceptado, algunos aceptados, rechazado por un hook, rechazado por el <code>
        accept
      </code>
      
       del destino, y cuánto tardaron los hooks.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop
      </code>
    </td>
    
    <td>
      El destino; en las listas ordenables, el movimiento, <code>
        e.result
      </code>
      
       y si se llamó a <code>
        preventDefault()
      </code>
      
      .
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel
      </code>
    </td>
    
    <td>
      Por qué: cancelado (Escape, <code>
        cancel()
      </code>
      
      ), rechazado por un hook o rechazado por el <code>
        accept
      </code>
      
       del destino.
    </td>
  </tr>
</tbody>
</table>

También `auto-scroll on` y `off`, los textos de `announcement` (ocultos por defecto) y, fuera de
los arrastres, `animate` (cambios de los ítems de una lista que no hizo ningún arrastre). Haz clic
en una entrada para ver sus datos. Una pestaña que se abre más tarde recibe los arrastres hechos
hasta entonces.

## Depurar un drop, paso a paso

Una tarjeta no entra en una columna. Con la pestaña abierta:

1. **Reprodúcelo** a mano, o con **Drive** para tener las manos libres para la pestaña.
2. **Mira el mapa** mientras la tarjeta está sobre la columna. Rojo significa que la lista
rechaza la tarjeta: revisa su `group` (`put`) o el `accept` del destino. Azul significa que la
acepta, y el problema viene después.
3. **Lee el registro** de ese arrastre. `onBeforeDrop` dice quién dijo que no — un hook, o el
`accept` del destino. Si el drop se completó pero tus datos no cambiaron, la entrada `drop`
dice si se llamó a `preventDefault()` y qué contenía `e.result`: una lista controlada debe
aplicarlo ella misma.
4. **Prueba un arreglo en vivo** en **Options** — un `acceptMode` más permisivo, otra `collision`,
`placeholder: 'indicator'` — y luego escribe en tu código el que funcione.

## Cómo funciona

Los providers informan a un hook que instala la parte de la página. Mientras ninguna pestaña
observa la página, solo se registran; después, la página escucha como cualquier monitor y envía a
la pestaña lo que muestra — cada 40 ms durante un arrastre, dos veces por segundo el resto del
tiempo — y se detiene cuando ninguna pestaña la ha observado durante unos segundos. La pestaña
habla con la página a través de un `BroadcastChannel` del origen de la página. No cambia nada más
que lo que pides: los arrastres, la selección y las opciones sobrescritas.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
