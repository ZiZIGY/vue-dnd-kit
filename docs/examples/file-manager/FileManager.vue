<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, provide, ref, useTemplateRef, watch } from 'vue';
import ContextMenu from './ContextMenu.vue';
import Crumb from './Crumb.vue';
import FileView from './FileView.vue';
import Glyph from './Glyph.vue';
import InfoPane from './InfoPane.vue';
import Sidebar from './Sidebar.vue';
import { DRIVE, createDrive } from './drive';
import { formatSize, items, sizeOf } from './files';
import { useDesktopDrop } from './useDesktopDrop';

/** The window: sidebar, toolbar, the open folder, the info pane, the status bar and the toast. */
const drive = createDrive();
provide(DRIVE, drive);
const desktop = useDesktopDrop(drive);
const root = useTemplateRef<HTMLElement>('root');

/** A narrow window shows the sidebar as a drawer. Opening a folder closes it. */
const drawer = ref(false);

// The info pane opens when the window has room for it beside the files (an expanded stage),
// and closes again when it hasn't. In between, its button decides.
const WIDE = 1100;
let wide = false;
let observer: ResizeObserver | undefined;
onMounted(() => {
  observer = new ResizeObserver(([entry]) => {
    const now = entry!.contentRect.width >= WIDE;
    if (now !== wide) drive.info.value = now;
    wide = now;
  });
  observer.observe(root.value!);
});
onBeforeUnmount(() => observer?.disconnect());

// The view is made anew for every folder. Moved there from inside the window (Enter on a
// folder, a click in the sidebar), the focus follows to the new folder's entries.
watch(
  drive.currentId,
  async () => {
    drawer.value = false;
    if (!root.value?.contains(document.activeElement)) return;
    await nextTick();
    root.value.querySelector<HTMLElement>('.entries [tabindex="0"]')?.focus();
  },
  { flush: 'pre' },
);

const sortKey = computed({ get: () => drive.sort.value.key, set: drive.sortBy });

/** The grid's icons, scaled by the slider in the status bar (the view sets their base size). */
const zoom = ref(1);

const summary = computed(() => {
  const count = items(drive.entries.value.length);
  const picked = drive.selected.value;
  if (!picked.length) return count;
  return `${picked.length} of ${count} selected · ${formatSize(picked.reduce((sum, entry) => sum + sizeOf(entry), 0))}`;
});
const uploadName = computed(() => (drive.uploadTarget.value ? drive.find(drive.uploadTarget.value)?.name : null));

// "More" opens the context menu under the button, for the selection.
const more = (event: MouseEvent) => {
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  drive.menu.value = { x: rect.right, y: rect.bottom + 6 };
};

// The toast goes after a while; a new one starts over.
let toastTimer: ReturnType<typeof setTimeout> | undefined;
watch(
  () => drive.notice.value?.key,
  () => {
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (drive.notice.value = null), 6000);
  },
);

// Keys for the whole window; the view handles its own (arrows, Enter, F2, Delete…).
const onKeydown = (event: KeyboardEvent) => {
  if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
    event.preventDefault();
    drive.undo();
  } else if (event.altKey && event.key === 'ArrowUp') {
    event.preventDefault();
    drive.up();
  }
};
</script>

