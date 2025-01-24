<script setup lang="ts">
import SideLogo from "./components/SideLogo.vue"
import SideMenu from "./components/SideMenu.vue"
</script>

<template>
  <div>
    <SideLogo />
    <el-scrollbar>
      <SideMenu />
    </el-scrollbar>
  </div>
</template>

<style scoped></style>
