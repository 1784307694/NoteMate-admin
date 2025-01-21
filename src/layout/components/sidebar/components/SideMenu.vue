<script setup lang="ts">
import { inject, ref, type Ref } from "vue"
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()

const defaultActive = ref(route.path)

const isCollapse = inject<Ref<boolean>>("isCollapse")!

const handleSelect = (key: string) => {
  router.push(key)
}
</script>

<template>
  <el-menu
    :default-active="defaultActive"
    class="side-menu"
    :collapse="isCollapse"
    text-color="#333"
  >
    <el-menu-item index="/workbench">
      <el-icon><Monitor /></el-icon>
      <span>工作台</span>
    </el-menu-item>

    <el-sub-menu index="/system">
      <template #title>
        <el-icon><Setting /></el-icon>
        <span>系统管理</span>
      </template>

      <el-menu-item index="/user">
        <el-icon><User /></el-icon>
        <span>用户管理</span>
      </el-menu-item>

      <el-menu-item index="/role">
        <el-icon><UserFilled /></el-icon>
        <span>角色管理</span>
      </el-menu-item>

      <el-menu-item index="/menu">
        <el-icon><List /></el-icon>
        <span>菜单管理</span>
      </el-menu-item>

      <el-menu-item index="/api">
        <el-icon><Connection /></el-icon>
        <span>API管理</span>
      </el-menu-item>

      <el-menu-item index="/department">
        <el-icon><Tickets /></el-icon>
        <span>部门管理</span>
      </el-menu-item>

      <el-menu-item index="/audit">
        <el-icon><Document /></el-icon>
        <span>审计日志</span>
      </el-menu-item>
    </el-sub-menu>

    <el-sub-menu index="/schedule">
      <template #title>
        <el-icon><Timer /></el-icon>
        <span>一级菜单</span>
      </template>

      <el-menu-item index="/schedule">
        <el-icon><Timer /></el-icon>
        <span>二级菜单</span>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<style scoped>
.side-menu {
  border-right: none;
  user-select: none;
}

.side-menu :deep(.el-menu-item) {
  height: 50px;
  line-height: 50px;
}

.side-menu :deep(.el-menu-item.is-active) {
  background-color: #fff2f0;
  color: #ff4d4f;
  border-right: 2px solid #ff4d4f;
}

.side-menu :deep(.el-menu-item:hover) {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.side-menu :deep(.el-sub-menu__title:hover) {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.side-menu :deep(.el-menu-item .el-icon),
.side-menu :deep(.el-sub-menu .el-icon) {
  margin-right: 10px;
  width: 16px;
  height: 16px;
}

.side-menu:deep(.el-menu--collapse) {
  .el-menu-item .el-icon,
  .el-sub-menu .el-icon {
    margin: 0;
  }
}
</style>