<template>
  <div class="files">
    <div
      ref="root"
      class="window"
      :class="{ drawer }"
      :style="{ '--zoom': zoom }"
      @keydown="onKeydown"
      @dragover="desktop.dragover"
      @dragleave="desktop.dragleave"
      @drop="desktop.drop"
    >
      <Sidebar class="side" />
      <div v-if="drawer" class="scrim" @click="drawer = false" />

      <section class="main">
        <header class="toolbar">
          <button type="button" class="tool drawer-toggle" aria-label="Show the sidebar" :aria-expanded="drawer" @click="drawer = !drawer">
            <Glyph name="sidebar" />
          </button>
          <button type="button" class="tool" aria-label="Back" :disabled="!drive.history.value.length" @click="drive.back">
            <Glyph name="back" />
          </button>
          <button type="button" class="tool forward" aria-label="Forward" :disabled="!drive.future.value.length" @click="drive.forward">
            <Glyph name="forward" />
          </button>

          <nav class="path" aria-label="Path">
            <Crumb
              v-for="(folder, index) in drive.path.value"
              :key="folder.id"
              :folder="folder"
              :first="index === 0"
              :last="index === drive.path.value.length - 1"
            />
          </nav>

          <div class="segmented" role="group" aria-label="View">
            <button type="button" aria-label="As icons" :aria-pressed="drive.view.value === 'grid'" @click="drive.view.value = 'grid'">
              <Glyph name="grid" />
            </button>
            <button type="button" aria-label="As a list" :aria-pressed="drive.view.value === 'list'" @click="drive.view.value = 'list'">
              <Glyph name="list" />
            </button>
          </div>
          <button
            v-if="drive.inTrash.value"
            type="button"
            class="tool wide"
            :disabled="!drive.trash.value.children.length"
            @click="drive.emptyTrash"
          >
            Empty
          </button>
          <button v-else type="button" class="tool new-folder" aria-label="New folder" @click="drive.newFolder">
            <Glyph name="folder-plus" />
          </button>
          <button type="button" class="tool" aria-label="Info" :aria-pressed="drive.info.value" @click="drive.info.value = !drive.info.value">
            <Glyph name="info" />
          </button>
          <button type="button" class="tool" aria-label="More actions" aria-haspopup="menu" @click="more">
            <Glyph name="more" />
          </button>
        </header>

        <div class="body">
          <FileView :key="drive.currentId.value" />
          <InfoPane v-if="drive.info.value" class="pane" />

          <!-- Files from the desktop held over the window: where they would go. -->
          <div v-if="desktop.active.value" class="upload" :class="{ refused: !uploadName }">
            <span class="upload-pill">
              <Glyph :name="uploadName ? 'upload' : 'close'" />
              {{ uploadName ? `Drop to upload to ${uploadName}` : 'The Trash takes no uploads' }}
            </span>
          </div>

          <div v-show="!desktop.active.value" class="toasts" aria-live="polite">
            <Transition name="toast">
              <div v-if="drive.notice.value" :key="drive.notice.value.key" class="toast">
                <span class="toast-text">{{ drive.notice.value.text }}</span>
                <button v-if="drive.notice.value.undo" type="button" class="undo" @click="drive.undo">Undo</button>
                <button type="button" class="dismiss" aria-label="Dismiss" @click="drive.notice.value = null"><Glyph name="close" /></button>
              </div>
            </Transition>
          </div>
        </div>

        <footer class="statusbar">
          <span class="summary">{{ summary }}</span>
          <span class="hint"><kbd>Alt</kbd> copies · <kbd>Space</kbd> picks up</span>
          <select v-model="sortKey" class="sort" aria-label="Sort by">
            <option value="manual">Manual order</option>
            <option value="name">By name</option>
            <option value="kind">By kind</option>
            <option value="modified">By date</option>
            <option value="size">By size</option>
          </select>
          <input
            v-if="drive.view.value === 'grid'"
            v-model.number="zoom"
            class="zoom"
            type="range"
            min="0.75"
            max="1.6"
            step="0.05"
            aria-label="Icon size"
          />
        </footer>
      </section>

      <ContextMenu v-if="drive.menu.value" :key="`${drive.menu.value.x},${drive.menu.value.y}`" />
    </div>
  </div>
</template>

<style scoped>
/* Fills the stage when it is expanded (`flex: 1`), else takes its own height. */
.files {
  display: flex;
  flex: 1;
  flex-direction: column;
  width: 100%;
  min-height: 0;
  container: window / inline-size;
}

