import { type Router } from "vue-router"
import { createVNode, render } from "vue"
import LoadingComponent from "@/components/loading/index.vue"

export function createPageLoadingGuard(router: Router) {
  let loadingContainer: HTMLElement | null = null
  let minLoadingTime = 400 // 最小加载时间
  let loadingStartTime = 0 // 记录加载开始时间

  const showLoading = () => {
    // 创建容器
    loadingContainer = document.createElement("div")
    loadingContainer.className = "global-loading-container"

    // 创建loading组件的VNode
    const loadingVNode = createVNode(LoadingComponent)

    // 渲染到容器
    render(loadingVNode, loadingContainer)

    // 添加到body
    document.body.appendChild(loadingContainer)

    // 记录开始时间
    loadingStartTime = Date.now()
  }

  const hideLoading = () => {
    if (loadingContainer) {
      const elapsedTime = Date.now() - loadingStartTime
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime)

      setTimeout(() => {
        if (loadingContainer) {
          render(null, loadingContainer)
          loadingContainer.remove()
          loadingContainer = null
        }
      }, remainingTime)
    }
  }

  router.beforeEach((to, from, next) => {
    // 只有在路由真正变化时才显示loading
    if (to.path !== from.path) {
      showLoading()
    }
    next()
  })

  router.afterEach(() => {
    hideLoading()
  })

  router.onError(() => {
    hideLoading()
  })
}
