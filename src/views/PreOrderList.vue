<template>
  <div class="p-4 pb-24 space-y-3 bg-slate-50 min-h-screen font-sans">
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-xl font-black text-slate-800 tracking-tight">Pre-Orders</h2>
      
      <button
        class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 text-white shadow-sm active:scale-90 transition-all"
        @click="addProduct"
      >
        <span class="text-xl">+</span>
      </button>

    </div>

    <div v-if="preOrderStore.loading" class="text-center py-20 text-slate-400">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-slate-300 border-t-slate-800 rounded-full mb-4"></div>
      <p class="font-bold text-sm">Synchronizing Pre-Orders...</p>
    </div>

    <div
      v-for="p in preOrderStore.items"
      :key="p.id"
      class="flex flex-col mb-4"
    >
      <!-- CARD -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden h-28 flex z-20">
        <div
          class="absolute inset-0 z-20 bg-white p-4 flex justify-between items-center transition-transform duration-300 ease-out"
          :style="{ transform: p._showActions ? `translateX(-${calculateOffset(p)}px)` : 'translateX(0)' }"
          @click="handleCardClick(p)"
        >
          <div class="space-y-1">
            <div class="font-black text-slate-800 leading-tight truncate w-48 text-base">
              {{ p.name }}
            </div>
            <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wide">
              {{ p.sku }}
            </div>

            <div class="flex gap-1.5 mt-2">
              <span class="text-[8px] uppercase tracking-tighter font-black px-2 py-1 rounded-lg" :class="statusClass(p.status)">
                {{ p.status }}
              </span>
              <span class="text-[8px] uppercase tracking-tighter font-black px-2 py-1 rounded-lg bg-red-200 text-slate-600">
                📅 {{ formatDate(p.last_open_date) }}
              </span>
              <span class="text-[8px] uppercase tracking-tighter font-black px-2 py-1 rounded-lg bg-slate-100 text-slate-600">
                Qty : {{ totalQty(p) }}
              </span>
            </div>
          </div>

          <button
            v-if="hasActions(p)"
            @click.stop="toggleActions(p)"
            class="w-12 h-12 flex items-center justify-center text-slate-300 active:text-blue-500 transition-colors"
          >
            <i class="fa text-2xl transition-transform duration-300" :class="p._showActions ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
          </button>
        </div>

        <!-- ACTIONS -->
        <div class="absolute right-0 top-0 bottom-0 z-10 flex h-full bg-slate-50">
          <button
            v-if="p.status === 'OPEN'"
            class="w-16 bg-sky-500 text-white flex flex-col items-center justify-center gap-1"
            @click.stop="edit(p)"
          >
            <i class="fa fa-pencil text-xl"></i>
            <span class="text-[9px] font-black uppercase">Edit</span>
          </button>

          <button
            v-if="p.status === 'OPEN'"
            class="w-16 bg-amber-400 text-amber-900 flex flex-col items-center justify-center gap-1"
            @click.stop="addCustomer(p)"
          >
            <i class="fa fa-user-plus text-xl"></i>
            <span class="text-[9px] font-black uppercase">Add</span>
          </button>

          <button
            v-if="p.status === 'OPEN'"
            class="w-16 bg-slate-800 text-white flex flex-col items-center justify-center gap-1"
            @click.stop="finalize(p)"
          >
            <i class="fa fa-lock text-xl"></i>
            <span class="text-[9px] font-black uppercase">Finalize</span>
          </button>

          <button
            v-if="p.status === 'FINALIZED'"
            class="w-16 bg-emerald-500 text-white flex flex-col items-center justify-center gap-1"
            @click.stop="received(p)"
          >
            <i class="fa fa-check-circle text-xl"></i>
            <span class="text-[9px] font-black uppercase">Received</span>
          </button>
        </div>
      </div>

      <!-- EXPAND -->
      <div
        v-if="p._expanded"
        class="bg-white/60 border-x border-b border-slate-100 rounded-b-2xl -mt-4 pt-6 p-4 space-y-3 z-10 shadow-inner"
      >
        <div v-if="p._loadingItems" class="flex items-center justify-center py-4 gap-2">
          <div class="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Fetching Details</span>
        </div>

        <div v-else-if="p.customers && p.customers.length" class="space-y-2">
          <div v-for="c in p.customers" :key="c.id" 
            class="flex justify-between items-center text-xs bg-white p-2 rounded-xl border border-slate-50 shadow-sm">
            <div class="flex gap-3 items-center">
              <span class="h-6 w-6 flex items-center justify-center bg-slate-100 rounded-lg font-black text-slate-700">
                {{ c.qty }}
              </span>
              <div class="flex flex-col">
                <span class="font-bold text-slate-800">{{ c.name }}</span>
                <span class="text-[10px] text-slate-400">{{ c.phone || '' }}</span>
              </div>
            </div>

            <button
              v-if="p.status === 'OPEN'"
              class="text-rose-500 text-xs font-bold active:opacity-50"
              @click="removeCustomer(p, c)"
            >
              Delete
            </button>
          </div>

          <div class="pt-2 border-t border-dashed border-slate-200 flex justify-between items-center px-1">
            <span class="text-[10px] font-bold text-slate-400 uppercase">Total Customers: {{ p.customers.length }}</span>
            <span class="text-xs font-black text-slate-800">Qty {{ totalQty(p) }}</span>
          </div>
        </div>

        <div v-else class="text-center py-2 text-[10px] font-bold text-slate-400 uppercase">
          No customers
        </div>
      </div>
    </div>
  </div>

