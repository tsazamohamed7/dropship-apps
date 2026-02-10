<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
    @click="close"
  >
    <div
      class="absolute bottom-0 w-full bg-white rounded-t-3xl p-5 pb-24 space-y-4 shadow-2xl"
      @click.stop
    >
      <!-- Header -->
      <div class="flex justify-between items-center border-b pb-2">
        <h3 class="text-lg font-bold text-slate-800">
          {{ preOrder ? 'Edit Pre-Order Product' : 'Add Pre-Order Product' }}
        </h3>
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <!-- Product Name -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-slate-500 uppercase ml-1">
            Product Name
          </label>
          <input
            v-model="form.name"
            class="w-full border border-slate-200 rounded-xl p-3
                   focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. iPhone 16 Pro"
          />
        </div>

        <!-- SKU -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-slate-500 uppercase ml-1">
            SKU
          </label>
          <input
            v-model="form.sku"
            class="w-full border border-slate-200 rounded-xl p-3
                   focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="IP16-PRO-BLK"
          />
        </div>

        <!-- Dates -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-500 uppercase ml-1">
              Last Open Date
            </label>
            <input
              v-model="form.last_open_date"
              type="date"
              :disabled="!isOpen"
              class="w-full border border-slate-200 rounded-xl p-3
                     focus:ring-2 focus:ring-blue-500 outline-none
                     disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-500 uppercase ml-1">
              Expected Receive Date
            </label>
            <input
              v-model="form.expected_receive_date"
              type="date"
              :disabled="!isOpen"
              class="w-full border border-slate-200 rounded-xl p-3
                     focus:ring-2 focus:ring-blue-500 outline-none
                     disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-3 pt-4">
        <button
          class="flex-1 bg-slate-100 text-slate-600 font-bold rounded-xl py-3
                 active:scale-95 transition-all"
          @click="close"
        >
          Cancel
        </button>

        <button
          class="flex-1 bg-slate-800 text-white font-bold rounded-xl py-3
                 shadow-lg active:scale-95 transition-all"
          @click="save"
        >
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from "vue";

const props = defineProps({
  open: Boolean,
  preOrder: Object
});

const emit = defineEmits(["close", "save"]);

const form = reactive({
  preorder_id: "",
  name: "",
  sku: "",
  last_open_date: "",
  expected_receive_date: "",
  status: "OPEN"
});

const isOpen = computed(() => form.status === "OPEN");

watch(
  () => props.open,
  (isOpenSheet) => {
    if (!isOpenSheet) return;

    if (props.preOrder) {
      Object.assign(form, props.preOrder);
    } else {
      Object.assign(form, {
        preorder_id: "",
        name: "",
        sku: "",
        last_open_date: "",
        expected_receive_date: "",
        status: "OPEN"
      });
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
