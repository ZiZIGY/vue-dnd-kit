/**
 * Every page of the playground: what the Lab lists, and what the demo page renders for
 * `/demo/#<id>`. Only metadata: the Lab reads it without loading any demo.
 */

export type SectionId =
  | 'sortable'
  | 'between'
  | 'trees'
  | 'multi'
  | 'overlay'
  | 'animations'
  | 'zones'
  | 'virtual'
  | 'a11y'
  | 'platform'
  | 'touch'
  | 'apps'
  | 'kits'
  | 'stress';

export interface Section {
  id: SectionId;
  title: string;
}

export interface DemoEntry {
  /** The hash: `/demo/#<id>` renders it, `/#<id>` opens it in the Lab. */
  id: string;
  title: string;
  section: SectionId;
  description: string;
  /** The component, under `src/demos/`. */
  file?: string;
  /** A page of its own instead (the UI kits: their global CSS stays out of the demo page). */
  page?: string;
  /** Its page in the docs, under `/docs/`. */
  docs?: string;
  /** Opens at a phone's width. */
  phone?: boolean;
}

export const SECTIONS: readonly Section[] = [
  { id: 'sortable', title: 'Sortable' },
  { id: 'between', title: 'Between lists' },
  { id: 'trees', title: 'Trees' },
  { id: 'multi', title: 'Multi-drag' },
  { id: 'overlay', title: 'Overlay' },
  { id: 'animations', title: 'Animations' },
  { id: 'zones', title: 'Free drag & zones' },
  { id: 'virtual', title: 'Virtual lists' },
  { id: 'a11y', title: 'Accessibility' },
  { id: 'platform', title: 'Sensors & platform' },
  { id: 'touch', title: 'Touch' },
  { id: 'apps', title: 'Apps' },
  { id: 'kits', title: 'UI kits' },
  { id: 'stress', title: 'Stress & stability' },
];

