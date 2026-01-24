import { defineStore } from "pinia";
import { OrderService } from "../api/order.service";
import { useToastStore } from "./toast.store";

export const useOrderStore = defineStore("order", {
  state: () => ({
    items: [],
    loading: false
  }),

  actions: {
    async fetchOrders() {
      this.loading = true;
      try {
        const res = await OrderService.getAll();
        this.items = res.data || [];
      } finally {
        this.loading = false;
      }
    },

    async createOrder(data) {
      const toast = useToastStore();

      await OrderService.create(data);

      toast.success("Order created");
      await this.fetchOrders(); // refresh list
    },

    async markPaid(order) {
      const toast = useToastStore();

      await OrderService.pay({
        order_id: order.order_id
      });

      // ✅ optimistic UI update
      order.payment_status = "PAID";
      toast.success("Order marked as PAID");
    },

    async markDelivered(order) {
      const toast = useToastStore();

      await OrderService.deliver({ 
        order_id: order.order_id 
      });

      order.delivery_status = "DELIVERED";
      toast.success("Order delivered");
    },

    async cancel(order) {
      const toast = useToastStore();

      await OrderService.cancel(order.order_id);

      // optimistic UI remove
      this.items = this.items.filter(
        o => o.order_id !== order.order_id
      );

      toast.success("Order cancelled");
    }

  }
});
