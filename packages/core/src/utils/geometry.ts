import type { IBoundingBox, IPoint } from '../types';

export const checkCollision = (
  boxA: IBoundingBox,
  boxB: IBoundingBox
): boolean => {
  return (
    boxA.x < boxB.x + boxB.width &&
    boxA.x + boxA.width > boxB.x &&
    boxA.y < boxB.y + boxB.height &&
    boxA.y + boxA.height > boxB.y
  );
};

export const getBoundingBox = (element: HTMLElement | null): IBoundingBox => {
  if (!element)
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
    };

  const rect = element.getBoundingClientRect();

  return {
    bottom: rect.bottom,
    left: rect.left,
    right: rect.right,
    top: rect.top,
    x: rect.x,
    y: rect.y,
    width: rect.width,
    height: rect.height,
  };
};

export const getCenter = (box: IBoundingBox): IPoint => ({
  x: box.x + box.width / 2,
  y: box.y + box.height / 2,
});

export const getOffset = (element: HTMLElement | null, pointer: IPoint) => {
  const rect = getBoundingBox(element);
  return {
    pixel: {
      x: pointer.x - rect.x,
      y: pointer.y - rect.y,
    },
    percent: {
      x: ((pointer.x - rect.x) / rect.width) * 100,
      y: ((pointer.y - rect.y) / rect.height) * 100,
    },
  };
};

export const getDistance = (pointA: IPoint, pointB: IPoint): number => {
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  return Math.sqrt(dx * dx + dy * dy);
};

export const getOverlapPercent = (
  boxA: IBoundingBox,
  boxB: IBoundingBox
): number => {
  const xOverlap = Math.max(
    0,
    Math.min(boxA.x + boxA.width, boxB.x + boxB.width) -
      Math.max(boxA.x, boxB.x)
  );
  const yOverlap = Math.max(
    0,
    Math.min(boxA.y + boxA.height, boxB.y + boxB.height) -
      Math.max(boxA.y, boxB.y)
  );

  const overlapArea = xOverlap * yOverlap;

  const boxAArea = boxA.width * boxA.height;
  const boxBArea = boxB.width * boxB.height;

  // Возвращаем среднее значение процентов перекрытия относительно обоих элементов
  return ((overlapArea / boxAArea) * 100 + (overlapArea / boxBArea) * 100) / 2;
};
