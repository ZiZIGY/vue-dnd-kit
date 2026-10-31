<script setup lang="ts">
  import { computed, reactive, ref, shallowRef, useTemplateRef } from 'vue';
  import CheckCard from './CheckCard.vue';
  import AreaProbe from './AreaProbe.vue';
  import DeviceList from './DeviceList.vue';
  import {
    CHECKS,
    loadStates,
    saveStates,
    seenPointers,
    summarize,
    type CheckId,
    type CheckState,
    type CheckStates,
  } from './checks';

  /**
   * A checklist for a human with a real phone or tablet: what emulated touch input can't
   * show (rfcs/0001-v3.md §10). Results stay in localStorage and end up in a plain-text
   * summary to paste into an issue.
   */
  const states = ref<CheckStates>(loadStates());
  const change = (id: CheckId, state: CheckState) => {
    states.value = { ...states.value, [id]: state };
    saveStates(states.value);
  };

  const count = (result: 'pass' | 'fail') => CHECKS.filter((check) => states.value[check.id]?.result === result).length;
  const passed = computed(() => count('pass'));
  const failed = computed(() => count('fail'));
  const summary = computed(() => summarize(states.value, [...seenPointers]));

  const host = location.hostname;
  const onLocalhost = ['localhost', '127.0.0.1', '[::1]'].includes(host);

  // The back checks: an extra history step, so going back stays on this page.
  const armed = reactive(new Set<CheckId>());
  const arm = (id: CheckId) => {
    history.pushState({ deviceCheck: id }, '', location.href);
    armed.add(id);
  };

  const summaryField = useTemplateRef<HTMLTextAreaElement>('summaryField');
  const copyStatus = shallowRef('');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary.value);
      copyStatus.value = 'Copied';
      return;
    } catch {
      // No Clipboard API outside secure contexts, and plain http over Wi-Fi isn't one.
    }
    const field = summaryField.value!;
    field.focus();
    field.select();
    // iOS ignores select() on its own.
    field.setSelectionRange(0, field.value.length);
    copyStatus.value = document.execCommand('copy') ? 'Copied' : 'Selected: copy it from the system menu';
  };

  // Two taps: a stray one never wipes the results.
  const resetArmed = shallowRef(false);
  let resetTimer: ReturnType<typeof setTimeout> | undefined;
  const reset = () => {
    clearTimeout(resetTimer);
    if (!resetArmed.value) {
      resetArmed.value = true;
      resetTimer = setTimeout(() => (resetArmed.value = false), 3000);
      return;
    }
    resetArmed.value = false;
    states.value = {};
    saveStates({});
    copyStatus.value = '';
  };
</script>

