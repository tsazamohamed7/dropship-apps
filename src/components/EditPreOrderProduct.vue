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

        <!-- Product Dropdown -->
        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold text-slate-500 uppercase ml-1">
            Product
          </label>

          <select
            v-model="selectedProductId"
            class="w-full border border-slate-200 rounded-xl p-3
                   focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="">-- Create New Product --</option>
            <option
              v-for="p in productOptions"
              :key="p.product_id"
              :value="p.product_id"
            >
              {{ p.name }}
            </option>
          </select>
        </div>

        <!-- New Product Name (Only when not selecting existing) -->
        <div v-if="!selectedProductId" class="flex flex-col gap-1">
          <label class="text-xs font-bold text-slate-500 uppercase ml-1">
            New Product Name
          </label>

          <input
            v-model="form.name"
            class="w-full border border-slate-200 rounded-xl p-3
                   focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="e.g. Kuih Muih"
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
import { reactive, watch, computed, ref, onMounted, nextTick } from "vue";
import { useProductStore } from "../stores/product.store";

const productStore = useProductStore();

const selectedProductId = ref("");
const isInitializing = ref(false);

onMounted(async () => {
  await productStore.fetchSimpleProducts(); // only product_id + name
});

const productOptions = computed(() => productStore.simpleItems);

const props = defineProps({
  open: Boolean,
  preOrder: Object
});

const emit = defineEmits(["close", "save"]);

const form = reactive({
  preorder_id: "",
  product_id: "",
  name: "",
  sku: "",
  last_open_date: "",
  expected_receive_date: "",
  status: "OPEN"
});

const isOpen = computed(() => form.status === "OPEN");


/* ------------------------------------------
   Watch modal open (Add / Edit mode)
------------------------------------------ */
watch(
  () => props.open,
  (isOpen) => {
    if (!isOpen) return;

    isInitializing.value = true;

    if (props.preOrder) {
      const data = { ...props.preOrder };

      const formatToInputDate = (isoString) => {
        if (!isoString) return "";
        return isoString.split("T")[0];
      };

      data.last_open_date = formatToInputDate(data.last_open_date);
      data.expected_receive_date = formatToInputDate(data.expected_receive_date);

      Object.assign(form, data);

      selectedProductId.value = data.product_id || "";
    } else {
      Object.assign(form, {
        preorder_id: "",
        product_id: "",
        name: "",
        sku: "",
        last_open_date: "",
        expected_receive_date: "",
        status: "OPEN"
      });

      selectedProductId.value = "";
    }

    nextTick(() => {
      isInitializing.value = false;
    });
  },
  { immediate: true } 
);

/* ------------------------------------------
   Watch dropdown selection
------------------------------------------ */
watch(selectedProductId, (val) => {

  if (isInitializing.value) return;

  // ----------------------------
  // Existing product selected
  // ----------------------------
  if (val) {
    const selected = productOptions.value.find(
      p => p.product_id === val
    );

    if (!selected) return;

    form.product_id = selected.product_id;
    form.name = selected.name;
    form.sku = selected.sku;
    return;
  }
});


function close() {
  emit("close");
}

/* ------------------------------------------
   Save Logic
------------------------------------------ */
function save() {
  emit("save", {
    ...form,
    isNewProduct: !selectedProductId.value
  });
}
</script>
