import type { RouteRecordRaw } from "vue-router"
import Layout from "@/layout/index.vue"

export const basicRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/workbench",
    component: Layout,
    children: [
      {
        path: "/workbench",
        name: "工作台",
        component: () => import("@/views/workbench/index.vue"),
        meta: {
          title: "工作台",
          icon: "Monitor",
          affix: true,
        },
      },
      {
        path: "/profile",
        name: "个人中心",
        component: () => import("@/views/profile/index.vue"),
        meta: {
          title: "个人中心",
        },
      },
    ],
  },
  {
    path: "/login",
    name: "login",
    component: () => import("@/views/login/index.vue"),
  },
]

export const NOT_FOUND_ROUTE: RouteRecordRaw = {
  name: "NotFound",
  path: "/:pathMatch(.*)*",
  component: () => import("@/views/error-page/404.vue"),
}

// 动态导入视图组件
const modules = import.meta.glob("@/views/**/index.vue")
export const vueModules: Record<string, () => Promise<any>> = modules