<template>
  <section class="device-check">
    <header class="top">
      <a href="#sortable">‹ Demos</a>
      <h2>Device check</h2>
    </header>

    <aside
      class="how"
      data-testid="how-to-open"
    >
      <strong>Open this page on a phone</strong>
      <ol>
        <li>On the computer, in <code>playground</code>: <code>yarn dev:host</code>.</li>
        <li>Vite prints a <em>Network</em> address, such as <code>http://192.168.1.20:4100/</code>.</li>
        <li>On the phone, on the same Wi-Fi, open that address followed by <code>demo/#device-check</code>.</li>
      </ol>
      <p>
        Nothing loads? Let Node.js through the computer's firewall, and make sure the Wi-Fi doesn't isolate
        devices from each other (guest networks often do).
      </p>
      <p
        v-if="onLocalhost"
        class="warning"
        data-testid="localhost-warning"
      >
        This tab is on {{ host }}: a phone can't open that address. Use the Network address.
      </p>
      <p class="intro">
        Go through the checks on the device, mark each one Pass or Fail (add a note when something is off), then
        copy the summary at the end. The line under each area reports what the page saw.
      </p>
    </aside>

    <CheckCard
      v-for="(check, index) in CHECKS"
      :key="check.id"
      :check="check"
      :index="index"
      :state="states[check.id]"
      @change="change(check.id, $event)"
    >
      <template v-if="check.id === 'basics'">
        <AreaProbe
          :prefixes="['b']"
          :show="['drags', 'pageMoved', 'pointers']"
        >
          <DeviceList
            prefix="b"
            :count="12"
          />
        </AreaProbe>
      </template>

      <template v-else-if="check.id === 'callout'">
        <AreaProbe
          :prefixes="['c']"
          :show="['drags', 'contextmenu', 'selected']"
        >
          <DeviceList
            prefix="c"
            :count="4"
            variant="rich"
          />
        </AreaProbe>
      </template>

      <template v-else-if="check.id === 'selection'">
        <AreaProbe
          :prefixes="['s']"
          :show="['drags', 'selected']"
        >
          <DeviceList
            prefix="s"
            :count="4"
          />
        </AreaProbe>
        <p class="plain">
          A plain paragraph, not draggable: a long press on a word here selects it, with handles, as on any page.
        </p>
      </template>

      <template v-else-if="check.id === 'contextmenu'">
        <AreaProbe
          :prefixes="['m']"
          :show="['drags', 'contextmenu']"
        >
          <DeviceList
            prefix="m"
            :count="4"
            variant="rich"
          />
        </AreaProbe>
        <p class="plain">
          <a
            href="https://vuejs.org/"
            target="_blank"
            rel="noopener"
            >A plain link, not draggable</a
          >
        </p>
      </template>

      <template v-else-if="check.id === 'native-drag'">
        <AreaProbe
          :prefixes="['n']"
          :show="['drags', 'dragstart']"
        >
          <DeviceList
            prefix="n"
            :count="4"
            variant="rich"
          />
        </AreaProbe>
      </template>

      <template v-else-if="check.id === 'detached'">
        <AreaProbe
          :prefixes="['l', 'r']"
          :show="['drags', 'pageMoved', 'pointercancel']"
        >
          <div class="two-lists">
            <DeviceList
              prefix="l"
              :count="4"
              group="device-detached"
              label="Left"
            />
            <DeviceList
              prefix="r"
              :count="2"
              group="device-detached"
              label="Right"
            />
          </div>
        </AreaProbe>
      </template>

      <template v-else-if="check.id === 'edge-back' || check.id === 'system-back'">
        <p class="arm">
          <button
            type="button"
            data-testid="arm"
            @click="arm(check.id)"
          >
            Arm
          </button>
          <span v-if="armed.has(check.id)">Armed: going back stays on this page.</span>
        </p>
        <AreaProbe
          :prefixes="[check.id === 'edge-back' ? 'e' : 'y']"
          :show="check.id === 'edge-back' ? ['drags', 'pointercancel', 'back'] : ['drags', 'pointercancel', 'back', 'hidden']"
        >
          <!-- Edge to edge on a phone: the swipe has to start on an item, at the screen edge. -->
          <div class="bleed">
            <DeviceList
              :prefix="check.id === 'edge-back' ? 'e' : 'y'"
              :count="4"
            />
          </div>
        </AreaProbe>
      </template>

      <template v-else-if="check.id === 'fling'">
        <AreaProbe
          :prefixes="['f']"
          :show="['drags', 'pageMoved']"
        >
          <DeviceList
            prefix="f"
            :count="16"
            variant="handle"
          />
        </AreaProbe>
      </template>

      <template v-else-if="check.id === 'pinch'">
        <AreaProbe
          :prefixes="['p']"
          :show="['drags', 'zoom']"
        >
          <DeviceList
            prefix="p"
            :count="4"
          />
        </AreaProbe>
      </template>

      <template v-else-if="check.id === 'pen'">
        <AreaProbe
          :prefixes="['w']"
          :show="['drags', 'pointers', 'selected']"
        >
          <DeviceList
            prefix="w"
            :count="4"
          />
        </AreaProbe>
      </template>
    </CheckCard>

    <section class="results">
      <h3>Summary</h3>
      <p data-testid="progress">
        {{ passed + failed }} of {{ CHECKS.length }} checked: {{ passed }} passed, {{ failed }} failed
      </p>
      <textarea
        ref="summaryField"
        readonly
        rows="10"
        :value="summary"
        aria-label="Summary"
        data-testid="summary"
      />
      <div class="actions">
        <button
          type="button"
          data-testid="copy"
          @click="copy"
        >
          Copy summary
        </button>
        <button
          type="button"
          data-testid="reset"
          @click="reset"
        >
          {{ resetArmed ? 'Tap again to reset' : 'Reset results' }}
        </button>
        <output data-testid="copy-status">{{ copyStatus }}</output>
      </div>
    </section>
  </section>
</template>

<style scoped>
  .device-check {
    --gutter: 12px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 560px;
    margin: 0 auto;
    color: #111827;
    font: 15px/1.4 system-ui, sans-serif;
  }

  .top {
    display: flex;
    align-items: baseline;
    gap: 12px;
  }

  .top h2 {
    margin: 0;
  }

  .how {
    padding: 12px var(--gutter);
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 10px;
  }

  .how ol {
    margin: 6px 0;
    padding-left: 20px;
  }

  .how p {
    margin: 6px 0 0;
  }

  .how code {
    overflow-wrap: anywhere;
  }

  .warning {
    color: #b45309;
    font-weight: 600;
  }

  .plain {
    margin: 12px 0 0;
  }

  .two-lists {
    display: grid;
    /* `minmax(0, …)`: the rows' one-line notes must not widen the columns. */
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .arm {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 0 8px;
  }

  .arm button,
  .actions button {
    min-height: 40px;
    padding: 0 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    background: #f9fafb;
    font: inherit;
    font-weight: 600;
  }

  .results textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font: 12px/1.4 ui-monospace, monospace;
  }

  .results h3,
  .results p {
    margin: 0 0 8px;
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
  }

  /*
   * On a phone the cards run edge to edge (main's 16px padding cancelled), so the
   * edge-swipe list can reach the screen edges: an edge swipe has to start on an item.
   */
  @media (max-width: 600px) {
    .device-check {
      margin-inline: -16px;
    }

    .device-check > :deep(.check),
    .how {
      border-inline-width: 0;
      border-radius: 0;
    }

    .top,
    .results {
      padding-inline: var(--gutter);
    }

    .bleed {
      margin-inline: calc(-1 * var(--gutter));
    }
  }
</style>
