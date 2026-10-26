/**
 * The page's side of the tab, loaded once a tab watches the page (`plugin.ts`). It follows
 * the providers through the bridge and, while a tab watches, sends what the tab shows: the
 * state (registry, session, options, overrides, the chosen node's details), the mini-map
 * with the copies and the page's CSS, the overlay's preview and the log. It runs the tab's
 * commands: the joystick, drops and cancels, moves, picking on the page, option overrides.
 *
 * It paces itself: frames every 40 ms during a drag, twice a second otherwise; nothing once
 * no tab has said it watches for a while.
 */

import type { DevtoolsBridge, DevtoolsProvider, ProviderSnapshot } from '@vue-dnd-kit/core/devtools';
import { WATCH_TIMEOUT, type Command, type NodeRef, type PageMessage } from '../protocol';
import { createDrive } from './drive';
import { createFrames } from './frames';
import { highlight, reveal, unhighlight } from './highlight';
import { createLog } from './log';
import { moveTarget, resolveMove } from './moves';
import { decodeValue } from './options';
import { createPicker } from './pick';
import { keyLabel } from './preview';
import { createStick } from './stick';
import { detailView, providerView } from './views';

/** Pacing of what is sent, in ms: while a drag runs, and otherwise. */
const FRAME = { dragging: 40, idle: 500 };
const STATE = { dragging: 150, idle: 1000 };
const PREVIEW_EVERY = 200;
const STYLES_EVERY = 1000;

export interface Agent {
  /** A tab says it watches the page. */
  watched(tab: string): void;
  command(command: Command): void;
  stop(): void;
}

const nodeLabel = (node: NodeRef) => ('id' in node ? `${node.kind} ${keyLabel(node.id)}` : node.kind);

