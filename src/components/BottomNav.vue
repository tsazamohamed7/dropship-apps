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
  </nav>
</template>

<script setup>

const items = [
  { to: "/dashboard", label: "Home", icon: "fa-th-large" }, // Dashboard/Grid icon
  { to: "/products", label: "Products", icon: "fa-archive" }, // Box icon
  { to: "/orders", label: "Orders", icon: "fa-list-alt" },    // Receipt/List icon
  { to: "/pre-order", label: "Pre-Order", icon: "fa-calendar-check-o" } // New Pre-Order item
];

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