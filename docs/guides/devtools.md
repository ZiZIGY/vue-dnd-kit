---
title: "DevTools"
description: "A Vue DnD Kit tab in the Vue DevTools and the Nuxt DevTools — a live mini-map, a joystick that drags for real, live option editing and a log of every drag."
canonical_url: "https://zizigy.github.io/vue-dnd-kit/docs/guides/devtools"
---

> Index of every page on this site: [llms.txt](https://zizigy.github.io/vue-dnd-kit/llms.txt)

`@vue-dnd-kit/devtools` adds a **Vue DnD Kit** tab to the Vue DevTools (`vite-plugin-vue-devtools`)
and to the Nuxt DevTools. It shows every list, tree and drop target of the page in a live
mini-map, drags any item with a joystick, edits options while the app runs, and logs what each drag
did. It works in development only: nothing of it reaches a production build.

The tab is a page of its own, served by your dev server next to your app, so it can't run inside
these docs. Three steps set it up.

## Install

### 1. Add the packages

```bash
npm i -D @vue-dnd-kit/devtools @vue-dnd-kit/actions
```

`@vue-dnd-kit/actions` is a peer dependency: the tab's moves go through it. npm 7+ and pnpm install
it by themselves; with Yarn 1, add it.

### 2. Add the plugin

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

With Vite, the plugin does three things on the dev server (`vite serve`): it serves the tab at
`/__vue-dnd-kit-devtools/` (under your `base`), adds it to the Vue DevTools, and makes the page
report to it before your app starts. No `app.use()` is needed, and builds are untouched.

With Nuxt, the `@vue-dnd-kit/nuxt` module finds the package, serves the tab, adds it to the Nuxt
DevTools and installs the page's side with a client plugin. `vueDndKit: { devtools: false }` turns
it off.

### 3. Run the app in development

Start the dev server as usual (`vite`, `nuxt dev`) and open the app: the tab is ready. Every
provider of the page shows in it, whichever app it renders in.

### Without the plugins

For a dev server of your own, or a page Vite doesn't serve from an `index.html` (SSR setups),
install the page's side yourself:

```ts [main.ts]
import { createApp } from 'vue';
import { DnDDevtools } from '@vue-dnd-kit/devtools';
import App from './App.vue';

const app = createApp(App);
app.use(DnDDevtools); // before mount: providers set up earlier aren't seen
app.mount('#app');
```

Or import `@vue-dnd-kit/devtools/auto` first in the entry file. Use
`vueDnDKitDevtools({ inject: false })` when the plugin should serve the tab but you install the
page's side yourself; `serveTab()` from `@vue-dnd-kit/devtools/vite` is the middleware that serves
the tab.

<note>

In a production build, `app.use(DnDDevtools)` and the `auto` import shrink to almost nothing:
every entry point checks `process.env.NODE_ENV` first, and bundlers drop the rest. On the server
they do nothing.

</note>

## Open it

- **Vue DevTools**: <kbd value="Alt">



</kbd>

 + <kbd value="Shift">



</kbd>

 + <kbd value="D">



</kbd>

, or the Vue button at
the bottom of the page, then the **Vue DnD Kit** tab.
- **Nuxt DevTools**: <kbd value="Alt">



</kbd>

 + <kbd value="Shift">



</kbd>

 + <kbd value="D">



</kbd>

, or the Nuxt button,
then **Vue DnD Kit** (in the sidebar or its overflow menu).
- **A window of its own**: open `http://localhost:5173/__vue-dnd-kit-devtools/` on your dev server,
or the tab's ⧉ button. Handy on a second screen. With several pages open, a select on top
chooses the one to watch.

<warning>

Keep the tab in a window of its own, not in a background browser tab of the same window: the page
must stay visible, and a hidden page cancels drags.

</warning>

## The tab at a glance

<table>
<thead>
  <tr>
    <th>
      Part
    </th>
    
    <th>
      What it holds
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Top bar
    </td>
    
    <td>
      What the drag is doing right now (<code>
        dragging card-3 → done (accepts)
      </code>
      
      ), the page watched, <strong>
        ⌖ Pick
      </strong>
      
      , the count of edited options with a reset, ⧉ (a window of its own) and the theme.
    </td>
  </tr>
  
  <tr>
    <td>
      Left: the registry
    </td>
    
    <td>
      Every provider as a tree: its lists, trees, drop targets and draggables. <strong>
        ☰
      </strong>
      
       shows or hides it.
    </td>
  </tr>
  
  <tr>
    <td>
      Middle: <strong>
        Map
      </strong>
      
       and <strong>
        Log
      </strong>
    </td>
    
    <td>
      The live mini-map of the page, or the log of the drags.
    </td>
  </tr>
  
  <tr>
    <td>
      Right: <strong>
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
      The joystick and the move buttons, the options of the chosen node, and what the provider knows about it.
    </td>
  </tr>
</tbody>
</table>

Choose a node in the registry or an item on the map, and the right side follows it.

## The mini-map

A live card per list, tree and drop target, with copies of their items where they are — the same
clones the overlay would show, with the page's CSS. During a drag it marks:

- the lists and targets that **accept** the drag (blue) or **refuse** it (red);
- the placeholder, and the target under the pointer;
- the pointer, the overlay's box, and the insertion line of `placeholder: 'indicator'` lists.

A click chooses an item and highlights it on the page; a double click scrolls the page to it. Use
the map when a drop doesn't go where you expect: it shows at a glance which lists take the drag.

## Drive: the joystick

Choose an item — on the map, in the registry, or with **⌖ Pick**, which takes the next press on a
draggable of the page instead of letting it act — and push the joystick's knob. The item is picked
up and moves that way, faster the farther the knob is from the center. Let go and it stops;
**Drop** and **Cancel** end the drag.

It is a real pointer drag of a sensor named `devtools`, made with the public
[sensor API](https://zizigy.github.io/docs/guides/sensors#a-sensor-of-your-own): lists sort under it, containers
auto-scroll at their edges, and `onBeforeDrop` and `onDrop` run as for any drag. Disabled items
aren't picked up. A keyboard drag the page started can be steered too.

Items of sortable lists also get buttons: up, down, to the start, to the end, to another list of
the group. Each is one keyboard drag of [`moveItem`](https://zizigy.github.io/docs/guides/sensors#programmatic-drags).
Below the joystick, a large copy of what the overlay shows.

<table>
<thead>
  <tr>
    <th>
      Key, in the tab
    </th>
    
    <th>
      Does
    </th>
  </tr>
</thead>

<tbody>
  <tr>
    <td>
      Arrows or <kbd value="W">
        
      </kbd>
      
       <kbd value="A">
        
      </kbd>
      
       <kbd value="S">
        
      </kbd>
      
       <kbd value="D">
        
      </kbd>
    </td>
    
    <td>
      Push the knob that way, halfway; with <kbd value="Shift">
        
      </kbd>
      
      , all the way
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="G">
        
      </kbd>
    </td>
    
    <td>
      Pick the chosen item up
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
      Drop
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="Escape">
        
      </kbd>
    </td>
    
    <td>
      Cancel
    </td>
  </tr>
  
  <tr>
    <td>
      <kbd value="P">
        
      </kbd>
    </td>
    
    <td>
      Pick on the page
    </td>
  </tr>
</tbody>
</table>

## Options

Every option that isn't a callback can be edited while the app runs. Choose the node and open
**Options**:

<table>
<thead>
  <tr>
    <th>
      Node
    </th>
    
    <th>
      Options
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
      
       (the library's, by name), <code>
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
      List
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
      Tree
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
      Drop target
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
      Item
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

An edit applies at once, to this page only, and is never written to your code: the library reads
the new value where it reads the option. It lasts until you reset it (↺ per option, or the reset in
the top bar), the provider unmounts or the page reloads. An edited option shows your code's value
next to it. Items mounted while an edit is set — rows of a virtual list — get it too.

## State

What each provider knows, for the node you chose:

- the **drag session**: status, the active ids, items and sensor, the target and whether it
accepts, the pointer, the overlay, the sortable group's session and insertion line;
- a **list**: its order and its draft; a **tree**: its rows;
- an **item**: its type, data and position; a **drop target**: its rules.

Items mount and unmount without events: the registry catches up within a second.

## Log

One band per drag, in order:

<table>
<thead>
  <tr>
    <th>
      Entry
    </th>
    
    <th>
      What it tells
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
      The ids, the sensor and whether by touch, the list it comes from.
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
      Each target entered and left, and whether it accepts.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        release
      </code>
    </td>
    
    <td>
      The target it was let go on, while <code>
        onBeforeDrop
      </code>
      
       decides.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        onBeforeDrop
      </code>
    </td>
    
    <td>
      The verdict: accepted, some accepted, rejected by a hook, refused by the target's <code>
        accept
      </code>
      
      , and how long the hooks took.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        drop
      </code>
    </td>
    
    <td>
      The target; for sortable lists the move, <code>
        e.result
      </code>
      
      , and whether <code>
        preventDefault()
      </code>
      
       was called.
    </td>
  </tr>
  
  <tr>
    <td>
      <code>
        cancel
      </code>
    </td>
    
    <td>
      Why: cancelled (Escape, <code>
        cancel()
      </code>
      
      ), rejected by a hook, or refused by the target's <code>
        accept
      </code>
      
      .
    </td>
  </tr>
</tbody>
</table>

Also `auto-scroll on` and `off`, the `announcement` texts (hidden by default) and, outside drags,
`animate` (changes of a list's items that no drag made). Click an entry for its data. A tab that
opens later gets the drags so far.

## Debug a drop, step by step

A card won't go into a column. With the tab open:

1. **Reproduce it** by hand, or with **Drive** so your hands stay free for the tab.
2. **Watch the map** while the card is over the column. Red means the list refuses the card: look at
its `group` (`put`) or the target's `accept`. Blue means it accepts, and the problem comes later.
3. **Read the log** of that drag. `onBeforeDrop` says who said no — a hook, or the target's
`accept`. If the drop went through but your data didn't change, the `drop` entry says whether
`preventDefault()` was called and what `e.result` held: a controlled list must apply it itself.
4. **Try a fix live** in **Options** — a looser `acceptMode`, another `collision`, `placeholder: 'indicator'` — then write the one that works into your code.

## How it works

Providers report to a hook that the page's side installs. Until a tab watches the page, they are
only recorded; then the page listens like any monitor and sends the tab what it shows — every
40 ms during a drag, twice a second otherwise — and stops once no tab has watched for a few
seconds. The tab talks to the page over a `BroadcastChannel` of the page's origin. It changes
nothing but what you ask for: the drags, the selection and the option overrides.

## Sitemap

See the full [sitemap](https://zizigy.github.io/vue-dnd-kit/sitemap.md) for all pages.
