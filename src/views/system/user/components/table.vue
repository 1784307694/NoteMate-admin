<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import api from "@/api"
import { ElMessage } from "element-plus"

interface User {
  username: string
  email: string
  phone: string
  roles: number[]
  is_active: boolean
  is_superuser: boolean
}

// 表格数据
const tableData = ref<User[]>([])

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

// 加载状态
const loading = ref(false)

// 获取用户列表
const getUserList = async () => {
  loading.value = true
  try {
    const res = await api.user.getList({
      page: pagination.currentPage,
      page_size: pagination.pageSize,
    })
    tableData.value = res.data
    pagination.total = res.data.total
  } catch (error) {
    console.error("获取用户列表失败:", error)
    ElMessage.error("获取用户列表失败")
  } finally {
    loading.value = false
  }
}

// 处理分页变化
const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  getUserList()
}

const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  pagination.currentPage = 1
  getUserList()
}

onMounted(() => {
  getUserList()
})
</script>

<template>
  <div class="table-container">
    <el-table v-loading="loading" :data="tableData" style="width: 100%" border>
      <el-table-column prop="username" label="用户名称" min-width="120" />
      <el-table-column prop="email" label="邮箱" min-width="180" />
      <el-table-column prop="phone" label="手机号码" min-width="120" />
      <el-table-column prop="is_superuser" label="超级用户" width="100">
        <template #default="{ row }">
          <el-tag :type="row.is_superuser ? 'success' : 'info'">
            {{ row.is_superuser ? "是" : "否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_active" label="状态" width="80">
        <template #default="{ row }">
          <el-tag :type="row.is_active ? 'success' : 'danger'">
            {{ row.is_active ? "启用" : "禁用" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200" fixed="right">
        <template #default>
          <el-button link type="primary">编辑</el-button>
          <el-button link type="primary">重置密码</el-button>
          <el-button link type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
.table-container {
  width: 100%;
}

:deep(.el-table) {
  --el-table-border-color: var(--el-border-color-lighter);
  --el-table-header-bg-color: var(--el-fill-color-light);
  --el-table-row-hover-bg-color: var(--el-fill-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
}

:deep(.el-table__header th.el-table__cell) {
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
  font-weight: 500;
  font-size: 14px;
  height: 48px;
  padding: 8px 0;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

:deep(.el-table__row) {
  height: 52px;
}

:deep(.el-table__cell) {
  padding: 8px 0;
}

:deep(.el-button) {
  padding: 4px 8px;
  font-size: 13px;
}

:deep(.el-button .el-icon) {
  font-size: 14px;
  margin-right: 4px;
}

:deep(.el-tag) {
  border-radius: 4px;
  padding: 0 8px;
  height: 24px;
  line-height: 22px;
}

.pagination-container {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--el-border-color-lighter);
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
</style>
