<script setup lang="ts">
import { useRouter } from "vue-router"

const router = useRouter()

const handleBack = () => {
  router.push("/")
}
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <h1 class="error-title">404</h1>
      <h2 class="error-subtitle">抱歉，您访问的页面不存在</h2>
      <p class="error-desc">请检查您输入的网址是否正确，或者点击下面的按钮返回首页</p>
      <el-button type="primary" @click="handleBack">返回首页</el-button>
    </div>
  </div>
</template>

<style scoped>
.error-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f6fb;
}

.error-content {
  text-align: center;
  padding: 48px;
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
}

.error-title {
  font-size: 120px;
  font-weight: bold;
  color: #67c23a;
  margin: 0;
  line-height: 1;
  text-shadow: 4px 4px 0 #e5f2d9;
}

.error-subtitle {
  font-size: 24px;
  color: var(--el-text-color-primary);
  margin: 24px 0 16px;
  font-weight: 500;
}

.error-desc {
  font-size: 16px;
  color: var(--el-text-color-secondary);
  margin-bottom: 32px;
}

:deep(.el-button--primary) {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  height: auto;
  background-color: #67c23a;
  border-color: #67c23a;
}

:deep(.el-button--primary:hover) {
  background-color: #85ce61;
  border-color: #85ce61;
}
</style>
