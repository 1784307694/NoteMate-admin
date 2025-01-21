<script setup lang="ts">
import MenuCollapse from "./components/MenuCollapse.vue"
import Breadcrumb from "./components/Breadcrumb.vue"
import TabBar from "./components/TabBar.vue"
import UserInfo from "./components/UserInfo.vue"
</script>

<template>
  <div class="header-container">
    <!-- 顶部工具栏 -->
    <div class="top-bar">
      <div class="left">
        <MenuCollapse />
        <Breadcrumb />
      </div>
      <div class="right">
        <UserInfo />
      </div>
    </div>
    <!-- 标签栏 -->
    <div class="tab-bar">
      <TabBar />
    </div>
  </div>
</template>

<style scoped>
.header-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.top-bar {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
}

.left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.right {
  display: flex;
  align-items: center;
}

.tab-bar {
  flex: 1;
  background-color: #fff;
}
</style>
