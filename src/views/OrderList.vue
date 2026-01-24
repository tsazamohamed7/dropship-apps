<template>
  <div class="p-4 pb-20 space-y-3 bg-slate-50 min-h-screen font-sans">
    <h2 class="text-lg font-semibold text-slate-800">Orders</h2>

    <div class="flex gap-2 text-xs font-bold overflow-x-auto pb-2 no-scrollbar">
      <button
        v-for="t in tabs"
        :key="t.key"
        @click="activeTab = t.key"
        class="px-4 py-2 rounded-xl border flex items-center gap-2 transition-all whitespace-nowrap"
        :class="activeTab === t.key
          ? 'bg-slate-800 text-white border-slate-800 shadow-md'
          : 'bg-white text-slate-600 border-slate-200'"
      >
        {{ t.label }}
        <span class="px-2 py-0.5 rounded-full text-[10px]" :class="t.badge">
          {{ t.count }}
        </span>
      </button>
    </div>

    <div v-if="orderStore.loading" class="text-center py-10 text-slate-400">
      <div class="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full mb-2"></div>
      <p>Loading orders...</p>
    </div>

    <div
      v-for="o in filteredOrders"
      :key="o.order_id"
      class="bg-white rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden h-28 flex mb-3"
    >
      
      <div 
        class="absolute inset-0 z-20 bg-white p-4 flex justify-between items-center transition-transform duration-300 ease-in-out"
        :style="{ transform: o._showActions ? `translateX(-${calculateOffset(o)}px)` : 'translateX(0)' }"
      >
        <div class="space-y-1">
          <div class="font-bold text-slate-800 leading-tight truncate w-40">
            {{ o.customer_name }}
          </div>
          <div class="text-sm font-medium text-slate-500">
            RM {{ Number(o.total_amount).toFixed(2) }}
          </div>

          <div class="flex gap-1.5 mt-2">
            <span
              class="text-[9px] uppercase tracking-widest font-black px-2 py-1 rounded-md shadow-sm"
              :class="paymentClass(o.payment_status)"
            >
              {{ o.payment_status }}
            </span>
            <span
              class="text-[9px] uppercase tracking-widest font-black px-2 py-1 rounded-md shadow-sm"
              :class="deliveryClass(o.delivery_status)"
            >
              {{ o.delivery_status }}
            </span>
          </div>
        </div>

        <button 
          v-if="hasActions(o)"
          @click="toggleActions(o)"
          class="w-10 h-10 flex items-center justify-center bg-transparent border-none text-blue-500 active:scale-90 transition-all outline-none mr-2"
        >
          <i 
            class="fa text-xl transition-transform duration-300" 
            :class="o._showActions ? 'fa-chevron-right' : 'fa-chevron-left'" 
            aria-hidden="true"
          ></i>
        </button>
      </div>

      <div class="absolute right-0 top-0 bottom-0 z-10 flex h-full bg-slate-50">
        <button
          v-if="o.payment_status === 'UNPAID'"
          class="w-16 bg-emerald-500 text-white flex flex-col items-center justify-center gap-1 active:bg-emerald-600 transition-colors"
          @click="markPaid(o)"
        >
          <span class="text-base">💵</span>
          <span class="text-[9px] font-bold">PAID</span>
        </button>

        <button
          v-if="o.delivery_status === 'PENDING' && o.payment_status !== 'CANCELLED'"
          class="w-16 bg-sky-500 text-white flex flex-col items-center justify-center gap-1 active:bg-sky-600 transition-colors"
          @click="markDelivered(o)"
        >
          <span class="text-base">🚚</span>
          <span class="text-[9px] font-bold">DELIVERED</span>
        </button>

        <button
          v-if="o.payment_status === 'UNPAID' && o.delivery_status === 'PENDING'"
          class="w-16 bg-rose-400 text-white flex flex-col items-center justify-center gap-1 active:bg-rose-500 transition-colors"
          @click="cancel(o)"
        >
          <span class="text-base">❌</span>
          <span class="text-[9px] font-bold">CANCEL</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from "vue";
import { useOrderStore } from "../stores/order.store";

const orderStore = useOrderStore();
const activeTab = ref("ALL");

onMounted(async () => {
  await orderStore.fetchOrders();
});

// --- LOGIC HELPERS ---

function hasActions(o) {
  const canPay = o.payment_status === 'UNPAID';
  const canDeliver = o.delivery_status === 'PENDING' && o.payment_status !== 'CANCELLED';
  return canPay || canDeliver;
}

/**
 * Calculates how many pixels to slide based on button count.
 * Each button is w-16 (64px).
 */
function calculateOffset(o) {
  let buttons = 0;
  if (o.payment_status === 'UNPAID') buttons++; // Paid button
  if (o.delivery_status === 'PENDING' && o.payment_status !== 'CANCELLED') buttons++; // Delivered button
  if (o.payment_status === 'UNPAID' && o.delivery_status === 'PENDING') buttons++; // Cancel button
  
  return buttons * 64; 
}

function toggleActions(order) {
  orderStore.items.forEach(item => {
    if (item.order_id !== order.order_id) item._showActions = false;
  });
  order._showActions = !order._showActions;
}

// --- DATA & COMPUTED ---

const filteredOrders = computed(() => {
  let items = orderStore.items;
  items.forEach(i => { if (i._showActions === undefined) i._showActions = false; });

  switch (activeTab.value) {
    case "PENDING": return items.filter(isPending);
    case "COMPLETED": return items.filter(isCompleted);
    case "CANCELLED": return items.filter(isCancelled);
    default: return items;
  }
});

const tabs = computed(() => [
  { key: "ALL", label: "All", count: orderStore.items.length, badge: "bg-slate-200 text-slate-700" },
  { key: "PENDING", label: "Pending", count: orderStore.items.filter(isPending).length, badge: "bg-amber-100 text-amber-700" },
  { key: "COMPLETED", label: "Completed", count: orderStore.items.filter(isCompleted).length, badge: "bg-emerald-100 text-emerald-700" },
  { key: "CANCELLED", label: "Cancelled", count: orderStore.items.filter(isCancelled).length, badge: "bg-red-100 text-red-700" }
]);

// --- STORE ACTIONS ---

function markPaid(order) {
  order._showActions = false;
  orderStore.markPaid(order);
}

function markDelivered(order) {
  order._showActions = false;
  orderStore.markDelivered(order);
}

function cancel(order) {
  if(confirm("Cancel this order?")) {
    order._showActions = false;
    orderStore.cancel(order);
  }
}

// --- STYLING HELPERS ---

function paymentClass(status) {
  return status === "PAID" ? "bg-emerald-500 text-white" : "bg-amber-100 text-amber-700";
}

function deliveryClass(status) {
  return status === "DELIVERED" ? "bg-sky-500 text-white" : "bg-slate-100 text-slate-500";
}

function isCancelled(o) { return o.payment_status === "CANCELLED" || o.delivery_status === "CANCELLED"; }
function isCompleted(o) { return o.payment_status === "PAID" && o.delivery_status === "DELIVERED"; }
function isPending(o) { return !isCancelled(o) && !isCompleted(o); }
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>