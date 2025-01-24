<script setup lang="ts">
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

interface BreadcrumbItem {
  title: string
  path: string
  icon: string
}

const route = useRoute()
const router = useRouter()

// 面包屑数据
const breadcrumbs = ref<BreadcrumbItem[]>([])

// 更新面包屑
function updateBreadcrumbs() {
  const matched = route.matched.filter((item) => item.name && item.path !== "/")
  breadcrumbs.value = matched.map((item) => ({
    title: item.name as string,
    path: item.path,
    icon: item.meta.icon as string,
  }))
}

// 监听路由变化
watch(
  () => route.path,
  () => {
    updateBreadcrumbs()
  },
  { immediate: true },
)

// 点击面包屑导航
const handleClick = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="breadcrumb-container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="item in breadcrumbs"
        :key="item.path"
        :to="{ path: item.path }"
        @click="handleClick(item.path)"
      >
        <el-icon v-if="item.icon" :size="14"><component :is="item.icon" /></el-icon>
        {{ item.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<style scoped>
.breadcrumb-container {
  display: flex;
  align-items: center;
  height: 50px;
}

:deep(.el-breadcrumb__inner) {
  color: #666;
  font-weight: normal;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s;
}

:deep(.el-breadcrumb__inner.is-link:hover) {
  color: #333;
  background-color: #f0f8e1;
}
</style>
