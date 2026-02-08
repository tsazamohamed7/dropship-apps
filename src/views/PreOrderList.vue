<template>
  <div class="p-4 space-y-4 bg-slate-50 min-h-screen font-sans">
    <div class="flex flex-col gap-1">
      <h2 class="text-xl font-black text-slate-800 tracking-tight">Pre-Orders</h2>
      <p class="text-xs text-slate-500 font-medium">Manage scheduled deliveries</p>
    </div>

    <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
      <div class="flex flex-col">
        <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Date</span>
        <input 
          type="date" 
          v-model="selectedDate"
          class="text-sm font-bold text-slate-700 outline-none bg-transparent"
        />
      </div>
      <div class="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
        <i class="fa fa-calendar text-xl"></i>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div class="bg-blue-500 p-3 rounded-2xl text-white">
        <div class="text-[10px] font-bold opacity-80 uppercase">Total Items</div>
        <div class="text-xl font-black">{{ totalItemsForDate }}</div>
      </div>
      <div class="bg-slate-800 p-3 rounded-2xl text-white">
        <div class="text-[10px] font-bold opacity-80 uppercase">Orders</div>
        <div class="text-xl font-black">{{ filteredPreOrders.length }}</div>
      </div>
    </div>

    <div v-if="filteredPreOrders.length > 0" class="space-y-3">
      <div 
        v-for="o in filteredPreOrders" 
        :key="o.order_id"
        class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:scale-[0.98] transition-transform"
      >
        <div class="flex justify-between items-start mb-2">
          <div>
            <div class="font-black text-slate-800 text-base leading-tight">{{ o.customer_name }}</div>
            <div class="text-[10px] font-bold text-blue-500 uppercase mt-0.5">
              Ref: {{ o.order_id.split('-')[0] }}
            </div>
          </div>
          <div class="text-right">
            <div class="font-black text-slate-800">RM {{ Number(o.total_amount).toFixed(2) }}</div>
            <span class="text-[9px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md font-black">PRE-ORDER</span>
          </div>
        </div>

        <div class="border-t border-slate-50 pt-2 mt-2 space-y-1">
          <div v-for="item in o.items" :key="item.product_id" class="flex justify-between text-xs text-slate-600">
            <span>{{ item.qty }}x {{ item.product_name }}</span>
            <span class="font-bold">RM {{ (item.price * item.qty).toFixed(2) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-12 text-slate-400">
      <i class="fa fa-calendar-o text-5xl mb-3 opacity-20"></i>
      <p class="font-bold text-sm">No pre-orders for this date</p>
      <p class="text-[10px]">Select another date to view schedule</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useOrderStore } from '../stores/order.store';

const orderStore = useOrderStore();
const selectedDate = ref(new Date().toISOString().substr(0, 10));

// Temporary Filter Logic (Assumes your order object has a 'delivery_date' field)
const filteredPreOrders = computed(() => {
  return orderStore.items.filter(order => {
    return order.delivery_status === 'PRE-ORDER' && 
           (order.delivery_date === selectedDate.value);
  });
});

const totalItemsForDate = computed(() => {
  return filteredPreOrders.value.reduce((acc, order) => {
    return acc + order.items.reduce((sum, item) => sum + item.qty, 0);
  }, 0);
});
</script>