import { createRouter, createWebHistory } from "vue-router"
import type { RouteRecordRaw } from "vue-router"

import { basicRoutes, NOT_FOUND_ROUTE } from "./routes"
import type { App } from "vue"
import { setupRouterGuard } from "./guard"
import { useUserStore } from "@/stores/user"
import { usePermissionStore } from "@/stores/permission"
import useTokenStore from "@/stores/token"
import { isNullOrWhitespace } from "@/utils/common/is"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: basicRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

export async function setupRouter(app: App) {
  await addDynamicRoutes()
  setupRouterGuard(router)
  app.use(router)
}

/**
 * 添加动态路由
 * 根据用户权限动态添加路由配置
 */
export async function addDynamicRoutes() {
  const token = useTokenStore().token
  // 没有token时不加载动态路由
  if (isNullOrWhitespace(token)) {
    return
  }

  // 有token时处理动态路由
  const userStore = useUserStore()
  const permissionStore = usePermissionStore()

  try {
    // 如果没有用户信息则获取用户信息
    !userStore.userId && (await userStore.getUserInfo())
    // 生成权限路由
    const accessRoutes = await permissionStore.generateRoutes()
    // 获取用户可访问的API权限
    await permissionStore.getAccessApis()
    // 重置路由
    resetRouter()
    // 添加动态路由
    accessRoutes.forEach((route) => {
      const routeName = route.name
      if (routeName && !router.hasRoute(routeName)) {
        router.addRoute(route as unknown as RouteRecordRaw)
      }
    })
    // 添加404路由
    router.addRoute(NOT_FOUND_ROUTE)
  } catch (error) {
    console.error("error", error)
    // 发生错误时登出用户
    await userStore.logout()
  }
}

/**
 * 重置路由
 * 删除动态添加的路由
 */
export function resetRouter() {
  const permissionStore = usePermissionStore()
  permissionStore.routes.forEach((route) => {
    const name = route.name
    if (name && router.hasRoute(name)) {
      router.removeRoute(name)
    }
  })
}

export default router
