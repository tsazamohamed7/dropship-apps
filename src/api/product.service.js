import { apiGet, apiPost } from "./http";

export const ProductService = {
  getAll(status = "ACTIVE") {
    return apiGet({
      resource: "product",
      status
    });
  },

  getById(id) {
    return apiGet({
      resource: "product",
      id
    });
  },

  create(data) {
    return apiPost({
      resource: "product",
      method: "POST",
      ...data
    });
  },

  update(payload) {
    return apiPost(payload);
  },

  delete(id) {
    return apiPost({
      resource: "product",
      method: "DELETE",
      product_id: id
    });
  }
};
