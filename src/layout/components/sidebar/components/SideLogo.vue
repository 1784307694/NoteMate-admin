<script setup lang="ts">
import logo from "@/assets/img/logo.jpg"
import { inject, type Ref } from "vue"

const isCollapse = inject<Ref<boolean>>("isCollapse")!
</script>

<template>
  <div class="side-logo">
    <el-image class="logo-image" :src="logo" alt="logo" :class="{ centered: isCollapse }" />
    <h1 v-show="!isCollapse" class="logo-text">NoteMate Admin</h1>
  </div>
</template>

<style scoped>
.side-logo {
  display: flex;
  align-items: center;
  padding: 0 16px;
  height: 60px;
}

.logo-image {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}

.logo-image.centered {
  margin-right: 0;
  margin-left: 4px;
}

.logo-text {
  color: #333;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}
</style>