export const DEMOS: readonly DemoEntry[] = [
  // Sortable
  {
    id: 'sortable',
    title: 'Vertical list',
    section: 'sortable',
    file: 'SortableDemo.vue',
    docs: 'guides/sortable-lists',
    description: 'Items of different heights: the list settles instead of ping-ponging between them.',
  },
  {
    id: 'lists',
    title: 'List layouts',
    section: 'sortable',
    file: 'ListsDemo.vue',
    docs: 'guides/sortable-lists',
    description: 'A horizontal list, an indicator line instead of moving items, and a custom placeholder.',
  },
  {
    id: 'grid',
    title: 'Grids',
    section: 'sortable',
    file: 'GridDemo.vue',
    docs: 'guides/sortable-lists',
    description: 'A uniform grid, and cells spanning several columns and rows.',
  },
  {
    id: 'table',
    title: 'Table rows',
    section: 'sortable',
    file: 'TableDemo.vue',
    docs: 'guides/sortable-lists',
    description: "Sortable table rows that stay on the y axis (the list's `axis`).",
  },
  {
    id: 'swap',
    title: 'Swap',
    section: 'sortable',
    file: 'SwapDemo.vue',
    docs: 'guides/sortable-lists',
    description: 'A list and a grid that exchange items instead of shifting them, and two lists swapping across.',
  },

  // Between lists
  {
    id: 'kanban',
    title: 'Kanban',
    section: 'between',
    file: 'KanbanDemo.vue',
    docs: 'guides/shared-lists',
    description: 'Tall columns that take drops anywhere in their height (`dropzone`).',
  },
  {
    id: 'nested',
    title: 'Draggable columns',
    section: 'between',
    file: 'NestedDemo.vue',
    docs: 'guides/shared-lists',
    description: 'A kanban whose columns are sortable too: cards and columns in nested lists.',
  },
  {
    id: 'copy',
    title: 'Copy',
    section: 'between',
    file: 'CopyDemo.vue',
    docs: 'guides/shared-lists',
    description: "A palette that copies (`pull: 'clone'`); Alt copies between the other lists.",
  },
  {
    id: 'external',
    title: 'External items',
    section: 'between',
    file: 'ExternalDemo.vue',
    docs: 'guides/shared-lists',
    description: 'A chip dragged into a list becomes an item there (`createItem`); a list without it ignores chips.',
  },
  {
    id: 'combine',
    title: 'Drop into an item',
    section: 'between',
    file: 'CombineDemo.vue',
    docs: 'guides/drop-decisions',
    description: "The middle of a group takes a task inside; near its edges the list sorts as usual.",
  },
  {
    id: 'trash',
    title: 'Trash',
    section: 'between',
    file: 'TrashDemo.vue',
    docs: 'guides/drop-decisions',
    description: 'Drop on the trash to remove; in the second list, a drop anywhere outside removes.',
  },
  {
    id: 'reject',
    title: 'Rejected drops',
    section: 'between',
    file: 'RejectDemo.vue',
    docs: 'guides/drop-decisions',
    description: '`onBeforeDrop` answers after an async check; a refusal flies the items back.',
  },
  {
    id: 'controlled',
    title: 'Controlled lists',
    section: 'between',
    file: 'ControlledDemo.vue',
    docs: 'guides/drop-decisions',
    description: 'A frozen store applies `event.result` itself; cards are saved on a server before they land.',
  },

  // Trees
  {
    id: 'tree',
    title: 'Tree',
    section: 'trees',
    file: 'TreeDemo.vue',
    docs: 'guides/trees',
    description: "Drag sideways to change the level, hover a folder's middle to drop into it; a clipboard list trades nodes.",
  },
  {
    id: 'tree-indicator',
    title: 'Indicator line',
    section: 'trees',
    file: 'TreeIndicatorDemo.vue',
    docs: 'guides/trees',
    description: "The tree doesn't move: a line shows where the drop goes, at the indentation of its level.",
  },
  {
    id: 'tree-multi',
    title: 'Tree multi-drag',
    section: 'trees',
    file: 'TreeMultiDemo.vue',
    docs: 'guides/trees',
    description: 'Selected nodes travel as one block, each with its subtree, and land side by side.',
  },

  // Multi-drag
  {
    id: 'multi-group',
    title: "'group' (default)",
    section: 'multi',
    file: 'MultiGroupDemo.vue',
    docs: 'guides/multi-drag',
    description: 'The other selected items travel with the dragged one, so the list shows the result; Alt copies the block.',
  },
  {
    id: 'multi',
    title: "'stack' and 'gaps'",
    section: 'multi',
    file: 'MultiDemo.vue',
    docs: 'guides/multi-drag',
    description: 'The others fly into the overlay, or stay in their places until the drop.',
  },
  {
    id: 'selection',
    title: 'Rubber-band selection',
    section: 'multi',
    file: 'SelectionDemo.vue',
    docs: 'guides/multi-drag',
    description: 'Drag across empty space to select (`makeSelectionArea`); dragging a selected card drags them all.',
  },

  // Overlay
  {
    id: 'overlay-types',
    title: 'Which overlay shows',
    section: 'overlay',
    file: 'overlay/OverlayTypesDemo.vue',
    docs: 'guides/overlay',
    description: "The item's overlay, then the list's, then the provider's slot, then the clone.",
  },
  {
    id: 'overlay-zones',
    title: 'The overlay reads the target',
    section: 'overlay',
    file: 'overlay/OverlayZonesDemo.vue',
    docs: 'guides/overlay',
    description: 'It names the target, turns red where the card is not allowed, and shows the copy mode.',
  },
  {
    id: 'overlay-droplet',
    title: 'Targets shape the overlay',
    section: 'overlay',
    file: 'overlay/OverlayDropletDemo.vue',
    docs: 'guides/overlay',
    description: 'Over the water a seed turns into a droplet, over the garden it grows a sprout.',
  },
  {
    id: 'overlay-fit',
    title: 'Overlay size',
    section: 'overlay',
    file: 'overlay/OverlayFitDemo.vue',
    docs: 'guides/overlay',
    description: "`overlayFit`: the box glides to the size of the target list's items, or keeps its own.",
  },
  {
    id: 'overlay-multi',
    title: 'A multi-drag overlay',
    section: 'overlay',
    file: 'overlay/OverlayMultiDemo.vue',
    docs: 'guides/overlay',
    description: "The list's overlay component gets every dragged item and draws them with `DragPreview`.",
  },
  {
    id: 'overlay-deck',
    title: 'A hand of cards',
    section: 'overlay',
    file: 'overlay/OverlayDeckDemo.vue',
    docs: 'guides/overlay',
    description: 'The selected cards fan out in the overlay, each landing on its own slot.',
  },

  // Animations
  {
    id: 'animation-libs',
    title: 'GSAP and motion',
    section: 'animations',
    file: 'animation/AnimationLibsDemo.vue',
    docs: 'guides/animations',
    description: "The same list animated by GSAP and by motion through the library's hooks: recipes, not dependencies.",
  },
  {
    id: 'overlay-motion',
    title: 'A spring overlay',
    section: 'animations',
    file: 'overlay/OverlayMotionDemo.vue',
    docs: 'guides/animations',
    description: 'The overlay lifts with a motion-v spring, and a custom `dropAnimation` lands it.',
  },

  // Free drag & zones
  {
    id: 'free',
    title: 'Free drag',
    section: 'zones',
    file: 'FreeDragDemo.vue',
    docs: 'guides/constraints',
    description: 'Pieces snap to a 20px grid; with the keyboard they jump between zones or move freely.',
  },
  {
    id: 'nested-zones',
    title: 'Nested zones',
    section: 'zones',
    file: 'NestedZonesDemo.vue',
    docs: 'guides/drag-and-drop',
    description: 'The deepest zone under the pointer wins, a higher priority beats depth; wrong pieces are refused.',
  },
  {
    id: 'autoscroll',
    title: 'Auto-scroll',
    section: 'zones',
    file: 'AutoScrollDemo.vue',
    docs: 'guides/constraints',
    description: 'Scrollers and the page scroll while a drag holds near their edges.',
  },

  // Virtual lists
  {
    id: 'virtual-tanstack',
    title: 'TanStack Virtual',
    section: 'virtual',
    file: 'VirtualTanstackDemo.vue',
    docs: 'guides/virtual-lists',
    description: 'Thousands of rows rendered by TanStack Virtual, sorted like any list.',
  },
  {
    id: 'virtual-vueuse',
    title: 'VueUse useVirtualList',
    section: 'virtual',
    file: 'VirtualVueUseDemo.vue',
    docs: 'guides/virtual-lists',
    description: "10,000 rows with VueUse's `useVirtualList`.",
  },
  {
    id: 'virtual-kanban',
    title: 'Virtual kanban',
    section: 'virtual',
    file: 'VirtualKanbanDemo.vue',
    docs: 'guides/virtual-lists',
    description: 'Three virtualized columns with thousands of cards each.',
  },

  // Accessibility
  {
    id: 'a11y',
    title: 'Keyboard and screen readers',
    section: 'a11y',
    file: 'A11yDemo.vue',
    docs: 'guides/accessibility',
    description: 'Sorting by keyboard, live announcements, and nested providers.',
  },
  {
    id: 'announce',
    title: 'Custom announcements',
    section: 'a11y',
    file: 'AnnounceDemo.vue',
    docs: 'guides/accessibility',
    description: 'Only the end text is overridden; the others keep the position-aware defaults.',
  },

  // Sensors & platform
  {
    id: 'sensors',
    title: 'A custom sensor',
    section: 'platform',
    file: 'sensors/SensorsDemo.vue',
    docs: 'guides/sensors',
    description: 'An on-screen joystick built with `defineSensor`, next to the mouse, touch and keyboard.',
  },
  {
    id: 'actions',
    title: 'Programmatic moves',
    section: 'platform',
    file: 'actions/ActionsDemo.vue',
    description: '`@vue-dnd-kit/actions`: buttons move items with `moveItem`, animated and announced like a drag.',
  },
  {
    id: 'shadow',
    title: 'Shadow DOM',
    section: 'platform',
    file: 'ShadowDomDemo.vue',
    docs: 'guides/provider',
    description: 'A list rendered by a second Vue app inside a shadow root, bridged with `provideDnDContext`.',
  },

  // Touch
  {
    id: 'touch-list',
    title: 'Long list',
    section: 'touch',
    file: 'touch/TouchListDemo.vue',
    phone: true,
    description: 'Long-press an item to drag it, swipe to scroll; holding it at the edge scrolls the page.',
  },
  {
    id: 'touch-handle',
    title: 'Drag handle',
    section: 'touch',
    file: 'touch/TouchHandleDemo.vue',
    phone: true,
    description: 'Items drag by their handle; the rest of the item scrolls the page.',
  },
  {
    id: 'touch-kanban',
    title: 'Kanban',
    section: 'touch',
    file: 'touch/TouchKanbanDemo.vue',
    phone: true,
    description: 'One column per screen in a horizontal scroller with scroll snapping.',
  },
  {
    id: 'touch-tree',
    title: 'Tree',
    section: 'touch',
    file: 'touch/TouchTreeDemo.vue',
    phone: true,
    description: 'Long-press a row, then slide right to nest it or left to move it out.',
  },
  {
    id: 'device-check',
    title: 'Real device checklist',
    section: 'touch',
    file: 'device/DeviceCheckDemo.vue',
    phone: true,
    description: "A checklist for a real phone or tablet: what emulated touch input can't reproduce.",
  },

  // Apps
  {
    id: 'app-board',
    title: 'Roadmap board',
    section: 'apps',
    file: 'apps/BoardApp.vue',
    docs: 'examples/board',
    description: 'Cards and columns, WIP limits, and a confirmation before Done.',
  },
  {
    id: 'app-files',
    title: 'File manager',
    section: 'apps',
    file: 'apps/FilesApp.vue',
    docs: 'examples/file-manager',
    description: 'Rubber-band selection, folders to drop into, and a tree of folders.',
  },
  {
    id: 'app-form',
    title: 'Form builder',
    section: 'apps',
    file: 'apps/FormApp.vue',
    description: 'A palette of fields, an indicator line, and Alt to duplicate a field.',
  },
  {
    id: 'app-playlist',
    title: 'Playlist',
    section: 'apps',
    file: 'apps/PlaylistApp.vue',
    description: 'A library and a queue, fully usable from the keyboard, with spoken positions.',
  },
  {
    id: 'app-calendar',
    title: 'Calendar',
    section: 'apps',
    file: 'apps/CalendarApp.vue',
    docs: 'examples/calendar',
    description: 'Events snap to half-hours and stay inside the week.',
  },
  {
    id: 'app-chess',
    title: 'Chess',
    section: 'apps',
    file: 'apps/ChessApp.vue',
    docs: 'examples/chess',
    description: 'Legal squares light up from the drag state; any other square sends the piece back.',
  },

  // UI kits
  {
    id: 'kit-nuxt-ui',
    title: 'Nuxt UI',
    section: 'kits',
    page: '/kits/nuxt-ui.html',
    description: 'Lists, a kanban, a tree and a virtual table built from Nuxt UI components.',
  },
  {
    id: 'kit-vuetify',
    title: 'Vuetify',
    section: 'kits',
    page: '/kits/vuetify.html',
    description: 'Lists, a kanban, a tree and virtual lists built from Vuetify components.',
  },

  // Stress & stability
  {
    id: 'stability',
    title: 'List boundaries',
    section: 'stress',
    file: 'StabilityDemo.vue',
    description: 'Lists that touch: no ping-pong of items at the boundary between them.',
  },
  {
    id: 'bench',
    title: 'Bench: 500 rows',
    section: 'stress',
    file: 'BenchDemo.vue',
    description: 'The cost of each reorder, measured for `yarn bench`.',
  },
  {
    id: 'bench-kanban',
    title: 'Bench: 5,000 cards',
    section: 'stress',
    file: 'BenchKanbanDemo.vue',
    description: 'Five columns of 1,000 cards, all mounted: cross-list moves with large drafts.',
  },
  {
    id: 'bench-virtual',
    title: 'Bench: 50,000 rows',
    section: 'stress',
    file: 'BenchVirtualDemo.vue',
    description: 'TanStack Virtual with 50k rows, instrumented for `yarn bench`.',
  },
];

export const demoById = (id: string): DemoEntry | undefined => DEMOS.find((demo) => demo.id === id);

/** The demo page's address of an entry: its own page, or the demo page with its hash. */
export const frameUrl = (entry: DemoEntry): string => entry.page ?? `/demo/#${entry.id}`;
