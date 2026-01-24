<template>
  <div class="p-4 pb-24 space-y-4 bg-slate-50 min-h-screen">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-bold text-slate-800 tracking-tight">Products</h2>

      <button
        class="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-800 text-white shadow-sm active:scale-90 transition-all"
        @click="addProduct"
      >
        <span class="text-xl">+</span>
      </button>
    </div>

    <div v-if="productStore.loading" class="space-y-3">
      <div v-for="i in 5" :key="i" class="h-28 bg-slate-200 rounded-2xl animate-pulse"></div>
    </div>

    <div
      v-for="p in productStore.items"
      :key="p.product_id"
      class="bg-white rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden h-28 flex"
    >
      <div 
        class="absolute inset-0 z-20 bg-white p-4 flex justify-between items-center transition-transform duration-300 ease-in-out"
        :class="p._showActions ? '-translate-x-32' : 'translate-x-0'"
      >
        <div class="space-y-0.5 max-w-[70%]">
          <h3 class="font-bold text-slate-800 truncate leading-tight">{{ p.name }}</h3>
          <p class="text-[10px] text-slate-400 font-medium tracking-wide uppercase">{{ p.sku }}</p>
          <div class="text-xs font-semibold text-slate-500 pt-1">
            Cost: <span class="text-slate-400 font-normal">RM {{ p.cost_price }}</span> · 
            Sell: <span class="text-emerald-600 font-bold">RM {{ p.sell_price }}</span>
          </div>
          
          <div class="flex gap-2 mt-2">
            <span
              class="text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm border"
              :class="p.stock > 0 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-rose-50 text-rose-600 border-rose-100'"
            >
              Stock: {{ p.stock }}
            </span>

            <button
              @click="addToCart(p)"
              :disabled="p.stock <= 0"
              class="text-[10px] font-bold px-3 py-1 rounded-lg bg-amber-400 text-amber-900 shadow-sm active:scale-95 disabled:opacity-50 disabled:grayscale transition-all"
            >
              🛒 Add to Cart
            </button>
          </div>
        </div>

        <button 
          @click="toggleActions(p)"
          class="w-10 h-10 flex items-center justify-center bg-transparent border-none text-blue-500 active:scale-90 transition-all outline-none"
        >
          <i 
            class="fa text-xl transition-transform duration-300" 
            :class="p._showActions ? 'fa-chevron-right' : 'fa-chevron-left'" 
            aria-hidden="true"
          ></i>
        </button>
      </div>

      <div class="absolute right-0 top-0 bottom-0 z-10 flex h-full">
        <button
          class="w-16 bg-sky-500 text-white flex flex-col items-center justify-center gap-1 active:bg-sky-600 transition-colors"
          @click="edit(p)"
        >
          <span class="text-lg">✏️</span>
          <span class="text-[9px] font-bold uppercase">Edit</span>
        </button>

        <button
          class="w-16 bg-rose-400 text-white flex flex-col items-center justify-center gap-1 active:bg-rose-500 transition-colors"
          @click="onDelete(p)"
        >
          <span class="text-lg">🗑</span>
          <span class="text-[9px] font-bold uppercase tracking-tighter">Delete</span>
        </button>
      </div>
    </div>
  </div>

  <EditProductSheet
    :open="showEdit"
    :product="editing"
    @close="showEdit = false"
    @save="onSave"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useProductStore } from "../stores/product.store";
import { useCartStore } from "../stores/cart.store";
import { useToastStore } from "../stores/toast.store";
import EditProductSheet from "../components/EditProductSheet.vue";

const productStore = useProductStore();
const cartStore = useCartStore();
const toast = useToastStore();

const editing = ref(null);
const showEdit = ref(false);

onMounted(() => {
  productStore.fetchProducts();
});

function toggleActions(product) {
  // Initialize state if it doesn't exist
  if (product._showActions === undefined) product._showActions = false;
  
  // Close other drawers
  productStore.items.forEach(item => {
    if (item.product_id !== product.product_id) item._showActions = false;
  });
  product._showActions = !product._showActions;
}

function addProduct() {
  editing.value = null;
  showEdit.value = true;
}

function addToCart(product) {
  if (product.stock <= 0) {
    toast.error("Out of stock");
    return;
  }
  cartStore.add(product);
  toast.success("Added to cart");
}

function edit(product) {
  product._showActions = false;
  editing.value = product;
  showEdit.value = true;
}

function onDelete(product) {
  if (confirm(`Delete ${product.name}?`)) {
    product._showActions = false;
    productStore.deleteProduct(product.product_id);
    toast.success("Product deleted");
  }
}

function onSave(data) {
  if (editing.value) {
    productStore.updateProduct(data);
    toast.success("Product updated");
  } else {
    productStore.addProduct(data);
    toast.success("Product added");
  }
  showEdit.value = false;
}
</script>