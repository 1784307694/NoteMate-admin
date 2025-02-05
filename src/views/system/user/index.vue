<template>
  <div class="container">
    <div>
      <Search />
    </div>
    <div class="content-box">
      <div class="content-header">
        <Header />
      </div>
      <div class="content-table">
        <Table />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Search from "./components/search.vue"
import Header from "./components/header.vue"
import Table from "./components/table.vue"
</script>

<style scoped>
.container {
  height: 100%;
  background-color: #f5f6fb;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  padding: 24px 32px;
  border-bottom: 1px solid var(--el-border-color-lighter);
}

.content-table {
  flex: 1;
  padding: 24px 32px;
  overflow: auto;
}
</style>
