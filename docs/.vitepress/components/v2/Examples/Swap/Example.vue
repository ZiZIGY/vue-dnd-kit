<script setup lang="ts">
  import { ref } from 'vue';
  import { DnDProvider } from '@vue-dnd-kit/core';
  import type { IDragEvent } from '@vue-dnd-kit/core';
  import ExampleContainer from '../../ExampleContainer.vue';
  import TeamList from './TeamList.vue';
  import type { Player } from './PlayerCard.vue';

  const COLORS = {
    alpha: '#6366f1',
    beta: '#8b5cf6',
  };

  const teamAlpha = ref<Player[]>([
    { id: 1, name: 'Alex Chen', role: 'Frontend' },
    { id: 2, name: 'Sam Rivera', role: 'Backend' },
    { id: 3, name: 'Jordan Kim', role: 'DevOps' },
  ]);

  const teamBeta = ref<Player[]>([
    { id: 4, name: 'Morgan Lee', role: 'Design' },
    { id: 5, name: 'Casey Park', role: 'QA' },
    { id: 6, name: 'Riley Wang', role: 'PM' },
  ]);

  function handleDrop(e: IDragEvent) {
    if (!e.hoveredDraggable) return;

    const r = e.helpers.suggestSwap();
    if (!r) return;

    const srcItems = e.draggedItems[0]?.items as Player[];

    if (srcItems === teamAlpha.value)
      teamAlpha.value = r.sourceItems as Player[];
    else if (srcItems === teamBeta.value)
      teamBeta.value = r.sourceItems as Player[];

    if (!r.sameList) {
      const tgtItems = e.hoveredDraggable.items as Player[];
      if (tgtItems === teamAlpha.value)
        teamAlpha.value = r.targetItems as Player[];
      else if (tgtItems === teamBeta.value)
        teamBeta.value = r.targetItems as Player[];
    }
  }
</script>

<template>
  <ExampleContainer direction="bottom-left">
    <DnDProvider class="swap-provider">
      <div class="board">
        <div class="board-header">
          <span class="board-title">Sprint Planning</span>
          <span class="board-hint">Hover over a member to swap positions</span>
        </div>

        <div class="teams">
          <TeamList
            title="Team Alpha"
            subtitle="Frontend & Infrastructure"
            :items="teamAlpha"
            :color="COLORS.alpha"
            :on-drop="handleDrop"
          />
          <div class="divider">⇄</div>
          <TeamList
            title="Team Beta"
            subtitle="Design & Quality"
            :items="teamBeta"
            :color="COLORS.beta"
            :on-drop="handleDrop"
          />
        </div>
      </div>
    </DnDProvider>
  </ExampleContainer>
</template>

<style>
  .swap-provider div {
    opacity: 1 !important;
  }

  .board {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .board-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 4px;
  }

  .board-title {
    font-size: 16px;
    font-weight: 700;
    color: var(--vp-c-text-1);
  }

  .board-hint {
    font-size: 12px;
    color: var(--vp-c-text-3);
  }

  .teams {
    display: flex;
    gap: 8px;
    align-items: flex-start;
  }

  .divider {
    font-size: 22px;
    color: var(--vp-c-text-3);
    padding-top: 52px;
    flex-shrink: 0;
    user-select: none;
  }

  @media (max-width: 580px) {
    .teams {
      flex-direction: column;
    }
    .divider {
      padding-top: 0;
      text-align: center;
      transform: rotate(90deg);
    }
  }
</style>
