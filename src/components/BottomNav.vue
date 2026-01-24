<template>
  <nav class="fixed bottom-0 inset-x-0 h-20 bg-white border-t flex items-center justify-around z-50 px-2 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
    <router-link
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="flex-1 flex flex-col items-center justify-center transition-all duration-300 active:scale-90"
      :class="$route.path === item.to ? 'text-slate-900' : 'text-slate-400'"
    >
      <div class="relative flex items-center justify-center h-10 w-10">
        <i :class="['fa text-3xl fa-fw', item.icon]"></i>
      </div>
      <span class="text-[11px] font-bold mt-1 tracking-wide">{{ item.label }}</span>
    </router-link>

    <button
      @click="toggleCart"
      class="flex-1 flex flex-col items-center justify-center transition-all duration-300 active:scale-90"
      :class="cart.open ? 'text-slate-900' : 'text-slate-400'"
    >
      <div class="relative flex items-center justify-center h-10 w-10">
        <i class="fa fa-shopping-cart text-3xl fa-fw"></i>
    
        <span
          v-if="cart.totalQty"
          class="absolute -top-1 -right-2 bg-orange-500 text-white text-[10px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white shadow-md animate-bounce-short"
        >
          {{ cart.totalQty }}
        </span>
      </div>
      <span class="text-[11px] font-bold mt-1 tracking-wide">Cart</span>
    </button>
  </nav>
</template>

<script setup>
import { useCartStore } from "../stores/cart.store";

const cart = useCartStore();

const items = [
  { to: "/dashboard", label: "Home", icon: "fa-th-large" }, // Dashboard/Grid icon
  { to: "/products", label: "Products", icon: "fa-archive" }, // Box icon
  { to: "/orders", label: "Orders", icon: "fa-list-alt" }    // Receipt/List icon
];

function toggleCart() {
  cart.toggle();
}
</script>


<style scoped>
/* A subtle one-time bounce when the count changes */
.animate-bounce-short {
  animation: bounce 0.5s ease-in-out;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}
</style>