<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import api from "@/api"
import { ElMessage } from "element-plus"
import type { TagProps } from "element-plus"

interface AuditLog {
  id: number
  user_id: number
  username: string
  module: string
  method: string
  path: string
  summary: string
  status: number
  response_time: number
  ip: string
  created_at: string
}

interface ApiResponse {
  code: number
  msg: string | null
  data: AuditLog[]
  total: number
  page: number
  page_size: number
}

// 表格数据
const tableData = ref<AuditLog[]>([])

// 搜索参数
const searchParams = ref({})

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

// 加载状态
const loading = ref(false)

// 详情对话框
const detailDialogVisible = ref(false)
const currentDetail = ref<AuditLog | null>(null)

// 获取审计日志列表
const getAuditLogList = async () => {
  loading.value = true
  try {
    const res = (await api.auditLog.getList({
      page: pagination.currentPage,
      page_size: pagination.pageSize,
      ...searchParams.value,
    })) as unknown as ApiResponse
    tableData.value = res.data
    pagination.total = res.total
  } catch (error) {
    console.error("获取审计日志列表失败:", error)
    ElMessage.error("获取审计日志列表失败")
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = (params: any) => {
  searchParams.value = params
  pagination.currentPage = 1 // 重置到第一页
  getAuditLogList()
}

// 处理分页变化
const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  getAuditLogList()
}

const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  pagination.currentPage = 1
  getAuditLogList()
}

// 查看详情
const handleViewDetail = (row: AuditLog) => {
  currentDetail.value = row
  detailDialogVisible.value = true
}

// 格式化状态码
const formatStatus = (status: number): { type: TagProps["type"]; label: string } => {
  const statusMap: { [key: number]: { type: TagProps["type"]; label: string } } = {
    200: { type: "success", label: "成功" },
    401: { type: "warning", label: "未授权" },
    403: { type: "warning", label: "禁止访问" },
    404: { type: "info", label: "未找到" },
    500: { type: "danger", label: "服务器错误" },
  }
  return statusMap[status] || { type: "info", label: "未知" }
}

// 格式化响应时间
const formatResponseTime = (time: number): string => {
  if (time < 1000) {
    return `${time}ms`
  }
  return `${(time / 1000).toFixed(2)}s`
}

defineExpose({
  handleSearch,
  getAuditLogList,
})

onMounted(() => {
  getAuditLogList()
})
</script>

<template>
  <div class="table-container">
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column prop="username" label="操作人" min-width="100" align="center" />
      <el-table-column prop="module" label="功能模块" min-width="120" align="center" />
      <el-table-column prop="method" label="请求方法" width="100" align="center">
        <template #default="{ row }">
          <el-tag
            :type="
              row.method === 'GET'
                ? 'success'
                : row.method === 'POST'
                  ? 'primary'
                  : row.method === 'PUT'
                    ? 'warning'
                    : 'danger'
            "
          >
            {{ row.method }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="summary"
        label="请求描述"
        min-width="150"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="path"
        label="请求路径"
        min-width="180"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column prop="ip" label="IP地址" min-width="120" align="center" />
      <el-table-column prop="status" label="状态码" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="formatStatus(row.status).type">
            {{ formatStatus(row.status).label }}({{ row.status }})
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="response_time" label="响应时间" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="row.response_time > 1000 ? 'warning' : 'success'">
            {{ formatResponseTime(row.response_time) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="操作时间" min-width="160" align="center" />
      <el-table-column label="操作" width="100" fixed="right" align="center">
        <template #default="{ row }">
          <el-button type="primary" link @click="handleViewDetail(row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="审计日志详情" width="800px">
      <el-descriptions :column="2" border>
        <el-descriptions-item label="操作人">{{ currentDetail?.username }}</el-descriptions-item>
        <el-descriptions-item label="用户ID">{{ currentDetail?.user_id }}</el-descriptions-item>
        <el-descriptions-item label="功能模块">{{ currentDetail?.module }}</el-descriptions-item>
        <el-descriptions-item label="请求方法">
          <el-tag
            :type="
              currentDetail?.method === 'GET'
                ? 'success'
                : currentDetail?.method === 'POST'
                  ? 'primary'
                  : currentDetail?.method === 'PUT'
                    ? 'warning'
                    : 'danger'
            "
          >
            {{ currentDetail?.method }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="请求描述">{{ currentDetail?.summary }}</el-descriptions-item>
        <el-descriptions-item label="请求路径">{{ currentDetail?.path }}</el-descriptions-item>
        <el-descriptions-item label="状态码">
          <el-tag :type="formatStatus(currentDetail?.status || 0).type">
            {{ formatStatus(currentDetail?.status || 0).label }}({{ currentDetail?.status }})
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="响应时间">
          <el-tag :type="(currentDetail?.response_time || 0) > 1000 ? 'warning' : 'success'">
            {{ formatResponseTime(currentDetail?.response_time || 0) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="IP地址">{{ currentDetail?.ip }}</el-descriptions-item>
        <el-descriptions-item label="操作时间">{{
          currentDetail?.created_at
        }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <div class="pagination-container">
      <el-pagination
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :total="pagination.total"
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

:deep(.el-descriptions) {
  padding: 8px 0;
}

:deep(.el-descriptions__cell) {
  padding: 12px 16px;
}
</style>