.window {
  position: relative;
  display: flex;
  flex: 1 1 30rem;
  box-sizing: border-box;
  width: 100%;
  max-width: 1800px;
  min-height: 24rem;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, currentColor 13%, transparent);
  border-radius: 14px;
  background: Canvas;
  box-shadow:
    0 1px 2px rgb(0 0 0 / 0.06),
    0 28px 60px -30px rgb(0 0 0 / 0.55);
  font-size: 13px;
  line-height: 1.4;
}

.side {
  flex: none;
  width: clamp(196px, 19%, 244px);
  box-sizing: border-box;
  border-right: 1px solid color-mix(in srgb, currentColor 9%, transparent);
  background: color-mix(in srgb, currentColor 3.5%, Canvas);
}

.main {
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
}

/* ─── Toolbar ─── */

.toolbar {
  display: flex;
  flex: none;
  align-items: center;
  gap: 4px;
  height: 52px;
  padding: 0 10px;
  border-bottom: 1px solid color-mix(in srgb, currentColor 9%, transparent);
}

.tool,
.segmented button {
  display: grid;
  flex: none;
  place-items: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font: inherit;
  font-size: 17px;
  opacity: 0.75;
  cursor: default;
  transition:
    background-color 0.15s,
    opacity 0.15s;
}

.tool:hover:not(:disabled),
.segmented button:hover {
  background: color-mix(in srgb, currentColor 8%, transparent);
  opacity: 1;
}

.tool:disabled {
  opacity: 0.25;
}

.tool[aria-pressed='true'] {
  background: color-mix(in srgb, #42b883 16%, transparent);
  color: #42b883;
  opacity: 1;
}

.tool.wide {
  width: auto;
  padding: 0 12px;
  font-size: 12.5px;
  font-weight: 600;
}

.tool:focus-visible,
.segmented button:focus-visible,
.sort:focus-visible,
.zoom:focus-visible {
  outline: 2px solid #42b883;
  outline-offset: 1px;
}

.drawer-toggle {
  display: none;
}

.forward {
  margin-right: 4px;
}

.path {
  display: flex;
  flex: 1;
  align-items: center;
  gap: 1px;
  min-width: 0;
  overflow: hidden;
  font-size: 14px;
}

.segmented {
  display: flex;
  flex: none;
  padding: 2px;
  border-radius: 9px;
  background: color-mix(in srgb, currentColor 7%, transparent);
}

.segmented button {
  width: 30px;
  height: 26px;
  border-radius: 7px;
  font-size: 15px;
}

.segmented button[aria-pressed='true'] {
  background: Canvas;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.18);
  opacity: 1;
}

/* ─── The open folder, the info pane, the overlays on them ─── */

.body {
  position: relative;
  display: flex;
  flex: 1;
  min-height: 0;
}

.pane {
  flex: none;
  width: 268px;
  box-sizing: border-box;
  border-left: 1px solid color-mix(in srgb, currentColor 9%, transparent);
  background: color-mix(in srgb, currentColor 2%, Canvas);
}

/* Under it, the folders still find the pointer: it lets every event through. */
.upload {
  position: absolute;
  inset: 8px;
  z-index: 4;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 14px;
  border: 2px dashed #42b883;
  border-radius: 12px;
  background: color-mix(in srgb, #42b883 7%, transparent);
  pointer-events: none;
  animation: fade 0.15s ease-out;
}

.upload-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 99px;
  background: #42b883;
  color: #04130c;
  font-weight: 600;
  box-shadow: 0 10px 24px -10px rgb(0 0 0 / 0.5);
}

