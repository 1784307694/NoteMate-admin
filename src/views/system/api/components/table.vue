<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Edit, Delete } from "@element-plus/icons-vue"
import { ElMessage, ElMessageBox } from "element-plus"

import api from "@/api"

interface ApiResponse<T = any> {
  code: number
  msg: string | null
  data: T
  total: number
  page: number
  page_size: number
}

interface ApiItem {
  id: number
  path: string
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  summary: string
  tags: string
  created_at: string
  updated_at: string
}

// 表格数据
const tableData = ref<ApiItem[]>([])

// 搜索参数
const searchParams = ref({
  path: "",
  method: "",
  summary: "",
  tags: "",
})

// 分页参数
const pagination = ref({
  current: 1,
  pageSize: 10,
  total: 0,
})

// 加载状态
const loading = ref(false)

// 编辑相关
const editDialogVisible = ref(false)
const editFormRef = ref()
const editForm = ref<ApiItem>({
  id: 0,
  path: "",
  method: "GET",
  summary: "",
  tags: "",
  created_at: "",
  updated_at: "",
})

const methodOptions = [
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "DELETE", value: "DELETE" },
]

const methodTagType = (method: string): "success" | "warning" | "info" | "primary" | "danger" => {
  const map: Record<string, "success" | "warning" | "info" | "primary" | "danger"> = {
    GET: "success",
    POST: "warning",
    PUT: "primary",
    DELETE: "danger",
  }
  return map[method] || "info"
}

// 获取API列表
const getApiList = async () => {
  loading.value = true
  try {
    const params = {
      ...searchParams.value,
      page: pagination.value.current,
      page_size: pagination.value.pageSize,
    }
    const res = (await api.api.getList(params)) as unknown as ApiResponse<ApiItem[]>
    if (res.code === 200) {
      tableData.value = res.data
      pagination.value.total = res.total
    } else {
      ElMessage.error(res.msg || "获取API列表失败")
    }
  } catch (error) {
    console.error("获取API列表失败:", error)
    ElMessage.error("获取API列表失败")
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = (params: any) => {
  searchParams.value = {
    ...searchParams.value,
    path: params.path || "",
    method: params.method || "",
    summary: params.description || "",
    tags: params.tags || "",
  }
  pagination.value.current = 1
  getApiList()
}

// 处理分页变化
const handleCurrentChange = (val: number) => {
  pagination.value.current = val
  getApiList()
}

const handleSizeChange = (val: number) => {
  pagination.value.pageSize = val
  pagination.value.current = 1
  getApiList()
}

// 处理编辑
const handleEdit = (row: ApiItem) => {
  editForm.value = { ...row }
  editDialogVisible.value = true
}

// 处理编辑提交
const handleEditSubmit = () => {
  editFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const params = {
          id: editForm.value.id,
          path: editForm.value.path,
          method: editForm.value.method,
          summary: editForm.value.summary,
          tags: editForm.value.tags,
        }
        const res = (await api.api.update(params)) as unknown as ApiResponse
        if (res.code === 200) {
          ElMessage.success("更新API成功")
          editDialogVisible.value = false
          getApiList()
        } else {
          ElMessage.error(res.msg || "更新API失败")
        }
      } catch (error) {
        console.error("更新API失败:", error)
        ElMessage.error("更新API失败")
      }
    }
  })
}

// 处理关闭编辑对话框
const handleEditClose = () => {
  editFormRef.value?.resetFields()
  editDialogVisible.value = false
}

// 处理删除
const handleDelete = (row: ApiItem) => {
  ElMessageBox.confirm(`确定要删除API "${row.path}" 吗？`, "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        const res = (await api.api.delete({ api_id: row.id })) as unknown as ApiResponse
        if (res.code === 200) {
          ElMessage.success("删除API成功")
          getApiList()
        } else {
          ElMessage.error(res.msg || "删除API失败")
        }
      } catch (error) {
        console.error("删除API失败:", error)
        ElMessage.error("删除API失败")
      }
    })
    .catch(() => {
      // 取消删除，不做任何操作
    })
}

const rules = {
  path: [
    { required: true, message: "请输入API路径", trigger: "blur" },
    { min: 1, message: "API路径不能为空", trigger: "blur" },
  ],
  method: [{ required: true, message: "请选择请求方式", trigger: "change" }],
  summary: [{ required: true, message: "请输入API简介", trigger: "blur" }],
  tags: [{ required: true, message: "请输入API标签", trigger: "blur" }],
}

defineExpose({
  handleSearch,
  getApiList,
})

onMounted(() => {
  getApiList()
})
</script>

<template>
  <div class="table-container">
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column prop="path" label="API路径" min-width="80" align="center" />
      <el-table-column prop="method" label="请求方式" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="methodTagType(row.method)">{{ row.method }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="summary" label="API简介" min-width="100" align="center" />
      <el-table-column prop="tags" label="Tags" width="150" align="center">
        <template #default="{ row }">
          <el-tag type="info" effect="plain">{{ row.tags }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="80" fixed="right" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">
            <el-icon><Delete /></el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑API"
      width="500px"
      :close-on-click-modal="false"
      @close="handleEditClose"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="rules" label-width="100px">
        <el-form-item label="API路径" prop="path">
          <el-input v-model="editForm.path" placeholder="请输入API路径" clearable />
        </el-form-item>
        <el-form-item label="请求方式" prop="method">
          <el-select
            v-model="editForm.method"
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
        <el-form-item label="API简介" prop="summary">
          <el-input v-model="editForm.summary" placeholder="请输入API简介" clearable />
        </el-form-item>
        <el-form-item label="Tags" prop="tags">
          <el-input v-model="editForm.tags" placeholder="请输入API标签" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleEditClose">取消</el-button>
          <el-button type="primary" @click="handleEditSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <div class="pagination-container">
      <el-pagination
        v-model:current="pagination.current"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<style scoped>
:deep(.el-table) {
  --el-table-border-color: var(--el-border-color-lighter);
  --el-table-header-bg-color: var(--el-fill-color-light);
  --el-table-row-hover-bg-color: var(--el-fill-color);
  border-radius: 8px;
}

:deep(.el-table__inner-wrapper::before) {
  display: none;
}

:deep(.el-table__header th.el-table__cell) {
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
  font-weight: 500;
  font-size: 14px;
  height: 44px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

:deep(.el-table__row) {
  height: 44px;
}

:deep(.el-table__cell) {
  padding: 8px 12px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

:deep(.el-button.el-button--small) {
  padding: 6px;
  height: 32px;
  width: 32px;
}

:deep(.el-button--primary) {
  background-color: #67c23a;
  border-color: #67c23a;
}

:deep(.el-button--primary:hover) {
  background-color: #85ce61;
  border-color: #85ce61;
}

:deep(.el-button--danger) {
  background-color: #f56c6c;
  border-color: #f56c6c;
}

:deep(.el-button--danger:hover) {
  background-color: #f78989;
  border-color: #f78989;
}

:deep(.el-button:not(:last-child)) {
  margin-right: 8px;
}

:deep(.el-tag) {
  border-radius: 4px;
  padding: 0 8px;
  height: 24px;
  line-height: 22px;
}

.pagination-container {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
  display: flex;
  justify-content: flex-end;
  align-items: center;
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
