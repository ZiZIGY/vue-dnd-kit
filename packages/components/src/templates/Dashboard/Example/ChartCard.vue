<script setup lang="ts"></script>

<template>
  <div class="chart-card">
    <div class="chart-header">
      <h3 class="chart-title">Sales Overview</h3>
      <div class="chart-period">Last 7 days</div>
    </div>
    <div class="chart-content">
      <div class="chart-bars">
        <div
          class="chart-bar"
          style="height: 60%"
        ></div>
        <div
          class="chart-bar"
          style="height: 80%"
        ></div>
        <div
          class="chart-bar"
          style="height: 45%"
        ></div>
        <div
          class="chart-bar"
          style="height: 90%"
        ></div>
        <div
          class="chart-bar"
          style="height: 70%"
        ></div>
        <div
          class="chart-bar"
          style="height: 85%"
        ></div>
        <div
          class="chart-bar"
          style="height: 55%"
        ></div>
      </div>
      <div class="chart-labels">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .chart-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    height: 100%;
  }

  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .chart-title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }

  .chart-period {
    font-size: 12px;
    color: #6b7280;
  }

  .chart-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .chart-bars {
    display: flex;
    align-items: end;
    gap: 8px;
    height: 120px;
  }

  .chart-bar {
    flex: 1;
    background: linear-gradient(to top, #3b82f6, #60a5fa);
    border-radius: 4px 4px 0 0;
    min-width: 20px;
  }

  .chart-labels {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #6b7280;
  }
</style>
