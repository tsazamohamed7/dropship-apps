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

    async fetchOrderDetails(orderId) {
      const order = this.items.find(o => o.order_id === orderId);
      if (!order) return;

      order._loadingItems = true;
      try {
        const res = await OrderService.getById(orderId);
        if (res.data && res.data.items) {
          // Update the specific order in the list with its items
          order.items = res.data.items;
          // Sync other details just in case they changed
          order.total_amount = res.data.total_amount;
          order.payment_status = res.data.payment_status;
          order.delivery_status = res.data.delivery_status;
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        order._loadingItems = false;
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
