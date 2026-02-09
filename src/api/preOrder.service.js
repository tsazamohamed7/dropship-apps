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

  create(data) {
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

  delete(preorder_id) {
    return apiPost({
      resource: "preorder",
      method: "DELETE",
      preorder_id
    });
  },

  // =========================
  // Pre-Order Customer Items
  // =========================

  addItem(data) {
    return apiPost({
      resource: "preorder",
      method: "ADD_ITEM",
      ...data
    });
  },

  deleteItem(preorder_item_id) {
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

  receive(preorder_id) {
    return apiPost({
      resource: "preorder",
      method: "RECEIVE",
      preorder_id
    });
  }
};
