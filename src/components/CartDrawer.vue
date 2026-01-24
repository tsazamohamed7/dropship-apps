<template>
  <div
    v-if="cart.open"
    class="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
    @click="cart.toggle"
  >
    <div
      class="absolute bottom-0 w-full bg-white rounded-t-3xl p-4 shadow-xl"
      @click.stop
    >
      <h3 class="text-lg font-semibold mb-3">Cart</h3>

      <div
        v-for="i in cart.items"
        :key="i.product_id"
        class="flex items-center justify-between py-2 border-b text-sm"
      >
        <div>
          <div class="font-medium">{{ i.name }}</div>
          <div class="text-slate-500 text-xs">
            RM {{ i.sell_price }} × {{ i.qty }}
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="w-7 h-7 rounded-full bg-slate-100"
            @click="decrease(i)"
          >
            −
          </button>

          <span class="w-5 text-center">{{ i.qty }}</span>

          <button
            class="w-7 h-7 rounded-full bg-slate-100"
            @click="increase(i)"
          >
            +
          </button>
        </div>
      </div>


      <div class="flex justify-between font-bold mt-4">
        <span>Total</span>
        <span>RM {{ Number(cart.totalAmount).toFixed(2) }}</span> 
      </div>

      <button
        class="mt-4 w-full bg-orange-500 text-white py-3 rounded-xl disabled:opacity-50"
        :disabled="!cart.totalQty"
        @click="showCheckout = true"
      >
        Checkout
      </button>

    </div>
  </div>

  <CheckoutSheet
  :open="showCheckout"
  @close="showCheckout = false"
  @confirm="placeOrder"
  />

</template>

<script setup>
import { ref } from "vue";
import { useCartStore } from "../stores/cart.store";
import { useOrderStore } from "../stores/order.store";
import { useToastStore } from "../stores/toast.store";
import CheckoutSheet from "./CheckoutSheet.vue";

const cart = useCartStore();
const orderStore = useOrderStore();
const toast = useToastStore();

const showCheckout = ref(false);

async function placeOrder(customer) {
  // 1. Close UI Immediately for a "snappy" feel
  showCheckout.value = false;
  if (cart.open) cart.toggle();

  // 2. Show Processing Toast
  toast.info("Processing order...");

  try {
    // 3. Start Backend Request
    await orderStore.createOrder({
      customer_name: customer.customer_name,
      phone: customer.phone,
      items: cart.items.map(i => ({
        product_id: i.product_id,
        qty: i.qty,
        price: i.sell_price
      }))
    });

    // 4. Success: Clear cart and update Toast
    cart.clear();
    toast.success("Order created!");
    
  } catch (error) {
    // 5. Error: Alert the user
    toast.error("Failed to create order");
    // Note: You might want to keep the cart items if it fails
  }
}


function increase(item) {
  if (item.qty >= item.stock) return;
  item.qty++;
}

function decrease(item) {
  if (item.qty === 1) cart.remove(item.product_id);
  else item.qty--;
}

</script>