<!-- EDIT PRE-ORDER PRODUCT -->
<EditPreOrderProduct
  v-if="showEditProduct"
  :open="showEditProduct"
  :preOrder="activePreOrder"
  @close="closeEditors"
  @save="onProductSaved"
/>

<!-- ADD CUSTOMER -->
<EditPreOrderCustomer
  v-if="showEditCustomer && activePreOrder"
  :open="showEditCustomer"
  :preOrder="activePreOrder"
  @close="closeEditors"
  @saved="onCustomerSaved"
/>

</template>

<script setup>
import { onMounted, ref } from 'vue'
import { usePreOrderStore } from '../stores/preOrder.store'
import EditPreOrderProduct from '../components/EditPreOrderProduct.vue'
import EditPreOrderCustomer from '../components/EditPreOrderCustomer.vue'

const preOrderStore = usePreOrderStore();

const activePreOrder = ref(null);
const editing = ref(false)

const showEditProduct = ref(false);
const showEditCustomer = ref(false);

onMounted(() => {
  preOrderStore.fetchPreOrders()
});

function handleCardClick(p) {
  if (p._showActions) {
    p._showActions = false
    return
  }

  p._expanded = !p._expanded

  if (p._expanded && (!p.customers || p.customers.length === 0)) {
    preOrderStore.fetchPreOrderDetails(p.id)
  }
}

function toggleActions(p) {
  if (!p._showActions) p._expanded = false

  preOrderStore.items.forEach(i => {
    if (i.id !== p.id) i._showActions = false
  })

  p._showActions = !p._showActions
}

function hasActions(p) {
  if (p.status === 'OPEN') return true
  if (p.status === 'FINALIZED') return true
  return false
}

function calculateOffset(p) {
  if (p.status === 'OPEN') return 64 * 3
  if (p.status === 'FINALIZED') return 64
  return 0
}

function totalQty(p) {
  return (p.customers || []).reduce((sum, c) => sum + c.qty, 0)
}

function statusClass(status) {
  if (status === 'OPEN') return 'bg-amber-100 text-amber-700'
  if (status === 'FINALIZED') return 'bg-sky-100 text-sky-700'
  return 'bg-emerald-100 text-emerald-700'
}

// STORE ACTIONS
function addProduct() {
  editing.value = null;
  activePreOrder.value = null   // explicitly new
  showEditProduct.value = true
}

function edit(p) {
  editing.value = p;
  p._showActions = false
  activePreOrder.value = p
  showEditProduct.value = true
}

function addCustomer(p) {
  p._showActions = false
  activePreOrder.value = p
  showEditCustomer.value = true
}

function finalize(p) {
  if (confirm('Finalize this pre-order?')) {
    p._showActions = false
    preOrderStore.finalize(p)
  }
}

function received(p) {
  if (confirm('Mark this pre-order as received?')) {
    p._showActions = false
    preOrderStore.received(p)
  }
}

function removeCustomer(p, c) {
  if (confirm('Remove this customer?')) {
    preOrderStore.removeCustomer(p.id, c.id)
  }
}

function closeEditors() {
  showEditProduct.value = false
  showEditCustomer.value = false
  activePreOrder.value = null
  editing.value = false
}


async function onProductSaved(payload) {
  if (editing.value) {
    await preOrderStore.updatePreOrder(payload)
  } else {
    await preOrderStore.createPreOrder(payload)
  }

  closeEditors()
}

async function onCustomerSaved(payload) {
  await preOrderStore.addCustomerToPreOrder(payload)

  closeEditors()
}


function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}
</script>