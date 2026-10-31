<script setup lang="ts">
  import type { OverlayProps } from '@vue-dnd-kit/core';

  // The water's overlay: it leaves the seed's own (its default slot) out and shows a
  // droplet. On `dropping` it splashes; the drop waits for the splash to end.
  defineProps<OverlayProps>();
</script>

<template>
  <div
    class="droplet"
    data-overlay-kind="droplet"
    :data-state="status"
  >
    <span class="drop" />
    <span
      v-if="status === 'dropping'"
      class="ring"
    />
  </div>
</template>

<style scoped>
  .droplet {
    position: relative;
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
  }

  .drop {
    width: 34px;
    height: 34px;
    background: #3b82f6;
    border-radius: 0 50% 50% 50%;
    rotate: 45deg;
    animation: form 0.25s cubic-bezier(0.2, 0.8, 0.2, 1.4) both;
  }

  [data-state='dropping'] .drop {
    animation: splash 0.45s ease-out forwards;
  }

  .ring {
    position: absolute;
    width: 34px;
    height: 34px;
    border: 3px solid #60a5fa;
    border-radius: 50%;
    animation: ripple 0.45s ease-out forwards;
  }

  @keyframes form {
    from {
      opacity: 0;
      scale: 0.4;
    }
  }

  @keyframes splash {
    30% {
      scale: 1.25 0.8;
    }

    to {
      opacity: 0;
      scale: 2.4 0.3;
    }
  }

  @keyframes ripple {
    from {
      opacity: 1;
      scale: 0.5;
    }

    to {
      opacity: 0;
      scale: 3;
    }
  }
</style>
