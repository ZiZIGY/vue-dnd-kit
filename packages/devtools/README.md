# @vue-dnd-kit/devtools

DevTools for [Vue DnD Kit](https://github.com/zizigy/vue-dnd-kit) v3: a **Vue DnD Kit** tab in the [Nuxt DevTools](https://devtools.nuxt.com/) and in the [Vue DevTools](https://devtools.vuejs.org/) of `vite-plugin-vue-devtools`. Drag any item from it with a joystick, watch every list, tree and drop target live in a mini-map, edit the options of the providers, lists and items while the app runs, read what each provider knows, and follow the drags in a log.

<!-- TODO screenshot: the tab in the Vue DevTools during a drag (mini-map, joystick, overlay preview). -->
> _Screenshot coming soon._

## Install

```bash
npm i -D @vue-dnd-kit/devtools @vue-dnd-kit/actions
```

Peer dependencies: `vue ^3.5`, `@vue-dnd-kit/core ^3` and [`@vue-dnd-kit/actions`](https://www.npmjs.com/package/@vue-dnd-kit/actions) `^3` (the tab's moves go through it; npm 7+ and pnpm install peer dependencies themselves, with Yarn 1 add it). The tab is a prebuilt page that the package ships: the dev server serves it next to your app.

### Vite

Add the plugin next to [`vite-plugin-vue-devtools`](https://devtools.vuejs.org/guide/vite-plugin):

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import { vueDnDKitDevtools } from '@vue-dnd-kit/devtools/vite';

export default defineConfig({
  plugins: [vueDevTools(), vueDnDKitDevtools(), vue()],
});
```

It works on the dev server only (`vite serve`; builds are untouched): it serves the tab at `/__vue-dnd-kit-devtools/` (under your `base`), adds it to the Vue DevTools, and makes the page report to it before your app starts. Nothing else to install in the app.

With `vueDnDKitDevtools({ inject: false })` the page doesn't report by itself: install its side yourself (below). The same for pages Vite doesn't serve from an `index.html` (SSR frameworks).

### Nuxt

With [`@vue-dnd-kit/nuxt`](https://www.npmjs.com/package/@vue-dnd-kit/nuxt) in `modules`, there is nothing to configure: in development the module finds the package, serves the tab, adds it to the Nuxt DevTools and installs the page's side with a client plugin (`vueDndKit.devtools: false` turns it off).

### Without the plugins

The page's side alone, for a dev server of your own that serves the tab (`serveTab()` of `@vue-dnd-kit/devtools/vite` is its middleware):

```ts
import { createApp } from 'vue';
import { DnDDevtools } from '@vue-dnd-kit/devtools';
import App from './App.vue';

const app = createApp(App);
app.use(DnDDevtools); // before mount: providers set up earlier aren't seen
app.mount('#app');
```

Or first in the entry file, without `app.use()`: `import '@vue-dnd-kit/devtools/auto';`. `setupDnDDevtools(app)` and `autoSetupDnDDevtools()` do the same as functions. Every provider of the page shows, whichever app it renders in.

### Production

Nothing of it reaches production builds: the Vite plugin and the Nuxt module only act on the dev server, and every entry point of the page's side checks `process.env.NODE_ENV` first, so bundlers drop it (what is left of `app.use(DnDDevtools)` is under 0.1 KB gzipped). It also does nothing on the server.

## Open it

Run the app in development:

- **Vue DevTools** (`vite-plugin-vue-devtools`): <kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd>, or the Vue button at the bottom of the page, then the **Vue DnD Kit** tab in the sidebar.
- **Nuxt DevTools**: <kbd>Shift</kbd>+<kbd>Alt</kbd>+<kbd>D</kbd>, or the Nuxt button, then the **Vue DnD Kit** tab (in the sidebar, or its overflow menu).
- **A window of its own**: open `http://localhost:5173/__vue-dnd-kit-devtools/` (your dev server's address), or the ⧉ button of the tab. Handy next to the app on a second screen.

The tab talks to the page over a `BroadcastChannel` of the page's origin: in the DevTools it watches the page around it; in a window of its own the page that announced itself last (a select chooses among several open pages). Theme: the DevTools' (light or dark), the system's in a window; ◐ switches.

## What it does

### Drive: the joystick

Choose an item (click it in the mini-map or the tree, or **Pick** on the page: the next press on a draggable chooses it, instead of doing what it does), then push the joystick's knob: the item is picked up and moves that way, faster the farther the knob is from the center, like a gamepad's stick. Let go and it stops; **Drop** or **Cancel** end the drag. It is a real pointer drag of a sensor named `devtools`, through the core's public sensor API (`useSensor`, `SensorContext.activate`, `SensorDrag.move/drop/cancel`): lists sort under it, containers auto-scroll at their edges, the overlay, the animations, the announcements and the drop pipeline (`onBeforeDrop`, `onDrop`, `event.result`, `preventDefault()`) run as for any drag. Disabled items aren't picked up. A drag the page started (the keyboard's) can be steered too.

| Key (in the tab) | Does |
| --- | --- |
| <kbd>←</kbd><kbd>↑</kbd><kbd>→</kbd><kbd>↓</kbd> / <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd> | push the knob that way (half tilt; with <kbd>Shift</kbd> to the rim) |
| <kbd>G</kbd> | pick the chosen item up |
| <kbd>Space</kbd> / <kbd>Enter</kbd> | drop |
| <kbd>Esc</kbd> | cancel |
| <kbd>P</kbd> | pick on the page |

Items of sortable lists also move by buttons (up, down, to the start, to the end, to another list of the group), each in one keyboard drag made with [`@vue-dnd-kit/actions`](https://www.npmjs.com/package/@vue-dnd-kit/actions). Below the joystick, what the overlay shows, copied from the page.

### The mini-map

A live card per list, tree and drop target of the page (and one for the draggables outside them), with copies of their items where they are: the library's own clones of the elements (what the overlay would show), with the page's CSS. During a drag it shows the placeholder, the target under the pointer, the lists that accept the drag (blue) or refuse it (red), the pointer, the overlay's box and the insertion line of `placeholder: 'indicator'` lists. A click chooses an item (and highlights it on the page), a double click scrolls the page to it.

### Options: live editing

Every option that isn't a callback, editable while the app runs: the provider's (`overlayFit`, `autoScroll`, `collision`, `modifiers` — the library's, by name —, `animation`, `dropAnimation`, `animate`, `activation`, `keyboard`, `haptics`, `copyModifier`, …), a list's (`disabled`, `strategy`, `placeholder`, `behavior`, `multiple`, `sort`, `dropOutside`, `acceptMode`, `animation`, `animate`, `autoScroll`, `modifiers`), a tree's (`placeholder`, `indentation`, `nesting`, `maxDepth`, …), a drop target's (`disabled`, `priority`, `accept`, `acceptMode`) and an item's (`disabled`, `keyboard`, `activation`). Choose the node in the tree (or the item in the map) and open **Options**.

An edit applies at once, to this page only, and is never written to your code: the core's devtools bridge reads the option's new value where the library reads it, until you reset it (↺ per option, **Reset all**), the provider unmounts or the page reloads. An edited option shows the code's value too. Items remounted while an edit is set (virtual lists) get it as well.

### State

What each provider knows, as the tree on the left: its drag session, its lists and trees (their mounted items in the order shown), drop targets and plain draggables, with what a drag makes of them (over, accepts, refuses, the draft). **State** shows a node's details: the session (status, the active ids, items and sensor, the target and whether it accepts, the pointer, the overlay, the sortable group's session and insertion line), a list's order and draft, an item's type, data and position, a drop target's rule. Items mount and unmount without events: the tree catches up within a second.

### Log

What happened in each drag (one band per drag): `drag start` (ids, the sensor and whether by touch, the list it comes from), `over` and `left` (and whether the target accepts), `release`, `onBeforeDrop` (accepted, accepted some, rejected by a hook, refused by the target's `accept`, and how long the hooks took), `drop` (the target, and for sortable lists the move, `event.result` and whether `preventDefault()` was called) or `cancel` (and why), `announcement` (hidden by default), `auto-scroll on` / `off`, and outside drags `animate` (changes of a list's items that no drag made and its `animate` option plays). Click an entry for its data. A tab that opens later gets the drags so far.

## How it works

Providers report to a hook that the page's side installs (the core's internal bridge, `@vue-dnd-kit/core/devtools`): without it nothing reports and nothing runs. Until a tab watches the page, providers are only recorded; then the page listens like any monitor, reads snapshots and sends the tab what it shows, paced (every 40 ms during a drag, twice a second otherwise), and stops once no tab has watched for a few seconds. It changes nothing but what you ask: the drags, the selection, the option overrides.

## License

MIT
