/**
 * The Lab's state, kept in its URL so a link opens the same view: the demo in the hash
 * (`/#tree`, as the demo page's), the rest in the query (`?view=phone&tab=code&devtools`).
 */

import { computed, ref, shallowRef, watch } from 'vue';
import { useEventListener } from '@vueuse/core';
import { DEMOS, demoById, type DemoEntry } from '../catalog';

export type View = 'desktop' | 'tablet' | 'phone';
export type Tab = 'about' | 'code' | 'tests';

const VIEWS: readonly View[] = ['desktop', 'tablet', 'phone'];
const TABS: readonly Tab[] = ['about', 'code', 'tests'];

const params = new URLSearchParams(location.search);
const pick = <T extends string>(values: readonly T[], value: string | null): T | null =>
  values.includes(value as T) ? (value as T) : null;

const readDemo = (): DemoEntry => demoById(location.hash.slice(1)) ?? DEMOS[0]!;

export const demo = shallowRef(readDemo());

/** A width chosen in the toolbar; without one, phone demos open at a phone's width. */
const chosenView = ref<View | null>(pick(VIEWS, params.get('view')));
export const view = computed<View>({
  get: () => chosenView.value ?? (demo.value.phone ? 'phone' : 'desktop'),
  set: (value) => (chosenView.value = value),
});

export const tab = ref<Tab>(pick(TABS, params.get('tab')) ?? 'about');
export const panelOpen = ref(params.get('panel') !== 'closed');
export const devtoolsOpen = ref(params.has('devtools'));

useEventListener(window, 'hashchange', () => {
  const next = readDemo();
  if (next === demo.value) return;
  demo.value = next;
  // Another demo opens at its own width.
  chosenView.value = null;
});

/** Opens a demo: a history entry of its own, as a link would. */
export const open = (id: string) => {
  location.hash = id;
};

watch([chosenView, tab, panelOpen, devtoolsOpen], () => {
  const query = new URLSearchParams();
  if (chosenView.value) query.set('view', chosenView.value);
  if (tab.value !== 'about') query.set('tab', tab.value);
  if (!panelOpen.value) query.set('panel', 'closed');
  if (devtoolsOpen.value) query.set('devtools', '');
  const search = query.toString().replace(/=(?=&|$)/g, '');
  history.replaceState(history.state, '', `${search ? `?${search}` : location.pathname}${location.hash}`);
});
