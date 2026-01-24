<template>
  <div
    v-if="toast.show"
    class="fixed bottom-20 left-1/2 -translate-x-1/2 z-50
           px-4 py-2 rounded-xl shadow-lg text-white
           transition-all duration-300"
    :class="bg"
  >
    {{ toast.message }}
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useToastStore } from "../stores/toast.store";

const toast = useToastStore();

const bg = computed(() => {
  if (toast.type === "success") return "bg-emerald-500";
  if (toast.type === "error") return "bg-red-500";
  if (toast.type === "info") return "bg-slate-700";
  return "bg-primary";
});
</script>
