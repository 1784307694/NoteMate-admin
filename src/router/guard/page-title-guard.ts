import { type Router } from "vue-router"

export function createPageTitleGuard(router: Router) {
  const baseTitle = "NoteMate"

  router.beforeEach((to) => {
    const title = to.meta.title
    if (title) {
      document.title = `${title} | ${baseTitle}`
    } else {
      document.title = baseTitle
    }
  })
}
