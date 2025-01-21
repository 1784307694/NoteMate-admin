<script setup lang="ts">
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import type { TabPaneName } from "element-plus"

const route = useRoute()
const router = useRouter()

// 标签列表
const tabs = ref([
  {
    title: "工作台",
    path: "/workbench",
    closable: false,
  },
  {
    title: "一级菜单",
    path: "/schedule",
    closable: true,
  },
  {
    title: "菜单管理",
    path: "/menu",
    closable: true,
  },
  {
    title: "部门管理",
    path: "/department",
    closable: true,
  },
  {
    title: "审计日志",
    path: "/audit",
    closable: true,
  },
  {
    title: "API管理",
    path: "/api",
    closable: true,
  },
  {
    title: "角色管理",
    path: "/role",
    closable: true,
  },
])

// 当前激活的标签
const activeTab = ref("/workbench")

// 关闭标签
const handleClose = (path: TabPaneName) => {
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
  if (tab.paneName) {
    router.push(tab.paneName)
  }
}
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
      />
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
  padding: 0 16px !important;
  margin-right: 6px !important;
  border-radius: 4px !important;
  border: none !important;
  background-color: #f0f2f5;
  color: #666;
  transition: all 0.3s;
}

:deep(.el-tabs__item.is-active) {
  background-color: #fff2f0;
  color: #ff4d4f;
}

:deep(.el-tabs__item:hover) {
  color: #ff4d4f;
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

:deep(.el-tabs__item:first-child) {
  background-color: #fff7e6;
  color: #fa8c16;
}

:deep(.el-tabs__item:first-child.is-active) {
  background-color: #fff2f0;
  color: #ff4d4f;
}
</style>
