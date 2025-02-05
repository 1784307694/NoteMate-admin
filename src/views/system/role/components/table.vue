<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import api from "@/api"
import { ElMessage, ElMessageBox } from "element-plus"
import { Edit, Delete } from "@element-plus/icons-vue"
import type { FormRules } from "element-plus"
import Permission from "./permission.vue"

interface Role {
  id: number
  name: string
  desc: string
  created_at: string
  updated_at: string
}

interface ApiResponse {
  code: number
  msg: string | null
  data: Role[]
  total: number
  page: number
  page_size: number
}

// 编辑表单类型
interface EditForm {
  id: number
  name: string
  desc: string
}

interface SearchParams {
  role_name?: string
  start_time?: string
  end_time?: string
  page?: number
  page_size?: number
}

// 表格数据
const tableData = ref<Role[]>([])

// 搜索参数
const searchParams = ref<SearchParams>({})

// 分页参数
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
})

// 加载状态
const loading = ref(false)

// 编辑相关
const editDialogVisible = ref(false)
const editFormRef = ref()
const editForm = reactive<EditForm>({
  id: 0,
  name: "",
  desc: "",
})

// 编辑表单校验规则
const rules: FormRules = {
  name: [
    { required: true, message: "请输入角色名称", trigger: "blur" },
    { min: 2, message: "角色名称不能少于2个字符", trigger: "blur" },
  ],
  desc: [{ required: true, message: "请输入角色描述", trigger: "blur" }],
}

// 权限相关
const drawerVisible = ref(false)
const currentRole = ref<Role>()
const permissionRef = ref()

// 获取角色列表
const getRoleList = async () => {
  loading.value = true
  try {
    const res = (await api.role.getList({
      page: pagination.currentPage,
      page_size: pagination.pageSize,
      ...searchParams.value,
    })) as unknown as ApiResponse
    tableData.value = res.data
    pagination.total = res.total
  } catch (error) {
    console.error("获取角色列表失败:", error)
    ElMessage.error("获取角色列表失败")
  } finally {
    loading.value = false
  }
}

// 处理编辑
const handleEdit = (row: Role) => {
  editForm.id = row.id
  editForm.name = row.name
  editForm.desc = row.desc
  editDialogVisible.value = true
}

// 处理编辑提交
const handleEditSubmit = () => {
  editFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await api.role.update({
          id: editForm.id,
          name: editForm.name,
          desc: editForm.desc,
        })
        ElMessage.success("更新角色成功")
        editDialogVisible.value = false
        getRoleList() // 刷新列表
      } catch (error) {
        console.error("更新角色失败:", error)
        ElMessage.error("更新角色失败")
      }
    }
  })
}

// 处理关闭编辑对话框
const handleEditClose = () => {
  editFormRef.value?.resetFields()
  editDialogVisible.value = false
}

// 处理搜索
const handleSearch = (params: SearchParams) => {
  searchParams.value = params
  pagination.currentPage = 1 // 重置到第一页
  getRoleList()
}

// 处理分页变化
const handleCurrentChange = (val: number) => {
  pagination.currentPage = val
  getRoleList()
}

const handleSizeChange = (val: number) => {
  pagination.pageSize = val
  pagination.currentPage = 1
  getRoleList()
}

// 处理删除
const handleDelete = (row: Role) => {
  ElMessageBox.confirm(`确定要删除角色 "${row.name}" 吗？`, "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await api.role.delete({ role_id: row.id })
        ElMessage.success("删除角色成功")
        getRoleList() // 刷新列表
      } catch (error) {
        console.error("删除角色失败:", error)
        ElMessage.error("删除角色失败")
      }
    })
    .catch(() => {
      // 取消删除，不做任何操作
    })
}

// 处理权限
const handlePermission = (row: Role) => {
  currentRole.value = row
  drawerVisible.value = true
}

// 处理权限保存成功
const handlePermissionSuccess = () => {
  drawerVisible.value = false
  getRoleList()
}

defineExpose({
  handleSearch,
  getRoleList,
})

onMounted(() => {
  getRoleList()
})
</script>

<template>
  <div class="table-container">
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="角色名称" min-width="120" align="center" />
      <el-table-column prop="desc" label="角色描述" min-width="180" align="center" />
      <el-table-column prop="created_at" label="创建时间" min-width="150" align="center" />
      <el-table-column prop="updated_at" label="更新时间" min-width="150" align="center" />
      <el-table-column label="操作" min-width="180" fixed="right" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">
            <el-icon><Delete /></el-icon>
          </el-button>
          <el-button type="primary" size="small" @click="handlePermission(row)">权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑角色"
      width="500px"
      :close-on-click-modal="false"
      @close="handleEditClose"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入角色名称" clearable />
        </el-form-item>
        <el-form-item label="角色描述" prop="desc">
          <el-input
            v-model="editForm.desc"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
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
        v-model:current-page="pagination.currentPage"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 权限设置抽屉 -->
    <el-drawer
      v-model="drawerVisible"
      :title="`设置权限 - ${currentRole?.name}`"
      size="500px"
      :close-on-click-modal="false"
      :destroy-on-close="true"
    >
      <Permission
        v-if="currentRole"
        ref="permissionRef"
        :role-id="currentRole.id"
        :role-name="currentRole.name"
        @success="handlePermissionSuccess"
      />
    </el-drawer>
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

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  margin-right: 0;
}
</style>
