import { defineStore } from "pinia"
import api from "@/api"
import useTokenStore from "@/stores/token"
import { useRouter } from "vue-router"
import { lStorage } from "@/utils/storage"

type UserInfo = {
  id: string
  username: string
  email: string
  avatar: string
  roles: string[]
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
        const { id, username, email, avatar, roles, is_superuser, is_active } = res.data.data
        this.userInfo = { id, username, email, avatar, roles, is_superuser, is_active }
        return res.data
      } catch (error) {
        return error
      }
    },
    async logout() {
      // 清除登陆逻辑
      useTokenStore().clearToken()
      // 清除标签数据
      lStorage.remove("TABS")
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = { ...this.userInfo, ...userInfo }
    },
  },
})

export default useUserStore
