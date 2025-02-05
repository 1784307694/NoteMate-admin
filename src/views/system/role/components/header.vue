<script setup lang="ts">
import { ref, reactive } from "vue"
import api from "@/api"
import { ElMessage } from "element-plus"
import type { FormRules } from "element-plus"
import { Plus } from "@element-plus/icons-vue"

interface RoleForm {
  name: string
  desc: string
}

const dialogVisible = ref(false)
const roleFormRef = ref()

const roleForm = reactive<RoleForm>({
  name: "",
  desc: "",
})

const emit = defineEmits(["refresh"])

// 开启模态框
const handleAdd = () => {
  dialogVisible.value = true
}

// 关闭模态框
const handleClose = () => {
  roleFormRef.value?.resetFields()
  dialogVisible.value = false
}

const handleSubmit = () => {
  roleFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await api.role.create(roleForm)
        ElMessage.success("创建角色成功")
        handleClose()
        emit("refresh")
      } catch (error) {
        console.error("创建角色失败:", error)
        ElMessage.error("创建角色失败")
      }
    }
  })
}

// 表单校验规则
const rules: FormRules = {
  name: [
    { required: true, message: "请输入角色名称", trigger: "blur" },
    { min: 2, message: "角色名称不能少于2个字符", trigger: "blur" },
  ],
  desc: [{ required: true, message: "请输入角色描述", trigger: "blur" }],
}
</script>

<template>
  <div class="header-content">
    <el-text class="title">角色列表</el-text>
    <el-button type="primary" @click="handleAdd">
      <el-icon><Plus /></el-icon>新增角色
    </el-button>

    <el-dialog
      v-model="dialogVisible"
      title="新增角色"
      width="500px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form ref="roleFormRef" :model="roleForm" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" placeholder="请输入角色名称" clearable />
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input
            v-model="roleForm.desc"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
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

:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

:deep(.el-input__wrapper:hover),
:deep(.el-textarea__inner:hover) {
  box-shadow: 0 0 0 1px var(--el-border-color-darker) inset;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-textarea__inner:focus) {
  box-shadow: 0 0 0 1px #67c23a inset !important;
}
</style>
