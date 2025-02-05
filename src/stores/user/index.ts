import { defineStore } from "pinia"
import api from "@/api"
import useTokenStore from "@/stores/token"
import { lStorage } from "@/utils/storage"

type UserInfo = {
  id: string
  username: string
  email: string
  avatar: string
  roles: number[]
  is_superuser: boolean
  is_active: boolean
}

export const useUserStore = defineStore("user", {
  state() {
    return {
      userInfo: {} as UserInfo,
    }
  },
  getters: {
    userId(state) {
      return state.userInfo?.id
    },
    username(state) {
      return state.userInfo?.username
    },
    email(state) {
      return state.userInfo?.email
    },
    avatar(state) {
      return (
        state.userInfo?.avatar ||
        "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      )
    },
    role(state) {
      return state.userInfo?.roles || []
    },
    isSuperUser(state) {
      return state.userInfo?.is_superuser
    },
    isActive(state) {
      return state.userInfo?.is_active
    },
  },
  actions: {
    async getUserInfo() {
      try {
        const res = await api.base.getUserInfo()
        if (res.data.code === 401) {
          this.logout()
          return
        }
        const { id, username, email, avatar, roles, is_superuser, is_active } = res.data
        this.userInfo = { id, username, email, avatar, roles, is_superuser, is_active }
        return res.data
      } catch (error) {
        return error
      }
    },
    async logout() {
      try {
        // 重置用户信息
        this.userInfo = {} as UserInfo
        // 清除登陆逻辑
        useTokenStore().clearToken()
      } catch (error) {
        console.error("退出登录时发生错误:", error)
      }
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})

export default useUserStore
