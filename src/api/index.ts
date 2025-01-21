import { request } from "@/utils/http"

export default {
  // base
  login: (data: { username: string; password: string }) =>
    request.post("/base/access_token", { ...data, noNeedToken: true }),
  getUserInfo: () => request.get("/base/userinfo"),
}
