import type { RouteLocationNormalized, Router } from "vue-router"

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
    return true
  })
}
