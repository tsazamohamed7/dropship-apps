import { createRouter, createWebHashHistory } from "vue-router";
import MainLayout from "../layouts/MainLayout.vue";

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "dashboard",
          component: () => import("../views/Dashboard.vue"),
          meta: { title: "Dashboard" }
        },
        {
          path: "products",
          component: () => import("../views/ProductList.vue"),
          meta: { title: "Products" }
        },
        {
          path: "orders",
          component: () => import("../views/OrderList.vue"),
          meta: { title: "Orders" }
        },
        { path: "", redirect: "/dashboard" }
      ]
    }
  ]
});
