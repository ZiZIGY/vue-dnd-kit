import {
  getBoundingBox,
  getCenter,
  getDistance,
  getOverlapPercent,
  containsPoint,
  type IBoundingBox,
} from '../utils/geometry';
import { isDescendant } from '../utils/dom';
import type { IDnDProviderInternal } from '../types/provider';

/**
 * Collision detection function signature.
 * Returns sorted lists of colliding elements and zones.
 *
 * IMPORTANT: When implementing custom sensors, use:
 * - `provider.entities.allowedDroppableSet` for zones (visible + filtered by groups)
 * - `provider.entities.allowedDraggableSet` for draggables (visible + filtered by groups)
 * OR use helper functions from `steps.ts`: `allowedVisibleZones()` and `visibleElements()`.
 */
export type CollisionDetectionFn = (provider: IDnDProviderInternal) => {
  elements: HTMLElement[];
  zones: HTMLElement[];
};

export type TContainerFn = (
  provider: IDnDProviderInternal
) => HTMLElement | null;
export type TContainerBoxFn = (provider: IDnDProviderInternal) => IBoundingBox;
export type TCandidatesFn = (
  provider: IDnDProviderInternal
) => Iterable<HTMLElement>;
export type TFilterFn = (
  node: HTMLElement,
  provider: IDnDProviderInternal
) => boolean;
export type TCollisionContext = {
  containerBox: IBoundingBox;
  pointer: { x: number; y: number };
};
export type TCollisionCheckFn = (
  nodeBox: IBoundingBox,
  ctx: TCollisionContext
) => boolean;
export type TSortCompareFn = (
  a: { node: HTMLElement; box: IBoundingBox; meta: ICollisionMeta },
  b: { node: HTMLElement; box: IBoundingBox; meta: ICollisionMeta },
  ctx: { containerBox: IBoundingBox; pointer: { x: number; y: number } }
) => number;

/** Merge strategy: how to combine elements and zones into final result */
export type TMergeStrategy =
  | 'separate' // Default: return separate lists (elements[], zones[])
  | 'unified-closest'; // Return single closest from both lists

export interface ICollisionMeta {
  isPointerInElement: boolean;
  overlapPercent: number;
  depth: number;
  centerDistance: number;
}

interface ISensorConfig {
  container: TContainerFn;
  containerBox?: TContainerBoxFn;
  elements: TCandidatesFn;
  zones: TCandidatesFn;
  filterElements: TFilterFn;
  filterZones: TFilterFn;
  collision: TCollisionCheckFn;
  sortElements: TSortCompareFn;
  sortZones: TSortCompareFn;
  mergeStrategy: TMergeStrategy;
  /** Pick closest between first zone and first element (by distance to pointer) */
  pickClosestBetweenFirst: boolean;
  /** Minimum overlap percent required for collision (0-100) */
  minOverlapPercent?: number;
}

export interface ISensorBuilder {
  container(fn: TContainerFn): ISensorBuilder;
  containerBox(fn: TContainerBoxFn): ISensorBuilder;
  elements(fn: TCandidatesFn): ISensorBuilder;
  zones(fn: TCandidatesFn): ISensorBuilder;
  filterElements(fn: TFilterFn): ISensorBuilder;
  filterZones(fn: TFilterFn): ISensorBuilder;
  collision(fn: TCollisionCheckFn): ISensorBuilder;
  sortElements(fn: TSortCompareFn): ISensorBuilder;
  sortZones(fn: TSortCompareFn): ISensorBuilder;
  mergeStrategy(strategy: TMergeStrategy): ISensorBuilder;
  /** Pick closest between first zone and first element by distance to pointer */
  pickClosestBetweenFirst(enable: boolean): ISensorBuilder;
  /** Filter by minimum overlap percent (0-100). Applied after collision check. */
  minOverlapPercent(percent: number): ISensorBuilder;
  build(): CollisionDetectionFn;
}

const defaultFilter = () => true;
const defaultSort = () => 0;
const defaultMergeStrategy: TMergeStrategy = 'separate';

