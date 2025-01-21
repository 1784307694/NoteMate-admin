<script setup lang="ts">
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/user"

const router = useRouter()
const userStore = useUserStore()

const handleCommand = (command: string) => {
  if (command === "logout") {
    userStore.logout()
    router.push("/login")
  }
}
</script>

<template>
  <el-dropdown @command="handleCommand">
    <el-space>
      <el-avatar
        :size="32"
        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
      />
      <span class="username">{{ userStore.username }}</span>
      <el-icon><ArrowDown /></el-icon>
    </el-space>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="profile">个人信息</el-dropdown-item>
        <el-dropdown-item command="settings">系统设置</el-dropdown-item>
        <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
.username {
  font-size: 14px;
  color: #333;
}
</style>
