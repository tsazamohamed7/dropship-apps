<template>
  <div class="h-screen flex flex-col">
    <header class="h-14 flex items-center justify-center bg-white/80 backdrop-blur border-b">
      <router-link to="/">
        <img src="../assets/vue.svg" alt="Logo" class="h-8 w-auto" />
      </router-link>

      <button 
        @click="cart.toggle()" 
        class="relative w-10 h-10 flex items-center justify-center text-slate-700 active:scale-90 transition-transform"
      >
        <i class="fa fa-shopping-cart text-2xl"></i>
        <span
          v-if="cart.totalQty"
          class="absolute top-0 right-0 bg-orange-500 text-white text-[10px] font-black min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-white shadow-sm"
        >
          {{ cart.totalQty }}
        </span>
      </button>
    </header>

    <main class="flex-1 overflow-y-auto p-4 pb-24">
      <router-view />
    </main>

    <BottomNav />
    <CartDrawer />
  </div>
</template>



<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useCartStore } from "../stores/cart.store";
import BottomNav from "../components/BottomNav.vue";
import CartDrawer from "../components/CartDrawer.vue";

const route = useRoute();
const cart = useCartStore();

const title = computed(() => {
  return route.meta.title || "Dashboard";
});
</script>

<style scoped>
.app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
  font-weight: bold;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  padding-bottom: 80px; /* space for bottom nav */
}
</style>