const createBuilder = (): ISensorBuilder => {
  const config: Partial<ISensorConfig> = {
    filterElements: defaultFilter,
    filterZones: defaultFilter,
    sortElements: defaultSort,
    sortZones: defaultSort,
    mergeStrategy: defaultMergeStrategy,
    pickClosestBetweenFirst: false,
  };

  const run = (
    provider: IDnDProviderInternal,
    containerBox: IBoundingBox,
    pointer: { x: number; y: number },
    candidates: Iterable<HTMLElement>,
    filter: TFilterFn,
    sortFn: TSortCompareFn,
    collisionCheck: TCollisionCheckFn
  ): Array<{ node: HTMLElement; box: IBoundingBox }> => {
    const nodeSet = new Set(candidates);
    const ctx = { containerBox, pointer };

    const entries = [...candidates]
      .filter((node) => filter(node, provider))
      .map((node) => {
        const nodeBox = getBoundingBox(node);
        if (!collisionCheck(nodeBox, ctx)) return null;

        let depth = 0;
        for (const parent of nodeSet) {
          if (parent !== node && isDescendant(parent, node)) depth++;
        }

        const overlapPercent = getOverlapPercent(nodeBox, containerBox);

        return {
          node,
          box: nodeBox,
          meta: {
            isPointerInElement: containsPoint(nodeBox, pointer.x, pointer.y),
            overlapPercent,
            depth,
            centerDistance: getDistance(
              getCenter(containerBox),
              getCenter(nodeBox)
            ),
          },
        };
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);

    // Filter by minOverlapPercent if configured
    if (config.minOverlapPercent !== undefined) {
      const minOverlap = config.minOverlapPercent;
      const filtered = entries.filter((e) => e.meta.overlapPercent >= minOverlap);
      entries.length = 0;
      entries.push(...filtered);
    }

    entries.sort((a, b) => sortFn(a, b, ctx));

    return entries;
  };

  const builder: ISensorBuilder = {
    container(fn) {
      config.container = fn;
      return builder;
    },

    containerBox(fn) {
      config.containerBox = fn;
      return builder;
    },

    elements(fn) {
      config.elements = fn;
      return builder;
    },

    zones(fn) {
      config.zones = fn;
      return builder;
    },

    filterElements(fn) {
      config.filterElements = fn;
      return builder;
    },

    filterZones(fn) {
      config.filterZones = fn;
      return builder;
    },

    collision(fn) {
      config.collision = fn;
      return builder;
    },

    sortElements(fn) {
      config.sortElements = fn;
      return builder;
    },

    sortZones(fn) {
      config.sortZones = fn;
      return builder;
    },

    mergeStrategy(strategy) {
      config.mergeStrategy = strategy;
      return builder;
    },

    pickClosestBetweenFirst(enable) {
      config.pickClosestBetweenFirst = enable;
      return builder;
    },

    minOverlapPercent(percent) {
      config.minOverlapPercent = percent;
      return builder;
    },

    build(): CollisionDetectionFn {
      const cfg = config as ISensorConfig;
      if (!cfg.container || !cfg.elements || !cfg.zones || !cfg.collision) {
        throw new Error(
          'sensor: container, elements, zones, collision are required'
        );
      }

      return (provider: IDnDProviderInternal) => {
        const containerEl = cfg.container(provider);
        if (!containerEl) return { elements: [], zones: [] };

        const containerBox = cfg.containerBox
          ? cfg.containerBox(provider)
          : getBoundingBox(containerEl);
        const pointer = provider.pointer.value?.current ?? { x: 0, y: 0 };

        const elements = run(
          provider,
          containerBox,
          pointer,
          cfg.elements(provider),
          cfg.filterElements,
          cfg.sortElements,
          cfg.collision
        );
        const zones = run(
          provider,
          containerBox,
          pointer,
          cfg.zones(provider),
          cfg.filterZones,
          cfg.sortZones,
          cfg.collision
        );

        if (cfg.mergeStrategy === 'unified-closest') {
          const all = [
            ...elements.map((entry) => ({ 
              node: entry.node, 
              box: entry.box, 
              isZone: false, 
              distance: 0 
            })),
            ...zones.map((entry) => ({ 
              node: entry.node, 
              box: entry.box, 
              isZone: true, 
              distance: 0 
            })),
          ];
          if (all.length === 0) return { elements: [], zones: [] };

          for (const item of all) {
            const center = getCenter(item.box);
            item.distance = Math.hypot(pointer.x - center.x, pointer.y - center.y);
          }

          const closest = all.reduce((acc, item) =>
            item.distance < acc.distance ? item : acc
          );

          return closest.isZone
            ? { elements: [], zones: [closest.node] }
            : { elements: [closest.node], zones: [] };
        }

        // Pick closest between first zone and first element
        if (cfg.pickClosestBetweenFirst && elements[0] && zones[0]) {
          const zoneCenter = getCenter(zones[0].box);
          const elementCenter = getCenter(elements[0].box);
          
          const zoneDistance = Math.hypot(
            pointer.x - zoneCenter.x,
            pointer.y - zoneCenter.y
          );
          const elementDistance = Math.hypot(
            pointer.x - elementCenter.x,
            pointer.y - elementCenter.y
          );
          
          return elementDistance < zoneDistance
            ? { elements: elements.map(e => e.node), zones: [] }
            : { elements: [], zones: zones.map(z => z.node) };
        }

        return { 
          elements: elements.map(e => e.node), 
          zones: zones.map(z => z.node) 
        };
      };
    },
  };

  return builder;
};

export const createSensor = () => createBuilder();
