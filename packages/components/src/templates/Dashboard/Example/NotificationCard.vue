<script setup lang="ts"></script>

<template>
  <div class="notification-card">
    <div class="notification-header">
      <h3 class="notification-title">Notifications</h3>
      <div class="notification-badge">3 new</div>
    </div>
    <div class="notification-items">
      <div class="notification-item unread">
        <div class="notification-icon">🔔</div>
        <div class="notification-content">
          <div class="notification-text">New order received</div>
          <div class="notification-time">2 minutes ago</div>
        </div>
      </div>
      <div class="notification-item unread">
        <div class="notification-icon">📧</div>
        <div class="notification-content">
          <div class="notification-text">Email from client</div>
          <div class="notification-time">15 minutes ago</div>
        </div>
      </div>
      <div class="notification-item">
        <div class="notification-icon">✅</div>
        <div class="notification-content">
          <div class="notification-text">Task completed</div>
          <div class="notification-time">1 hour ago</div>
        </div>
      </div>
      <div class="notification-item">
        <div class="notification-icon">👥</div>
        <div class="notification-content">
          <div class="notification-text">Team meeting reminder</div>
          <div class="notification-time">2 hours ago</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .notification-card {
    background: white;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    height: 100%;
  }

  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .notification-title {
    font-size: 16px;
    font-weight: 600;
    color: #111827;
    margin: 0;
  }

  .notification-badge {
    background: #ef4444;
    color: white;
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 12px;
    font-weight: 500;
  }

  .notification-items {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .notification-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
  }

  .notification-item.unread {
    background: #f8fafc;
    margin: 0 -20px;
    padding: 8px 20px;
  }

  .notification-icon {
    font-size: 16px;
    width: 24px;
    text-align: center;
  }

  .notification-content {
    flex: 1;
  }

  .notification-text {
    font-size: 14px;
    color: #111827;
    margin-bottom: 2px;
  }

  .notification-time {
    font-size: 12px;
    color: #6b7280;
  }
</style>
