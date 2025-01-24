import { defineStore } from "pinia"
import type { RouteRecordRaw } from "vue-router"
import { basicRoutes, vueModules } from "@/router/routes"
import Layout from "@/layout/index.vue"
import api from "@/api"
import { shallowRef, type Component } from "vue"

// 定义后端返回的路由数据结构接口
interface BackendRouteData {
  name: string
  path: string
  component?: string
  is_hidden: boolean
  redirect?: string
  icon?: string
  order?: number
  keepalive?: boolean
  children?: BackendRouteData[]
}

// 定义前端路由元数据接口
interface RouteMeta {
  title: string
  icon?: string
  order?: number
  keepAlive?: boolean
}

// 扩展前端路由类型
interface AppRouteRecordRaw extends Omit<RouteRecordRaw, "meta" | "children"> {
  name: string
  component: Component | (() => Promise<Component>)
  isHidden?: boolean
  meta: RouteMeta
  children?: AppRouteRecordRaw[]
}

// 定义 vueModules 类型
type VueModules = Record<string, () => Promise<Component>>

// 类型断言确保 vueModules 的正确类型
const modules = vueModules as VueModules

// * 后端路由相关函数
// 根据后端传来数据构建出前端路由
function buildRoutes(routes: BackendRouteData[] = []): AppRouteRecordRaw[] {
  return routes.map((e): AppRouteRecordRaw => {
    const route: AppRouteRecordRaw = {
      name: e.name,
      path: e.path,
      component: shallowRef(Layout),
      isHidden: e.is_hidden,
      redirect: e.redirect,
      meta: {
        title: e.name,
        icon: e.icon,
        order: e.order,
        keepAlive: e.keepalive,
      },
      children: [],
    }

    if (e.children && e.children.length > 0) {
      // 处理子路由
      route.children = e.children.map(
        (e_child): AppRouteRecordRaw => ({
          name: e_child.name,
          path: e_child.path,
          component: modules[`/src/views${e_child.component}/index.vue`],
          isHidden: e_child.is_hidden,
          meta: {
            title: e_child.name,
            icon: e_child.icon,
            order: e_child.order,
            keepAlive: e_child.keepalive,
          },
        }),
      )
    } else if (e.component) {
      // 处理无子路由的情况
      route.children = [
        {
          name: `${e.name}Default`,
          path: "",
          component: modules[`/src/views${e.component}/index.vue`],
          isHidden: true,
          meta: {
            title: e.name,
            icon: e.icon,
            order: e.order,
            keepAlive: e.keepalive,
          },
        },
      ]
    }

    return route
  })
}

interface PermissionState {
  accessRoutes: AppRouteRecordRaw[]
  accessApis: string[]
}

export const usePermissionStore = defineStore("permission", {
  state: (): PermissionState => ({
    accessRoutes: [],
    accessApis: [],
  }),
  getters: {
    routes(): AppRouteRecordRaw[] {
      return [...(basicRoutes as unknown as AppRouteRecordRaw[]), ...this.accessRoutes]
    },
    menus(): AppRouteRecordRaw[] {
      return this.routes.filter((route) => route.name && !route.isHidden)
    },
    apis(): string[] {
      return this.accessApis
    },
  },
  actions: {
    async generateRoutes() {
      try {
        const res = await api.base.getUserMenu()
        this.accessRoutes = buildRoutes(res.data)
        return this.accessRoutes
      } catch (error) {
        console.error("获取菜单失败:", error)
        return []
      }
    },
    async getAccessApis() {
      try {
        const res = await api.base.getUserApi()
        this.accessApis = res.data
        return this.accessApis
      } catch (error) {
        console.error("获取API权限失败:", error)
        return []
      }
    },
    resetPermission() {
      this.$reset()
    },
  },
})
