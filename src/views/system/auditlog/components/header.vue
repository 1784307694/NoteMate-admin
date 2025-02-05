<script setup lang="ts">
const emit = defineEmits(["refresh"])

const handleRefresh = () => {
  emit("refresh")
}
</script>

<template>
  <div class="header-content">
    <el-text class="title">审计日志</el-text>
    <el-button type="primary" @click="handleRefresh">
      <el-icon><Refresh /></el-icon>刷新
    </el-button>
  </div>
</template>

<style scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
</style>
