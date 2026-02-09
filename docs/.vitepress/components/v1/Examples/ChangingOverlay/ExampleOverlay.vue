<script setup lang="ts">
  import { useDragContainer } from '@vue-dnd-kit/core';
  import { computed, CSSProperties } from 'vue';

  const { elementRef, pointerPosition } = useDragContainer();

  const computedStyle = computed<CSSProperties>(() => ({
    transform: `translate3d(${
      (pointerPosition.current.value?.x ?? 0) -
      (pointerPosition.offset.pixel.value?.x ?? 0)
    }px, ${
      (pointerPosition.current.value?.y ?? 0) -
      (pointerPosition.offset.pixel.value?.y ?? 0)
    }px, 0)`,
    zIndex: 1000,
    position: 'fixed',
    top: 0,
    left: 0,
    transition: '0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
  }));
</script>

<template>
  <div
    ref="elementRef"
    class="user-card-skeleton"
    :style="computedStyle"
  >
    <div class="user-card-content">
      <div class="avatar-skeleton"></div>
      <div class="info-container">
        <div class="name-skeleton"></div>
        <div class="subtitle-skeleton"></div>
      </div>
      <div class="body-container">
        <div class="text-line-skeleton"></div>
        <div class="text-line-skeleton medium"></div>
        <div class="text-line-skeleton short"></div>
      </div>
      <div class="footer-container">
        <div class="button-skeleton"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .user-card-skeleton {
    width: 100%;
    max-width: 350px;
    background-color: #16161625;
    padding: 16px;
    border-radius: 8px;
    backdrop-filter: blur(10px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .user-card-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .avatar-skeleton {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: rgba(62, 175, 124, 0.1);
    border: 1px dashed rgba(62, 175, 124, 0.3);
    position: relative;
    overflow: hidden;
  }

  .info-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .name-skeleton {
    height: 20px;
    width: 70%;
    border-radius: 4px;
    background-color: rgba(62, 175, 124, 0.1);
    border: 1px dashed rgba(62, 175, 124, 0.3);
    position: relative;
    overflow: hidden;
  }

  .subtitle-skeleton {
    height: 16px;
    width: 50%;
    border-radius: 4px;
    background-color: rgba(62, 175, 124, 0.1);
    border: 1px dashed rgba(62, 175, 124, 0.3);
    position: relative;
    overflow: hidden;
  }

  .body-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
  }

  .text-line-skeleton {
    height: 16px;
    width: 100%;
    border-radius: 4px;
    background-color: rgba(62, 175, 124, 0.1);
    border: 1px dashed rgba(62, 175, 124, 0.3);
    position: relative;
    overflow: hidden;
  }

  .text-line-skeleton.medium {
    width: 85%;
  }

  .text-line-skeleton.short {
    width: 70%;
  }

  .footer-container {
    margin-top: 8px;
  }

  .button-skeleton {
    height: 30px;
    width: 40%;
    border-radius: 4px;
    background-color: rgba(62, 175, 124, 0.1);
    border: 1px dashed rgba(62, 175, 124, 0.3);
    position: relative;
    overflow: hidden;
  }

  .avatar-skeleton::after,
  .name-skeleton::after,
  .subtitle-skeleton::after,
  .text-line-skeleton::after,
  .button-skeleton::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(62, 175, 124, 0.1) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: shimmer 1.5s infinite;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }
</style>
