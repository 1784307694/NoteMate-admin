<script setup lang="ts">
import { ref } from "vue"
import {
  Search,
  Refresh,
  Calendar,
  User,
  Menu,
  Operation,
  Document,
  CircleCheck,
} from "@element-plus/icons-vue"

interface SearchForm {
  username: string
  module: string
  method: string
  summary: string
  status: number | undefined
  dateRange: [Date, Date] | undefined
}

const emit = defineEmits(["search"])

const searchForm = ref<SearchForm>({
  username: "",
  module: "",
  method: "",
  summary: "",
  status: undefined,
  dateRange: undefined,
})

const handleSearch = () => {
  emit("search", {
    username: searchForm.value.username,
    module: searchForm.value.module,
    method: searchForm.value.method,
    summary: searchForm.value.summary,
    status: searchForm.value.status,
    start_time: searchForm.value.dateRange?.[0]?.toISOString(),
    end_time: searchForm.value.dateRange?.[1]?.toISOString(),
  })
}

const handleReset = () => {
  searchForm.value = {
    username: "",
    module: "",
    method: "",
    summary: "",
    status: undefined,
    dateRange: undefined,
  }
  emit("search", {})
}

const methodOptions = [
  { label: "GET", value: "GET" },
  { label: "POST", value: "POST" },
  { label: "PUT", value: "PUT" },
  { label: "DELETE", value: "DELETE" },
]

const statusOptions = [
  { label: "成功(200)", value: 200 },
  { label: "未授权(401)", value: 401 },
  { label: "禁止访问(403)", value: 403 },
  { label: "未找到(404)", value: 404 },
  { label: "服务器错误(500)", value: 500 },
]
</script>

<template>
  <div class="search">
    <el-form :model="searchForm" label-width="80px">
      <el-row :gutter="32">
        <el-col :span="7">
          <el-form-item label="操作人">
            <el-input v-model="searchForm.username" placeholder="请输入操作人名称" clearable>
              <template #prefix>
                <el-icon class="input-icon"><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="功能模块">
            <el-input v-model="searchForm.module" placeholder="请输入功能模块" clearable>
              <template #prefix>
                <el-icon class="input-icon"><Menu /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="请求方法">
            <el-select
              v-model="searchForm.method"
              placeholder="请选择请求方法"
              clearable
              style="width: 100%"
            >
              <template #prefix>
                <el-icon class="select-icon"><Operation /></el-icon>
              </template>
              <el-option
                v-for="item in methodOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="32">
        <el-col :span="7">
          <el-form-item label="接口描述">
            <el-input v-model="searchForm.summary" placeholder="请输入接口描述" clearable>
              <template #prefix>
                <el-icon class="input-icon"><Document /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="状态码">
            <el-select
              v-model="searchForm.status"
              placeholder="请选择状态码"
              clearable
              style="width: 100%"
            >
              <template #prefix>
                <el-icon class="select-icon"><CircleCheck /></el-icon>
              </template>
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="searchForm.dateRange"
              type="daterange"
              range-separator="-"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
              style="width: 100%"
            >
              <template #prefix>
                <el-icon class="date-icon"><Calendar /></el-icon>
              </template>
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="3" style="text-align: right; margin-top: 4px">
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
:deep(.el-select .el-input__wrapper),
:deep(.el-date-editor.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

:deep(.el-input__wrapper:hover),
:deep(.el-select .el-input__wrapper:hover),
:deep(.el-date-editor.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px var(--el-border-color-darker) inset;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-select .el-input.is-focus .el-input__wrapper),
:deep(.el-date-editor.el-input__wrapper.is-focus) {
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
