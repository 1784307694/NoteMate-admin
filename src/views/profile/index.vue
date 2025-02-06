<script setup lang="ts">
import { ref } from "vue"
import { useUserStore } from "@/stores/user"
import { ElMessage } from "element-plus"
import type { FormInstance, FormRules } from "element-plus"
import { Edit, Lock, Message, Phone, User } from "@element-plus/icons-vue"
import api from "@/api"
import router from "@/router"

const userStore = useUserStore()

// 基本信息表单
const infoFormRef = ref<FormInstance>()
const infoForm = ref({
  username: userStore.username || "",
  email: userStore.email || "",
  phone: userStore.phone || "",
})

// 修改密码表单
const passwordFormRef = ref<FormInstance>()
const passwordForm = ref({
  old_password: "",
  new_password: "",
  confirm_password: "",
})

// 对话框显示状态
const infoDialogVisible = ref(false)
const passwordDialogVisible = ref(false)

// 表单校验规则
const infoRules: FormRules = {
  username: [
    { required: true, message: "请输入用户名", trigger: "blur" },
    { min: 2, message: "用户名不能少于2个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
  ],
  phone: [{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号格式", trigger: "blur" }],
}

const passwordRules: FormRules = {
  old_password: [{ required: true, message: "请输入原密码", trigger: "blur" }],
  new_password: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, message: "密码不能少于6个字符", trigger: "blur" },
  ],
  confirm_password: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.value.new_password) {
          callback(new Error("两次输入的密码不一致"))
        } else {
          callback()
        }
      },
      trigger: "blur",
    },
  ],
}

// 处理修改基本信息
const handleUpdateInfo = () => {
  infoFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        await api.base.updateBaseUserInfo({
          email: infoForm.value.email,
          phone: infoForm.value.phone,
          username: infoForm.value.username,
        })
        ElMessage.success("更新信息成功")
        infoDialogVisible.value = false
        // 等待登出完成后再跳转
        await userStore.logout()
        setTimeout(() => {
          router.replace("/login")
        }, 100)
      } catch (error) {
        console.error("更新信息失败:", error)
        ElMessage.error("更新信息失败")
      }
    }
  })
}

// 处理修改密码
const handleUpdatePassword = () => {
  passwordFormRef.value?.validate(async (valid) => {
    if (valid) {
      try {
        await api.base.updatePassword({
          old_password: passwordForm.value.old_password,
          new_password: passwordForm.value.new_password,
        })
        ElMessage.success("修改密码成功")
        passwordDialogVisible.value = false
        // 重置表单
        passwordForm.value = {
          old_password: "",
          new_password: "",
          confirm_password: "",
        }
        // 等待登出完成后再跳转
        await userStore.logout()
        setTimeout(() => {
          router.replace("/login")
        }, 100)
      } catch (error) {
        console.error("修改密码失败:", error)
        ElMessage.error("修改密码失败")
      }
    }
  })
}
</script>

<template>
  <div class="container">
    <div class="content-box">
      <div class="profile-header">
        <div class="avatar-wrapper">
          <el-avatar :size="120" :src="userStore.avatar">
            <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          </el-avatar>
        </div>
        <h2 class="username">{{ userStore.username }}</h2>
      </div>

      <div class="info-section">
        <div class="info-item">
          <el-icon><Message /></el-icon>
          <span class="label">邮箱：</span>
          <span class="value">{{ userStore.email }}</span>
        </div>
        <div class="info-item">
          <el-icon><Phone /></el-icon>
          <span class="label">手机：</span>
          <span class="value">{{ userStore.phone || "未设置" }}</span>
        </div>
      </div>

      <div class="action-section">
        <el-button type="primary" @click="infoDialogVisible = true">
          <el-icon><Edit /></el-icon>修改信息
        </el-button>
        <el-button type="warning" @click="passwordDialogVisible = true">
          <el-icon><Lock /></el-icon>修改密码
        </el-button>
      </div>
    </div>

    <!-- 修改信息对话框 -->
    <el-dialog
      v-model="infoDialogVisible"
      title="修改个人信息"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form ref="infoFormRef" :model="infoForm" :rules="infoRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="infoForm.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon class="input-icon"><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="infoForm.email" placeholder="请输入邮箱">
            <template #prefix>
              <el-icon class="input-icon"><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="infoForm.phone" placeholder="请输入手机号">
            <template #prefix>
              <el-icon class="input-icon"><Phone /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="infoDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateInfo">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="修改密码"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        label-width="80px"
      >
        <el-form-item label="原密码" prop="old_password">
          <el-input
            v-model="passwordForm.old_password"
            type="password"
            placeholder="请输入原密码"
            show-password
          >
            <template #prefix>
              <el-icon class="input-icon"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="new_password">
          <el-input
            v-model="passwordForm.new_password"
            type="password"
            placeholder="请输入新密码"
            show-password
          >
            <template #prefix>
              <el-icon class="input-icon"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm_password">
          <el-input
            v-model="passwordForm.confirm_password"
            type="password"
            placeholder="请确认新密码"
            show-password
          >
            <template #prefix>
              <el-icon class="input-icon"><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdatePassword">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.container {
  height: 100%;
  background-color: #f5f6fb;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content-box {
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
  padding: 32px;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.avatar-wrapper {
  margin-bottom: 16px;
}

.username {
  margin: 0;
  font-size: 24px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

.info-section {
  margin-bottom: 32px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  font-size: 16px;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item .el-icon {
  margin-right: 8px;
  font-size: 18px;
  color: var(--el-text-color-secondary);
}

.info-item .label {
  color: var(--el-text-color-regular);
  margin-right: 8px;
}

.info-item .value {
  color: var(--el-text-color-primary);
}

.action-section {
  display: flex;
  gap: 16px;
  justify-content: center;
}

:deep(.el-button) {
  padding: 8px 16px;
  font-weight: 500;
}

:deep(.el-button .el-icon) {
  margin-right: 4px;
  font-size: 14px;
}

:deep(.el-dialog) {
  border-radius: 8px;
}

:deep(.el-dialog__header) {
  margin: 0;
  padding: 16px 24px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-dialog__footer) {
  padding: 16px 24px;
  border-top: 1px solid var(--el-border-color-lighter);
}

:deep(.el-form-item) {
  margin-bottom: 24px;
}

:deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

:deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-border-color-darker) inset;
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #67c23a inset !important;
}

:deep(.input-icon) {
  margin-right: 8px;
  font-size: 16px;
  color: var(--el-text-color-secondary);
}

:deep(.el-button--primary) {
  background-color: #67c23a;
  border-color: #67c23a;
}

:deep(.el-button--primary:hover) {
  background-color: #85ce61;
  border-color: #85ce61;
}
</style>
