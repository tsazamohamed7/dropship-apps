<template>
  <div v-if="open" class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm" @click="close">
    <div
      class="absolute bottom-0 w-full bg-white rounded-t-3xl p-5 pb-24 space-y-4 shadow-2xl"
      @click.stop
    >
      <div class="flex justify-between items-center border-b pb-2">
        <h3 class="text-lg font-bold text-slate-800">{{ product ? 'Edit Product' : 'Add Product' }}</h3>
      </div>

      <div class="space-y-4">
        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-slate-500 uppercase ml-1">Product Name</label>
          <input
            v-model="form.name"
            class="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Mineral Water"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-500 uppercase ml-1">Sale Price (RM)</label>
            <input
              v-model.number="form.sell_price"
              type="number"
              class="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-500 uppercase ml-1">Cost Price (RM)</label>
            <input
              v-model.number="form.cost_price"
              type="number"
              class="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-500 uppercase ml-1">Current Stock</label>
            <input
              v-model.number="form.stock"
              type="number"
              class="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-500 uppercase ml-1">Source (SKU)</label>
            <input
              v-model="form.sku"
              class="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="sku code"
            />
          </div>
        </div>
      </div>

      <div class="flex gap-3 pt-4">
        <button
          class="flex-1 bg-slate-100 text-slate-600 font-bold rounded-xl py-3 active:scale-95 transition-all"
          @click="close"
        >
          Cancel
        </button>

        <button
          class="flex-1 bg-slate-800 text-white font-bold rounded-xl py-3 shadow-lg active:scale-95 transition-all"
          @click="save"
        >
          Save Changes
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  open: Boolean,
  product: Object
});

const emit = defineEmits(["close", "save"]);

const form = reactive({
  product_id: "",
  name: "",
  sku: "",
  sell_price: 0,
  cost_price: 0,
  stock: 0
});

watch(
  () => props.open, // Watch when the sheet opens
  (isOpen) => {
    if (isOpen) {
      if (props.product) {
        // If editing: fill with product data
        Object.assign(form, props.product);
      } else {
        // If adding: clear the form
        Object.assign(form, {
          product_id: "",
          name: "",
          sku: "",
          sell_price: 0,
          cost_price: 0,
          stock: 0
        });
      }
    }
  }
);

function close() {
  emit("close");
}

function save() {
  emit("save", { ...form });
}
</script>
