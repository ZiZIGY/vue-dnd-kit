import { inject } from 'vue';
import type { DnDEvent } from '@vue-dnd-kit/core';
import type { Layer, LayerKind } from './design';
import { EDITOR } from './editor';

/** What a tool of the toolbar carries while it is dragged: the kind of layer it adds. */
export interface ToolData {
  tool: LayerKind;
  zoom: number;
}

/**
 * The canvas and every frame take drops alike. `position` is where the grabbed layer's
 * corner was let go inside the target, in screen pixels: turned into world units, it says
 * how far that layer went, and every dragged layer moves as far, into the frame (or onto
 * the canvas). Alt held leaves them in place and drops copies. A tool from the toolbar
 * adds its layer centred on the drop point.
 */
export function useLayerDrop(frame: () => Layer | null) {
  const editor = inject(EDITOR)!;

  return ({ active, over, pointer, position }: DnDEvent) => {
    const target = frame();
    const { view } = editor;
    // The target's corner in the world: the frame's, or whatever the canvas shows at its corner.
    const corner = target ? editor.boxOf(target) : { x: -view.x / view.zoom, y: -view.y / view.zoom };
    const toWorld = (x: number, y: number) => ({ x: corner.x + x / view.zoom, y: corner.y + y / view.zoom });

    const { tool } = active.data as Partial<ToolData>;
    if (tool && over) return editor.add(tool, toWorld(pointer.x - over.rect.left, pointer.y - over.rect.top), target);

    const grabbed = editor.find(active.id);
    if (!grabbed || !position) return;
    const from = editor.boxOf(grabbed);
    const to = toWorld(position.x, position.y);
    editor.move(active.ids, { x: to.x - from.x, y: to.y - from.y }, target, editor.altHeld.value);
  };
}
