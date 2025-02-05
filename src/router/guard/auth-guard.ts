import type { RouteLocationNormalized, Router } from "vue-router"

import { addDynamicRoutes } from "@/router"
import useTokenStore from "@/stores/token"
import { isNullOrWhitespace } from "@/utils/common"

const WHITE_LIST = ["/login", "/404"]
export function createAuthGuard(router: Router) {
  router.beforeEach(async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    const token = useTokenStore().token

    /** 没有token的情况 */
    if (isNullOrWhitespace(token)) {
      if (WHITE_LIST.includes(to.path)) return true
      return "/login"
    }

    /** 有token的情况 */
    if (to.path === "/login") return "/"

    // 如果路由不存在，说明可能是动态路由还没有加载完成
    if (to.matched.length === 0) {
      try {
        // 添加动态路由
        await addDynamicRoutes()
        // 重新进行路由跳转
        return { ...to, replace: true }
      } catch (error) {
        console.error("加载动态路由失败:", error)
        return "/404"
      }
    }

    return true
  })
}