.upload.refused {
  border-color: #e5484d;
  background: color-mix(in srgb, #e5484d 6%, transparent);
}

.upload.refused .upload-pill {
  background: #e5484d;
  color: #fff;
}

@keyframes fade {
  from {
    opacity: 0;
  }
}

.toasts {
  position: absolute;
  bottom: 14px;
  left: 50%;
  z-index: 6;
  translate: -50% 0;
}

.toast {
  display: flex;
  align-items: center;
  gap: 4px;
  max-width: min(440px, calc(100cqw - 32px));
  padding: 5px 5px 5px 14px;
  border-radius: 12px;
  background: color-mix(in srgb, CanvasText 90%, Canvas);
  color: Canvas;
  box-shadow: 0 14px 32px -10px rgb(0 0 0 / 0.5);
  white-space: nowrap;
}

.toast-text {
  overflow: hidden;
  margin-right: 6px;
  text-overflow: ellipsis;
}

.undo,
.dismiss {
  flex: none;
  height: 28px;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  background: none;
  color: inherit;
  font: inherit;
  font-weight: 650;
  cursor: pointer;
}

.undo {
  color: #42b883;
}

.dismiss {
  display: grid;
  place-items: center;
  width: 28px;
  padding: 0;
  font-size: 14px;
  opacity: 0.6;
}

.undo:hover,
.dismiss:hover {
  background: color-mix(in srgb, Canvas 14%, transparent);
  opacity: 1;
}

.undo:focus-visible,
.dismiss:focus-visible {
  outline: 2px solid #42b883;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  translate: 0 10px;
  scale: 0.97;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.22s,
    translate 0.22s,
    scale 0.22s;
}

.toast-leave-active {
  position: absolute;
  bottom: 0;
}

/* ─── Status bar ─── */

.statusbar {
  display: flex;
  flex: none;
  align-items: center;
  gap: 14px;
  height: 30px;
  padding: 0 14px;
  border-top: 1px solid color-mix(in srgb, currentColor 9%, transparent);
  font-size: 11.5px;
}

.summary {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  opacity: 0.6;
}

.hint {
  white-space: nowrap;
  opacity: 0.45;
}

.sort {
  height: 22px;
  padding: 0 20px 0 6px;
  border: 0;
  border-radius: 6px;
  background: transparent
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m7 10 5 5 5-5'/%3E%3C/svg%3E")
    no-repeat right 4px center / 12px;
  color: inherit;
  font: inherit;
  opacity: 0.75;
  appearance: none;
}

.sort:hover {
  background-color: color-mix(in srgb, currentColor 7%, transparent);
  opacity: 1;
}

.sort option {
  background: Canvas;
  color: CanvasText;
}

kbd {
  padding: 0 4px;
  border: 1px solid color-mix(in srgb, currentColor 30%, transparent);
  border-bottom-width: 2px;
  border-radius: 4px;
  font: 10px/1.4 ui-monospace, Menlo, Consolas, monospace;
}

.zoom {
  width: 84px;
  accent-color: #42b883;
}

/* ─── Narrow windows ─── */

/* No room for the info pane beside the files: it slides over them. */
@container window (max-width: 820px) {
  .pane {
    position: absolute;
    inset: 0 0 0 auto;
    z-index: 5;
    width: min(280px, 86%);
    box-shadow: -18px 0 40px -24px rgb(0 0 0 / 0.5);
  }

  /* The path needs the room; New Folder is in the menus too. */
  .hint,
  .new-folder {
    display: none;
  }
}

/* The sidebar becomes a drawer. */
@container window (max-width: 640px) {
  .side {
    position: absolute;
    inset: 0 auto 0 0;
    z-index: 10;
    width: min(260px, 82%);
    translate: -100% 0;
    visibility: hidden;
    transition:
      translate 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
      visibility 0.25s;
  }

  .drawer .side {
    translate: 0 0;
    visibility: visible;
    box-shadow: 18px 0 40px -24px rgb(0 0 0 / 0.5);
  }

  .scrim {
    position: absolute;
    inset: 0;
    z-index: 9;
    background: rgb(0 0 0 / 0.3);
  }

  .drawer-toggle {
    display: grid;
  }

  .forward {
    display: none;
  }

  .toolbar {
    padding: 0 6px;
  }
}

@container window (max-width: 420px) {
  .zoom {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .side,
  .toast-enter-active,
  .toast-leave-active {
    transition: none;
  }

  .upload {
    animation: none;
  }
}
</style>
