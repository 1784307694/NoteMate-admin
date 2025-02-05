<script setup lang="ts">
import { ref, onMounted } from "vue"
import { Plus, Refresh } from "@element-plus/icons-vue"
import { ElMessage } from "element-plus"
import api from "@/api"

const emit = defineEmits(["refresh"])

const handleRefresh = () => {
  emit("refresh")
}

const dialogVisible = ref(false)
const menuFormRef = ref()

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

interface MenuForm {
  name: string
  path: string
  component: string
  icon: string
  parent_id: number | null
  menu_type: "catalog" | "menu"
  order: number
  redirect: string
  is_hidden: boolean
  keepalive: boolean
  remark: string
}

const menuForm = ref<MenuForm>({
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
})

// 菜单树数据
const menuTreeData = ref<Menu[]>([])

// 获取菜单列表
const getMenuList = async () => {
  try {
    const res = await api.menu.getList({ page_size: 9999 })
    menuTreeData.value = [
      {
        id: 0,
        name: "根菜单",
        path: "",
        component: "",
        icon: "",
        parent_id: -1,
        menu_type: "catalog",
        order: 0,
        redirect: "",
        is_hidden: false,
        keepalive: false,
        remark: "",
        created_at: "",
        updated_at: "",
        children: res.data,
      },
    ]
  } catch (error) {
    console.error("获取菜单列表失败:", error)
  }
}

const handleAdd = () => {
  dialogVisible.value = true
}

const handleClose = () => {
  menuFormRef.value?.resetFields()
  // 重置时也设置为第一个菜单
  if (menuTreeData.value.length > 0) {
    menuForm.value.parent_id = menuTreeData.value[0].id
  }
  dialogVisible.value = false
}

const handleSubmit = () => {
  menuFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      try {
        // 如果 parent_id 为 null，设置为 0
        const submitData = {
          ...menuForm.value,
          parent_id: menuForm.value.parent_id ?? 0,
        }
        await api.menu.create(submitData)
        ElMessage.success("创建菜单成功")
        handleClose()
        emit("refresh")
      } catch (error) {
        console.error("创建菜单失败:", error)
        ElMessage.error("创建菜单失败")
      }
    }
  })
}

const rules = {
  name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
  path: [{ required: true, message: "请输入路由路径", trigger: "blur" }],
  component: [{ required: true, message: "请输入组件路径", trigger: "blur" }],
  menu_type: [{ required: true, message: "请选择菜单类型", trigger: "change" }],
  order: [{ required: true, message: "请输入显示排序", trigger: "blur" }],
}

onMounted(() => {
  getMenuList()
})
</script>

<template>
  <div class="header-content">
    <el-text class="title">菜单列表</el-text>
    <div class="button-group">
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>新增根菜单
      </el-button>
      <el-button type="primary" @click="handleRefresh">
        <el-icon><Refresh /></el-icon>刷新
      </el-button>
    </div>

    <el-dialog
      v-model="dialogVisible"
      title="新增菜单"
      width="600px"
      :close-on-click-modal="false"
      @close="handleClose"
    >
      <el-form ref="menuFormRef" :model="menuForm" :rules="rules" label-width="100px">
        <el-form-item label="菜单类型" prop="menu_type">
          <el-radio-group v-model="menuForm.menu_type">
            <el-radio label="catalog">目录</el-radio>
            <el-radio label="menu">菜单</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上级菜单" prop="parent_id">
          <el-tree-select
            v-model="menuForm.parent_id"
            :data="menuTreeData"
            :props="{ label: 'name', value: 'id', children: 'children' }"
            placeholder="请选择上级菜单"
            check-strictly
            default-expand-all
            clearable
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="menuForm.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="menuForm.path" placeholder="请输入路由路径" />
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标" />
        </el-form-item>
        <el-form-item label="显示排序" prop="order">
          <el-input-number v-model="menuForm.order" :min="1" :max="999" />
        </el-form-item>
        <el-form-item label="重定向" prop="redirect">
          <el-input v-model="menuForm.redirect" placeholder="请输入重定向路径" />
        </el-form-item>
        <el-form-item label="隐藏菜单">
          <el-switch v-model="menuForm.is_hidden" />
        </el-form-item>
        <el-form-item label="页面缓存">
          <el-switch v-model="menuForm.keepalive" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="menuForm.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
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

.button-group {
  display: flex;
  gap: 8px;
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