export function createAgent(bridge: DevtoolsBridge, page: string, post: (message: PageMessage) => void): Agent {
  const drive = createDrive();
  const frames = createFrames();
  const log = createLog();
  const providers = () => bridge.providers();
  const find = (id: string) => providers().find((provider) => provider.id === id);
  const stick = createStick(drive, providers);
  const picker = createPicker(providers, (picked) => {
    post({ type: 'pick', page, on: false, ...(picked ? { picked } : {}) });
    if (picked) select(picked);
  });

  const tabs = new Map<string, number>();
  let selected: NodeRef | null = null;
  let timer: ReturnType<typeof setTimeout> | undefined;
  /** When each kind of message was last sent; `state` at 0 sends it on the next tick. */
  const sent = { state: 0, preview: 0, styles: 0 };
  let previewHtml: string | null = null;

  const watching = () => {
    const now = Date.now();
    for (const [tab, at] of tabs) if (now - at > WATCH_TIMEOUT) tabs.delete(tab);
    return tabs.size > 0;
  };

  const sendState = (snapshots: Map<DevtoolsProvider, ProviderSnapshot>) => {
    const owner = selected && find(selected.provider);
    const detail = owner && selected ? detailView(owner, selected, snapshots.get(owner) ?? owner.snapshot()).view : null;
    post({ type: 'state', page, providers: [...snapshots].map(([provider, snapshot]) => providerView(provider, snapshot)), detail });
  };

  const sendPreview = (snapshots: Map<DevtoolsProvider, ProviderSnapshot>) => {
    let next: ReturnType<typeof frames.overlay> = null;
    for (const snapshot of snapshots.values()) next ??= frames.overlay(snapshot);
    if ((next?.html ?? null) === previewHtml) return;
    previewHtml = next?.html ?? null;
    post({ type: 'preview', page, html: previewHtml, size: next?.size ?? null });
  };

  const tick = () => {
    timer = undefined;
    if (!watching()) {
      stick.stop();
      picker.stop();
      return;
    }
    const now = performance.now();
    const snapshots = new Map(providers().map((provider) => [provider, provider.snapshot()] as const));
    const dragging = [...snapshots.values()].some((snapshot) => snapshot.status !== 'idle');
    const pace = dragging ? 'dragging' : 'idle';
    const styles = now - sent.styles > STYLES_EVERY ? frames.styles() : null;
    if (styles !== null) post({ type: 'styles', page, css: styles });
    if (now - sent.styles > STYLES_EVERY) sent.styles = now;
    const id = selected?.kind === 'draggable' ? selected.id : null;
    const { frame, copies } = frames.frame([...snapshots.keys()], snapshots, dragging, id);
    if (copies.length) post({ type: 'copies', page, copies });
    post({ type: 'frame', page, frame });
    if (now - sent.state >= STATE[pace]) {
      sent.state = now;
      sendState(snapshots);
    }
    if (dragging || previewHtml !== null) {
      if (now - sent.preview >= PREVIEW_EVERY) {
        sent.preview = now;
        sendPreview(snapshots);
      }
    }
    timer = setTimeout(tick, FRAME[pace]);
  };

  /** The state is sent on the next tick, which comes soon. */
  const refresh = () => {
    sent.state = 0;
    if (!watching()) return;
    clearTimeout(timer);
    timer = setTimeout(tick, 16);
  };

  const unsubscribe = bridge.subscribe({
    added: refresh,
    removed: (provider) => {
      drive.forget(provider);
      log.forget(provider);
      refresh();
    },
    event: (provider, event) => {
      const entries = log.add(provider, event);
      if (watching() && entries.length) post({ type: 'log', page, entries });
      if (event.type !== 'move' && event.type !== 'announcement') refresh();
    },
  });

  function select(node: NodeRef | null) {
    selected = node;
    refresh();
    const provider = node && find(node.provider);
    if (!provider || !node) return unhighlight();
    highlight(detailView(provider, node, provider.snapshot()).element, nodeLabel(node));
  }

  const run = (command: Command) => {
    switch (command.type) {
      case 'select':
        return select(command.node);
      case 'reveal': {
        const provider = find(command.node.provider);
        if (provider) reveal(detailView(provider, command.node, provider.snapshot()).element, nodeLabel(command.node));
        return;
      }
      case 'stick': {
        const grabbed = command.grab && find(command.grab.provider);
        return stick.set(command.x, command.y, grabbed ? { provider: grabbed, id: command.grab!.id } : undefined);
      }
      case 'drop':
        return void stick.drop();
      case 'cancel':
        return stick.cancel();
      case 'pick':
        if (command.on) picker.start();
        else picker.stop();
        return post({ type: 'pick', page, on: picker.on });
      case 'move': {
        const provider = find(command.provider);
        const target = moveTarget(command.to);
        if (provider) void drive.move(provider, command.id, () => resolveMove(provider.snapshot(), command.id, target));
        return;
      }
      case 'override': {
        const provider = find(command.provider);
        if (provider) provider.overrides.set(command.target, command.option, decodeValue(provider, command.target, command.option, command.value));
        return refresh();
      }
      case 'reset': {
        for (const provider of command.provider ? [find(command.provider)] : providers()) {
          provider?.overrides.reset(command.target, command.option);
        }
        return refresh();
      }
      case 'clearSelection':
        find(command.provider)?.clearSelection();
        return refresh();
      case 'clearLog':
        log.clear();
        return post({ type: 'log', page, entries: [], clear: true });
    }
  };

  return {
    watched(tab) {
      const known = tabs.has(tab) && watching();
      tabs.set(tab, Date.now());
      if (known) return;
      // A tab joined: it gets everything.
      frames.resend();
      previewHtml = null;
      sent.styles = 0;
      post({ type: 'log', page, entries: [...log.entries], clear: true });
      post({ type: 'pick', page, on: picker.on });
      refresh();
    },
    command(command) {
      try {
        run(command);
      } catch (error) {
        console.error(error);
      }
    },
    stop() {
      clearTimeout(timer);
      unsubscribe();
      stick.stop();
      picker.stop();
      drive.stop();
      unhighlight();
    },
  };
}
