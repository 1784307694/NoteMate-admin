<script setup lang="ts">
import { ref } from "vue"
import Search from "./components/search.vue"
import Header from "./components/header.vue"
import Table from "./components/table.vue"

const tableRef = ref()

const handleSearch = (params: any) => {
  tableRef.value?.handleSearch(params)
}

const handleRefresh = () => {
  tableRef.value?.getApiList()
}
</script>

<template>
  <div class="container">
    <div>
      <Search @search="handleSearch" />
    </div>
    <div class="content-box">
      <div class="content-header">
        <Header @refresh="handleRefresh" />
      </div>
      <div class="content-table">
        <Table ref="tableRef" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  height: 90%;
  background-color: #f5f6fb;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.content-box {
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: var(--el-box-shadow-light);
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-header {
  padding: 16px 24px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.content-table {
  flex: 1;
  padding: 16px 24px;
  overflow: auto;
}
</style>
