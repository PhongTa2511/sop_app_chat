import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // { path: "/", redirect: "/trang-chu" },
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
        {
          path: "tin-nhan",
          component: () => import("@/views/chat/index.vue"),
        },
        {
          path: "cai-dat",
          component: () => import("../pages/setting.vue"),
        },
        {
          path: "buoc/:id",
          component: () => import("@/views/procedure/stepindex.vue"),
        },
        {
          path: "form2/:id/:stepid/:workid",
          component: () => import("@/views/procedure/formindex.vue"),
        },
        {
          path: "form/:id",
          component: () => import("@/views/procedure/formindex.vue"),
        },
        {
          path: "cong-viec/:id",
          component: () => import("@/views/procedure/workindex.vue"),
        },
        {
          path: "thong-tin-cong-viec/:id",
          component: () => import("@/views/document-job/jobinfo.vue"),
        },
        {
          path: "ho-so",
          component: () => import("../pages/document.vue"),
        },
        {
          path: "danh-sach-cong-viec",
          component: () => import("../pages/document-job.vue"),
        },
        {
          path: "thong-tin/:id",
          component: () => import("@/views/document/docinfo.vue"),
        },
        {
          path: "san-pham",
          component: () => import("@/views/product/index.vue"),
        },
        {
          path: "danh-sach-khieu-nai",
          component: () => import("@/views/complaint/index.vue"),
        },
        {
          path: "danh-sach-san-pham",
          component: () => import("../pages/product.vue"),
        },
        {
          path: "cam-co",
          component: () => import("../pages/flag.vue"),
        },
        {
          path: "thong-tin-san-pham/:id",
          component: () => import("@/views/product/productInfo.vue"),
        },
        {
          path: "phat-sinh",
          component: () => import("../pages/work-arising.vue"),
        },
        {
          path: "quoc-gia",
          component: () => import("@/views/country/law.vue"),
        },
        // {
        //   path: "lich-lam-viec",
        //   component: () => import("../pages/calendar.vue"),
        // },
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
        // {
        //   path: "dang-ky",
        //   component: () => import("../pages/register.vue"),
        // },
        {
          path: "khieu-nai",
          component: () => import("../pages/complaint.vue"),
        },
        // {
        //   path: "/:pathMatch(.*)*",
        //   component: () => import("../pages/404.vue"),
        // },
        {
          path: "/404",
          component: () => import("@/pages/404.vue"),
        },
      ],
    },
  ],
});

export default router;
