# @vue-dnd-kit/devtools

A [Vue DevTools](https://devtools.vuejs.org/) plugin for [Vue DnD Kit](https://github.com/zizigy/vue-dnd-kit) v3: see what every `DnDProvider` knows, and what happened in each drag.

<!-- TODO screenshot: the "Vue DnD Kit" inspector with a provider expanded, and its timeline layer. -->
> _Screenshot coming soon._

## Install

```bash
npm i -D @vue-dnd-kit/devtools
```

Peer dependencies: `vue ^3.5` and `@vue-dnd-kit/core ^3`. The plugin talks to the DevTools through [`@vue/devtools-api`](https://www.npmjs.com/package/@vue/devtools-api) v8, which comes with it.

### `app.use()`

```ts
import { createApp } from 'vue';
import { DnDDevtools } from '@vue-dnd-kit/devtools';
import App from './App.vue';

const app = createApp(App);
app.use(DnDDevtools); // before mount: providers set up earlier aren't seen
app.mount('#app');
```

### Automatic

Import it first in your entry file: every app a `DnDProvider` renders in gets the plugin, without `app.use()`.

```ts
import '@vue-dnd-kit/devtools/auto';
```

`setupDnDDevtools(app)` and `autoSetupDnDDevtools()` do the same as functions.

### Production

The plugin does nothing in production builds: every entry point checks `process.env.NODE_ENV` first, so bundlers drop the plugin and `@vue/devtools-api` with it (what is left of `app.use(DnDDevtools)` is under 0.2 KB gzipped). It also does nothing on the server. To leave even that out, install it only in development:

```ts
if (import.meta.env.DEV) app.use(DnDDevtools);
```

## Open it

Run the app in development and open the Vue DevTools: the [browser extension](https://devtools.vuejs.org/getting-started/installation) or [`vite-plugin-vue-devtools`](https://devtools.vuejs.org/guide/vite-plugin) (<kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>D</kbd>). The DevTools set plugins up once their panel is open; from then on the plugin follows the drags. It adds:

### The "Vue DnD Kit" inspector

Every provider, as `DnDProvider · <the component that renders it>`, with:

- **Drag session**: status, the active ids, items and type, the sensor, the target it is over (and whether it accepts), the pointer and the overlay offset, the mode (`move`, `copy`, `swap`, `insert`), the landing key, the overlay's fit size and the drop target while the overlay lands; the session of the sortable group (origin, slot, block, swap partner, insertion line).
- **Selection**: the selected ids.
- **Draggables**: id, type, disabled, selected, dragging, handle, data and element.
- **Drop targets**: id, `accept` rule and `acceptMode`, priority, disabled, and during a drag whether it is under the pointer and whether it takes the dragged items.
- **Sortable lists and trees**: id, group, `strategy`, `placeholder`, `behavior`, `multiple`, `pull`, `sort`, `dropOutside`, `acceptMode`, whether `items` is read-only (controlled), the item count, the keys and the draft order during a drag; their mounted items are the nodes below them.

Selecting a node highlights its element on the page; the node action (⌖) scrolls it into view first. The filter searches ids. The inspector's actions cancel the current drag and clear the selection.

Items mount and unmount without events: the tree catches up within a second.

### The "Vue DnD Kit" timeline layer

Turn the layer on in the Timeline tab (the DevTools record a plugin's layer only when it is on). One group per drag: `drag start` (ids, the sensor that started it and whether by touch, the list it comes from), `over` and `left` (target changes, and whether the target accepts), `release`, `onBeforeDrop` (the verdict: accepted, accepted some, rejected by a hook, or refused by the target's `accept`, and how long the hooks took), `drop` (the target, and for sortable lists the move, `event.result` and whether `preventDefault()` was called) or `cancel` (and why), `announcement` (what the live region said) and `auto-scroll on` / `off`.

Outside drags, `animate` logs the changes of a list's items that no drag made and that its `animate` option plays: items added, removed, reordered.

## Several apps, shadow roots

Each app with the plugin shows its own providers. A provider shared with an app mounted in a shadow root (`provideDnDContext`) is one provider: the items of both apps are in it, and their elements are highlighted where they are.

## How it works

Providers report to a hook the plugin installs (through the core's internal bridge, `@vue-dnd-kit/core/devtools`). Without the plugin nothing reports and nothing runs. With it, a provider is only recorded until the DevTools panel is open; from then on the plugin listens like any monitor, and reads snapshots. It changes nothing but what you ask it to (cancel, clear the selection).

## License

MIT
