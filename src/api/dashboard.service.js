import { apiGet } from "./http";

export const DashboardService = {
  get() {
    return apiGet({ resource: "dashboard" });
  }
};
