import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "Admin",
      meta: { role: "admin" },
      component: () => import("../views/AdminView.vue"),
    },
    {
      path: "/dsp",
      name: "Display",
      meta: { role: "display" },
      component: () => import("../views/DisplayView.vue"),
    },
  ],
});
