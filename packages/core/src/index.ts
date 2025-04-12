import { VueDndKitPlugin } from './plugin';
import { getBoundingBox } from './utils/geometry';
import { useDnDStore } from './composables/useDnDStore';
import { useDraggable } from './composables/useDraggable';
import { useDroppable } from './composables/useDroppable';
import { useSelection } from './composables/useSelection';

export default VueDndKitPlugin;

export {
  useDraggable,
  useDroppable,
  useDnDStore,
  useSelection,
  getBoundingBox,
};

export type {
  IDnDStore,
  IActiveContainer,
  IDragElement,
  IDraggingElement,
  IDropZone,
  IPoint,
  IBoundingBox,
} from './types';
