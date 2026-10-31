/**
 * Keyboard drags (rfcs/0001-v3.md §10), built on the public sensor API like any custom
 * sensor: Space/Enter picks up the focused draggable and drops it, arrows move it by
 * items (`SensorDrag.step`), Escape cancels any drag. The keys are rebound with the
 * provider's `keyboard` option.
 */

import { defaultDocument, useEventListener } from '@vueuse/core';
import type { SensorDirection } from '../../types';
import { getEventTarget } from '../../utils/dom';
import { defineSensor } from './host';

const DEFAULT_KEYS = {
  start: ['Space', 'Enter'],
  drop: ['Space', 'Enter'],
  cancel: ['Escape'],
};

const ARROWS = new Map<string, SensorDirection>([
  ['ArrowUp', 'up'],
  ['ArrowDown', 'down'],
  ['ArrowLeft', 'left'],
  ['ArrowRight', 'right'],
]);

/** Bindings match `event.code` ('Space', 'KeyW') or `event.key` ('Enter', 'w'). */
const matches = (bindings: readonly string[], event: KeyboardEvent): boolean =>
  bindings.includes(event.code) || bindings.includes(event.key);

/**
 * A key the drag acts on is consumed: nothing below the document sees it. UI kits
 * handle the same keys on their own elements (a list moving focus on arrows, an item
 * clicking itself on Enter/Space and stopping propagation, an overlay closing on
 * Escape); left to them, the press would act twice or never reach the drag.
 */
const consume = (event: KeyboardEvent) => {
  event.preventDefault();
  event.stopPropagation();
};

/**
 * Space/Enter, arrows and Escape (rebound with the provider's `keyboard` option). In
 * `sensors` by default; it also cancels pointer and custom drags with Escape, even with
 * `keyboard: false`.
 */
export const keyboardSensor = /* @__PURE__ */ defineSensor({
  name: 'keyboard',
  setup(context) {
    const options = () => (context.props.keyboard === false ? null : (context.props.keyboard ?? {}));
    const keys = () => ({ ...DEFAULT_KEYS, ...options()?.keys });

    // Capture phase: runs before any handler on the focused element or its ancestors.
    useEventListener(defaultDocument, 'keydown', (event: KeyboardEvent) => {
      const { status } = context;
      const bindings = keys();

      // Escape cancels any drag, including pointer drags and pending activations.
      if ((status === 'dragging' || status === 'activating') && matches(bindings.cancel, event)) {
        consume(event);
        context.cancel();
        return;
      }

      if (status === 'dragging') {
        // Every keyboard drag, whoever picked it up; pointer drags leave the keys to the page.
        const { drag } = context;
        if (drag?.type !== 'keyboard' || drag.state !== 'dragging') return;
        if (matches(bindings.drop, event)) {
          consume(event);
          if (!event.repeat) void drag.drop();
          return;
        }
        const direction = ARROWS.get(event.key) ?? ARROWS.get(event.code);
        if (!direction) return;
        consume(event);
        void drag.step(direction, { event });
        return;
      }

      // Overlays still landing don't hold a pickup back, as they don't hold a press back; a
      // drop still being decided does (it is a drag: `drag` is set).
      const atRest = status === 'idle' || (status === 'dropping' && !context.drag);
      if (!atRest || !options() || event.repeat) return;
      if (!matches(bindings.start, event)) return;
      const target = getEventTarget(event);
      if (!(target instanceof Element)) return;
      if (context.activate({ target, type: 'keyboard', event })) consume(event);
    }, { capture: true });
  },
});
