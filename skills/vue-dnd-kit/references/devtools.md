# DevTools: @vue-dnd-kit/devtools

A **Vue DnD Kit** tab in the Vue DevTools (`vite-plugin-vue-devtools`) and in the Nuxt
DevTools. It shows a live mini-map of every list, tree and drop target, a joystick that
drags any item, live editing of options, each provider's state, and a log of drags.
It works in development only, and nothing of it reaches production builds.

```bash
npm i -D @vue-dnd-kit/devtools @vue-dnd-kit/actions
```

## Vite

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

That's all: the plugin serves the tab at `/__vue-dnd-kit-devtools/`, adds it to the Vue
DevTools and makes the page report to it. No `app.use()` is needed.

## Nuxt

With `@vue-dnd-kit/nuxt` in `modules` and `@vue-dnd-kit/devtools` installed, the tab
appears in the Nuxt DevTools in development. To turn it off, set `vueDndKit: { devtools: false }`.

## Without the plugins (a custom dev server, SSR setups)

```ts
import { DnDDevtools } from '@vue-dnd-kit/devtools';
app.use(DnDDevtools);                  // before app.mount(): earlier providers aren't seen
// or, first in the entry file:
import '@vue-dnd-kit/devtools/auto';
```

Use `vueDnDKitDevtools({ inject: false })` when you install the page's side yourself.
`serveTab()` from `@vue-dnd-kit/devtools/vite` is the middleware that serves the tab.

## Opening it

- Vue DevTools: Alt+Shift+D → **Vue DnD Kit** tab.
- Nuxt DevTools: Shift+Alt+D → **Vue DnD Kit** (maybe in the overflow menu).
- Its own window: `http://localhost:5173/__vue-dnd-kit-devtools/` (your dev server). Keep it as a separate window, not a background browser tab: a hidden page cancels drags.

## Using it to debug

- **Mini-map**: during a drag it shows which lists accept the drag (blue) or refuse it
  (red), the placeholder, the target under the pointer, the overlay box and the
  indicator line. Use it when "the drop doesn't go where I expect".
- **Log**: per drag, `over`/`left` with acceptance, the `onBeforeDrop` verdict (accepted,
  some accepted, rejected by a hook, refused by `accept`), and the `drop` with
  `event.result` and whether `preventDefault()` was called. Use it to find out why a drop
  was refused or why a controlled list didn't change.
- **Options**: try `strategy`, `placeholder`, `behavior`, `multiple`, `overlayFit`,
  `collision`, `modifiers`, animations and more live. Nothing is written to your code,
  and edits reset on reload.
- **Drive**: pick an item (on the map, in the tree, or "Pick" on the page) and push the
  joystick. It runs a real pointer drag through the sensor API, so `onBeforeDrop` and
  `onDrop` run as usual. Sortable items also get up/down/top/bottom/other-list buttons.
- **State**: the session (status, active ids, sensor, target, pointer), each list's order
  and draft, items' types and data, and drop targets' rules.
