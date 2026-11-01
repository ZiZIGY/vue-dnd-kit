<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import { makeSortableList } from '@vue-dnd-kit/core';
import ExpenseRow from './ExpenseRow.vue';

const expenses = ref([
  { id: 'e1', name: 'Design tools', amount: 49, paid: true, trend: [30, 35, 40, 42, 45, 49] },
  { id: 'e2', name: 'Cloud hosting', amount: 230, paid: false, trend: [120, 150, 170, 190, 210, 230] },
  { id: 'e3', name: 'Office coffee', amount: 64, paid: true, trend: [70, 58, 66, 52, 62, 64] },
  { id: 'e4', name: 'Team offsite', amount: 1200, paid: false, trend: [0, 0, 0, 400, 800, 1200] },
]);

// The rows of the table body sort; the overlay is the default clone of a row.
const body = useTemplateRef<HTMLElement>('body');
const { items } = makeSortableList(body, { items: expenses });

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const total = computed(() => expenses.value.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0));
const remove = (id: string) => (expenses.value = expenses.value.filter((expense) => expense.id !== id));
</script>

<template>
  <!-- On a narrow screen, the table scrolls sideways. -->
  <div class="sheet">
    <table class="expenses">
      <colgroup>
        <col class="grip-column" />
        <col />
        <col class="amount-column" />
        <col class="small-column" />
        <col class="trend-column" />
        <col class="small-column" />
      </colgroup>
      <thead>
        <tr>
          <th><span class="visually-hidden">Move</span></th>
          <th>Expense</th>
          <th class="right">Amount</th>
          <th>Paid</th>
          <th>6 months</th>
          <th><span class="visually-hidden">Remove</span></th>
        </tr>
      </thead>
      <tbody ref="body">
        <ExpenseRow
          v-for="expense in items"
          :id="expense.id"
          :key="expense.id"
          v-model:name="expense.name"
          v-model:amount="expense.amount"
          v-model:paid="expense.paid"
          :trend="expense.trend"
          @remove="remove(expense.id)"
        />
      </tbody>
      <tfoot>
        <tr>
          <td />
          <td>Total</td>
          <td class="right">{{ money.format(total) }}</td>
          <td colspan="3" />
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<style scoped>
.sheet {
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  overflow-x: auto;
}

.expenses {
  width: 100%;
  min-width: 460px;
  border-collapse: collapse;
  border-radius: 12px;
  background: color-mix(in srgb, currentColor 3%, Canvas);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, currentColor 10%, transparent);
  font-size: 13px;
}

.grip-column {
  width: 36px;
}

.amount-column {
  width: 96px;
}

.small-column {
  width: 48px;
}

.trend-column {
  width: 86px;
}

th {
  padding: 10px 6px 8px;
  font-size: 11px;
  font-weight: 600;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.55;
}

tfoot td {
  padding: 10px 13px;
  border-top: 1px solid color-mix(in srgb, currentColor 14%, transparent);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.right {
  text-align: right;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
</style>
