<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from "vue";
import { 
  Chart, LineController, BarController, LineElement, BarElement, 
  PointElement, LinearScale, CategoryScale, Tooltip, Filler 
} from "chart.js";

// Register Filler for the area under the line
Chart.register(
  LineController, BarController, LineElement, BarElement, 
  PointElement, LinearScale, CategoryScale, Tooltip, Filler
);

const props = defineProps({
  type: { type: String, default: "bar" },
  labels: { type: Array, required: true },
  data: { type: Array, required: true },
  label: { type: String, required: true },
  color: { type: String, default: "#3b82f6" } // Default Blue
});

const canvas = ref(null);
let chart = null;

function render() {
  if (!canvas.value) return;
  if (chart) chart.destroy();

  const ctx = canvas.value.getContext('2d');
  
  // Create a beautiful gradient for line charts
  const gradient = ctx.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, `${props.color}44`); // Start with transparency
  gradient.addColorStop(1, `${props.color}00`); // Fade to invisible

  chart = new Chart(ctx, {
    type: props.type,
    data: {
      labels: props.labels,
      datasets: [{
        label: props.label,
        data: props.data,
        // Visual Styling
        borderColor: props.color,
        backgroundColor: props.type === 'line' ? gradient : `${props.color}cc`,
        fill: true, // Needed for line gradient
        borderWidth: 3,
        pointBackgroundColor: props.color,
        pointRadius: props.type === 'line' ? 4 : 0,
        pointHoverRadius: 6,
        borderRadius: props.type === "bar" ? 8 : 0,
        tension: 0.4, // Smooth curves
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1e293b',
          padding: 12,
          cornerRadius: 12,
          displayColors: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#f1f5f9' },
          border: { display: false },
          ticks: { color: '#94a3b8', font: { size: 10 } }
        },
        x: {
          grid: { display: false },
          border: { display: false },
          ticks: { color: '#94a3b8', font: { size: 10 } }
        }
      }
    }
  });
}

onMounted(render);
watch(() => [props.type, props.labels, props.data, props.color], render, { deep: true });

onBeforeUnmount(() => {
  if (chart) chart.destroy();
});
</script>