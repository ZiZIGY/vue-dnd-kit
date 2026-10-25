/**
 * The rules a press must pass before it becomes a drag (rfcs/0001-v3.md §10): where it
 * may start from, and the activation constraint it waits for. Every sensor gets them
 * from `SensorContext.activate()`.
 */

import type { ActivationConstraint, ActivationOptions, PointerKind, SensorActivation, SensorType } from '../../types';
import type { DraggableEntry } from '../manager';
import { isEditable, isInsideInteractive } from '../../utils/dom';

const DEFAULT_ACTIVATION: Record<PointerKind, ActivationConstraint> = {
  mouse: { distance: 4 },
  pen: { distance: 4 },
  touch: { delay: 200, tolerance: 5 },
};

/** Default `tolerance` of a delay without a distance. */
const DEFAULT_TOLERANCE = 5;

/**
 * Activation constraint for a press: the item's option, then the provider's, then the
 * defaults (mouse/pen 4px, touch 200ms with 5px tolerance). A mouse press on an
 * explicit handle starts at once unless something was configured.
 */
export const resolveActivation = (
  kind: PointerKind,
  item: ActivationOptions | undefined,
  provider: ActivationOptions | undefined,
  onHandle: boolean,
): ActivationConstraint =>
  item?.[kind] ?? provider?.[kind] ?? (onHandle && kind === 'mouse' ? {} : DEFAULT_ACTIVATION[kind]);

/** The constraint a sensor asked for (`SensorActivation.activation`): none by default. */
export const resolveConstraint = (
  activation: SensorActivation['activation'],
  entry: DraggableEntry,
  provider: ActivationOptions | undefined,
): ActivationConstraint =>
  typeof activation === 'string'
    ? resolveActivation(activation, entry.getActivation?.(), provider, entry.getHandle() != null)
    : (activation ?? {});

/**
 * State of a pending activation after the pointer moved `distance` px in `elapsed` ms:
 * `'start'`, `'abort'` or the progress (0–1). Distance and delay have OR semantics,
 * whichever is met first; moving past `tolerance` while a delay runs aborts, so the
 * page can scroll. No constraint at all starts immediately.
 */
export const checkActivation = (
  constraint: ActivationConstraint,
  distance: number,
  elapsed: number,
): 'start' | 'abort' | number => {
  const required = constraint.distance ?? 0;
  const delay = constraint.delay ?? 0;
  if (required <= 0 && delay <= 0) return 'start';
  if (required > 0 && distance >= required) return 'start';
  if (delay > 0) {
    if (elapsed >= delay) return 'start';
    const tolerance = constraint.tolerance ?? (required > 0 ? Infinity : DEFAULT_TOLERANCE);
    if (distance > tolerance) return 'abort';
  }
  return Math.min(
    Math.max(required > 0 ? distance / required : 0, delay > 0 ? elapsed / delay : 0),
    1,
  );
};

/**
 * True when a drag of `type` may start from `target` inside the draggable `element`.
 * Pointer: on the handle, or anywhere but interactive children. Keyboard: only from the
 * draggable itself (or its handle), never from a button inside it or an editable field.
 */
export const canStartFrom = (entry: DraggableEntry, element: HTMLElement, target: Element, type: SensorType) => {
  if (type === 'keyboard') return !isEditable(target) && target === entry.getFocusTarget();
  const handle = entry.getHandle();
  if (handle) {
    const handleElement = typeof handle === 'string' ? target.closest(handle) : handle;
    return !!handleElement && handleElement.contains(target) && element.contains(handleElement);
  }
  return !isInsideInteractive(target, element);
};
