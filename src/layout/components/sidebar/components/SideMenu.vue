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
    if (currentPath === path) {
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
    if (currentPath === menu.path) {
      return menu.path
    }

    // 检查子菜单
    if (menu.children) {
      for (const child of menu.children) {
        const fullChildPath = `${menu.path}/${child.path}`
        if (currentPath === fullChildPath) {
          return fullChildPath
        }
      }
    }
  }

  // 如果没有完全匹配，返回当前路径
  return currentPath
}

// 点击菜单回调
const handleSelect = (key: string) => {
  router.push(key)
}

// 更新激活的菜单项
function updateActivePath() {
  const currentPath = route.path
  const menuPath = findMenuPath(currentPath)
  defaultActive.value = menuPath
}

// 从后端获取菜单列表
async function getMenuList() {
  try {
    const res = await api.base.getUserMenu()
    menuData.value = res.data
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
      <el-icon class="menu-icon"><Monitor /></el-icon>
      <span>工作台</span>
    </el-menu-item>

    <template v-for="menu in menuData" :key="menu.path">
      <!-- 有子菜单的情况 -->
      <el-sub-menu
        v-if="menu.children && menu.children.length > 0"
        :index="menu.path"
        v-show="!menu.is_hidden"
      >
        <template #title>
          <el-icon class="menu-icon"><component :is="menu.icon || 'Menu'" /></el-icon>
          <span>{{ menu.name }}</span>
        </template>

        <el-menu-item
          v-for="child in menu.children"
          :key="child.path"
          :index="`${menu.path}/${child.path}`"
          v-show="!child.is_hidden"
        >
          <el-icon class="menu-icon"><component :is="child.icon || 'Menu'" /></el-icon>
          <span>{{ child.name }}</span>
        </el-menu-item>
      </el-sub-menu>

      <!-- 没有子菜单的情况 -->
      <el-menu-item v-else :index="menu.path" v-show="!menu.is_hidden">
        <el-icon class="menu-icon"><component :is="menu.icon || 'Menu'" /></el-icon>
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
  margin: 4px 8px 4px 0;
  border-radius: 4px;
}

/* 子菜单标题激活状态 */
.side-menu :deep(.el-sub-menu.is-active) {
  > .el-sub-menu__title {
    .menu-icon {
      color: #67c23a !important;
    }
  }
}

.side-menu :deep(.el-menu-item.is-active) {
  background-color: #f0f8e1;
  color: #333;
  border-left: 4px solid #67c23a;
  padding-left: 16px !important;

  .menu-icon {
    color: #67c23a !important;
  }
}

.side-menu :deep(.el-menu-item:hover) {
  background-color: #f0f8e1;
  color: #333;

  .menu-icon {
    color: #67c23a !important;
  }
}

.side-menu :deep(.el-sub-menu__title) {
  margin: 4px 8px 4px 0;
  border-radius: 4px;
}

.side-menu :deep(.el-sub-menu__title:hover) {
  background-color: #f0f8e1;
  color: #333;

  .menu-icon {
    color: #67c23a !important;
  }
}

.side-menu :deep(.menu-icon) {
  margin-right: 10px;
  width: 16px;
  height: 16px;
  position: relative;
  text-align: center;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 折叠状态下的样式 */
.side-menu:deep(.el-menu--collapse) {
  .menu-icon {
    margin: 0;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .el-menu-item,
  .el-sub-menu__title {
    margin: 4px 8px;
  }

  /* 折叠状态下的子菜单 */
  .el-sub-menu {
    &.is-active > .el-sub-menu__title {
      background-color: #f0f8e1;
      color: #333;

      .menu-icon {
        color: #67c23a !important;
      }
    }

    .el-sub-menu__title {
      &:hover {
        background-color: #f0f8e1;
        color: #333;

        .menu-icon {
          color: #67c23a !important;
        }
      }
    }
  }

  /* 折叠状态下的菜单项 */
  .el-menu-item {
    &.is-active {
      background-color: #f0f8e1;
      color: #333;
      border-left: none;
      padding-left: 20px !important;

      .menu-icon {
        color: #67c23a !important;
      }
    }

    &:hover {
      background-color: #f0f8e1;
      color: #333;

      .menu-icon {
        color: #67c23a !important;
      }
    }
  }
}

/* 弹出的子菜单样式 */
:global(.el-menu--popup-container) {
  .el-menu--popup {
    padding: 4px !important;
    border-radius: 4px !important;
    min-width: 200px !important;
    background: #fff !important;
    border: none !important;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;

    .el-menu-item {
      margin: 0;
      height: 40px !important;
      line-height: 40px !important;
      border-radius: 4px !important;

      &.is-active {
        background-color: #f0f8e1;
        color: #333;
        border-left: 4px solid #67c23a;
        padding-left: 16px !important;

        .menu-icon {
          color: #67c23a !important;
        }
      }

      &:hover {
        background-color: #f0f8e1;
        color: #333;

        .menu-icon {
          color: #67c23a !important;
        }
      }
    }
  }
}
</style>
