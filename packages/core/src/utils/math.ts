export const checkCollision = (boxA: DOMRect, boxB: DOMRect): boolean => {
  return (
    boxA.x < boxB.x + boxB.width &&
    boxA.x + boxA.width > boxB.x &&
    boxA.y < boxB.y + boxB.height &&
    boxA.y + boxA.height > boxB.y
  );
};

export const getOffset = (
  element: HTMLElement,
  pointer: { x: number; y: number }
) => {
  const rect = element.getBoundingClientRect();

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

// export const getDistance = (
//   pointA: { x: number; y: number },
//   pointB: { x: number; y: number }
// ): number => {
//   const dx = pointB.x - pointA.x;
//   const dy = pointB.y - pointA.y;
//   return Math.sqrt(dx * dx + dy * dy);
// };

export const getOverlapPercent = (boxA: DOMRect, boxB: DOMRect): number => {
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

  return ((overlapArea / boxAArea) * 100 + (overlapArea / boxBArea) * 100) / 2;
};
