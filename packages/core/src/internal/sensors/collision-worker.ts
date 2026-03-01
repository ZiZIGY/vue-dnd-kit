import { createInternalWorker } from '../utils/createInternalWorker';
import type { IInternalWorker } from '../utils/createInternalWorker';

export interface ICollisionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ICollisionWorkerInput {
  containerBox: ICollisionBox;
  pointer: { x: number; y: number };
  /** Packed as [x, y, width, height, ...] — 4 values per element */
  elements: number[];
  elementCount: number;
  zones: number[];
  zoneCount: number;
  config: { minOverlapPercent: number };
}

export interface ICollisionWorkerResult {
  elementIndices: number[];
  zoneIndices: number[];
}

// Pure math helpers — serialized as localDependencies into the worker

function _checkAABB(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
): boolean {
  return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by;
}

function _getOverlapPercent(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
): number {
  const xO = Math.max(0, Math.min(ax + aw, bx + bw) - Math.max(ax, bx));
  const yO = Math.max(0, Math.min(ay + ah, by + bh) - Math.max(ay, by));
  const area = xO * yO;
  const aA = aw * ah;
  const bA = bw * bh;
  if (!aA || !bA) return 0;
  return ((area / aA) * 100 + (area / bA) * 100) / 2;
}

function _containsPoint(x: number, y: number, w: number, h: number, px: number, py: number): boolean {
  return px >= x && px <= x + w && py >= y && py <= y + h;
}

// Pure collision math — no DOM access, no imports, no closures

function runCollisionMath(input: ICollisionWorkerInput): ICollisionWorkerResult {
  const { containerBox, pointer, elements, elementCount, zones, zoneCount, config } = input;
  const { x: cx, y: cy, width: cw, height: ch } = containerBox;
  const { x: px, y: py } = pointer;
  const minOverlap = config.minOverlapPercent;
  const containerCenterX = cx + cw / 2;
  const containerCenterY = cy + ch / 2;
  const pointerInContainer = _containsPoint(cx, cy, cw, ch, px, py);

  function processSet(boxes: number[], count: number): number[] {
    const hits: Array<{
      index: number;
      overlapPercent: number;
      centerDistance: number;
      isPointerInElement: boolean;
      depth: number;
    }> = [];

    const b = boxes as number[];

    for (let i = 0; i < count; i++) {
      const base = i * 4;
      const ex = b[base]!, ey = b[base + 1]!, ew = b[base + 2]!, eh = b[base + 3]!;
      if (!_checkAABB(ex, ey, ew, eh, cx, cy, cw, ch)) continue;
      const overlapPercent = _getOverlapPercent(ex, ey, ew, eh, cx, cy, cw, ch);
      if (overlapPercent < minOverlap) continue;
      hits.push({
        index: i,
        overlapPercent,
        centerDistance: Math.hypot(containerCenterX - (ex + ew / 2), containerCenterY - (ey + eh / 2)),
        isPointerInElement: _containsPoint(ex, ey, ew, eh, px, py),
        depth: 0,
      });
    }

    for (let i = 0; i < hits.length; i++) {
      const hBase = hits[i]!.index * 4;
      const hcx = b[hBase]! + b[hBase + 2]! / 2;
      const hcy = b[hBase + 1]! + b[hBase + 3]! / 2;
      for (let j = 0; j < hits.length; j++) {
        if (i === j) continue;
        const ob = hits[j]!.index * 4;
        if (_containsPoint(b[ob]!, b[ob + 1]!, b[ob + 2]!, b[ob + 3]!, hcx, hcy)) {
          hits[i]!.depth++;
        }
      }
    }

    hits.sort((a, b) => {
      if (pointerInContainer) {
        if (a.isPointerInElement && b.isPointerInElement) return b.depth - a.depth;
        if (a.isPointerInElement !== b.isPointerInElement) return a.isPointerInElement ? -1 : 1;
      }
      if (Math.abs(a.overlapPercent - b.overlapPercent) <= 1) return a.centerDistance - b.centerDistance;
      return b.overlapPercent - a.overlapPercent;
    });

    return hits.map((h) => h.index);
  }

  return {
    elementIndices: processSet(elements, elementCount),
    zoneIndices: processSet(zones, zoneCount),
  };
}

let _instance: IInternalWorker<ICollisionWorkerInput, ICollisionWorkerResult> | null = null;

export function getCollisionWorker(): IInternalWorker<ICollisionWorkerInput, ICollisionWorkerResult> {
  if (!_instance) {
    _instance = createInternalWorker(runCollisionMath, {
      localDependencies: [_checkAABB, _getOverlapPercent, _containsPoint],
    });
  }
  return _instance;
}

export function terminateCollisionWorker(): void {
  _instance?.terminate();
  _instance = null;
}
