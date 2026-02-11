<template>
  <!-- BACKDROP -->
  <div
    v-if="open"
    class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
    @click="close"
  >
    <!-- BOTTOM SHEET -->
    <div
      class="absolute bottom-0 w-full bg-white rounded-t-3xl p-5 pb-24 space-y-4 shadow-2xl"
      @click.stop
    >
      <!-- HEADER -->
      <div class="flex justify-between items-center border-b pb-2">
        <h3 class="text-lg font-bold text-slate-800">
          Add Customer
        </h3>
      </div>

      <!-- FORM -->
      <div class="space-y-4">
        <!-- Customer Name -->
        <div class="flex flex-col gap-1">
          <label class="text-xs font-bold text-slate-500 uppercase ml-1">
            Customer Name
          </label>
          <input
            v-model="name"
            class="w-full border border-slate-200 rounded-xl p-3
                   focus:ring-2 focus:ring-blue-500 outline-none
                   disabled:bg-slate-100 disabled:text-slate-400"
            placeholder="e.g. John Tan"
            :disabled="!isEditable || saving"
          />
        </div>

        <div class="grid grid-cols-2 gap-4 items-end">
          <!-- Phone -->
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-500 uppercase ml-1">
              Phone Number
            </label>
            <input
              v-model="phone"
              type="tel"
              class="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-slate-100 disabled:text-slate-400"
              placeholder="e.g. 012345..."
              :disabled="!isEditable || saving"
            />
          </div>

          <!-- Quantity -->
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-slate-500 uppercase ml-1">
              Quantity
            </label>
            <div class="flex items-center justify-between bg-slate-50 p-1.5 rounded-xl border border-slate-100">
              <button
                type="button"
                class="w-9 h-9 flex items-center justify-center rounded-lg bg-white border border-slate-200 shadow-sm active:scale-90 disabled:opacity-50"
                @click="adjustQty(-1)"
                :disabled="qty <= 1 || !isEditable || saving"
              >
                <span class="text-lg font-bold text-slate-600">−</span>
              </button>

              <span class="text-lg font-black text-slate-800">
                {{ qty }}
              </span>

              <button
                type="button"
                class="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 text-white shadow-md active:scale-90 disabled:opacity-50"
                @click="adjustQty(1)"
                :disabled="!isEditable || saving"
              >
                <span class="text-lg font-bold">+</span>
              </button>
            </div>
          </div>
        </div>

        <!-- STATUS HINT -->
        <p
          v-if="!isEditable"
          class="text-xs font-bold text-slate-400 uppercase tracking-wide"
        >
          Customer can only be edited while status is OPEN
        </p>

        <!-- ERROR -->
        <p
          v-if="error"
          class="text-sm font-bold text-rose-600"
        >
          {{ error }}
        </p>
      </div>

      <!-- ACTIONS -->
      <div class="flex gap-3 pt-4">
        <button
          class="flex-1 bg-slate-100 text-slate-600 font-bold rounded-xl py-3
                 active:scale-95 transition-all"
          @click="close"
          :disabled="saving"
        >
          Cancel
        </button>

        <button
          class="flex-1 bg-slate-800 text-white font-bold rounded-xl py-3
                 shadow-lg active:scale-95 transition-all
                 disabled:bg-slate-400"
          @click="save"
          :disabled="saving || !isEditable"
        >
          {{ saving ? "Saving..." : "Save" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { usePreOrderStore } from "../stores/preOrder.store";

const props = defineProps({
  open: Boolean,
  preOrder: {
    type: Object,
    required: false,
    default: null
  }
});

const emit = defineEmits(["close", "saved"]);

const store = usePreOrderStore();

// --- Local form state
const name = ref("");
const phone = ref("");
const qty = ref(1); // 👈 Default 1
const saving = ref(false);
const error = ref(null);

// --- Editable only when OPEN
const isEditable = computed(() => props.preOrder?.status === "OPEN");

// --- Init form when preOrder changes
watch(
  () => props.preOrder,
  (val) => {
    if (!val) return;
    name.value = "";
    phone.value = "";
    qty.value = 1;
  },
  { immediate: true }
);

// --- Close handler
function close() {
  emit("close");
}

function adjustQty(amount) {
  if (!isEditable.value || saving.value) return;
  const newQty = qty.value + amount;
  if (newQty >= 1) { // 👈 Prevents going below 1
    qty.value = newQty;
  }
}

// --- Save handler
async function save() {
  if (!isEditable.value) return;

  error.value = null;
  saving.value = true;

  try {
    await store.addCustomer({
      pre_order_id: props.preOrder.id,
      name: name.value.trim(),
      phone: phone.value.trim(),
      qty: qty.value // 👈 Pass the local qty state
    });

    emit("saved");
    emit("close");
  } catch (e) {
    error.value = e?.message || "Failed to save customer";
  } finally {
    saving.value = false;
  }
}

</script>
