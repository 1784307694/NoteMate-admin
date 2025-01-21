<script setup lang="ts">
import { type Ref, inject } from "vue"

const isCollapse = inject<Ref<boolean>>("isCollapse")!

const handleClick = () => {
  isCollapse.value = !isCollapse.value
}
</script>

<template>
  <div class="menu-collapse" @click="handleClick">
    <el-icon size="20">
      <component :is="isCollapse ? 'Expand' : 'Fold'" />
    </el-icon>
  </div>
</template>

<style scoped>
.menu-collapse {
  cursor: pointer;
  margin-top: 5px;
}
</style>
