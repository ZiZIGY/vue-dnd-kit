import { reactive } from 'vue';

/**
 * Manual checks for real phones and tablets (`#device-check`): what an emulator can't
 * reproduce (rfcs/0001-v3.md §10). Each check has an interactive area, rendered by
 * DeviceCheckDemo.vue under the same id.
 */

/** Pointer types pressed anywhere in the check areas, for the summary. */
export const seenPointers = reactive(new Set<string>());

export type CheckId =
  | 'basics'
  | 'callout'
  | 'selection'
  | 'contextmenu'
  | 'native-drag'
  | 'detached'
  | 'edge-back'
  | 'system-back'
  | 'fling'
  | 'pinch'
  | 'pen';

export interface Check {
  id: CheckId;
  title: string;
  /** Where it matters. */
  platforms: string;
  steps: string[];
  expected: string;
}

export const CHECKS: Check[] = [
  {
    id: 'basics',
    title: 'Long press drags, a swipe scrolls',
    platforms: 'all',
    steps: [
      'Swipe quickly up and down over the list: the page scrolls.',
      'Press and hold an item until it lifts (about 0.2 s), then move it to another place and let go.',
    ],
    expected:
      'A quick swipe only scrolls and never picks an item up. A held item lifts, follows the finger, the page stays still, and it lands where you let go.',
  },
  {
    id: 'callout',
    title: 'No callout menu or magnifier',
    platforms: 'iOS, iPadOS',
    steps: [
      'Press and hold the link of an item, without moving, until the item lifts.',
      'Do the same on the image and on the plain text of an item. Hold for another second after it lifts.',
    ],
    expected:
      'The item lifts after about 0.2 s. No callout menu (Open, Copy, Share…), no link preview, no magnifier loupe, no text selection, however long you hold.',
  },
  {
    id: 'selection',
    title: 'No selection handles',
    platforms: 'all',
    steps: [
      'Press and hold the text of an item until it lifts, move it and drop it.',
      'Then press and hold a word of the plain paragraph under the list.',
    ],
    expected:
      'On items: no selection highlight or handles, neither during the drag nor after the drop. On the paragraph: the system selects the word with handles as usual.',
  },
  {
    id: 'contextmenu',
    title: 'Long press shows no context menu',
    platforms: 'Android',
    steps: [
      'Press and hold the link, the image and the text of an item, 1–2 seconds each, without moving.',
      'Then press and hold the plain link under the list.',
    ],
    expected:
      'On items the item lifts and no context menu (Open in new tab, Download image…) and no haptic menu opens. The plain link under the list gets the browser menu as usual.',
  },
  {
    id: 'native-drag',
    title: 'No native link or image drag',
    platforms: 'iPadOS, Android (tablets: also drag towards another app)',
    steps: [
      'Press and hold the image of an item until it lifts, then drag it over the list.',
      'Do the same with the link. On a tablet with split view, also drag towards the other app.',
    ],
    expected:
      'The whole item moves and lands in the list. No native drag preview (a floating thumbnail or URL), nothing can be dropped into another app, and the link never opens.',
  },
  {
    id: 'detached',
    title: 'The page stays still when the item is recreated',
    platforms: 'iOS, Android',
    steps: [
      'Press and hold an item of the left list, move it into the right list.',
      'Without lifting, keep moving the finger up and down, also outside the lists. Then drop it in the right list.',
    ],
    expected:
      'Moving to the right list recreates the item there, so the finger now rests on an element that left the page. The item still follows the finger, the page never starts scrolling, the drag is not cancelled, and the drop lands in the right list.',
  },
  {
    id: 'edge-back',
    title: 'Edge swipe back',
    platforms: 'iOS Safari (also Android Chrome with gesture navigation)',
    steps: [
      'Tap "Arm": the page adds a history step, so going back stays on this page.',
      'Start a swipe exactly at the left screen edge, over an item, and swipe right as if going back.',
      'Then press and hold an item until it lifts and drag it to the left edge and back.',
    ],
    expected:
      'The edge swipe is the browser’s: it goes back ("back caught" appears), and the item is not picked up, or its drag is cancelled and the item returns to its place. A lifted item dragged to the edge just follows the finger; that never goes back. Nothing stays stuck.',
  },
  {
    id: 'system-back',
    title: 'System gestures cancel a drag',
    platforms: 'Android (gesture navigation), iOS (home indicator)',
    steps: [
      'Tap "Arm". Press and hold an item until it lifts.',
      'Keep holding and, with another finger, swipe in from the side edge of the screen (Android back gesture).',
      'Lift an item again and swipe up from the bottom edge (go home or switch apps), then come back.',
    ],
    expected:
      'The system gesture wins: the drag is cancelled, the item flies back to its place, the lifted copy disappears. Whether the page goes back or not, nothing stays stuck, and the next long press drags normally.',
  },
  {
    id: 'fling',
    title: 'A fling, then a handle',
    platforms: 'all',
    steps: [
      'Fling the page with a fast swipe on the text of an item, so it keeps scrolling.',
      'While it still moves, put the finger on a ⠿ handle and drag right away.',
      'Repeat, but touch the text of an item instead of a handle.',
    ],
    expected:
      'On a handle the touch stops the scroll and the item drags at once (no long press); the page does not scroll under the drag. On the text the touch just stops the scroll; no item is picked up.',
  },
  {
    id: 'pinch',
    title: 'Pinch during the long press',
    platforms: 'all',
    steps: [
      'Put a finger on an item and, before it lifts, add a second finger and pinch.',
      'Let an item lift with one finger, then add a second finger and pinch.',
    ],
    expected:
      'A pinch that starts before the item lifts is a zoom: no item is picked up. With an item lifted, the second finger is ignored: no zoom, the item stays under the first finger. Afterwards a long press drags normally (zoom back out first).',
  },
  {
    id: 'pen',
    title: 'Pen',
    platforms: 'iPadOS (Apple Pencil), Android (S Pen and others)',
    steps: [
      'With the pen, press an item and move it: no need to hold first.',
      'Hover the pen over the list, then write a stroke across the text of an item.',
    ],
    expected:
      'A pen drag starts after a few pixels of movement, like a mouse, and reorders. Hovering does nothing; Scribble or handwriting never turns into text input or a selection.',
  },
];

