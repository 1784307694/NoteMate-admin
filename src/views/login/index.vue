<script setup lang="ts">
import { ref, reactive } from "vue"
import { ElMessage } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
import { User, Lock } from "@element-plus/icons-vue"
import { useRouter } from "vue-router"

import api from "@/api"
import useTokenStore from "@/stores/token"
import { lStorage } from "@/utils/storage"

const router = useRouter()
const formRef = ref<FormInstance>()
const form = reactive<{ username: string; password: string }>({
  username: lStorage.get("username") || "",
  password: lStorage.get("password") || "",
})

const rules = reactive<FormRules>({
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 3, message: "用户名长度不能小于3位", trigger: "blur" },
  ],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码长度不能小于6位", trigger: "blur" },
  ],
})

const loading = ref<boolean>(false)
const isRememberMe = ref<boolean>(lStorage.get("isRememberMe") || false)

const handleLogin = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  await formEl.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        const res = (await api.login(form)) as unknown as {
          code: number
          data: { access_token: string; username: string }
          msg: string
        }
        if (res.code === 200) {
          useTokenStore().setToken(res.data.access_token, res.data.username)
          handleRememberMe()
          ElMessage.success("登录成功")
          router.push("/")
        } else {
          ElMessage.error(res.msg || "登录失败")
        }
      } catch (error: any) {
        ElMessage.error(error.response?.data?.msg || "登录失败")
      } finally {
        loading.value = false
      }
    }
  })
}

const handleRememberMe = () => {
  if (isRememberMe.value) {
    lStorage.set("username", form.username)
    lStorage.set("password", form.password)
    lStorage.set("isRememberMe", true)
  } else {
    lStorage.remove("password")
    lStorage.remove("isRememberMe")
  }
}

const handleForgotPassword = () => {
  ElMessage.info("忘记密码功能开发中...")
}

const handleRegister = () => {
  ElMessage.info("注册功能开发中...")
}
</script>

<template>
  <div class="login-container">
    <div class="login-box">
      <el-form ref="formRef" :model="form" :rules="rules" class="login-form">
        <h2 class="title">NoteMate Admin</h2>

        <el-form-item prop="username">
          <div class="flex-column">
            <p>Username</p>
          </div>
          <el-input
            v-model="form.username"
            placeholder="Enter your Username"
            :prefix-icon="User"
            size="large"
          />
        </el-form-item>

        <el-form-item prop="password">
          <div class="flex-column">
            <p>Password</p>
          </div>
          <el-input
            v-model="form.password"
            type="password"
            placeholder="Enter your Password"
            :prefix-icon="Lock"
            :show-password="true"
            size="large"
          />
        </el-form-item>

        <el-checkbox v-model="isRememberMe" class="remember-me">Remember me</el-checkbox>

        <el-button
          :loading="loading"
          type="primary"
          class="login-button"
          @click="handleLogin(formRef)"
        >
          Sign In
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  width: 100%;
  height: 100vh;
  background: url("@/assets/img/Background.jpg") no-repeat center center;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-form {
  width: 420px;
  padding: 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.title {
  text-align: center;
  margin: 0 0 35px;
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  padding: 4px 12px;
  box-shadow: 0 0 0 1px #e4e7ed;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px var(--el-color-primary);
}

.login-button {
  width: 100%;
  height: 44px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  margin-top: 24px;
  border: 1px solid #ededef;
  background-color: #151717;
  transition: 0.2s ease-in-out;
}

.login-button:hover {
  border: 2px solid #2d79f3;
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

.flex-column > p {
  color: #151717;
  font-weight: 600;
}

:deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
  color: #151717;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #151717;
  border-color: #151717;
}
</style>
