import type { Router } from "vue-router"
import { createAuthGuard } from "./auth-guard"
import { createPageLoadingGuard } from "./page-loading-guard"

export function setupRouterGuard(router: Router) {
  createAuthGuard(router)
  createPageLoadingGuard(router)
}
