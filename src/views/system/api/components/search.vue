#
<script setup lang="ts">
import { ref } from "vue"
import { Search, Refresh } from "@element-plus/icons-vue"

interface SearchForm {
  path: string
  method: string
  description: string
  tags: string
}

const emit = defineEmits(["search"])

const searchForm = ref<SearchForm>({
  path: "",
  method: "",
  description: "",
  tags: "",
})

const methodOptions = [
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "DELETE", value: "DELETE" },
]

const handleSearch = () => {
  emit("search", { ...searchForm.value })
}

const handleReset = () => {
  searchForm.value = {
    path: "",
    method: "",
    description: "",
    tags: "",
  }
  emit("search", {})
}
</script>

<template>
  <div class="search">
    <el-form :model="searchForm" label-width="100px">
      <el-row :gutter="24">
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="API路径">
            <el-input v-model="searchForm.path" placeholder="请输入查询的API路径" clearable />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="请求方式">
            <el-select
              v-model="searchForm.method"
              placeholder="请选择请求方式"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in methodOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="API简介">
            <el-input
              v-model="searchForm.description"
              placeholder="请输入查询的API简介"
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8" :lg="6">
          <el-form-item label="Tags">
            <el-input v-model="searchForm.tags" placeholder="请输入查询的Tags" clearable />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24">
        <el-col :span="24" style="text-align: right; margin-top: 16px">
          <el-button @click="handleReset" class="reset-button">
            <el-icon><Refresh /></el-icon>重置
          </el-button>
          <el-button type="primary" class="search-button" @click="handleSearch">
            <el-icon><Search /></el-icon>查询
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style scoped>
.search {
  padding: 16px 24px;
  margin-bottom: 12px;
  border-radius: 8px;
  background-color: var(--el-bg-color);
  box-shadow: var(--el-box-shadow-light);
}

:deep(.el-form-item) {
  margin-bottom: 16px;
}

:deep(.el-input__wrapper),
:deep(.el-select .el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

:deep(.el-input__wrapper:hover),
:deep(.el-select .el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-border-color-darker) inset;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-select .el-input.is-focus .el-input__wrapper) {
  box-shadow: 0 0 0 1px #67c23a inset !important;
}

.el-button {
  height: 32px;
  padding: 0 16px;
  font-weight: 500;
  border-radius: 4px;
}

.reset-button {
  margin-right: 8px;
}

.reset-button:hover {
  color: #67c23a;
  border-color: #67c23a;
  background-color: #f0f9eb;
}

.search-button {
  background-color: #67c23a;
  border-color: #67c23a;
  color: #fff;
}

.search-button:hover {
  background-color: #85ce61;
  border-color: #85ce61;
}

:deep(.el-icon) {
  margin-right: 4px;
  font-size: 14px;
}
</style>
