<script setup lang="ts">
import { useRouter } from "vue-router"
import useUserStore from "@/stores/user"
import useTokenStore from "@/stores/token"

const router = useRouter()
const userStore = useUserStore()
const tokenStore = useTokenStore()

const handleCommand = (command: string) => {
  if (command === "logout") {
    userStore.logout()
    router.push("/login")
  }
  if (command === "profile") {
    router.push("/profile")
  }
}
</script>

<template>
  <el-dropdown @command="handleCommand">
    <el-space class="user-info">
      <el-avatar :size="46" :src="userStore.avatar" />
      <span class="username">{{ tokenStore.username }}</span>
      <el-icon><ArrowDown /></el-icon>
    </el-space>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="profile">
          <el-icon><InfoFilled /></el-icon>
          个人信息</el-dropdown-item
        >
        <el-dropdown-item divided command="logout">
          <el-icon><CircleClose /></el-icon>
          退出登录</el-dropdown-item
        >
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.user-info {
  cursor: pointer;
}
/* 去除下拉菜单的黑色边框 */
:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}

:deep(.el-dropdown-menu__item:focus, .el-dropdown-menu__item:not(.is-disabled):hover) {
  background-color: #f0f8e1 !important;
  color: #333 !important;
}

.username {
  font-size: 14px;
  color: #333;
}
</style>
