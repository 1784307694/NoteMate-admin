<script setup lang="ts">
import { RouterView } from "vue-router"
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
:root {
  --el-color-primary: #333;
  --el-color-primary-light-3: #f0f8e1;
  --el-color-primary-light-5: #f0f8e1;
  --el-color-primary-light-7: #f0f8e1;
  --el-color-primary-light-8: #f0f8e1;
  --el-color-primary-light-9: #f0f8e1;
  --el-color-primary-dark-2: #333;
}

#app {
  width: 100vw;
  height: 100vh;
}
</style>
