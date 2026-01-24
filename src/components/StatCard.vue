<template>
  <div :class="['rounded-2xl p-4 shadow-sm relative overflow-hidden', bgColor]">
    <div :class="['absolute top-3 right-3 text-xl opacity-30', iconColor]">
      <i :class="['fa', icon]"></i>
    </div>

    <div class="text-[10px] font-bold uppercase tracking-wider text-slate-500/80">
      {{ title }}
    </div>
    
    <div class="text-2xl font-black mt-1 text-slate-800">
      {{ value }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: String,
  value: [String, Number],
  icon: String,
  color: String // 'emerald', 'sky', 'amber', 'rose', etc.
});

// Map the color prop to specific Tailwind classes
const bgColor = computed(() => {
  const maps = {
    emerald: 'bg-emerald-50 border border-emerald-100',
    sky: 'bg-sky-50 border border-sky-100',
    amber: 'bg-amber-50 border border-amber-100',
    indigo: 'bg-indigo-50 border border-indigo-100',
    rose: 'bg-rose-50 border border-rose-100'
  };
  return maps[props.color] || 'bg-white border border-slate-100';
});

const iconColor = computed(() => {
  const maps = {
    emerald: 'text-emerald-600',
    sky: 'text-sky-600',
    amber: 'text-amber-600',
    indigo: 'text-indigo-600',
    rose: 'text-rose-600'
  };
  return maps[props.color] || 'text-slate-400';
});
</script>