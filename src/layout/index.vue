<script setup lang="ts">
import Sidebar from "./components/sidebar/index.vue"
import Header from "./components/header/index.vue"
import { provide, ref } from "vue"

const isCollapse = ref(false)
// 提供isCollapse给孙组件之间通信
provide("isCollapse", isCollapse)
</script>

<template>
  <div class="common-layout">
    <!-- 侧边栏 -->
    <el-container>
      <el-aside :width="isCollapse ? '64px' : '220px'">
        <Sidebar />
      </el-aside>
      <el-container class="right-container">
        <!-- 头部 -->
        <el-header>
          <Header></Header>
        </el-header>
        <!-- 主体 -->
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  height: 100vh;
  overflow: hidden;
}

.el-container {
  height: 100%;
}

.right-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.el-aside {
  height: 100%;
  transition: width 0.3s;
  background-color: #fff;
  box-shadow: 1px 0 4px rgba(0, 0, 0, 0.08);
  border-right: 1px solid #e4e7ed;
}

.el-header {
  height: 110px;
  padding-left: 6px;
  background-color: #fff;
}

.el-main {
  flex: 1;
  overflow: auto;
  padding: 5px;
  background-color: #f5f6fb;
}
</style>
