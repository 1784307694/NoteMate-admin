export const basicRoutes = [
  {
    path: "/",
    redirect: "/workbench",
    component: () => import("@/layout/index.vue"),
    children: [
      {
        path: "/workbench",
        name: "workbench",
        component: () => import("@/views/workbench/index.vue"),
        meta: {
          title: "工作台",
          icon: "icon-park-outline:workbench",
          affix: true,
        },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/error-page/404.vue"),
  },
]
