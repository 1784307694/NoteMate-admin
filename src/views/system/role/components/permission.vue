<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import api from "@/api"
import { ElMessage } from "element-plus"

interface MenuPermission {
  id: number
  name: string
  children?: MenuPermission[]
}

interface ApiPermission {
  id: number
  summary: string
  tags: string
  children?: ApiPermission[]
}

interface ApiGroupPermission {
  id: string
  name: string
  children: ApiPermission[]
}

interface RoleAuthorizedResponse {
  id: number
  name: string
  desc: string
  created_at: string
  updated_at: string
  apis: Array<{
    id: number
    path: string
    method: string
    summary: string
    tags: string
    created_at: string
    updated_at: string
  }>
  menus: Array<{
    id: number
    name: string
    menu_type: string
    icon: string
    path: string
    order: number
    parent_id: number
    is_hidden: boolean
    component: string
    keepalive: boolean
    redirect: string | null
    created_at: string
    updated_at: string
  }>
}

interface Props {
  roleId: number
  roleName: string
}

const props = defineProps<Props>()
const emit = defineEmits(["success"])

const activeTab = ref("menu")
const loading = ref(false)
const menuPermissions = ref<MenuPermission[]>([])
const apiPermissions = ref<ApiGroupPermission[]>([])
const checkedMenuKeys = ref<number[]>([])
const checkedApiKeys = ref<number[]>([])

// 将API列表按tags分组
const groupApisByTags = (apis: any[]) => {
  // 先按tags分组
  const groupedApis: { [key: string]: any[] } = {}
  apis.forEach((api) => {
    const tag = api.tags || "其他"
    if (!groupedApis[tag]) {
      groupedApis[tag] = []
    }
    groupedApis[tag].push({
      ...api,
      name: api.summary, // 添加name属性以统一显示
    })
  })

  // 转换为树形结构
  return Object.entries(groupedApis).map(([tag, apis], index) => ({
    id: `group_${index}`, // 使用唯一的组ID
    name: tag,
    children: apis,
  }))
}

// 存储所有API的映射关系
const apiMap = ref<Map<number, { path: string; method: string }>>(new Map())

// 获取所有权限数据
const getPermissions = async () => {
  if (!props.roleId) {
    return
  }

  loading.value = true
  try {
    // 获取所有菜单和API
    console.log("Fetching permissions...")
    const [menuRes, apiRes] = await Promise.all([
      api.menu.getList({ page_size: 9999 }),
      api.api.getList({ page_size: 9999 }),
    ])

    menuPermissions.value = menuRes.data || []

    // 更新API映射
    apiMap.value.clear()
    apiRes.data?.forEach((api) => {
      apiMap.value.set(api.id, { path: api.path, method: api.method })
    })
    apiPermissions.value = groupApisByTags(apiRes.data || [])

    // 获取角色已有权限
    const { data } = await api.role.getAuthorized({ id: props.roleId })
    const rolePermission = data as RoleAuthorizedResponse

    // 设置选中的菜单和API
    const menuIds = rolePermission.menus.map((menu) => menu.id)
    const apiIds = rolePermission.apis.map((api) => api.id)

    checkedMenuKeys.value = menuIds
    checkedApiKeys.value = apiIds
  } catch (error) {
    console.error("获取权限列表失败:", error)
    ElMessage.error("获取权限列表失败")
  } finally {
    loading.value = false
  }
}

// 重置选中状态
const resetCheckedKeys = () => {
  console.log("Resetting checked keys")
  checkedMenuKeys.value = []
  checkedApiKeys.value = []
}

// 处理API树节点选中
const handleApiCheck = (node: any, { checkedKeys }: { checkedKeys: any[] }) => {
  // 过滤掉分组节点的ID，并且确保ID是数字类型
  checkedApiKeys.value = checkedKeys
    .filter((key) => !String(key).startsWith("group_"))
    .map((id) => Number(id))
}

// 处理菜单树节点选中
const handleMenuCheck = (
  node: any,
  { checkedKeys, halfCheckedKeys }: { checkedKeys: any[]; halfCheckedKeys: any[] },
) => {
  console.log("Menu check event:", { node, checkedKeys, halfCheckedKeys })
  checkedMenuKeys.value = [...checkedKeys, ...halfCheckedKeys].map((id) => Number(id))
  console.log("Updated checkedMenuKeys:", checkedMenuKeys.value)
}

// 处理权限变更
const handleSubmit = async () => {
  try {
    // 将选中的API ID转换为包含path和method的对象
    const apiInfos = checkedApiKeys.value
      .map((id) => apiMap.value.get(id))
      .filter((info) => info !== undefined) as { path: string; method: string }[]

    console.log("Submitting permissions:", {
      id: props.roleId,
      menu_ids: checkedMenuKeys.value,
      api_infos: apiInfos,
    })

    await api.role.updateAuthorized({
      id: props.roleId,
      menu_ids: checkedMenuKeys.value,
      api_infos: apiInfos,
    })

    ElMessage.success("更新权限成功")
    emit("success")
  } catch (error) {
    console.error("更新权限失败:", error)
    ElMessage.error("更新权限失败")
  }
}

// 监听roleId变化，重新加载权限数据
watch(
  () => props.roleId,
  (newVal) => {
    resetCheckedKeys()
    getPermissions()
  },
  { immediate: true },
)

defineExpose({
  handleSubmit,
})
</script>

<template>
  <div v-loading="loading" class="permission-content">
    <div class="tabs-header">
      <div class="tabs-wrapper">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="菜单权限" name="menu">
            <el-tree
              ref="menuTreeRef"
              :data="menuPermissions"
              show-checkbox
              node-key="id"
              :props="{ label: 'name', children: 'children' }"
              v-model:checked-keys="checkedMenuKeys"
              :default-checked-keys="checkedMenuKeys"
              @check="handleMenuCheck"
            />
          </el-tab-pane>
          <el-tab-pane label="接口权限" name="api">
            <el-tree
              ref="apiTreeRef"
              :data="apiPermissions"
              show-checkbox
              node-key="id"
              :props="{
                label: (data) => data.name,
                children: 'children',
              }"
              v-model:checked-keys="checkedApiKeys"
              :default-checked-keys="checkedApiKeys"
              @check="handleApiCheck"
            />
          </el-tab-pane>
        </el-tabs>
        <div class="action-buttons">
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.permission-content {
  height: 100%;
  padding: 0 20px;
}

.tabs-wrapper {
  position: relative;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.action-buttons {
  position: absolute;
  right: 0;
  top: 0;
  height: 40px;
  display: flex;
  align-items: center;
  padding-right: 16px;
}

:deep(.el-tabs__header) {
  margin-bottom: 16px;
  padding-right: 80px;
}

:deep(.el-tabs__nav-wrap::after) {
  height: 0;
}

:deep(.el-tree) {
  margin-top: 12px;
  background: none;
}

:deep(.el-tree-node__content) {
  height: 32px;
}

:deep(.el-tree-node__content:hover) {
  background-color: var(--el-fill-color-light);
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: #67c23a;
  border-color: #67c23a;
}

:deep(.el-checkbox__inner:hover) {
  border-color: #67c23a;
}

:deep(.el-tabs__item.is-active) {
  color: #67c23a;
}

:deep(.el-tabs__active-bar) {
  background-color: #67c23a;
}

:deep(.el-button--primary) {
  margin-left: 16px;
}
</style>
