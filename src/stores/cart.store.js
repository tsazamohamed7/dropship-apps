import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  state: () => ({
    open: false,
    items: []
  }),

  getters: {
    totalQty: state =>
      state.items.reduce((sum, i) => sum + i.qty, 0),

    totalAmount: state =>
      state.items.reduce((sum, i) => sum + i.qty * i.sell_price, 0)
  },

  actions: {
    toggle() {
      this.open = !this.open;
    },

    add(product) {
      const item = this.items.find(i => i.product_id === product.product_id);
      if (item) item.qty++;
      else this.items.push({ ...product, qty: 1 });
    },

    remove(productId) {
      this.items = this.items.filter(i => i.product_id !== productId);
    },

    clear() {
      this.items = [];
    }
  }
});
