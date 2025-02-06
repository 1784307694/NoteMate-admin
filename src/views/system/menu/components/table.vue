<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Edit, Delete, Plus } from "@element-plus/icons-vue"
import { ElMessage, ElMessageBox } from "element-plus"
import api from "@/api"

interface Menu {
  id: number
  name: string
  path: string
  component: string
  icon: string
  parent_id: number
  menu_type: "catalog" | "menu"
  order: number
  redirect?: string
  is_hidden: boolean
  keepalive: boolean
  remark?: string
  created_at: string
  updated_at: string
  children?: Menu[]
}

interface EditForm {
  id: number
  name: string
  path: string
  component: string
  icon: string
  parent_id: number | null
  menu_type: "catalog" | "menu"
  order: number
  redirect?: string
  is_hidden: boolean
  keepalive: boolean
  remark?: string
  created_at: string
  updated_at: string
  children?: Menu[]
}

// 表格数据
const tableData = ref<Menu[]>([])

// 加载状态
const loading = ref(false)

// 编辑相关
const editDialogVisible = ref(false)
const editFormRef = ref()
const editForm = ref<EditForm>({
  id: 0,
  name: "",
  path: "",
  component: "",
  icon: "",
  parent_id: null,
  menu_type: "menu",
  order: 1,
  redirect: "",
  is_hidden: false,
  keepalive: false,
  remark: "",
  created_at: "",
  updated_at: "",
})

// 菜单树数据
const menuTreeData = ref<Menu[]>([])

// 获取菜单列表
const getMenuList = async () => {
  loading.value = true
  try {
    const res = await api.menu.getList({})
    tableData.value = res.data
    menuTreeData.value = res.data
  } catch (error) {
    console.error("获取菜单列表失败:", error)
    ElMessage.error("获取菜单列表失败")
  } finally {
    loading.value = false
  }
}

// 处理编辑
const handleEdit = (row: Menu) => {
  editForm.value = {
    ...row,
    parent_id: row.parent_id === 0 ? null : row.parent_id,
  }
  editDialogVisible.value = true
}

// 处理编辑提交
const handleEditSubmit = () => {
  editFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const { created_at, updated_at, children, ...updateData } = editForm.value
        // 如果是编辑现有菜单
        if (editForm.value.id !== 0) {
          await api.menu.update({
            ...updateData,
            parent_id: updateData.parent_id ?? 0,
          })
          ElMessage.success("更新菜单成功")
        } else {
          // 如果是新增菜单
          await api.menu.create({
            ...updateData,
            parent_id: updateData.parent_id ?? 0,
          })
          ElMessage.success("创建菜单成功")
        }
        editDialogVisible.value = false
        getMenuList() // 刷新列表
      } catch (error) {
        console.error(editForm.value.id !== 0 ? "更新菜单失败:" : "创建菜单失败:", error)
        ElMessage.error(editForm.value.id !== 0 ? "更新菜单失败" : "创建菜单失败")
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
const handleDelete = (row: Menu) => {
  // 检查是否有子菜单
  if (row.children && row.children.length > 0) {
    ElMessage.warning("无法删除含有子菜单的菜单")
    return
  }

  ElMessageBox.confirm(`确定要删除菜单 "${row.name}" 吗?`, "删除确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      try {
        await api.menu.delete({ id: row.id })
        ElMessage.success("删除菜单成功")
        getMenuList() // 刷新列表
      } catch (error) {
        console.error("删除菜单失败:", error)
        ElMessage.error("删除菜单失败")
      }
    })
    .catch(() => {
      // 取消删除，不做任何操作
    })
}

// 新增子菜单相关
const handleAddChild = (row: Menu) => {
  editForm.value = {
    id: 0,
    name: "",
    path: "",
    component: "",
    icon: "",
    parent_id: row.id,
    menu_type: "menu",
    order: row.children?.length ? Math.max(...row.children.map((child) => child.order)) + 1 : 1, // 自动设置排序
    redirect: "",
    is_hidden: false,
    keepalive: false,
    remark: "",
    created_at: "",
    updated_at: "",
  }
  editDialogVisible.value = true
}

