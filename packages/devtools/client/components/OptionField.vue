<script setup lang="ts">
  /**
   * One option: its value, and an editor whose changes apply to the page at once (an
   * override, dev only, never written to the code). Choices are buttons; numbers and texts
   * fields; objects JSON; the library's modifiers and collision detections names. An
   * overridden option shows the code's value and a reset.
   */
  import { computed, ref, watch } from 'vue';
  import { TAG, type Literal, type OptionView, type Preview, type TargetRef } from '../../src/protocol';
  import { send } from '../utils/connection';
  import { isTagged, same, short, toJson } from '../utils/format';

  const props = defineProps<{ option: OptionView; target: TargetRef; provider: string }>();

  const set = (value: Preview) =>
    send({ type: 'override', provider: props.provider, target: props.target, option: props.option.name, value });
  const reset = () => send({ type: 'reset', provider: props.provider, target: props.target, option: props.option.name });

  const unset = computed(() => isTagged(props.option.value) && props.option.value[TAG] === 'undefined');
  const shown = computed(() => (unset.value ? (props.option.fallback ? `default (${props.option.fallback})` : 'default') : short(props.option.value, 60)));
  const isChoice = (choice: Literal) => !unset.value && same(props.option.value, choice);

  // ─── Free inputs ─────────────────────────────────────────────────────────────

  const text = ref('');
  const json = ref<string | null>(null);
  const error = ref('');
  watch(
    () => props.option.value,
    (value) => {
      text.value = typeof value === 'string' || typeof value === 'number' ? String(value) : Array.isArray(value) ? value.join(', ') : '';
    },
    { immediate: true },
  );

  const commitText = () => {
    if (props.option.input === 'number') {
      const value = Number(text.value);
      if (text.value.trim() !== '' && Number.isFinite(value)) set(value);
    } else set(text.value);
  };

  const openJson = () => {
    const current = props.option.value;
    json.value = (current !== null && typeof current === 'object' && toJson(current)) || JSON.stringify(props.option.template ?? {}, null, 2);
    error.value = '';
  };
  const applyJson = () => {
    try {
      set(JSON.parse(json.value ?? 'null') as Preview);
      json.value = null;
    } catch (failure) {
      error.value = (failure as Error).message;
    }
  };

  // ─── Names (modifiers, collision) ────────────────────────────────────────────

  const names = computed(() => {
    const value = props.option.value;
    return (Array.isArray(value) ? value : [value]).filter((entry): entry is string => typeof entry === 'string');
  });
  /** Functions of the code's own, kept by an edit. */
  const own = computed(() => (Array.isArray(props.option.value) ? props.option.value.filter((entry) => typeof entry !== 'string') : []));
  const toggleName = (name: string) => {
    const next = names.value.includes(name) ? names.value.filter((entry) => entry !== name) : [...names.value, name];
    set({ [TAG]: 'names', names: next });
  };
  const pickName = (event: Event) => set({ [TAG]: 'names', names: [(event.target as HTMLSelectElement).value] });
</script>

<template>
  <div class="field" :data-testid="`option-${option.name}`" :data-overridden="option.overridden || undefined">
    <div class="head">
      <span class="name mono">{{ option.name }}</span>
      <span class="value mono" :title="shown">{{ shown }}</span>
      <button v-if="option.overridden" class="reset" title="Back to the code's value" data-testid="reset-option" @click="reset">↺</button>
    </div>
    <div v-if="option.overridden" class="code mono mute">code: {{ short(option.code, 60) }}</div>

    <div class="editor">
      <button
        v-for="choice in option.choices ?? []"
        :key="String(choice)"
        class="btn choice"
        :class="{ on: isChoice(choice) }"
        :data-choice="String(choice)"
        @click="set(choice)"
      >
        {{ String(choice) }}
      </button>

      <input
        v-if="option.input === 'number' || option.input === 'text'"
        v-model="text"
        :type="option.input === 'number' ? 'number' : 'text'"
        :placeholder="option.fallback ?? ''"
        @change="commitText"
        @keydown.enter="commitText"
      />

      <template v-if="option.input === 'json'">
        <button v-if="json === null" class="btn choice" title="An object" @click="openJson">{…}</button>
      </template>

      <template v-if="option.input === 'names' && option.several">
        <label v-for="name in option.names" :key="name" class="name-check">
          <input type="checkbox" :checked="names.includes(name)" @change="toggleName(name)" />
          <span class="mono">{{ name }}</span>
        </label>
        <span v-for="(entry, index) in own" :key="index" class="chip" title="Of the code: kept">{{ short(entry, 30) }}</span>
      </template>
      <select v-else-if="option.input === 'names'" :value="names[0] ?? ''" @change="pickName">
        <option value="" disabled>{{ isTagged(option.value) ? short(option.value, 30) : 'default' }}</option>
        <option v-for="name in option.names" :key="name" :value="name">{{ name }}</option>
      </select>
    </div>

    <div v-if="json !== null" class="json">
      <textarea v-model="json" rows="4" spellcheck="false" />
      <div class="json-actions">
        <span v-if="error" class="error">{{ error }}</span>
        <button class="btn" @click="json = null">Close</button>
        <button class="btn primary" @click="applyJson">Apply</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .field {
    padding: 5px 0;
    border-bottom: 1px solid var(--border);
  }

  .field[data-overridden] .name {
    color: var(--purple);
  }

  .head {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .name {
    flex: none;
  }

  .value {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
    color: var(--text-soft);
  }

  .reset {
    border: 0;
    background: none;
    padding: 0 2px;
    color: var(--purple);
  }

  .code {
    text-align: right;
  }

  .editor {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    margin-top: 3px;
  }

  .editor input[type='number'],
  .editor input[type='text'] {
    width: 110px;
    height: 22px;
  }

  .choice {
    height: 20px;
    padding: 0 6px;
    font-size: 11px;
  }

  .name-check {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    margin-right: 6px;
  }

  .json textarea {
    width: 100%;
    margin-top: 4px;
  }

  .json-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 4px;
  }

  .error {
    flex: 1;
    color: var(--red);
  }
</style>
