<script setup lang="ts">
import useUserStore from "@/stores/user"

const userStore = useUserStore()
</script>

<template>
  <div>
    <h1>workbench</h1>
    <el-button @click="userStore.getUserInfo">获取用户信息</el-button>
    <el-button @click="userStore.logout">退出</el-button>
  </div>
</template>

<style scoped></style>
