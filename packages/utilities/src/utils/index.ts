import type { IPoint } from '@vue-dnd-kit/core';

export const getDelta = (pointA: IPoint, pointB: IPoint): IPoint => ({
  x: pointB.x - pointA.x,
  y: pointB.y - pointA.y,
});

export const getDirection = (
  delta: IPoint
): 'up' | 'right' | 'down' | 'left' => {
  const angle = Math.atan2(delta.y, delta.x);
  const deg = angle * (180 / Math.PI);

  if (deg >= -45 && deg <= 45) return 'right';
  if (deg > 45 && deg < 135) return 'down';
  if (deg >= 135 || deg <= -135) return 'left';
  return 'up';
};

export const getAngle = (pointA: IPoint, pointB: IPoint): number => {
  const dx = pointB.x - pointA.x;
  const dy = pointB.y - pointA.y;
  return Math.atan2(dy, dx) * (180 / Math.PI);
};
