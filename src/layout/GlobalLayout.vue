<script setup lang="ts">
import { RouterView } from 'vue-router'
import LeftAsideMenu from './leftAside/LeftAsideMenu.vue'
</script>

<template>
    <el-container>
      <LeftAsideMenu></LeftAsideMenu>
      <el-container>
        <ElScrollbar height="100vh" class="main-area">
          <RouterView />
        </ElScrollbar>
      </el-container>
    </el-container>
</template>

<style scoped>
.main-area {
  width: 100%;
}
</style>
