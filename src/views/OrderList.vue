<template>
  <div class="p-4 pb-24 space-y-3 bg-slate-50 min-h-screen font-sans">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-xl font-black text-slate-800 tracking-tight">Orders</h2>
      <span class="text-[10px] bg-slate-200 px-2 py-1 rounded-lg font-bold text-slate-500 uppercase">
        {{ filteredOrders.length }} Orders
      </span>
    </div>

    <div class="flex gap-2 text-xs font-bold overflow-x-auto pb-4 no-scrollbar">
      <button
        v-for="t in tabs"
        :key="t.key"
        @click="activeTab = t.key"
        class="px-5 py-2.5 rounded-2xl border flex items-center gap-2 transition-all whitespace-nowrap shadow-sm"
        :class="activeTab === t.key
          ? 'bg-slate-800 text-white border-slate-800'
          : 'bg-white text-slate-500 border-slate-100'"
      >
        {{ t.label }}
        <span 
          class="px-2 py-0.5 rounded-full text-[10px]" 
          :class="activeTab === t.key ? 'bg-white/20 text-white' : t.badge"
        >
          {{ t.count }}
        </span>
      </button>
    </div>

    <div v-if="orderStore.loading" class="text-center py-20 text-slate-400">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full mb-4"></div>
      <p class="font-bold text-sm">Synchronizing Orders...</p>
    </div>

    <div v-else-if="filteredOrders.length === 0" class="text-center py-20">
      <i class="fa fa-file-text-o text-5xl text-slate-200 mb-4"></i>
      <p class="text-slate-400 font-medium">No orders found in this category.</p>
    </div>

    <div
      v-for="o in filteredOrders"
      :key="o.order_id"
      class="flex flex-col mb-4"
    >
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden h-28 flex z-20">
        
        <div 
          class="absolute inset-0 z-20 bg-white p-4 flex justify-between items-center transition-transform duration-300 ease-out"
          :style="{ transform: o._showActions ? `translateX(-${calculateOffset(o)}px)` : 'translateX(0)' }"
          @click="handleCardClick(o)"
        >
          <div class="space-y-1">
            <div class="font-black text-slate-800 leading-tight truncate w-48 text-base">
              {{ o.customer_name }}
            </div>
            <div class="text-sm font-bold text-blue-600">
              RM {{ Number(o.total_amount).toFixed(2) }}
            </div>

            <div class="flex gap-1.5 mt-2">
              <span
                class="text-[8px] uppercase tracking-tighter font-black px-2 py-1 rounded-lg"
                :class="paymentClass(o.payment_status)"
              >
                {{ o.payment_status }}
              </span>
              <span
                class="text-[8px] uppercase tracking-tighter font-black px-2 py-1 rounded-lg"
                :class="deliveryClass(o.delivery_status)"
              >
                {{ o.delivery_status }}
              </span>
            </div>
          </div>

          <button 
            v-if="hasActions(o)"
            @click.stop="toggleActions(o)"
            class="w-12 h-12 flex items-center justify-center text-slate-300 active:text-blue-500 transition-colors"
          >
            <i 
              class="fa text-2xl transition-transform duration-300" 
              :class="o._showActions ? 'fa-chevron-right' : 'fa-chevron-left'"
            ></i>
          </button>
        </div>

        <div class="absolute right-0 top-0 bottom-0 z-10 flex h-full bg-slate-50">
          <button
            v-if="o.payment_status === 'UNPAID' && o.payment_status !== 'CANCELLED'"
            class="w-16 bg-emerald-500 text-white flex flex-col items-center justify-center gap-1 active:bg-emerald-600"
            @click.stop="markPaid(o)"
          >
            <i class="fa fa-check-circle text-xl"></i>
            <span class="text-[9px] font-black uppercase">Paid</span>
          </button>

          <button
            v-if="o.delivery_status === 'PENDING' && o.payment_status !== 'CANCELLED'"
            class="w-16 bg-sky-500 text-white flex flex-col items-center justify-center gap-1 active:bg-sky-600"
            @click.stop="markDelivered(o)"
          >
            <i class="fa fa-truck text-xl"></i>
            <span class="text-[9px] font-black uppercase">Sent</span>
          </button>

          <button
            v-if="o.payment_status === 'UNPAID' && o.delivery_status === 'PENDING'"
            class="w-16 bg-rose-400 text-white flex flex-col items-center justify-center gap-1 active:bg-rose-500"
            @click.stop="cancel(o)"
          >
            <i class="fa fa-times text-xl"></i>
            <span class="text-[9px] font-black uppercase">Void</span>
          </button>
        </div>
      </div>

      <div 
        v-if="o._expanded" 
        class="bg-white/60 border-x border-b border-slate-100 rounded-b-2xl -mt-4 pt-6 p-4 space-y-3 z-10 shadow-inner"
      >
        <div v-if="o._loadingItems" class="flex items-center justify-center py-4 gap-2">
           <div class="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
           <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Fetching Details</span>
        </div>
        
        <div v-else-if="o.items && o.items.length" class="space-y-2">
          <div 
            v-for="item in o.items" 
            :key="item.order_item_id" 
            class="flex justify-between items-center text-xs bg-white p-2 rounded-xl border border-slate-50 shadow-sm"
          >
            <div class="flex gap-3 items-center">
              <span class="h-6 w-6 flex items-center justify-center bg-slate-100 rounded-lg font-black text-slate-700">
                {{ item.qty }}
              </span>
              <div class="flex flex-col">
                <span class="font-bold text-slate-800">{{ item.product_name }}</span>
              </div>
            </div>
            <div class="font-black text-slate-700">
              RM {{ (item.price * item.qty).toFixed(2) }}
            </div>
          </div>
          
          <div class="pt-2 border-t border-dashed border-slate-200 flex justify-between items-center px-1">
             <span class="text-[10px] font-bold text-slate-400 uppercase">Total Items: {{ o.items.length }}</span>
             <span class="text-xs font-black text-slate-800">RM {{ Number(o.total_amount).toFixed(2) }}</span>
          </div>
        </div>
        
        <div v-else class="text-center py-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
          No item data available
        </div>
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

