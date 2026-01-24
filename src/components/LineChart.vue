<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from "chart.js";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

const props = defineProps({
  labels: { type: Array, required: true },
  data: { type: Array, required: true },
  label: { type: String, required: true }
});

const canvas = ref(null);
let chart = null;

function render() {
  if (!canvas.value) return;

  if (chart) chart.destroy();

  chart = new Chart(canvas.value, {
    type: "line",
    data: {
      labels: props.labels,
      datasets: [
        {
          label: props.label,
          data: props.data,
          fill: false,
          tension: 0.35
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

onMounted(render);
watch(() => [props.labels, props.data], render, { deep: true });

onBeforeUnmount(() => {
  if (chart) chart.destroy();
});
</script>
