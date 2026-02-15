// src/stores/preOrder.store.js
import { defineStore } from "pinia";
import { PreOrderService } from "../api/preOrder.service";
import { useToastStore } from "./toast.store";
import { useOrderStore } from "../stores/order.store";

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
          id: p.preorder_product_id,
          customers: p.customers || [],
          _expanded: false,
          _showActions: false
        }));
      } finally {
        this.loading = false;
      }
    },

    async fetchPreOrderDetails(preOrderId) {
      const preOrder = this.items.find(p => p.preorder_product_id === preOrderId);
      if (!preOrder) return;

      preOrder._loadingItems = true;

      try {
        const res = await PreOrderService.getById(preOrderId);

        if (res.data) {
          preOrder.customers = (res.data.items || []).map(item => ({
            id: item.preorder_item_id,
            name: item.customer_name,
            phone: item.phone,
            qty: item.qty
          }));

          preOrder.status = res.data.status;
        }
      } catch (e) {
        console.error("Fetch pre-order details failed", e);
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

    async addCustomer(payload) {
      const toast = useToastStore();

      const { pre_order_id } = payload;
      const preOrder = this.items.find(p => p.id === pre_order_id);

      //if (!preOrder || preOrder.status !== "OPEN") {
      //  toast.error("Pre-order is not editable");
      //  return;
      //}

      await PreOrderService.addCustomer(payload);

      // safest refresh (customers + qty sync)
      await this.fetchPreOrderDetails(pre_order_id);

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

    async deletePreOrder(preOrderProductId) {
      const toast = useToastStore();

      const preOrder = this.items.find(
        p => p.preorder_product_id === preOrderProductId
      );

      if (!preOrder) return;

      if (
        preOrder.status !== "OPEN" ||
        (preOrder.customers && preOrder.customers.length > 0)
      ) {
        toast.error("Cannot delete pre-order with customers");
        return;
      }

      // --- Start of Error Handling ---
      try {
        // 1. Wait for the server to confirm deletion
        await PreOrderService.deleteProduct(preOrderProductId);

        // 2. Only if the line above succeeds, update the local state
        this.items = this.items.filter(
          p => p.preorder_product_id !== preOrderProductId
        );

        // 3. Show the success message
        toast.success("Pre-order deleted");
    
      } catch (error) {
        // 4. If the server returns 400, 500, etc., this code runs instead:
        //console.error("Delete failed:", error);
        toast.error(error.message || "Failed to delete, please try again!");
      }
    },


    async updatePreOrder(payload) {
      const toast = useToastStore();

      try {
        toast.info("Updating pre-order...");
        await PreOrderService.update(payload);

        // Refresh list so UI reflects latest data
        await this.fetchPreOrders();

        toast.success("Pre-order updated");
      } catch (e) {
        toast.error("Failed to update pre-order");
        throw e;
      }
    },


    // ------------------------
    // STATUS TRANSITIONS
    // ------------------------
    async finalize(preOrder) {
      const toast = useToastStore();

      const res = await PreOrderService.finalize(preOrder.preorder_product_id);

      preOrder.status = "FINALIZED";
      toast.success("Pre-order finalized");

      return res.data; // 👈 IMPORTANT
    },

    async received(preOrder) {
      const toast = useToastStore();
      const orderStore = useOrderStore();

      try {
        await PreOrderService.received(preOrder.preorder_product_id, preOrder.product_id);

        // 🔥 Always refetch from backend now
        await this.fetchPreOrders();
        await orderStore.fetchOrders();

        toast.success("Pre-order received and orders created");
      } catch (e) {
        toast.error(e?.message || "Failed to receive pre-order");
      }
    }
  }
});
