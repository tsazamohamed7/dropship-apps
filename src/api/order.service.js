import { apiGet, apiPost } from "./http";

export const OrderService = {
  getAll() {
    return apiGet({
      resource: "order"
    });
  },

  getById(id) {
    return apiGet({
      resource: "order",
      id
    });
  },

  create(data) {
    return apiPost({
      resource: "order",
      method: "POST",
      ...data
    });
  },

  // ✅ FIXED: Dedicated PAY endpoint
  pay({ order_id }) {
    return apiPost({
      resource: "order",
      method: "PAY",
      order_id
    });
  },

  deliver({ order_id }) {
    return apiPost({
      resource: "order",
      method: "DELIVER",
      order_id
    });
  },

  cancel(orderId) {
    return apiPost({
      resource: "order",
      method: "DELETE",
      order_id: orderId
    });
  },


  // Used only for full edits (items, customer, etc.)
  update(payload) {
    return apiPost({
      resource: "order",
      method: "PUT",
      ...payload
    });
  }
};
