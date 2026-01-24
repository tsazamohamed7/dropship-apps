<template>
  <div
    v-if="open"
    class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
    @click="close"
  >
    <div
      class="absolute bottom-0 w-full bg-white rounded-t-3xl p-4 space-y-4"
      @click.stop
    >
      <h3 class="text-lg font-semibold">Customer Info</h3>

      <input
        v-model="form.customer_name"
        class="w-full border rounded-xl p-3"
        placeholder="Customer name"
      />

      <input
        v-model="form.phone"
        class="w-full border rounded-xl p-3"
        placeholder="Phone number"
      />

      <div class="flex gap-3 pt-2">
        <button
          v-if="!isSubmitting"
          class="flex-1 bg-slate-100 rounded-xl py-3"
          @click="close"
        >
          Cancel
        </button>

        <button
          class="flex-1 bg-amber-400 text-white rounded-xl py-3 flex items-center justify-center gap-2 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
          @click="handleConfirm"
          :disabled="!form.customer_name || isSubmitting"
        >
          <template v-if="isSubmitting">
            <i class="fa fa-circle-o-notch animate-spin"></i>
            <span>Adding Order...</span>
          </template>

          <template v-else>
            Confirm Order
          </template>
        </button>

      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";

const props = defineProps({
  open: Boolean
});

const emit = defineEmits(["close", "confirm"]);

const isSubmitting = ref(false); // Track the loading state

const form = reactive({
  customer_name: "",
  phone: ""
});

function close() {
  emit("close");
}

async function handleConfirm() {
  if (!form.customer_name) return;

  // Emit the data to parent (CartDrawer)
  emit("confirm", { ...form });

  // Reset form for next time
  form.customer_name = "";
  form.phone = "";
  
  // Close the sheet immediately
  close();
}
</script>
