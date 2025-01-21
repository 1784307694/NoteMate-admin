import { defineStore } from "pinia"
import { lStorage } from "@/utils/storage"

const useTokenStore = defineStore("token", {
  state: () => ({
    token: lStorage.get("access_token") || "",
    username: lStorage.get("username") || "",
  }),
  actions: {
    setToken(token: string, username: string) {
      this.token = token
      this.username = username
      lStorage.set("access_token", token)
      lStorage.set("username", username)
    },
    clearToken() {
      this.token = ""
      this.username = ""
      lStorage.remove("access_token")
    },
  },
})

export default useTokenStore