export type CheckResult = 'pass' | 'fail';

export interface CheckState {
  result?: CheckResult;
  note?: string;
}

export type CheckStates = Partial<Record<CheckId, CheckState>>;

export const STORAGE_KEY = 'vue-dnd-kit:device-check';

/** Saved results. Storage may be unavailable (private mode): the page works without it. */
export const loadStates = (): CheckStates => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as unknown;
    return saved && typeof saved === 'object' ? (saved as CheckStates) : {};
  } catch {
    return {};
  }
};

export const saveStates = (states: CheckStates): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
  } catch {
    // Not saved: the results only live until the page reloads.
  }
};

export const describeDevice = (pointers: readonly string[]): string[] => [
  `User agent: ${navigator.userAgent}`,
  `Screen: ${screen.width}×${screen.height} @${window.devicePixelRatio}x, viewport ${window.innerWidth}×${window.innerHeight}`,
  `Touch points: ${navigator.maxTouchPoints}; pointers seen: ${pointers.length ? pointers.join(', ') : 'none yet'}`,
];

/** Plain text to paste into an issue or a chat. */
export const summarize = (states: CheckStates, pointers: readonly string[], date = new Date()): string => {
  const lines = CHECKS.map((check, index) => {
    const state = states[check.id];
    const result = state?.result ? state.result.toUpperCase() : 'not run';
    const note = state?.note?.trim();
    return `${index + 1}. ${check.title}: ${result}${note ? ` (${note})` : ''}`;
  });
  const count = (result: CheckResult) => CHECKS.filter((check) => states[check.id]?.result === result).length;
  const passed = count('pass');
  const failed = count('fail');
  return [
    `vue-dnd-kit device check, ${date.toISOString().slice(0, 16).replace('T', ' ')} UTC`,
    ...describeDevice(pointers),
    '',
    ...lines,
    '',
    `Passed ${passed}, failed ${failed}, not run ${CHECKS.length - passed - failed}`,
  ].join('\n');
};
