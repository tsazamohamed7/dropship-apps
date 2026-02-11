import { apiGet, apiPost } from "./http";

export const PreOrderService = {

  // =========================
  // Pre-Order Product
  // =========================

  getAll() {
    return apiGet({
      resource: "preorder"
    });
  },

  getById(id) {
    return apiGet({
      resource: "preorder",
      id
    });
  },

  createProduct(data) {
    return apiPost({
      resource: "preorder",
      method: "POST",
      ...data
    });
  },

  update(payload) {
    return apiPost({
      resource: "preorder",
      method: "PUT",
      ...payload
    });
  },

  deleteProduct(preorder_id) {
    return apiPost({
      resource: "preorder",
      method: "DELETE",
      preorder_id
    });
  },

  // =========================
  // Pre-Order Customers
  // =========================

  /**
   * payload:
   * {
   *   pre_order_id,
   *   customer_name,
   *   phone,
   *   qty
   * }
   */
  addCustomer(payload) {
    return apiPost({
      resource: "preorder",
      method: "ADD_ITEM",
      ...payload
    });
  },

  removeCustomer(preorder_item_id) {
    return apiPost({
      resource: "preorder",
      method: "DELETE_ITEM",
      preorder_item_id
    });
  },

  // =========================
  // Lifecycle
  // =========================

  finalize(preorder_id) {
    return apiPost({
      resource: "preorder",
      method: "FINALIZE",
      preorder_id
    });
  },

  received(preorder_id) {
    return apiPost({
      resource: "preorder",
      method: "RECEIVE",
      preorder_id
    });
  }
};
