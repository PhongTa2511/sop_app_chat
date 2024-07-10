import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", redirect: "/trang-chu" },
    {
      path: "/",
      component: () => import("../layouts/default.vue"),
      children: [
        {
          path: "trang-chu",
          component: () => import("../pages/dashboard.vue"),
        },
        {
          path: "tai-khoan",
          component: () => import("../pages/account-settings.vue"),
        },
        // {
        //   path: "khu-vuc",
        //   component: () => import("../pages/typography.vue"),
        // },
        // {
        //   path: "thiet-bi",
        //   component: () => import("../pages/icons.vue"),
        // },
        {
          path: "cai-dat",
          component: () => import("../pages/cards.vue"),
        },
        {
          path: "quan-tri-he-thong",
          component: () => import("../pages/manager-system.vue"),
        },
        {
          path: "checkin",
          component: () => import("@/views/pages/checkin/index.vue"),
        },
      ],
    },
    {
      path: "/",
      component: () => import("../layouts/blank.vue"),
      children: [
        {
          path: "dang-nhap",
          component: () => import("../pages/login.vue"),
        },
        {
          path: "dang-ky",
          component: () => import("../pages/register.vue"),
        },
        {
          path: "/:pathMatch(.*)*",
          component: () => import("../pages/[...all].vue"),
        },
      ],
    },
  ],
});

export default router;
