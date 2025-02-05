<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import api from "@/api"
import { ElMessage, ElMessageBox } from "element-plus"
import { Edit, Delete, User, Message, Phone, UserFilled } from "@element-plus/icons-vue"
import type { FormRules } from "element-plus"

interface Role {
  id: number
  name: string
  desc: string
  created_at: string
  updated_at: string
}

interface User {
  id: number
  username: string
  email: string | null
  phone: string
  avatar: string | null
  bio: string | null
  alias: string | null
  roles: Role[]
  is_active: boolean
  is_superuser: boolean
  last_login: string
  created_at: string
  updated_at: string
}

interface ApiResponse {
  code: number
  msg: string | null
  data: User[]
  total: number
  page: number
  page_size: number
}

// 编辑表单类型
interface EditForm {
  id: number
  username: string
  email: string
  phone: string | null
  roles: number[]
  is_superuser: boolean
  is_active: boolean
}

// 表格数据
const tableData = ref<User[]>([])

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

// 编辑相关
const editDialogVisible = ref(false)
const editFormRef = ref()
const editForm = reactive<EditForm>({
  id: 0,
  username: "",
  email: "",
  phone: null,
  roles: [],
  is_superuser: false,
  is_active: true,
})

// 角色列表
const roles = ref<Role[]>([])

// 获取角色列表
const getRoles = async () => {
  try {
    const res = await api.role.getList()
    roles.value = res.data
  } catch (error) {
    console.error("获取角色列表失败:", error)
  }
}

// 编辑表单校验规则
const rules: FormRules = {
  username: [
    { required: true, message: "请输入用户名称", trigger: "blur" },
    { min: 3, message: "用户名不能少于3个字符", trigger: "blur" },
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱格式", trigger: "blur" },
  ],
  roles: [{ required: true, message: "请选择角色", trigger: "change" }],
}

// 处理编辑
const handleEdit = (row: User) => {
  editForm.id = row.id
  editForm.username = row.username
  editForm.email = row.email || ""
  editForm.phone = row.phone
  editForm.roles = row.roles.map((role) => role.id)
  editForm.is_superuser = row.is_superuser
  editForm.is_active = row.is_active
  editDialogVisible.value = true
}

// 处理编辑提交
const handleEditSubmit = () => {
  editFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await api.user.update({
          id: editForm.id,
          username: editForm.username,
          email: editForm.email,
          phone: editForm.phone || "",
          role_ids: editForm.roles,
          is_superuser: editForm.is_superuser,
          is_active: editForm.is_active,
        })
        ElMessage.success("更新用户成功")
        editDialogVisible.value = false
        getUserList() // 刷新列表
      } catch (error) {
        console.error("更新用户失败:", error)
        ElMessage.error("更新用户失败")
      }
    }
  })
}

// 处理关闭编辑对话框
const handleEditClose = () => {
  editFormRef.value?.resetFields()
  editDialogVisible.value = false
}

// 获取用户列表
const getUserList = async () => {
  loading.value = true
  try {
    const res = (await api.user.getList({
      page: pagination.currentPage,
      page_size: pagination.pageSize,
      ...searchParams.value,
    })) as unknown as ApiResponse
    tableData.value = res.data
    pagination.total = res.total
  } catch (error) {
    console.error("获取用户列表失败:", error)
    ElMessage.error("获取用户列表失败")
  } finally {
    loading.value = false
  }
}

// 处理搜索
const handleSearch = (params: any) => {
  searchParams.value = params
  pagination.currentPage = 1 // 重置到第一页
  getUserList()
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

// 处理删除
const handleDelete = (row: User) => {
  ElMessageBox.confirm(`确定要删除用户 "${row.username}" 吗？`, "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await api.user.delete({ user_id: row.id })
        ElMessage.success("删除用户成功")
        getUserList() // 刷新列表
      } catch (error) {
        console.error("删除用户失败:", error)
        ElMessage.error("删除用户失败")
      }
    })
    .catch(() => {
      // 取消删除，不做任何操作
    })
}

defineExpose({
  handleSearch,
  getUserList,
})

onMounted(() => {
  getUserList()
  getRoles()
})
</script>

<template>
  <div class="table-container">
    <el-table v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column prop="username" label="名称" min-width="80" align="center" />
      <el-table-column prop="email" label="邮箱" min-width="60" align="center" />
      <el-table-column prop="phone" label="手机号" min-width="80" align="center" />
      <el-table-column prop="roles" label="用户角色" min-width="60" align="center">
        <template #default="{ row }">
          <el-tag
            v-for="role in row.roles"
            :key="role.id"
            type="info"
            effect="plain"
            class="role-tag"
          >
            {{ role.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_superuser" label="超级用户" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="row.is_superuser ? 'success' : 'info'" effect="plain">
            {{ row.is_superuser ? "是" : "否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="last_login" label="上次登录时间" min-width="80" align="center" />
      <el-table-column prop="is_active" label="状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.is_active ? 'success' : 'danger'" effect="plain">
            {{ row.is_active ? "启用" : "禁用" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right" align="center">
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
      title="编辑用户"
      width="500px"
      :close-on-click-modal="false"
      @close="handleEditClose"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="rules" label-width="100px">
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="editForm.username" placeholder="请输入用户名称" clearable>
            <template #prefix>
              <el-icon class="input-icon"><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱" clearable>
            <template #prefix>
              <el-icon class="input-icon"><Message /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="editForm.phone" placeholder="请输入手机号码" clearable>
            <template #prefix>
              <el-icon class="input-icon"><Phone /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roles">
          <el-select
            v-model="editForm.roles"
            multiple
            placeholder="请选择角色"
            style="width: 100%"
            clearable
          >
            <template #prefix>
              <el-icon class="select-icon"><UserFilled /></el-icon>
            </template>
            <el-option v-for="role in roles" :key="role.id" :label="role.name" :value="role.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="超级用户">
          <el-switch v-model="editForm.is_superuser" />
        </el-form-item>
        <el-form-item label="启用状态">
          <el-switch v-model="editForm.is_active" />
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

:deep(.role-tag:not(:last-child)) {
  margin-right: 4px;
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

:deep(.input-icon),
:deep(.select-icon) {
  margin-right: 4px;
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

:deep(.el-switch.is-checked .el-switch__core) {
  border-color: #67c23a;
  background-color: #67c23a;
}
</style>
