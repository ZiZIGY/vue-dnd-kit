<script setup lang="ts">
import { ref } from 'vue';
import type { Widget } from './widgets';

defineProps<{ widget: Widget }>();

// Visits per hour: the chart stretches with its widget (`preserveAspectRatio="none"`).
const VISITS = [12, 18, 15, 22, 30, 26, 34, 41, 38, 45, 52, 48, 57, 61, 55, 63, 70, 66, 74, 69, 78, 84, 80, 88];
const top = Math.max(...VISITS);
const line = VISITS.map((visits, hour) => `${(hour / (VISITS.length - 1)) * 100},${40 - (visits / top) * 36}`).join(' ');

const tasks = ref([
  { id: 1, text: 'Review the Q3 report', done: true },
  { id: 2, text: 'Plan the launch', done: false },
  { id: 3, text: 'Reply to the investors', done: false },
  { id: 4, text: 'Update the roadmap', done: false },
]);

const team = [
  { name: 'Ada', status: 'online', hue: 160 },
  { name: 'Lin', status: 'online', hue: 30 },
  { name: 'Sam', status: 'away', hue: 260 },
  { name: 'Mia', status: 'offline', hue: 340 },
];

// The last 30 days, one of them with an outage.
const days = Array.from({ length: 30 }, (_, day) => (day === 19 ? 'down' : day === 20 ? 'slow' : 'up'));
</script>

<template>
  <div class="body">
    <template v-if="widget.kind === 'metric'">
      <span class="value">{{ widget.value }}</span>
      <span class="delta">▲ {{ widget.delta }} <span class="since">vs last week</span></span>
    </template>

    <svg v-else-if="widget.kind === 'chart'" class="chart" viewBox="0 0 100 40" preserveAspectRatio="none" aria-label="Visits per hour, rising">
      <polygon :points="`0,40 ${line} 100,40`" class="area" />
      <polyline :points="line" class="line" />
    </svg>

    <ul v-else-if="widget.kind === 'tasks'" class="tasks">
      <li v-for="task in tasks" :key="task.id">
        <label class="task">
          <input v-model="task.done" type="checkbox" />
          <span :class="{ done: task.done }">{{ task.text }}</span>
        </label>
      </li>
    </ul>

    <!-- Type more: the row grows with the text, and the widgets beside it with the row. -->
    <div v-else-if="widget.kind === 'notes'" v-once class="note" contenteditable="true" spellcheck="false">
      Ship the dashboard on Friday. Ask Lin about the chart colours.
    </div>

    <ul v-else-if="widget.kind === 'team'" class="team">
      <li v-for="person in team" :key="person.name" class="person" :title="`${person.name}, ${person.status}`">
        <span class="avatar" :style="{ background: `hsl(${person.hue} 55% 45%)` }">{{ person.name[0] }}</span>
        <span class="dot" :class="person.status" />
      </li>
    </ul>

    <template v-else-if="widget.kind === 'uptime'">
      <div class="bars" aria-label="30 days: one outage, one slow day">
        <span v-for="(day, index) in days" :key="index" class="bar" :class="day" />
      </div>
      <span class="since">99.97% over the last 30 days</span>
    </template>
  </div>
</template>

<style scoped>
.body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  padding: 2px 14px 14px;
  font-size: 13px;
}

.value {
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.delta {
  color: #42b883;
  font-size: 12px;
  font-weight: 600;
}

.since {
  font-size: 11px;
  font-weight: 400;
  opacity: 0.55;
}

.chart {
  flex: 1;
  width: 100%;
  min-height: 40px;
}

.area {
  fill: color-mix(in srgb, #42b883 18%, transparent);
}

.line {
  fill: none;
  stroke: #42b883;
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}

.tasks,
.team {
  margin: 0;
  padding: 0;
  list-style: none;
}

.tasks {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.task {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.task input {
  accent-color: #42b883;
}

.done {
  text-decoration: line-through;
  opacity: 0.5;
}

.note {
  flex: 1;
  padding: 8px 10px;
  border-radius: 8px;
  background: color-mix(in srgb, #f5c542 14%, transparent);
  line-height: 1.5;
  outline: none;
  cursor: text;
}

.note:focus-visible {
  box-shadow: 0 0 0 2px #42b883;
}

.team {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.person {
  position: relative;
}

.avatar {
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
}

.dot {
  position: absolute;
  right: -1px;
  bottom: -1px;
  width: 10px;
  height: 10px;
  border: 2px solid Canvas;
  border-radius: 50%;
  background: #9ca3af;
}

.dot.online {
  background: #42b883;
}

.dot.away {
  background: #f5c542;
}

.bars {
  display: flex;
  flex: 1;
  align-items: stretch;
  gap: 2px;
  min-height: 24px;
}

.bar {
  flex: 1;
  border-radius: 2px;
  background: #42b883;
}

.bar.slow {
  background: #f5c542;
}

.bar.down {
  background: #f43f5e;
}
</style>
