/**
 * AABB geometry utilities for collision detection
 */

export interface IBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  top: number;
  left: number;
  right: number;
  bottom: number;
}

export interface IPoint {
  x: number;
  y: number;
}

export const checkCollision = (boxA: IBoundingBox, boxB: IBoundingBox): boolean =>
  boxA.x < boxB.x + boxB.width &&
  boxA.x + boxA.width > boxB.x &&
  boxA.y < boxB.y + boxB.height &&
  boxA.y + boxA.height > boxB.y;

export const getBoundingBox = (element: HTMLElement | null): IBoundingBox => {
  if (!element)
    return { x: 0, y: 0, width: 0, height: 0, top: 0, left: 0, right: 0, bottom: 0 };
  const rect = element.getBoundingClientRect();
  return {
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
    top: rect.top,
    left: rect.left,
    right: rect.right,
    bottom: rect.bottom,
  };
};

export const getCenter = (box: IBoundingBox): IPoint => ({
  x: box.x + box.width / 2,
  y: box.y + box.height / 2,
});

export const getDistance = (pointA: IPoint, pointB: IPoint): number =>
  Math.hypot(pointB.x - pointA.x, pointB.y - pointA.y);

export const getOverlapPercent = (boxA: IBoundingBox, boxB: IBoundingBox): number => {
  const xOverlap = Math.max(
    0,
    Math.min(boxA.x + boxA.width, boxB.x + boxB.width) - Math.max(boxA.x, boxB.x)
  );
  const yOverlap = Math.max(
    0,
    Math.min(boxA.y + boxA.height, boxB.y + boxB.height) - Math.max(boxA.y, boxB.y)
  );
  const overlapArea = xOverlap * yOverlap;
  const boxAArea = boxA.width * boxA.height;
  const boxBArea = boxB.width * boxB.height;
  if (boxAArea === 0 || boxBArea === 0) return 0;
  return ((overlapArea / boxAArea) * 100 + (overlapArea / boxBArea) * 100) / 2;
};

export const containsPoint = (box: IBoundingBox, x: number, y: number): boolean =>
  x >= box.x && x <= box.x + box.width && y >= box.y && y <= box.y + box.height;
