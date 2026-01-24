import { defineStore } from "pinia";
import { DashboardService } from "../api/dashboard.service";

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
  loading: false,
  data: {
    total_sales: 0,
    total_profit: 0,
    total_products: 0,
    pending_orders: 0,
    sales_per_month: [],
    profit_per_month: []
  }
}),

  actions: {
    async fetch() {
      this.loading = true;
      const res = await DashboardService.get();
      this.data = res.data;
      this.loading = false;
    }
  }
});
