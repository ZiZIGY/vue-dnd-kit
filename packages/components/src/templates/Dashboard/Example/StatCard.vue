<script setup lang="ts"></script>

<template>
  <div class="stat-card">
    <div class="stat-header">
      <div class="stat-icon">📊</div>
      <div class="stat-title">Total Revenue</div>
    </div>
    <div class="stat-value">$45,231</div>
    <div class="stat-trend positive">+20.1%</div>
  </div>
</template>

<style scoped>
  .stat-card {
    background: white;
    border-radius: 8px;
    padding: 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    height: 100%;
  }

  .stat-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .stat-icon {
    font-size: 20px;
  }

  .stat-title {
    font-size: 14px;
    color: #6b7280;
    font-weight: 500;
  }

  .stat-value {
    font-size: 24px;
    font-weight: 600;
    color: #111827;
    margin-bottom: 4px;
  }

  .stat-trend {
    font-size: 12px;
    font-weight: 500;
    color: #059669;
  }
</style>
