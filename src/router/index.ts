import { createRouter, createWebHistory } from "vue-router"

import { basicRoutes } from "./routers"
import type { App } from "vue"
import { setupRouterGuard } from "./guard"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: basicRoutes,
})

export function setupRouter(app: App) {
  setupRouterGuard(router)
  app.use(router)
}
