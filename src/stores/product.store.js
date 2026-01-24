import { defineStore } from "pinia";
import { ProductService } from "../api/product.service";
import { useToastStore } from "./toast.store";


export const useProductStore = defineStore("product", {
  state: () => ({
    items: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchProducts(status = "ACTIVE") {
      this.loading = true;
      this.error = null;

      try {
        const res = await ProductService.getAll(status);
        this.items = res.data || [];
      } catch (err) {
        this.error = err.message || "Failed to load products";
      } finally {
        this.loading = false;
      }
    },

    async addProduct(data) {
      const toast = useToastStore();
      toast.info("Adding product..."); 
      await ProductService.create(data);
      await this.fetchProducts();
    },

    async updateProduct(updated) {
      const toast = useToastStore();

      const index = this.items.findIndex(
        p => p.product_id === updated.product_id
      );

      if (index === -1) return;

      const backup = { ...this.items[index] };

      // ✅ optimistic UI update
      this.items[index] = { ...updated };

      try {
        const payload = {
          resource: "product",
          method: "PUT",
          product_id: updated.product_id, // ✅ STRING ONLY
          name: updated.name,
          sku: updated.sku,
          sell_price: updated.sell_price,
          cost_price: updated.cost_price,
          stock: updated.stock,
          status: updated.status
        };

        await ProductService.update(payload);
        toast.success("Product updated");
      } catch (e) {
        // 🔙 rollback on failure
        this.items[index] = backup;
        console.error("Update product failed", e);
        toast.error("Failed to update product");
      }
    },

    async deleteProduct(id) {
      await ProductService.delete(id);
      await this.fetchProducts();
    }
  }
});
