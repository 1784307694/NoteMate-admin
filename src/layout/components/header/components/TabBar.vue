<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue"
import { useRoute, useRouter } from "vue-router"
import type { TabPaneName } from "element-plus"
import { lStorage } from "@/utils/storage"

interface TabItem {
  title: string
  path: string
  closable: boolean
  icon?: string
}

const route = useRoute()
const router = useRouter()

// 工作台标签
const defaultTab: TabItem = {
  title: "工作台",
  path: "/workbench",
  closable: false,
  icon: "Monitor",
}

// 标签列表
const tabs = ref<TabItem[]>([defaultTab])

// 当前激活的标签
const activeTab = ref("/workbench")

// 从本地存储恢复标签
function restoreTabs() {
  try {
    const savedTabs = lStorage.get("TABS")

    if (savedTabs && Array.isArray(savedTabs)) {
      // 确保工作台标签始终存在
      const parsedTabs = savedTabs.filter((tab: TabItem) => {
        return tab && typeof tab === "object" && tab.path && tab.path !== "/workbench"
      })

      tabs.value = [defaultTab, ...parsedTabs]

      // 如果当前路由不在标签列表中且不是工作台，添加它
      if (
        route.name &&
        route.path !== "/" &&
        route.path !== "/workbench" &&
        !tabs.value.some((tab) => tab.path === route.path)
      ) {
        addTab(route)
      }
    } else {
      tabs.value = [defaultTab]
    }
  } catch (error) {
    console.error("恢复标签失败:", error)
    tabs.value = [defaultTab]
  }
}

// 保存标签到本地存储
function saveTabs() {
  try {
    // 过滤掉无效的标签数据
    const validTabs = tabs.value.filter((tab) => tab && typeof tab === "object" && tab.path)
    lStorage.set("TABS", validTabs)
  } catch (error) {
    console.error("保存标签失败:", error)
  }
}

// 添加标签
function addTab(route: any) {
  if (!route || !route.path || !route.name) return

  const { path, name, meta } = route
  // 如果标签已存在，不重复添加
  if (tabs.value.some((tab) => tab.path === path)) {
    return
  }

  // 添加新标签
  tabs.value.push({
    title: name as string,
    path: path,
    closable: path !== "/workbench",
    icon: meta?.icon,
  })
}

// 关闭标签
const handleClose = (path: TabPaneName) => {
  if (!path || typeof path !== "string") return

  const index = tabs.value.findIndex((tab) => tab.path === path)
  if (index !== -1) {
    tabs.value.splice(index, 1)
    // 如果关闭的是当前标签，则跳转到最后一个标签
    if (path === activeTab.value) {
      const lastTab = tabs.value[tabs.value.length - 1]
      router.push(lastTab.path)
      activeTab.value = lastTab.path
    }
  }
}

// 切换标签
const handleClick = (tab: any) => {
  if (tab?.paneName && typeof tab.paneName === "string") {
    router.push(tab.paneName)
  }
}

// 监听路由变化
watch(
  () => route.path,
  (newPath) => {
    activeTab.value = newPath
    if (route.name && newPath !== "/" && newPath !== "/workbench") {
      addTab(route)
    }
  },
  { immediate: true },
)

// 组件挂载时恢复标签
onMounted(() => {
  restoreTabs()
  activeTab.value = route.path
  // 添加页面卸载前的保存事件
  window.addEventListener("beforeunload", saveTabs)
})

// 组件销毁前移除事件监听
onBeforeUnmount(() => {
  window.removeEventListener("beforeunload", saveTabs)
})
</script>

<template>
  <div class="tabs-container">
    <el-tabs v-model="activeTab" type="card" @tab-click="handleClick" @tab-remove="handleClose">
      <el-tab-pane
        v-for="tab in tabs"
        :key="tab.path"
        :label="tab.title"
        :name="tab.path"
        :closable="tab.closable"
      >
        <template #label>
          <el-icon v-if="tab.icon" :size="14"><component :is="tab.icon" /></el-icon>
          <span style="margin-left: 4px">{{ tab.title }}</span>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.tabs-container {
  height: 100%;
  padding: 8px 16px 0;
}

:deep(.el-tabs__header) {
  margin: 0;
  border-bottom: none;
}

:deep(.el-tabs__nav) {
  border: none !important;
}

:deep(.el-tabs__item) {
  height: 32px !important;
  line-height: 32px !important;
  margin-right: 6px !important;
  border-radius: 4px !important;
  background-color: #f0f2f5;
  color: #666;
  transition: all 0.3s;
}

:deep(.el-tabs__item:first-child) {
  background-color: #f0f8e1;
  color: #333;
}

:deep(.el-tabs__item:first-child.is-active) {
  background-color: #f0f8e1;
  color: #333;
}

:deep(.el-tabs__item.is-active) {
  background-color: #f0f8e1 !important;
  color: #333 !important;
}

:deep(.el-tabs__item:hover) {
  background-color: #f0f8e1;
  color: #333;
}

:deep(.el-tabs__nav-wrap::after) {
  display: none;
}

:deep(.el-tabs__item .el-icon-close) {
  color: #999;
}

:deep(.el-tabs__item .el-icon-close:hover) {
  color: #ff4d4f;
  background-color: transparent;
  transform: scale(1.2);
}

:deep(.el-tabs__item .el-icon) {
  margin-right: 0;
  vertical-align: middle;
}
</style>
