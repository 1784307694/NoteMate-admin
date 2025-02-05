<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"

import api from "@/api"
import { ElMessage } from "element-plus"
import type { FormRules } from "element-plus"
import { User, Message, Phone, UserFilled, Plus } from "@element-plus/icons-vue"

interface UserForm {
  username: string
  email: string
  phone: string | undefined
  password: string
  confirmPassword: string
  roles?: number[]
  role_ids?: number[]
  is_superuser: boolean
  is_active: boolean
}

const dialogVisible = ref(false)
const userFormRef = ref()

// 表单中使用 roles 字段来收集用户选择
// 提交到后端时使用 role_ids 字段
const userForm = reactive<UserForm>({
  username: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  roles: [],
  role_ids: [],
  is_superuser: false,
  is_active: false,
})

const roles = ref()

const emit = defineEmits(["refresh"])

// 获取角色列表
const getRoles = async () => {
  const res = await api.role.getList()
  roles.value = res.data
}

// 开启模态框
const handleAdd = () => {
  dialogVisible.value = true
}

// 关闭模态框
const handleClose = () => {
  userFormRef.value?.resetFields()
  dialogVisible.value = false
}

const handleSubmit = () => {
  userFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        // 解构出需要的字段, 排除 confirmPassword
        const { confirmPassword, ...submitData } = userForm

        // 确保 roles 是数字数组
        submitData.role_ids = Array.isArray(submitData.roles) ? submitData.roles : []
        delete submitData.roles

        // 处理空字符串
        if (submitData.phone === "") {
          submitData.phone = undefined
        }

        // 提交表单
        await api.base.createUser(submitData)
        ElMessage.success("创建用户成功")
        handleClose()
        emit("refresh")
      } catch (error) {
        console.error("创建用户失败:", error)
        ElMessage.error("创建用户失败")
      }
    }
  })
}

// 表单校验规则
const rules: FormRules = {
  username: [
    { required: true, message: "请输入用户名称", trigger: "blur" },
    { min: 3, message: "用户名不能少于3个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
  ],
  phone: [{ required: true, message: "请输入手机号码", trigger: "blur" }],
  password: [
    { required: true, message: "请输入密码", trigger: "blur" },
    { min: 6, message: "密码不能少于6个字符", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请确认密码", trigger: "blur" },
    { min: 6, message: "密码不能少于6个字符", trigger: "blur" },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== userForm.password) {
          callback(new Error("两次输入的密码不一致"))
        } else {
          callback()
        }
      },
      trigger: "blur",
    },
  ],
  roles: [{ required: true, message: "请选择角色", trigger: "change" }],
}

onMounted(() => {
  getRoles()
})
</script>

<template>
  <div class="header-content">
    <el-text class="title">用户列表</el-text>
    <el-button type="primary" @click="handleAdd">
      <el-icon><Plus /></el-icon>新增用户
    </el-button>

    <el-dialog
      v-model="dialogVisible"
      title="新增用户"
      width="500px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form ref="userFormRef" :model="userForm" :rules="rules" label-width="100px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名称" clearable>
            <template #prefix>
              <el-icon class="input-icon"><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" clearable>
            <template #prefix>
              <el-icon class="input-icon"><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="userForm.phone" placeholder="请输入手机号码" clearable>
            <template #prefix>
              <el-icon class="input-icon"><Phone /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="userForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="userForm.confirmPassword"
            type="password"
            placeholder="请确认密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select v-model="userForm.roles" multiple placeholder="请选择角色" style="width: 100%">
            <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="超级用户">
          <el-switch v-model="userForm.is_superuser" />
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch v-model="userForm.is_active" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-text) {
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
}

:deep(.el-button) {
  padding: 8px 16px;
  font-weight: 500;
}

:deep(.el-button--primary) {
  background-color: #67c23a;
  border-color: #67c23a;
  color: #fff;
}

:deep(.el-button--primary:hover) {
  background-color: #85ce61;
  border-color: #85ce61;
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
  padding: 16px 24px;
}

:deep(.el-dialog__footer) {
  padding: 12px 24px;
  border-top: 1px solid var(--el-border-color-lighter);
}

:deep(.el-switch.is-checked .el-switch__core) {
  border-color: #67c23a;
  background-color: #67c23a;
}

:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

:deep(.el-input__wrapper:hover),
:deep(.el-select .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-border-color-darker) inset;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-select .el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #67c23a inset !important;
}

:deep(.input-icon),
:deep(.select-icon) {
  margin-right: 4px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}
</style>
