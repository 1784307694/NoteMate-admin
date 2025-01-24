<script setup lang="ts">
import { inject, ref, type Ref, onMounted, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import api from "@/api"

interface MenuItem {
  name: string
  path: string
  icon?: string
  is_hidden: boolean
  children?: MenuItem[]
}

const router = useRouter()
const route = useRoute()

const defaultActive = ref(route.path)
const isCollapse = inject<Ref<boolean>>("isCollapse")!
const menuData = ref<MenuItem[]>([])

// 查找菜单项的完整路径
function findFullPath(path: string, menus: MenuItem[] = menuData.value, parentPath = ""): string {
  for (const menu of menus) {
    // 当前层级的完整路径
    const currentPath = parentPath ? `${parentPath}/${menu.path}` : menu.path

    // 如果找到匹配的路径，返回完整路径
    if (menu.path === path) {
      return currentPath
    }

    // 如果有子菜单，递归查找
    if (menu.children && menu.children.length > 0) {
      const fullPath = findFullPath(path, menu.children, currentPath)
      if (fullPath) {
        return fullPath
      }
    }
  }
  return path // 如果没找到，返回原始路径
}

// 查找当前路由对应的菜单项
function findMenuPath(currentPath: string, menus: MenuItem[] = menuData.value): string {
  // 先检查是否完全匹配
  for (const menu of menus) {
    const menuPath = menu.path
    if (currentPath === menuPath) {
      return menuPath
    }

    // 检查子菜单
    if (menu.children) {
      for (const child of menu.children) {
        if (currentPath === `${menu.path}/${child.path}`) {
          return child.path
        }
      }
    }
  }

  // 如果没有完全匹配，返回当前路径
  return currentPath
}

const handleSelect = (key: string) => {
  const fullPath = findFullPath(key)
  console.log("跳转路径:", fullPath)
  router.push(fullPath)
}

// 更新激活的菜单项
function updateActivePath() {
  const currentPath = route.path
  const menuPath = findMenuPath(currentPath)
  defaultActive.value = menuPath
  console.log("当前激活路径:", menuPath)
}

async function getMenuList() {
  try {
    const res = await api.base.getUserMenu()
    menuData.value = res.data
    console.log("菜单数据:", menuData.value)
    // 获取菜单数据后更新激活路径
    updateActivePath()
  } catch (error) {
    console.error("获取菜单失败:", error)
  }
}

// 监听路由变化
watch(
  () => route.path,
  () => {
    updateActivePath()
  },
)

onMounted(() => {
  getMenuList()
})
</script>

<template>
  <el-menu
    :default-active="defaultActive"
    class="side-menu"
    :collapse="isCollapse"
    text-color="#333"
    @select="handleSelect"
  >
    <el-menu-item index="/workbench">
      <el-icon><Monitor /></el-icon>
      <span>工作台</span>
    </el-menu-item>

    <template v-for="menu in menuData" :key="menu.path">
      <!-- 有子菜单的情况 -->
      <el-sub-menu v-if="menu.children && menu.children.length > 0" :index="menu.path">
        <template #title>
          <el-icon><component :is="menu.icon || 'Menu'" /></el-icon>
          <span>{{ menu.name }}</span>
        </template>

        <el-menu-item
          v-for="child in menu.children"
          :key="child.path"
          :index="child.path"
          v-show="!child.is_hidden"
        >
          <el-icon><component :is="child.icon || 'Menu'" /></el-icon>
          <span>{{ child.name }}</span>
        </el-menu-item>
      </el-sub-menu>

      <!-- 没有子菜单的情况 -->
      <el-menu-item v-else :index="menu.path" v-show="!menu.is_hidden">
        <el-icon><component :is="menu.icon || 'Menu'" /></el-icon>
        <span>{{ menu.name }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<style scoped>
.side-menu {
  border-right: none;
  user-select: none;
}

.side-menu :deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
}

.side-menu :deep(.el-menu-item.is-active) {
  background-color: #f0f8e1;
  color: #333;
  border-right: 2px solid #333;
}

.side-menu :deep(.el-menu-item:hover) {
  background-color: #f0f8e1;
  color: #333;
}

.side-menu :deep(.el-sub-menu__title:hover) {
  background-color: #f0f8e1;
  color: #333;
}

.side-menu :deep(.el-menu-item .el-icon),
.side-menu :deep(.el-sub-menu .el-icon) {
  margin-right: 10px;
  width: 16px;
  height: 16px;
}

.side-menu:deep(.el-menu--collapse) {
  .el-menu-item .el-icon,
  .el-sub-menu .el-icon {
    margin: 0;
  }
}
</style>
