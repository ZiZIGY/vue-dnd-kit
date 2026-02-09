<script setup lang="ts">
  import { ref } from 'vue';
  import {
    Table,
    TableRow,
    type ITableColumn,
  } from '@vue-dnd-kit/components/src/templates/Table';
  import ExampleContainer from '../../ExampleContainer.vue';

  interface IRow {
    id: number;
    name: string;
    age?: number;
    status?: string;
  }

  const rows = ref<IRow[]>([
    { id: 1, name: 'John Doe', status: 'Success' },
    { id: 2, name: 'Jane Smith', status: 'Success' },
    { id: 3, name: 'Jim Beam', status: 'Processing' },
    { id: 4, name: 'Jill Johnson', status: 'Failed' },
    { id: 5, name: 'Jack Daniels', age: 20, status: 'Success' },
  ]);

  const columns = ref<ITableColumn<IRow>[]>([
    { label: 'ID', key: 'id' },
    { label: 'Name', key: 'name' },
    { label: 'Status', key: 'status' },
    { label: 'Age', key: 'age' },
  ]);
</script>

<template>
  <ExampleContainer>
    <Table
      :rows="rows"
      :columns="columns"
      class="data-table"
    >
      <template #caption>Employee Data</template>

      <template #default="props">
        <TransitionGroup name="data-table">
          <TableRow
            v-for="(row, index) in rows"
            :key="row.id"
            :row="row"
            :row-index="index"
            v-bind="props"
          />
        </TransitionGroup>
      </template>

      <template #footer>
        <tr>
          <td colspan="4">Total employees: {{ rows.length }}</td>
        </tr>
      </template>
    </Table>
  </ExampleContainer>
</template>

<style>
  .data-table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  .data-table-move {
    transition: all 0.3s ease;
  }

  .data-table-enter-active,
  .data-table-leave-active {
    transition: all 0.3s ease;
  }

  .data-table-enter-from,
  .data-table-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  .data-table th,
  .data-table td,
  .data-table tr {
    width: 100%;
    touch-action: none;
  }

  .table-header {
    background: #f8f9fa;
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    color: #495057;
    border-bottom: 1px solid #dee2e6;
    position: relative;
    cursor: pointer;
    user-select: none;
  }

  .table-header:hover {
    background: #e9ecef;
  }

  .sort-icon {
    margin-left: 4px;
    opacity: 0.5;
    font-size: 12px;
  }

  .table-row {
    border-bottom: 1px solid #f1f3f4;
    transition: background-color 0.2s ease;
  }

  .table-row:hover {
    background: #f8f9fa;
  }

  .table-cell {
    padding: 12px 16px;
    vertical-align: middle;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 14px;
  }

  .role-badge {
    background: rgba(102, 126, 234, 0.1);
    color: #667eea;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
  }

  .status-badge {
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    text-transform: capitalize;
  }

  .status-badge.active {
    background: rgba(40, 167, 69, 0.1);
    color: #28a745;
  }

  .status-badge.inactive {
    background: rgba(108, 117, 125, 0.1);
    color: #6c757d;
  }

  .row-move {
    transition: all 0.3s ease;
  }

  .row-enter-active,
  .row-leave-active {
    transition: all 0.3s ease;
  }

  .row-enter-from,
  .row-leave-to {
    opacity: 0;
    transform: translateX(-20px);
  }
</style>