const rules = {
  name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  path: [{ required: true, message: "请输入路由路径", trigger: "blur" }],
  component: [{ required: true, message: "请输入组件路径", trigger: "blur" }],
  menu_type: [{ required: true, message: "请选择菜单类型", trigger: "change" }],
  order: [{ required: true, message: "请输入显示排序", trigger: "blur" }],
}

defineExpose({
  getMenuList,
})

onMounted(() => {
  getMenuList()
})
</script>

<template>
  <div class="table-container">
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
      row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column prop="name" label="菜单名称" min-width="150" align="left" />
      <el-table-column prop="menu_type" label="菜单类型" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.menu_type === 'catalog' ? 'warning' : 'success'" effect="plain">
            {{ row.menu_type === "catalog" ? "目录" : "菜单" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标" mix-width="100" align="center">
        <template #default="{ row }">
          <el-icon :size="16" :color="row.icon">
            <component :is="row.icon" />
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="path" label="路由路径" min-width="150" align="center" />
      <el-table-column prop="component" label="组件路径" min-width="150" align="center" />
      <el-table-column prop="order" label="排序" width="80" align="center" />
      <el-table-column prop="redirect" label="重定向" min-width="180" align="center">
        <template #default="{ row }">
          {{ !row.parent_id ? row.redirect : "-" }}
        </template>
      </el-table-column>
      <el-table-column prop="is_hidden" label="显示状态" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.is_hidden ? 'info' : 'success'" effect="plain">
            {{ row.is_hidden ? "隐藏" : "显示" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="keepalive" label="页面缓存" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.keepalive ? 'success' : 'info'" effect="plain">
            {{ row.keepalive ? "是" : "否" }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="240" fixed="right" align="center">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="handleEdit(row)">
            <el-icon><Edit /></el-icon>
          </el-button>
          <el-button type="danger" size="small" @click="handleDelete(row)">
            <el-icon><Delete /></el-icon>
          </el-button>
          <el-button
            v-if="row.menu_type === 'catalog'"
            type="success"
            size="small"
            @click="handleAddChild(row)"
          >
            <el-icon><Plus /></el-icon>子菜单
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      :title="editForm.id === 0 ? '新增菜单' : '编辑菜单'"
      width="600px"
      :close-on-click-modal="false"
      @close="handleEditClose"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="rules" label-width="100px">
        <el-form-item label="菜单类型" prop="menu_type">
          <el-radio-group v-model="editForm.menu_type">
            <el-radio label="catalog">目录</el-radio>
            <el-radio label="menu">菜单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parent_id">
          <el-tree-select
            v-model="editForm.parent_id"
            :data="menuTreeData"
            :props="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="请选择上级菜单"
            check-strictly
            default-expand-all
            clearable
            style="width: 100%"
            :disabled="editForm.id === 0"
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="editForm.path" placeholder="请输入路由路径" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="editForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="editForm.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item label="显示排序" prop="order">
          <el-input-number v-model="editForm.order" :min="1" :max="999" />
        </el-form-item>
        <el-form-item label="重定向" prop="redirect" v-if="!editForm.parent_id">
          <el-input v-model="editForm.redirect" placeholder="请输入重定向路径" />
        </el-form-item>
        <el-form-item label="隐藏菜单">
          <el-switch v-model="editForm.is_hidden" />
        </el-form-item>
        <el-form-item label="页面缓存">
          <el-switch v-model="editForm.keepalive" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="editForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
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
}

:deep(.el-button.el-button--small:has(.el-icon + span)) {
  padding: 6px 12px;
  width: auto;
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

:deep(.el-switch.is-checked .el-switch__core) {
  border-color: #67c23a;
  background-color: #67c23a;
}

:deep(.el-tree-select) {
  width: 100%;
}

:deep(.el-select-dropdown__item) {
  padding: 8px 12px;
}
</style>
