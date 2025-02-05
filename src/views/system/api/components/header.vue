#
<script setup lang="ts">
import { ref } from "vue"
import { Plus, Refresh } from "@element-plus/icons-vue"
import { ElMessage, ElMessageBox } from "element-plus"
import api from "@/api"

interface ApiResponse {
  code: number
  msg: string | null
  data: any
}

const emit = defineEmits(["refresh"])

const dialogVisible = ref(false)
const apiFormRef = ref()

const apiForm = ref({
  path: "",
  method: "",
  description: "",
  tags: "",
})

const methodOptions = [
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "DELETE", value: "DELETE" },
]

const handleAdd = () => {
  dialogVisible.value = true
}

const handleRefresh = () => {
  ElMessageBox.confirm(
    "此操作会根据后端 app.routes 进行路由更新，确定继续刷新 API 操作？",
    "刷新确认",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    },
  )
    .then(async () => {
      try {
        const res = (await api.api.refresh()) as unknown as ApiResponse
        if (res.code === 200) {
          ElMessage.success("刷新API成功")
          emit("refresh")
        } else {
          ElMessage.error(res.msg || "刷新API失败")
        }
      } catch (error) {
        console.error("刷新API失败:", error)
        ElMessage.error("刷新API失败")
      }
    })
    .catch(() => {
      // 取消刷新，不做任何操作
    })
}

const handleClose = () => {
  apiFormRef.value?.resetFields()
  dialogVisible.value = false
}

const handleSubmit = () => {
  apiFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        // TODO: 调用API创建接口
        console.log("创建API", apiForm.value)
        handleClose()
        emit("refresh")
      } catch (error) {
        console.error("创建API失败:", error)
      }
    }
  })
}

const rules = {
  path: [
    { required: true, message: "请输入API路径", trigger: "blur" },
    { min: 1, message: "API路径不能为空", trigger: "blur" },
  ],
  method: [{ required: true, message: "请选择请求方式", trigger: "change" }],
  description: [{ required: true, message: "请输入API简介", trigger: "blur" }],
  tags: [{ required: true, message: "请输入API标签", trigger: "blur" }],
}
</script>

<template>
  <div class="header-content">
    <el-text class="title">API列表</el-text>

    <div class="button-group">
      <el-button type="primary" @click="handleRefresh">
        <el-icon><Refresh /></el-icon>刷新API
      </el-button>
      <el-button type="success" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增API
      </el-button>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="新增API"
      width="500px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form ref="apiFormRef" :model="apiForm" :rules="rules" label-width="100px">
        <el-form-item label="API路径" prop="path">
          <el-input v-model="apiForm.path" placeholder="请输入API路径" clearable />
        </el-form-item>
        <el-form-item label="请求方式" prop="method">
          <el-select
            v-model="apiForm.method"
            placeholder="请选择请求方式"
            style="width: 100%"
            clearable
          >
            <el-option
              v-for="item in methodOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="API简介" prop="description">
          <el-input v-model="apiForm.description" placeholder="请输入API简介" clearable />
        </el-form-item>
        <el-form-item label="Tags" prop="tags">
          <el-input v-model="apiForm.tags" placeholder="请输入API标签" clearable />
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

.button-group {
  display: flex;
  gap: 12px;
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
  background-color: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: #fff;
}

:deep(.el-button--primary:hover) {
  background-color: var(--el-color-primary-light-3);
  border-color: var(--el-color-primary-light-3);
}

:deep(.el-button--success) {
  background-color: var(--el-color-success);
  border-color: var(--el-color-success);
  color: #fff;
}

:deep(.el-button--success:hover) {
  background-color: var(--el-color-success-light-3);
  border-color: var(--el-color-success-light-3);
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
</style>
