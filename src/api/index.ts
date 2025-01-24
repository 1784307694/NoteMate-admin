import { request } from "@/utils/http"

// 基础模块
const base = {
  login: (data: { username: string; password: string }) =>
    request.post("/base/access_token", { ...data, noNeedToken: true }),
  getUserInfo: () => request.get("/base/userinfo"),
  getUserMenu: () => request.get("/base/usermenu"),
  getUserApi: () => request.get("/base/userapi"),
  updatePassword: (data: { old_password: string; new_password: string }) =>
    request.post("/base/update_password", data),
  createUser: (data: {
    phone: string
    email: string
    username: string
    password: string
    is_active?: boolean
    is_superuser?: boolean
    role_ids?: number[]
  }) => request.post("/base/create", data),
}

// 用户模块
const user = {
  getList: (params: { page?: number; page_size?: number; username?: string; email?: string }) =>
    request.get("/users/list", { params }),
  getDetail: (params: { user_id: number }) => request.get("/users/get", { params }),
  update: (data: {
    id: number
    email: string
    phone: string
    username: string
    is_active?: boolean
    is_superuser?: boolean
    role_ids?: number[]
  }) => request.post("/users/update", data),
  delete: (params: { user_id: number }) => request.delete("/users/delete", { params }),
  resetPassword: (data: { user_id: number }) => request.post("/users/reset_password", data),
}

// 角色模块
const role = {
  getList: (params: { page?: number; page_size?: number; role_name?: string }) =>
    request.get("/roles/list", { params }),
  getDetail: (params: { role_id: number }) => request.get("/roles/get", { params }),
  create: (data: { name: string; desc?: string }) => request.post("/roles/create", data),
  update: (data: { id: number; name: string; desc?: string }) =>
    request.post("/roles/update", data),
  delete: (params: { role_id: number }) => request.delete("/roles/delete", { params }),
  getAuthorized: (params: { id: number }) => request.get("/roles/authorized", { params }),
  updateAuthorized: (data: { id: number; menu_ids?: number[]; api_infos?: any[] }) =>
    request.post("/roles/authorized", data),
}

// API模块
const api = {
  getList: (params: {
    page?: number
    page_size?: number
    path?: string
    summary?: string
    tags?: string
  }) => request.get("/apis/list", { params }),
  getDetail: (params: { id: number }) => request.get("/apis/get", { params }),
  create: (data: {
    path: string
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
    tags: string
    summary?: string
  }) => request.post("/apis/create", data),
  update: (data: {
    id: number
    path: string
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
    tags: string
    summary?: string
  }) => request.post("/apis/update", data),
  delete: (params: { api_id: number }) => request.delete("/apis/delete", { params }),
  refresh: () => request.post("/apis/refresh", {}),
}

// 菜单模块
const menu = {
  getList: (params: { page?: number; page_size?: number }) =>
    request.get("/menus/list", { params }),
  getDetail: (params: { menu_id: number }) => request.get("/menus/get", { params }),
  create: (data: {
    menu_type?: "catalog" | "menu"
    name: string
    icon?: string
    path: string
    order: number
    parent_id?: number
    is_hidden?: boolean
    component: string
    keepalive?: boolean
    redirect?: string
  }) => request.post("/menus/create", data),
  update: (data: {
    id: number
    menu_type: "catalog" | "menu"
    name: string
    icon?: string
    path: string
    order: number
    parent_id: number
    is_hidden?: boolean
    component: string
    keepalive?: boolean
    redirect?: string
  }) => request.post("/menus/update", data),
  delete: (params: { id: number }) => request.delete("/menus/delete", { params }),
}

// 审计日志模块
const auditLog = {
  getList: (params: {
    page?: number
    page_size?: number
    username?: string
    module?: string
    method?: string
    summary?: string
    status?: number
    start_time?: string
    end_time?: string
  }) => request.get("/auditlog/list", { params }),
}

export default {
  base,
  user,
  role,
  api,
  menu,
  auditLog,
}
