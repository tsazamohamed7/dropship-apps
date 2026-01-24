<template>
  <div class="bg-slate-100 text-slate-800 min-h-screen">
    <router-view />
    <AppToast />
  </div>
</template>

<script setup>
  import AppToast from "./components/AppToast.vue";
</script>

<style>
body {
  margin: 0;
  background: linear-gradient(135deg, #0f172a, #020617);
  color: #e5e7eb;
}
</style>
