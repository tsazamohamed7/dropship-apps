<template>
  <div class="space-y-6 pb-20">

    <!-- Header -->
    <h2 class="text-lg font-semibold text-slate-800">Dashboard</h2>

    <!-- Loading -->
    <div v-if="dashboard.loading" class="text-center py-10 text-slate-400">
      <div class="animate-spin inline-block w-6 h-6 border-2 border-current border-t-transparent rounded-full mb-2"></div>
      <p>Loading dashboard...</p>
    </div>

    <!-- Stats -->
    <div
      v-else-if="dashboard.data"
      class="grid grid-cols-2 gap-4"
    >
      <StatCard
        title="Total Sales"
        :value="`RM ${Number(dashboard.data.total_sales).toFixed(2)}`"
        icon="fa-line-chart"
        color="emerald"
      />
      <StatCard
        title="Total Profit"
        :value="`RM ${Number(dashboard.data.total_profit).toFixed(2)}`"
        icon="fa-money"
        color="amber"
      />
      <StatCard
        title="Products"
        :value="dashboard.data.total_products"
        icon="fa-cubes"
        color="sky"
      />
      <StatCard
        title="Pending Orders"
        :value="dashboard.data.pending_orders"
        icon="fa-clock-o"
        color="rose"
      />
    </div>

    <!-- Error -->
    <div v-else class="text-center text-red-500">
      Failed to load dashboard
    </div>

    <!-- Chart Controls -->
    <div class="flex flex-wrap items-center gap-2 text-xs mt-4">

      <!-- Chart Type -->
      <button
        @click="chartType = 'bar'"
        class="w-10 h-8 flex items-center justify-center rounded-lg transition-all"
        :class="chartType === 'bar'
          ? 'bg-slate-800 text-white shadow-md'
          : 'bg-slate-200 text-slate-600'"
        title="Bar Chart"
      >
        <i class="fa fa-bar-chart"></i>
      </button>

      <button
        @click="chartType = 'line'"
        class="w-10 h-8 flex items-center justify-center rounded-lg transition-all"
        :class="chartType === 'line'
          ? 'bg-slate-800 text-white shadow-md'
          : 'bg-slate-200 text-slate-600'"
        title="Line Chart"
      >
        <i class="fa fa-line-chart"></i>
      </button>

      <!-- Divider -->
      <span class="mx-2 text-slate-400">|</span>

      <!-- Period -->
      <button
        @click="period = 'month'"
        class="px-3 py-1 rounded-lg font-semibold"
        :class="period === 'month'
          ? 'bg-indigo-600 text-white'
          : 'bg-slate-200 text-slate-600'"
      >
        Monthly
      </button>

      <button
        @click="period = 'week'"
        class="px-3 py-1 rounded-lg font-semibold"
        :class="period === 'week'
          ? 'bg-indigo-600 text-white'
          : 'bg-slate-200 text-slate-600'"
      >
        Weekly
      </button>

    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

      <!-- Sales -->
      <div class="bg-white rounded-2xl p-4 h-64 shadow-sm">
        <h3 class="text-sm font-semibold text-slate-600 mb-2">
          Sales (RM)
        </h3>

        <MetricChart
          :type="chartType"
          :labels="salesLabels"
          :data="salesData"
          label="Sales"
          color="#10b981" 
        />
      </div>

      <!-- Profit -->
      <div class="bg-white rounded-2xl p-4 h-64 shadow-sm">
        <h3 class="text-sm font-semibold text-slate-600 mb-2">
          Profit (RM)
        </h3>

        <MetricChart
          :type="chartType"
          :labels="profitLabels"
          :data="profitData"
          label="Profit"
          color="#f59e0b"
        />
      </div>

    </div>

  </div>
</template>


<script setup>
import { onMounted, ref, computed } from "vue";
import { useDashboardStore } from "../stores/dashboard.store";
import StatCard from "../components/StatCard.vue";
import MetricChart from "../components/MetricChart.vue";

const dashboard = useDashboardStore();

const chartType = ref("bar");     // bar | line
const period = ref("month");      // month | week

onMounted(() => {
  dashboard.fetch();
});

const salesSource = computed(() =>
  period.value === "week"
    ? dashboard.data?.sales_per_week
    : dashboard.data?.sales_per_month
);

const profitSource = computed(() =>
  period.value === "week"
    ? dashboard.data?.profit_per_week
    : dashboard.data?.profit_per_month
);

const salesLabels = computed(() => salesSource.value?.map(i => i.month) || []);
const salesData   = computed(() => salesSource.value?.map(i => i.total) || []);

const profitLabels = computed(() => profitSource.value?.map(i => i.month) || []);
const profitData   = computed(() => profitSource.value?.map(i => i.total) || []);
</script>

