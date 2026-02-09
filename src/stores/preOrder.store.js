// src/stores/preOrder.store.js
import { defineStore } from "pinia";
import { PreOrderService } from "../api/preOrder.service";
import { useToastStore } from "./toast.store";

export const usePreOrderStore = defineStore("preOrder", {
  state: () => ({
    items: [],
    loading: false
  }),

  actions: {
    // ------------------------
    // FETCH
    // ------------------------
    async fetchPreOrders() {
      this.loading = true;
      try {
        const res = await PreOrderService.getAll();
        this.items = (res.data || []).map(p => ({
          ...p,
          customers: p.customers || [],
          _expanded: false,
          _showActions: false
        }));
      } finally {
        this.loading = false;
      }
    },

    async fetchPreOrderDetails(preOrderId) {
      const preOrder = this.items.find(p => p.id === preOrderId);
      if (!preOrder) return;

      preOrder._loadingItems = true;
      try {
        const res = await PreOrderService.getById(preOrderId);
        if (res.data) {
          preOrder.customers = res.data.customers || [];
          preOrder.status = res.data.status;
        }
      } finally {
        preOrder._loadingItems = false;
      }
    },

    // ------------------------
    // CREATE
    // ------------------------
    async createPreOrder(data) {
      const toast = useToastStore();
      toast.info("Creating pre-order...");

      await PreOrderService.createProduct(data);
      await this.fetchPreOrders();

      toast.success("Pre-order product created");
    },

    async addCustomer(preOrderId, customer) {
      const toast = useToastStore();

      const preOrder = this.items.find(p => p.id === preOrderId);
      if (!preOrder || preOrder.status !== "OPEN") return;

      await PreOrderService.addCustomer(preOrderId, customer);

      // optimistic refresh (simple & safe)
      await this.fetchPreOrders();
      toast.success("Customer added");
    },

    // ------------------------
    // DELETE
    // ------------------------
    async removeCustomer(preOrderId, customerId) {
      const toast = useToastStore();

      const preOrder = this.items.find(p => p.id === preOrderId);
      if (!preOrder || preOrder.status !== "OPEN") return;

      await PreOrderService.removeCustomer(customerId);

      preOrder.customers = preOrder.customers.filter(
        c => c.id !== customerId
      );

      toast.success("Customer removed");
    },

    async deletePreOrder(preOrderId) {
      const toast = useToastStore();

      const preOrder = this.items.find(p => p.id === preOrderId);
      if (!preOrder) return;

      if (preOrder.status !== "OPEN" || preOrder.customers.length > 0) {
        toast.error("Cannot delete this pre-order");
        return;
      }

      await PreOrderService.deleteProduct(preOrderId);

      this.items = this.items.filter(p => p.id !== preOrderId);
      toast.success("Pre-order deleted");
    },

    // ------------------------
    // STATUS TRANSITIONS
    // ------------------------
    async finalize(preOrder) {
      const toast = useToastStore();

      await PreOrderService.finalize(preOrder.id);

      // optimistic UI
      preOrder.status = "FINALIZED";
      toast.success("Pre-order finalized");
    },

    async received(preOrder) {
      const toast = useToastStore();

      await PreOrderService.received(preOrder.id);

      // optimistic UI
      preOrder.status = "RECEIVED";
      toast.success("Marked as received");
    }
  }
});
