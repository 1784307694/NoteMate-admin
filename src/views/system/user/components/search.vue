<script setup lang="ts">
import { ref } from "vue"

interface SearchForm {
  username: string
  email: string
  phone: string
  status: boolean | undefined
  dateRange: [Date, Date] | undefined
}

const searchForm = ref<SearchForm>({
  username: "",
  email: "",
  phone: "",
  status: undefined,
  dateRange: undefined,
})

const handleReset = () => {
  searchForm.value = {
    username: "",
    email: "",
    phone: "",
    status: undefined,
    dateRange: undefined,
  }
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
              v-model="searchForm.status"
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
          <el-button type="primary" class="search-button">
            <el-icon><Search /></el-icon>查询
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<style scoped>
.search {
  padding: 24px 32px;
  margin: 16px;
  border-radius: 8px;
  background-color: #f5f6fb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
}

:deep(.el-form-item) {
  margin-bottom: 18px;
}

:deep(.el-form-item__label) {
  color: #606266;
  font-weight: normal;
}

:deep(.el-input),
:deep(.el-select),
:deep(.el-date-editor) {
  --el-input-height: 40px !important;
  height: 40px !important;
  line-height: 40px !important;
  border-radius: 4px;
}

:deep(.el-input__wrapper),
:deep(.el-select__wrapper),
:deep(.el-date-editor.el-input__wrapper) {
  height: 40px !important;
  line-height: 40px !important;
  padding: 1px 11px !important;
  box-shadow: 0 0 0 1px #dcdfe6 inset;
}

:deep(.el-input__wrapper:hover),
:deep(.el-select .el-input__wrapper:hover),
:deep(.el-date-editor.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c0c4cc inset;
}

:deep(.el-input__wrapper.is-focus),
:deep(.el-select .el-input.is-focus .el-input__wrapper),
:deep(.el-date-editor.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #67c23a inset !important;
}

.input-icon,
.select-icon,
.date-icon {
  color: #909399;
  font-size: 16px;
}

.el-button {
  height: 40px;
  padding: 0 20px;
  font-weight: 500;
  border-radius: 4px;
  transition: all 0.3s;
}

.reset-button {
  color: #606266;
  border: 1px solid #dcdfe6;
  background: #fff;
  margin-right: 12px;
}

.reset-button:hover {
  color: #67c23a;
  border-color: #67c23a;
  background-color: #f0f8e1;
}

.search-button {
  background-color: #67c23a;
  border-color: #67c23a;
}

.search-button:hover {
  background-color: #85ce61;
  border-color: #85ce61;
}

.el-button .el-icon {
  margin-right: 4px;
  font-size: 16px;
}

:deep(.el-select),
:deep(.el-date-editor) {
  width: 100%;
}

:deep(.el-range-separator) {
  line-height: 40px !important;
}

:deep(.el-range-input) {
  height: 100% !important;
  line-height: 40px !important;
}

:deep(.el-input__inner) {
  height: 38px !important;
  line-height: 38px !important;
}
</style>