// --- UI HANDLERS ---

async function handleCardClick(order) {
  // If actions are open, close them instead of expanding
  if (order._showActions) {
    order._showActions = false;
    return;
  }

  // Toggle expansion
  order._expanded = !order._expanded;

  // Fetch details if not already loaded
  if (order._expanded && (!order.items || order.items.length === 0)) {
    order._loadingItems = true;
    try {
      await orderStore.fetchOrderDetails(order.order_id);
    } finally {
      order._loadingItems = false;
    }
  }
}

function toggleActions(order) {
  // Close expansion if we are opening actions
  if (!order._showActions) order._expanded = false;

  orderStore.items.forEach(item => {
    if (item.order_id !== order.order_id) item._showActions = false;
  });
  order._showActions = !order._showActions;
}

// --- LOGIC HELPERS ---

function hasActions(o) {
  const canPay = o.payment_status === 'UNPAID';
  const canDeliver = o.delivery_status === 'PENDING' && o.payment_status !== 'CANCELLED';
  return canPay || canDeliver;
}

function calculateOffset(o) {
  let buttons = 0;
  if (o.payment_status === 'UNPAID') buttons++; 
  if (o.delivery_status === 'PENDING' && o.payment_status !== 'CANCELLED') buttons++; 
  if (o.payment_status === 'UNPAID' && o.delivery_status === 'PENDING') buttons++; 
  return buttons * 64; 
}

// --- DATA & COMPUTED ---

const filteredOrders = computed(() => {
  let items = orderStore.items;
  // Initialize UI-only properties
  items.forEach(i => { 
    if (i._showActions === undefined) i._showActions = false; 
    if (i._expanded === undefined) i._expanded = false;
    if (i._loadingItems === undefined) i._loadingItems = false;
  });

  switch (activeTab.value) {
    case "PENDING": return items.filter(isPending);
    case "COMPLETED": return items.filter(isCompleted);
    case "CANCELLED": return items.filter(isCancelled);
    default: return items;
  }
});

const tabs = computed(() => [
  { key: "ALL", label: "All", count: orderStore.items.length, badge: "bg-slate-100 text-slate-500" },
  { key: "PENDING", label: "Pending", count: orderStore.items.filter(isPending).length, badge: "bg-amber-100 text-amber-600" },
  { key: "COMPLETED", label: "Done", count: orderStore.items.filter(isCompleted).length, badge: "bg-emerald-100 text-emerald-600" },
  { key: "CANCELLED", label: "Void", count: orderStore.items.filter(isCancelled).length, badge: "bg-red-100 text-red-600" }
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
  if(confirm("Void this order?")) {
    order._showActions = false;
    orderStore.cancel(order);
  }
}

// --- STYLING HELPERS ---

function paymentClass(status) {
  return status === "PAID" 
    ? "bg-emerald-100 text-emerald-700" 
    : "bg-amber-100 text-amber-700 animate-pulse";
}

function deliveryClass(status) {
  return status === "DELIVERED" 
    ? "bg-sky-100 text-sky-700" 
    : "bg-slate-100 text-slate-500";
}

function isCancelled(o) { return o.payment_status === "CANCELLED" || o.delivery_status === "CANCELLED"; }
function isCompleted(o) { return o.payment_status === "PAID" && o.delivery_status === "DELIVERED"; }
function isPending(o) { return !isCancelled(o) && !isCompleted(o); }
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>