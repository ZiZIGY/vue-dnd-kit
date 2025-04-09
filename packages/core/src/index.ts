import { VueDndKitPlugin } from './plugin';
import { useDnDStore } from './composables/useDnDStore';
import { useDraggable } from './composables/useDraggable';
import { useDroppable } from './composables/useDroppable';
import { useSelection } from './composables/useSelection';

export default VueDndKitPlugin;

export { useDraggable, useDroppable, useDnDStore, useSelection };

export type {
  IDnDStore,
  IActiveContainer,
  IBoundingBox,
  IDragElement,
  IDraggingElement,
  IDropZone,
  IPoint,
  IPointerPosition,
  IUseDragOptions,
  IUseDropOptions,
} from './types';
