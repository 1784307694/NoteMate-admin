<script setup lang="ts">
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()

// 面包屑数据
const breadcrumbs = ref<{ title: string; path?: string }[]>([])

// 监听路由变化更新面包屑
watch(
  () => route.path,
  () => {
    const paths = route.path.split("/").filter(Boolean)
    breadcrumbs.value = paths.map((path, index) => {
      const fullPath = "/" + paths.slice(0, index + 1).join("/")
      return {
        title: path,
        path: fullPath,
      }
    })
  },
  { immediate: true },
)

// 点击面包屑导航
const handleClick = (path?: string) => {
  if (path) {
    router.push(path)
  }
}
</script>

<template>
  <div class="breadcrumb-container">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item
        v-for="item in breadcrumbs"
        :key="item.path"
        :to="item.path ? { path: item.path } : ''"
      >
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
}

:deep(.el-breadcrumb__inner.is-link:hover) {
  color: var(--el-color-primary);
}
</style>
