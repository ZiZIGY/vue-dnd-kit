<script setup lang="ts"></script>

<template>
  <div class="task-list">
    <div class="task-header">
      <h3 class="task-title">Recent Tasks</h3>
      <div class="task-count">5 tasks</div>
    </div>
    <div class="task-items">
      <div class="task-item">
        <div class="task-checkbox completed"></div>
        <div class="task-content">
          <div class="task-text">Update website design</div>
          <div class="task-meta">Due in 2 days</div>
        </div>
      </div>
      <div class="task-item">
        <div class="task-checkbox"></div>
        <div class="task-content">
          <div class="task-text">Review marketing materials</div>
          <div class="task-meta">Due tomorrow</div>
        </div>
      </div>
      <div class="task-item">
        <div class="task-checkbox completed"></div>
        <div class="task-content">
          <div class="task-text">Prepare quarterly report</div>
          <div class="task-meta">Completed</div>
        </div>
      </div>
      <div class="task-item">
        <div class="task-checkbox"></div>
        <div class="task-content">
          <div class="task-text">Schedule team meeting</div>
          <div class="task-meta">Due in 3 days</div>
        </div>
      </div>
      <div class="task-item">
        <div class="task-checkbox"></div>
        <div class="task-content">
          <div class="task-text">Update documentation</div>
          <div class="task-meta">Due next week</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .task-list {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    height: 100%;
  }

  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .task-title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }

  .task-count {
    font-size: 12px;
    color: #6b7280;
  }

  .task-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .task-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
  }

  .task-checkbox {
    width: 16px;
    height: 16px;
    border: 2px solid #d1d5db;
    border-radius: 4px;
    cursor: pointer;
  }

  .task-checkbox.completed {
    background: #3b82f6;
    border-color: #3b82f6;
    position: relative;
  }

  .task-checkbox.completed::after {
    content: '✓';
    position: absolute;
    top: -2px;
    left: 1px;
    color: white;
    font-size: 12px;
    font-weight: bold;
  }

  .task-content {
    flex: 1;
  }

  .task-text {
    font-size: 14px;
    color: #111827;
    margin-bottom: 2px;
  }

  .task-meta {
    font-size: 12px;
    color: #6b7280;
  }
</style>
