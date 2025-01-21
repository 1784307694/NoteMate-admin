import type { Router } from "vue-router"
import { createAuthGuard } from "./auth-guard"

export function setupRouterGuard(router: Router) {
  createAuthGuard(router)
}
