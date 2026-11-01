import { nextTick } from 'vue';

/**
 * Animates a change of the position that no drag made (undo, a new game): every piece
 * flies from where it was, on a square or in a tray, to where it is now. FLIP: measure,
 * change, measure again, animate the difference. The pieces carry their id in `data-piece`.
 */
export async function glide(root: HTMLElement | null, change: () => void) {
  const pieces = () => [...(root?.querySelectorAll<HTMLElement>('[data-piece]') ?? [])];
  const before = new Map(pieces().map((element) => [element.dataset.piece, element.getBoundingClientRect()]));
  change();
  await nextTick();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  for (const element of pieces()) {
    const from = before.get(element.dataset.piece);
    const to = element.getBoundingClientRect();
    if (!from || (from.left === to.left && from.top === to.top)) continue;
    const start = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width})`;
    // Above the other pieces on its way.
    element.animate(
      [
        { transform: start, transformOrigin: '0 0', zIndex: 2 },
        { transform: 'none', transformOrigin: '0 0', zIndex: 2 },
      ],
      { duration: 380, easing: 'cubic-bezier(0.25, 1, 0.5, 1)' },
    );
  }
}
