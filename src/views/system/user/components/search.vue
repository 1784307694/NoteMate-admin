<script setup lang="ts">
import { ref } from "vue"

interface SearchForm {
  username: string
  email: string
  phone: string
  is_active: boolean | undefined
  dateRange: [Date, Date] | undefined
}

const emit = defineEmits(["search"])

const searchForm = ref<SearchForm>({
  username: "",
  email: "",
  phone: "",
  is_active: undefined,
  dateRange: undefined,
})

const handleSearch = () => {
  console.log(searchForm.value)
  emit("search", {
    username: searchForm.value.username,
    email: searchForm.value.email,
    phone: searchForm.value.phone,
    is_active: searchForm.value.is_active,
    start_time: searchForm.value.dateRange?.[0]?.toISOString(),
    end_time: searchForm.value.dateRange?.[1]?.toISOString(),
  })
}
// 重置
const handleReset = () => {
  searchForm.value = {
    username: "",
    email: "",
    phone: "",
    is_active: undefined,
    dateRange: undefined,
  }
  emit("search", {})
}
</script>

<template>
  <div class="search">
    <el-form :model="searchForm" label-width="80px">
      <el-row :gutter="32">
        <el-col :span="7">
          <el-form-item label="用户名">
            <el-input v-model="searchForm.username" placeholder="请输入查询的用户名" clearable>
              <template #prefix>
                <el-icon class="input-icon"><User /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="邮箱">
            <el-input v-model="searchForm.email" placeholder="请输入查询的邮箱" clearable>
              <template #prefix>
                <el-icon class="input-icon"><Message /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="手机号码">
            <el-input v-model="searchForm.phone" placeholder="请输入查询的手机号码" clearable>
              <template #prefix>
                <el-icon class="input-icon"><Phone /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="32">
        <el-col :span="7">
          <el-form-item label="状态">
            <el-select
              v-model="searchForm.is_active"
              placeholder="请选择查询的状态"
              clearable
              style="width: 100%"
            >
              <template #prefix>
                <el-icon class="select-icon"><CircleCheck /></el-icon>
              </template>
              <el-option label="启用" :value="true" />
              <el-option label="禁用" :value="false" />
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
        <el-col :span="10" style="text-align: right; margin-top: 4px">
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
