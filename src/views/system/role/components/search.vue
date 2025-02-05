<script setup lang="ts">
import { ref } from "vue"

interface SearchForm {
  role_name: string
  created_at: [Date, Date] | undefined
}

const emit = defineEmits(["search"])

const searchForm = ref<SearchForm>({
  role_name: "",
  created_at: undefined,
})

const handleSearch = () => {
  const params: Record<string, any> = {
    role_name: searchForm.value.role_name,
  }

  if (searchForm.value.created_at && searchForm.value.created_at.length === 2) {
    params.start_time = searchForm.value.created_at[0]
    params.end_time = searchForm.value.created_at[1]
  }

  emit("search", params)
}

const handleReset = () => {
  searchForm.value = {
    role_name: "",
    created_at: undefined,
  }
  emit("search", {})
}
</script>

<template>
  <div class="search">
    <el-form :model="searchForm" label-width="80px">
      <el-row :gutter="32">
        <el-col :span="7">
          <el-form-item label="角色名称">
            <el-input
              v-model="searchForm.role_name"
              placeholder="请输入查询的角色名称"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon class="input-icon"><Search /></el-icon>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="searchForm.created_at"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="YYYY-MM-DD"
              :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
            />
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

:deep(.input-icon) {
  color: var(--el-text-color-secondary);
}
</style>
